import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/store';

const points = [
  { id: 1, x: 20, y: 30, text: { en: "Cats are great", ar: "القطط رائعة" } },
  { id: 2, x: 25, y: 35, text: { en: "Dogs are loyal", ar: "الكلاب وفية" } },
  { id: 3, x: 80, y: 70, text: { en: "Quantum physics", ar: "فيزياء الكم" } },
  { id: 4, x: 75, y: 80, text: { en: "String theory", ar: "نظرية الأوتار" } },
  { id: 5, x: 50, y: 50, text: { en: "Cooking pasta", ar: "طبخ المكرونة" } },
];

const hint = { en: "Click anywhere in the space to drop a query.", ar: "اضغط في أي مكان في الفضاء لوضع استعلام (Query)." };

export default function VectorDB() {
  const { lang } = useStore();
  const [query, setQuery] = useState<{x: number, y: number} | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setQuery({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-center text-muted-foreground font-medium">{hint[lang]}</p>
      
      <div 
        className="w-full aspect-[2/1] bg-card border-2 rounded-2xl relative cursor-crosshair overflow-hidden shadow-inner"
        onClick={handleClick}
        dir="ltr" // keep grid coordinates LTR internally
      >
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {points.map(p => {
          let dist = query ? Math.sqrt(Math.pow(p.x - query.x, 2) + Math.pow(p.y - query.y, 2)) : 100;
          let isNearest = query && dist < 30;

          return (
            <motion.div
              key={p.id}
              initial={false}
              animate={{
                scale: isNearest ? 1.2 : 1,
                opacity: query && !isNearest ? 0.3 : 1
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <div className={`w-4 h-4 rounded-full shadow-sm ${isNearest ? 'bg-primary' : 'bg-muted-foreground'}`} />
              <div className={`text-xs font-bold whitespace-nowrap px-2 py-0.5 rounded ${isNearest ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {p.text[lang]}
              </div>
            </motion.div>
          );
        })}

        {query && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] pointer-events-none"
            style={{ left: `${query.x}%`, top: `${query.y}%` }}
          />
        )}
      </div>
    </div>
  );
}
