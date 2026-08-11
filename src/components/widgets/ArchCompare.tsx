import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/store';

const dict = {
  gpt: {
    title: { en: "GPT (Decoder-Only)", ar: "GPT (فك التشفير فقط)" },
    desc: { en: "The classic standard. Every token attends to all previous tokens. Huge parameter count active every step.", ar: "المعيار الكلاسيكي. كل token ينتبه لكل الرموز السابقة. عدد هائل من المعاملات نشط في كل خطوة." }
  },
  llama: {
    title: { en: "Llama Family", ar: "عائلة Llama" },
    desc: { en: "Optimized standard. Uses RMSNorm, RoPE embeddings, and Grouped Query Attention (GQA) for faster inference.", ar: "معيار مُحسّن. يستخدم RMSNorm و RoPE و GQA لتسريع التشغيل." }
  },
  mixtral: {
    title: { en: "Mixtral (MoE)", ar: "Mixtral (خليط الخبراء)" },
    desc: { en: "Mixture of Experts. A router sends each token to only 2 of 8 experts. Fast inference, high total memory.", ar: "مُوجّه الخبراء (Router) يرسل كل token لخبيرين فقط من أصل 8. تشغيل سريع، واستهلاك عالي للذاكرة." }
  },
  mamba: {
    title: { en: "Mamba (SSM)", ar: "Mamba (SSM)" },
    desc: { en: "State Space Model. Replaces attention with a hidden state that compresses the past. Constant memory scaling!", ar: "يستبدل الانتباه بحالة مخفية تضغط الماضي. الذاكرة ثابتة ولا تزيد!" }
  },
  dense: { en: "Dense", ar: "مكثف" },
  state: { en: "State", ar: "الحالة" },
};

export default function ArchCompare() {
  const { lang } = useStore();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* GPT */}
      <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">{dict.gpt.title[lang]}</h3>
        <p className="text-sm text-muted-foreground">{dict.gpt.desc[lang]}</p>
        <div className="h-24 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="w-16 h-16 bg-blue-500/20 border-2 border-blue-500 rounded-lg flex items-center justify-center font-bold text-blue-700">{dict.dense[lang]}</div>
        </div>
      </div>

      {/* Llama */}
      <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">{dict.llama.title[lang]}</h3>
        <p className="text-sm text-muted-foreground">{dict.llama.desc[lang]}</p>
        <div className="h-24 flex items-center justify-center bg-muted/50 rounded-lg gap-2">
          <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500 rounded font-bold text-xs text-emerald-700" dir="ltr">RoPE</div>
          <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500 rounded font-bold text-xs text-emerald-700" dir="ltr">GQA</div>
        </div>
      </div>

      {/* Mixtral MoE */}
      <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">{dict.mixtral.title[lang]}</h3>
        <p className="text-sm text-muted-foreground">{dict.mixtral.desc[lang]}</p>
        <div className="h-24 flex items-center justify-center bg-muted/50 rounded-lg relative">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs z-10" dir="ltr">R</div>
          <motion.div
            key={tick}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: lang === 'ar' ? -40 : 40, y: tick % 2 === 0 ? -20 : 20, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute w-3 h-3 bg-purple-400 rounded-full"
          />
          <div className={`absolute top-2 w-8 h-6 border-2 border-purple-500/50 rounded flex items-center justify-center text-[10px] font-bold text-purple-700 ${lang === 'ar' ? 'left-4' : 'right-4'}`} dir="ltr">E1</div>
          <div className={`absolute bottom-2 w-8 h-6 border-2 border-purple-500/50 rounded flex items-center justify-center text-[10px] font-bold text-purple-700 ${lang === 'ar' ? 'left-4' : 'right-4'}`} dir="ltr">E2</div>
        </div>
      </div>

      {/* Mamba/SSM */}
      <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">{dict.mamba.title[lang]}</h3>
        <p className="text-sm text-muted-foreground">{dict.mamba.desc[lang]}</p>
        <div className="h-24 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 flex-row-reverse" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
            <div className="w-8 h-8 rounded border-2 border-amber-500 bg-amber-500/20" />
            <div className="text-amber-500 font-bold" style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}>→</div>
            <div className="w-10 h-10 rounded border-2 border-amber-500 bg-amber-500/40 flex items-center justify-center font-bold text-xs text-amber-700">{dict.state[lang]}</div>
            <div className="text-amber-500 font-bold" style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}>→</div>
            <div className="w-8 h-8 rounded border-2 border-amber-500 bg-amber-500/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
