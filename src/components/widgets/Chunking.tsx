import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

const textEn = "Large language models are powerful. They require massive amounts of data. Chunking helps vector databases index this data. Without good chunking, retrieval fails. Overlap ensures context isn't lost between boundaries.";
const textAr = "نماذج اللغة الكبيرة قوية جداً. هي تحتاج إلى كميات هائلة من البيانات. تقسيم النصوص (Chunking) يساعد قواعد البيانات في الفهرسة. بدون تقسيم جيد يفشل الاسترجاع. التداخل يضمن عدم ضياع السياق عند الحواف.";

const t = {
  fixed: { en: 'Fixed Size', ar: 'حجم ثابت' },
  sentence: { en: 'Sentence', ar: 'الجملة' },
  overlap: { en: 'Fixed + Overlap', ar: 'ثابت + تداخل' },
  fixedDesc: { en: "Hard cutoffs can chop sentences in half, losing meaning.", ar: "التقطيع الصارم قد يقسم الجمل لنصفين، مما يفقدها المعنى." },
  sentenceDesc: { en: "Semantic splits keep thoughts together but can yield variable sizes.", ar: "التقسيم الدلالي يحافظ على الأفكار معاً لكنه يعطي أحجاماً متفاوتة." },
  overlapDesc: { en: "Overlapping chunks ensures phrases at boundaries are caught in both neighboring chunks.", ar: "القطع المتداخلة تضمن التقاط العبارات عند الحواف في القطعتين المتجاورتين." },
};

export default function Chunking() {
  const { lang } = useStore();
  const [strategy, setStrategy] = useState<'fixed' | 'sentence' | 'overlap'>('fixed');

  const text = lang === 'en' ? textEn : textAr;
  const words = text.split(" ");
  let chunks: string[][] = [];

  if (strategy === 'fixed') {
    for (let i = 0; i < words.length; i += 6) {
      chunks.push(words.slice(i, i + 6));
    }
  } else if (strategy === 'sentence') {
    let current: string[] = [];
    words.forEach(w => {
      current.push(w);
      if (w.includes('.') || w.includes('؟') || w.includes('!')) {
        chunks.push([...current]);
        current = [];
      }
    });
    if (current.length) chunks.push(current);
  } else if (strategy === 'overlap') {
    for (let i = 0; i < words.length; i += 4) {
      chunks.push(words.slice(i, i + 6)); // overlap by 2
    }
  }

  const colors = [
    'bg-blue-100 border-blue-300 text-blue-900',
    'bg-emerald-100 border-emerald-300 text-emerald-900',
    'bg-purple-100 border-purple-300 text-purple-900',
    'bg-amber-100 border-amber-300 text-amber-900',
    'bg-rose-100 border-rose-300 text-rose-900'
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        <button onClick={() => setStrategy('fixed')} className={`flex-1 py-2 font-bold rounded-lg transition-colors ${strategy === 'fixed' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}>{t.fixed[lang]}</button>
        <button onClick={() => setStrategy('sentence')} className={`flex-1 py-2 font-bold rounded-lg transition-colors ${strategy === 'sentence' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}>{t.sentence[lang]}</button>
        <button onClick={() => setStrategy('overlap')} className={`flex-1 py-2 font-bold rounded-lg transition-colors ${strategy === 'overlap' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}>{t.overlap[lang]}</button>
      </div>

      <div className="flex flex-wrap gap-3 min-h-[150px] content-start" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <AnimatePresence mode="popLayout">
          {chunks.map((chunk, i) => (
            <motion.div
              key={`${strategy}-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`px-3 py-2 rounded-lg border-2 ${colors[i % colors.length]} flex gap-1 flex-wrap`}
            >
              {chunk.map((w, j) => <span key={j}>{w}</span>)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-sm font-medium text-muted-foreground text-center">
        {strategy === 'fixed' && t.fixedDesc[lang]}
        {strategy === 'sentence' && t.sentenceDesc[lang]}
        {strategy === 'overlap' && t.overlapDesc[lang]}
      </p>
    </div>
  );
}
