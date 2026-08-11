import React, { useState } from 'react';
import { useStore } from '../../lib/store';

const t = {
  prec: { en: 'Precision', ar: 'الدقة' },
  desc32: { en: 'Perfect smooth transition. High memory usage.', ar: 'تدرج مثالي وناعم. استهلاك عالي للذاكرة.' },
  desc16: { en: 'Visually identical to FP32. Standard for inference.', ar: 'مطابق بصرياً لـ FP32. المعيار الأساسي للتشغيل.' },
  desc8: { en: 'Noticeable stepping. Cuts memory in half again.', ar: 'تدرج ملحوظ. يقلل الذاكرة للنصف مرة أخرى.' },
  desc4: { en: "Blocky 'snapping'. Fits massive models on consumer GPUs.", ar: 'تدرج حاد جداً. يسمح بتشغيل نماذج ضخمة على كروت شاشة عادية.' }
};

export default function Quantization() {
  const { lang } = useStore();
  const [bits, setBits] = useState(32);
  
  // 32-bit: smooth gradient
  // 8-bit: slight banding
  // 4-bit: extreme banding
  const levels = bits === 32 ? 256 : bits === 8 ? 16 : 4;

  return (
    <div className="space-y-8">
      <div>
        <label className="flex justify-between text-sm font-bold mb-4">
          <span>{t.prec[lang]}</span>
          <span className="text-primary font-mono" dir="ltr">{bits}-bit</span>
        </label>
        <div className="flex gap-2">
          {[32, 16, 8, 4].map(b => (
            <button
              key={b}
              onClick={() => setBits(b)}
              className={`flex-1 py-2 rounded-lg font-bold border transition-colors ${bits === b ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
              dir="ltr"
            >
              {b === 32 ? 'FP32' : b === 16 ? 'FP16' : `INT${b}`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-muted p-8 rounded-2xl border flex flex-col items-center gap-6">
        <div className="w-full max-w-sm h-32 rounded-xl overflow-hidden flex shadow-lg border-2 border-background" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
          {Array.from({ length: 64 }).map((_, i) => {
            const rawVal = i / 63; // 0 to 1
            const quantizedVal = Math.round(rawVal * (levels - 1)) / (levels - 1);
            const lightness = 20 + (quantizedVal * 60); // 20% to 80%
            
            return (
              <div 
                key={i} 
                className="flex-1 h-full"
                style={{ backgroundColor: `hsl(245, 70%, ${lightness}%)` }}
              />
            );
          })}
        </div>
        <p className="text-center text-sm font-medium text-muted-foreground">
          {bits === 32 && t.desc32[lang]}
          {bits === 16 && t.desc16[lang]}
          {bits === 8 && t.desc8[lang]}
          {bits === 4 && t.desc4[lang]}
        </p>
      </div>
    </div>
  );
}
