import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/store';

const t = {
  params: { en: 'Model Parameters', ar: 'حجم النموذج (المعاملات)' },
  precision: { en: 'Precision (Bytes per param)', ar: 'الدقة (بايت لكل معامل)' },
  req: { en: 'Required VRAM', ar: 'الـ VRAM المطلوبة' },
  fits: { en: 'Fits on:', ar: 'يعمل على:' },
  needs: { en: 'Needs Multi-GPU', ar: 'يحتاج كروت متعددة' },
  weights: { en: 'Weights', ar: 'الأوزان' },
  kv: { en: 'KV Cache', ar: 'الـ KV Cache' },
};

export default function VRAMCalc() {
  const { lang } = useStore();
  const [params, setParams] = useState(7);
  const [precision, setPrecision] = useState(2); // bytes

  const vramWeights = params * precision; // GB
  const kvCache = params * 0.2; // arbitrary illustrative
  const total = vramWeights + kvCache;

  const gpuOptions = [
    { name: 'RTX 3090', vram: 24 },
    { name: 'A6000', vram: 48 },
    { name: 'A100', vram: 80 }
  ];

  const fitsIn = gpuOptions.find(g => g.vram >= total)?.name || t.needs[lang];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="flex justify-between text-sm font-bold mb-2">
              <span>{t.params[lang]}</span>
              <span className="text-primary font-mono" dir="ltr">{params}B</span>
            </label>
            <input 
              type="range" min="1" max="100" step="1" 
              value={params} onChange={(e) => setParams(Number(e.target.value))}
              className="w-full accent-primary"
              style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
            />
          </div>
          <div>
            <label className="flex justify-between text-sm font-bold mb-2">
              <span>{t.precision[lang]}</span>
              <span className="text-primary font-mono" dir="ltr">{precision === 4 ? 'FP32' : precision === 2 ? 'FP16' : 'INT8'} ({precision}B)</span>
            </label>
            <input 
              type="range" min="1" max="4" step="1" 
              value={precision} onChange={(e) => setPrecision(e.target.value === '3' ? 2 : Number(e.target.value))}
              className="w-full accent-primary"
              style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
            />
          </div>
        </div>

        <div className="bg-muted/50 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-4 border">
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t.req[lang]}</div>
          <div className="text-5xl font-extrabold text-foreground font-mono" dir="ltr">{total.toFixed(1)} GB</div>
          <div className="px-3 py-1 bg-background rounded-full border text-sm font-medium shadow-sm">
            {t.fits[lang]} <span className="text-primary font-mono" dir="ltr">{fitsIn}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-muted-foreground font-mono" dir="ltr">
          <span>0 GB</span>
          <span>80 GB</span>
        </div>
        <div className="h-10 bg-muted rounded-full overflow-hidden flex shadow-inner relative" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
          <motion.div 
            className="h-full bg-blue-500"
            initial={false}
            animate={{ width: `${(vramWeights / 80) * 100}%` }}
            transition={{ type: 'spring', bounce: 0 }}
          />
          <motion.div 
            className="h-full bg-emerald-400"
            initial={false}
            animate={{ width: `${(kvCache / 80) * 100}%` }}
            transition={{ type: 'spring', bounce: 0 }}
          />
        </div>
        <div className="flex gap-4 text-sm font-medium pt-2">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> {t.weights[lang]}</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> {t.kv[lang]}</div>
        </div>
      </div>
    </div>
  );
}
