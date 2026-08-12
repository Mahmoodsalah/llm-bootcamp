import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/store';

type Method = 'full' | 'lora' | 'qlora';

const dict = {
  title: { en: 'Fine-Tuning Method Comparison', ar: 'مقارنة طرق الضبط الدقيق' },
  method: { en: 'Method', ar: 'الطريقة' },
  rank: { en: 'LoRA Rank (r)', ar: 'رتبة LoRA (r)' },
  trainable: { en: 'Trainable Parameters', ar: 'المعاملات القابلة للتدريب' },
  vram: { en: 'Est. VRAM (8B model)', ar: 'VRAM التقديري (نموذج 8B)' },
  quality: { en: 'Quality Notes', ar: 'ملاحظات الجودة' },
  full: { en: 'Full Fine-Tuning', ar: 'الضبط الكامل' },
  lora: { en: 'LoRA', ar: 'LoRA' },
  qlora: { en: 'QLoRA', ar: 'QLoRA' },
  qualityFull: { en: 'Best possible — all weights updated. Risk of catastrophic forgetting without careful LR.', ar: 'الأفضل — تحديث جميع الأوزان. خطر النسيان الكارثي بدون معدل تعلم حذر.' },
  qualityLoRA: { en: 'Near full-FT quality with rank ≥ 16. Fast convergence; easy to swap adapters.', ar: 'قريب من الجودة الكاملة عند الرتبة ≥ 16. تقارب سريع؛ تبديل المحوّلات سهل.' },
  qualityQLoRA: { en: 'Slight accuracy dip vs LoRA (~1–2%). Enables 8B+ models on a single 24GB GPU.', ar: 'انخفاض طفيف في الدقة مقارنة بـ LoRA (~1–2%). يُتيح نماذج 8B+ على GPU بذاكرة 24GB واحدة.' },
  trainablePct: { en: '100%', ar: '100%' },
  paramBar: { en: 'Parameters trained', ar: 'المعاملات المُدرَّبة' },
  vramBar: { en: 'VRAM used', ar: 'VRAM المستخدم' },
  note: { en: 'Slide the LoRA rank to see how parameter count and VRAM scale.', ar: 'حرّك شريط رتبة LoRA لترى كيف يتغير عدد المعاملات وVRAM.' }
};

// 8B model has ~8 billion params. LoRA adds adapter matrices of shape (d, r) + (r, d) per layer.
// Rough: ~32 attention layers, d_model=4096. Trainable = 2 * 32 * 2 * 4096 * r / 8e9 * 100
function loraParamPct(r: number) {
  const adapters = 2 * 32 * 2 * 4096 * r; // A+B for Q and V projections
  return Math.min((adapters / 8e9) * 100, 5);
}

function vramGB(method: Method, rank: number): number {
  if (method === 'full') return 160; // 8B × 4 bytes × ~5 (optimizer states, grads, activations)
  if (method === 'lora') return 20 + rank * 0.3;
  return 10 + rank * 0.2; // QLoRA: base model in 4-bit + adapters in bf16
}

const MAX_VRAM = 160;

export default function LoRACompare() {
  const { lang } = useStore();
  const [method, setMethod] = useState<Method>('lora');
  const [rank, setRank] = useState(16);

  const pct = method === 'full' ? 100 : loraParamPct(rank);
  const vram = vramGB(method, rank);
  const qualityMap: Record<Method, string> = {
    full: dict.qualityFull[lang],
    lora: dict.qualityLoRA[lang],
    qlora: dict.qualityQLoRA[lang]
  };

  const methods: { id: Method; label: string }[] = [
    { id: 'full', label: dict.full[lang] },
    { id: 'lora', label: dict.lora[lang] },
    { id: 'qlora', label: dict.qlora[lang] }
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-center text-muted-foreground font-medium">{dict.note[lang]}</p>

      {/* Method selector */}
      <div className="flex gap-2">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-sm border transition-all ${method === m.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted border-border'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Rank slider — only visible for LoRA/QLoRA */}
      {method !== 'full' && (
        <div>
          <label className="flex justify-between text-sm font-bold mb-2">
            <span>{dict.rank[lang]}</span>
            <span className="font-mono text-primary" dir="ltr">r = {rank}</span>
          </label>
          <input
            type="range"
            min={1}
            max={128}
            value={rank}
            onChange={e => setRank(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1" dir="ltr">
            <span>1</span>
            <span>32</span>
            <span>64</span>
            <span>128</span>
          </div>
        </div>
      )}

      {/* Stats bars */}
      <div className="space-y-4 bg-muted/50 rounded-2xl p-4 border">
        {/* Trainable params */}
        <div>
          <div className="flex justify-between text-sm font-semibold mb-1">
            <span>{dict.trainable[lang]}</span>
            <span className="font-mono text-primary" dir="ltr">{pct < 0.1 ? pct.toFixed(3) : pct.toFixed(1)}%</span>
          </div>
          <div className="h-6 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${method === 'full' ? 'bg-rose-500' : method === 'lora' ? 'bg-primary' : 'bg-emerald-500'}`}
              animate={{ width: `${Math.max(pct, 0.5)}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        {/* VRAM */}
        <div>
          <div className="flex justify-between text-sm font-semibold mb-1">
            <span>{dict.vram[lang]}</span>
            <span className="font-mono text-primary" dir="ltr">{vram.toFixed(0)} GB</span>
          </div>
          <div className="h-6 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${method === 'full' ? 'bg-rose-500' : method === 'lora' ? 'bg-primary' : 'bg-emerald-500'}`}
              animate={{ width: `${(vram / MAX_VRAM) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1" dir="ltr">
            <span>0 GB</span>
            <span>80 GB</span>
            <span>160 GB</span>
          </div>
        </div>
      </div>

      {/* Quality note */}
      <motion.div
        key={method}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-4 text-sm border ${method === 'full' ? 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-200' : method === 'lora' ? 'bg-primary/5 border-primary/20 text-foreground' : 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200'}`}
      >
        <strong className="block mb-1">{dict.quality[lang]}</strong>
        {qualityMap[method]}
      </motion.div>
    </div>
  );
}
