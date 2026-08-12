import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/store';

const dict = {
  prompt: { en: 'Prompt', ar: 'الأمر' },
  promptText: { en: 'Explain why the sky is blue.', ar: 'اشرح لماذا السماء زرقاء.' },
  chosen: { en: 'Chosen (preferred)', ar: 'المختار (المُفضَّل)' },
  rejected: { en: 'Rejected', ar: 'المرفوض' },
  chosenText: {
    en: 'The sky appears blue because of Rayleigh scattering — shorter blue wavelengths scatter more as sunlight passes through the atmosphere, reaching our eyes from every direction.',
    ar: 'تبدو السماء زرقاء بسبب تشتت رايلي — الأطوال الموجية الزرقاء الأقصر تتشتت أكثر عندما يمر ضوء الشمس عبر الغلاف الجوي، فيصل إلى أعيننا من كل اتجاه.'
  },
  rejectedText: {
    en: 'The sky is blue because water is blue and it reflects off the ocean up into the sky.',
    ar: 'السماء زرقاء لأن الماء أزرق وينعكس من المحيط إلى الأعلى نحو السماء.'
  },
  pickBetter: { en: 'Click the better answer:', ar: 'انقر على الإجابة الأفضل:' },
  beta: { en: 'Beta (β) — closeness to reference model', ar: 'بيتا (β) — القرب من النموذج المرجعي' },
  betaLow: { en: 'Low β: strong pull toward chosen', ar: 'β منخفض: جذب قوي نحو المختار' },
  betaHigh: { en: 'High β: stay close to reference model', ar: 'β مرتفع: البقاء قريباً من النموذج المرجعي' },
  probChosen: { en: 'Prob(chosen)', ar: 'احتمال المختار' },
  probRejected: { en: 'Prob(rejected)', ar: 'احتمال المرفوض' },
  probRef: { en: 'Reference model', ar: 'النموذج المرجعي' },
  correct: { en: '✓ Correct! DPO will increase probability of this response.', ar: '✓ صحيح! ستزيد DPO احتمال هذه الإجابة.' },
  wrong: { en: '✗ That\'s the rejected answer. DPO pushes probability away from it.', ar: '✗ هذه الإجابة المرفوضة. تُبعد DPO الاحتمال عنها.' },
  instruction: { en: 'DPO adjusts the model directly on (chosen, rejected) pairs without a separate reward model. The β parameter controls how much the policy can diverge from the frozen reference model.', ar: 'تُعدِّل DPO النموذج مباشرة على أزواج (مختار، مرفوض) دون نموذج مكافأة منفصل. تتحكم معلمة β في مقدار ما يمكن للسياسة أن تنحرف عن النموذج المرجعي المجمَّد.' }
};

export default function DPOExplorer() {
  const { lang } = useStore();
  const [beta, setBeta] = useState(0.1);
  const [picked, setPicked] = useState<'chosen' | 'rejected' | null>(null);

  // Simulate DPO probability shift: higher beta = smaller shift from reference (0.5)
  const refProb = 0.5;
  const maxShift = 0.45;
  const shift = maxShift * (1 - beta);
  const chosenProb = picked ? Math.min(refProb + shift, 0.97) : refProb;
  const rejectedProb = picked ? Math.max(refProb - shift, 0.03) : refProb;

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <div className="bg-muted/60 rounded-xl p-4 border">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{dict.prompt[lang]}</div>
        <p className="font-medium">{dict.promptText[lang]}</p>
      </div>

      {/* Two answers */}
      <div>
        <p className="text-sm font-bold text-center mb-3">{dict.pickBetter[lang]}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(['chosen', 'rejected'] as const).map(type => (
            <motion.button
              key={type}
              onClick={() => setPicked(type)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`text-start p-4 rounded-xl border-2 transition-all text-sm leading-relaxed ${
                picked === type
                  ? type === 'chosen'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                    : 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${type === 'chosen' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {dict[type][lang]}
              </div>
              {dict[`${type}Text`][lang]}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {picked && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-3 text-sm font-medium border ${picked === 'chosen' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-300'}`}
        >
          {picked === 'chosen' ? dict.correct[lang] : dict.wrong[lang]}
        </motion.div>
      )}

      {/* Beta slider */}
      <div>
        <label className="flex justify-between text-sm font-bold mb-2">
          <span>{dict.beta[lang]}</span>
          <span className="font-mono text-primary" dir="ltr">β = {beta.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0.01}
          max={0.5}
          step={0.01}
          value={beta}
          onChange={e => setBeta(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{dict.betaLow[lang]}</span>
          <span>{dict.betaHigh[lang]}</span>
        </div>
      </div>

      {/* Probability bars */}
      <div className="bg-muted/50 rounded-2xl p-4 border space-y-4">
        {[
          { label: dict.probChosen[lang], prob: chosenProb, color: 'bg-emerald-500' },
          { label: dict.probRejected[lang], prob: rejectedProb, color: 'bg-rose-500' },
          { label: dict.probRef[lang], prob: refProb, color: 'bg-muted-foreground' }
        ].map(({ label, prob, color }) => (
          <div key={label}>
            <div className="flex justify-between text-sm font-semibold mb-1">
              <span>{label}</span>
              <span className="font-mono text-primary" dir="ltr">{(prob * 100).toFixed(1)}%</span>
            </div>
            <div className="h-5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${color}`}
                animate={{ width: `${prob * 100}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <p className="text-xs text-muted-foreground text-center px-2">{dict.instruction[lang]}</p>
    </div>
  );
}
