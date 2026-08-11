import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/store';

const t = {
  new: { en: '+ New Request', ar: '+ طلب جديد' },
  clear: { en: 'Clear Memory', ar: 'مسح الذاكرة' },
  page: { en: 'Page', ar: 'صفحة' },
  desc: { en: "PagedAttention splits the KV cache into fixed-size blocks (pages). They don't need to be contiguous in memory, eliminating fragmentation!", ar: "تقنية PagedAttention تقسم الـ KV cache لكتل ثابتة (صفحات). لا يشترط أن تكون متجاورة، مما يلغي التجزئة!" }
};

export default function PagedAttention() {
  const { lang } = useStore();
  const blocks = Array.from({ length: 16 });
  const [allocations, setAllocations] = useState<{ id: number, color: string }[]>([]);

  const colors = ['bg-blue-400', 'bg-emerald-400', 'bg-purple-400', 'bg-amber-400'];

  const addRequest = () => {
    if (allocations.length >= 14) return;
    const size = Math.floor(Math.random() * 3) + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const newAllocs = Array.from({ length: size }).map(() => ({ id: Math.random(), color }));
    setAllocations([...allocations, ...newAllocs]);
  };

  const clear = () => setAllocations([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={addRequest} className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90">
          {t.new[lang]}
        </button>
        <button onClick={clear} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          {t.clear[lang]}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 bg-muted p-4 rounded-xl border" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        {blocks.map((_, i) => {
          const alloc = allocations[i];
          return (
            <div key={i} className="aspect-square bg-background rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative">
              <span className="text-xs text-muted-foreground z-0">{t.page[lang]} {i}</span>
              {alloc && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`absolute inset-1 rounded-md shadow-sm z-10 ${alloc.color}`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      <p className="text-sm font-medium text-muted-foreground text-center">
        {t.desc[lang]}
      </p>
    </div>
  );
}
