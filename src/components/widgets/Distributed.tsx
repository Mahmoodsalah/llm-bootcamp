import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

const t = {
  dp: { en: 'Data Parallel', ar: 'توازي البيانات (DP)' },
  tp: { en: 'Tensor Parallel', ar: 'توازي المصفوفات (TP)' },
  pp: { en: 'Pipeline Parallel', ar: 'توازي المسار (PP)' },
  full: { en: 'Full Model\n(Diff Data)', ar: 'النموذج كامل\n(بيانات مختلفة)' },
  left: { en: 'Left Half', ar: 'النصف الأيسر' },
  right: { en: 'Right Half', ar: 'النصف الأيمن' },
  layers1: { en: 'Layers 1-20', ar: 'طبقات 1-20' },
  layers2: { en: 'Layers 21-40', ar: 'طبقات 21-40' },
  gpu: { en: 'GPU', ar: 'GPU' }
};

export default function Distributed() {
  const { lang } = useStore();
  const [strategy, setStrategy] = useState<'dp' | 'tp' | 'pp'>('tp');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-muted p-1 rounded-xl">
        {[
          { id: 'dp', label: t.dp[lang] },
          { id: 'tp', label: t.tp[lang] },
          { id: 'pp', label: t.pp[lang] }
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setStrategy(s.id as any)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${strategy === s.id ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-background border rounded-2xl p-8 h-64 flex items-center justify-center shadow-inner relative overflow-hidden">
        <AnimatePresence mode="wait">
          {strategy === 'dp' && (
            <motion.div key="dp" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex gap-4" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
              {[1, 2].map(i => (
                <div key={i} className="border-2 border-primary bg-primary/5 p-4 rounded-xl flex flex-col items-center gap-2">
                  <div className="font-bold" dir="ltr">{t.gpu[lang]} {i}</div>
                  <div className="w-24 h-24 bg-blue-500/20 border border-blue-500 rounded flex items-center justify-center text-xs text-center whitespace-pre">{t.full[lang]}</div>
                </div>
              ))}
            </motion.div>
          )}
          {strategy === 'tp' && (
            <motion.div key="tp" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex gap-2 items-center" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
              <div className="border-2 border-primary bg-primary/5 p-4 rounded-xl flex flex-col items-center gap-2">
                <div className="font-bold" dir="ltr">{t.gpu[lang]} 1</div>
                <div className="w-16 h-24 bg-emerald-500/20 border border-emerald-500 rounded flex items-center justify-center text-xs text-center">{t.left[lang]}</div>
              </div>
              <div className="text-xl font-bold">+</div>
              <div className="border-2 border-primary bg-primary/5 p-4 rounded-xl flex flex-col items-center gap-2">
                <div className="font-bold" dir="ltr">{t.gpu[lang]} 2</div>
                <div className="w-16 h-24 bg-purple-500/20 border border-purple-500 rounded flex items-center justify-center text-xs text-center">{t.right[lang]}</div>
              </div>
            </motion.div>
          )}
          {strategy === 'pp' && (
            <motion.div key="pp" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex gap-4 items-center" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
              <div className="border-2 border-primary bg-primary/5 p-4 rounded-xl flex flex-col items-center gap-2">
                <div className="font-bold" dir="ltr">{t.gpu[lang]} 1</div>
                <div className="w-24 h-12 bg-amber-500/20 border border-amber-500 rounded flex items-center justify-center text-xs text-center" dir="ltr">{t.layers1[lang]}</div>
              </div>
              <div className="w-8 h-1 bg-muted-foreground relative">
                <div className={`absolute -top-1 w-3 h-3 rotate-45 border-t-2 border-muted-foreground ${lang === 'ar' ? 'left-0 border-l-2' : 'right-0 border-r-2'}`} />
              </div>
              <div className="border-2 border-primary bg-primary/5 p-4 rounded-xl flex flex-col items-center gap-2">
                <div className="font-bold" dir="ltr">{t.gpu[lang]} 2</div>
                <div className="w-24 h-12 bg-rose-500/20 border border-rose-500 rounded flex items-center justify-center text-xs text-center" dir="ltr">{t.layers2[lang]}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
