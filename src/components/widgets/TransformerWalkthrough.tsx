import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../../lib/store';

const steps = [
  { id: 'embed', name: { en: 'Embedding', ar: 'التضمين' }, desc: { en: 'Tokens are converted into rich numeric vectors.', ar: 'يتم تحويل الـ tokens إلى متجهات رقمية غنية.' } },
  { id: 'attn', name: { en: 'Self-Attention', ar: 'الانتباه الذاتي' }, desc: { en: 'Tokens exchange information to build context.', ar: 'الـ tokens تتبادل المعلومات لبناء السياق.' } },
  { id: 'mlp', name: { en: 'MLP (Feed Forward)', ar: 'الشبكة العصبية' }, desc: { en: 'Each token is processed individually to recall facts.', ar: 'كل token يعالج بشكل فردي لاسترجاع المعلومات.' } },
  { id: 'norm', name: { en: 'Add & Norm', ar: 'الجمع والتوحيد' }, desc: { en: 'Residual connections keep gradients stable.', ar: 'روابط تخطي تحافظ على استقرار العمليات الحسابية.' } },
  { id: 'logits', name: { en: 'Logits', ar: 'الاحتمالات (Logits)' }, desc: { en: 'Vectors are mapped back to the vocabulary to predict the next word.', ar: 'المتجهات تُترجم مرة أخرى للمفردات لتوقع الكلمة التالية.' } }
];

export default function TransformerWalkthrough() {
  const { lang } = useStore();
  const [step, setStep] = useState(0);

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const PrevIcon = lang === 'ar' ? ArrowRight : ArrowLeft;
  const NextIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={prev} disabled={step === 0} className="p-2 border rounded-lg hover:bg-muted disabled:opacity-50"><PrevIcon className="w-5 h-5" /></button>
        <div className="font-bold tracking-widest uppercase text-primary">
          {lang === 'en' ? `Step ${step + 1} of ${steps.length}` : `خطوة ${step + 1} من ${steps.length}`}
        </div>
        <button onClick={next} disabled={step === steps.length - 1} className="p-2 border rounded-lg hover:bg-muted disabled:opacity-50"><NextIcon className="w-5 h-5" /></button>
      </div>

      <div className="bg-muted p-8 rounded-2xl border flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
        {steps.map((s, i) => (
          <motion.div
            key={s.id}
            initial={false}
            animate={{
              scale: step === i ? 1.1 : 0.9,
              opacity: step === i ? 1 : 0.3,
              y: (i - step) * 60,
              zIndex: step === i ? 10 : 0
            }}
            className={`absolute px-6 py-3 rounded-xl border-2 font-bold text-lg w-64 text-center bg-background shadow-md transition-colors ${step === i ? 'border-primary text-primary' : 'border-border'}`}
          >
            {s.name[lang]}
          </motion.div>
        ))}
      </div>

      <div className="text-center h-16">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-medium text-muted-foreground"
          >
            {steps[step].desc[lang]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
