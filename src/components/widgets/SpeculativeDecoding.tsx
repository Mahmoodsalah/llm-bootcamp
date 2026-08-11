import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, FastForward } from 'lucide-react';
import { useStore } from '../../lib/store';

const script = [
  { state: { en: 'Drafting...', ar: 'جاري الاقتراح...' }, speed: { en: "3 tokens drafted in 1 step", ar: "اقتراح 3 رموز في خطوة واحدة" }, tokens: [{ t: "the", s: 'draft' }, { t: "cat", s: 'draft' }, { t: "barked", s: 'draft' }] },
  { state: { en: 'Verifying T1', ar: 'مراجعة T1' }, speed: { en: "Large model agrees: 'the'", ar: "النموذج الكبير وافق: 'the'" }, tokens: [{ t: "the", s: 'accept' }, { t: "cat", s: 'draft' }, { t: "barked", s: 'draft' }] },
  { state: { en: 'Verifying T2', ar: 'مراجعة T2' }, speed: { en: "Large model agrees: 'cat'", ar: "النموذج الكبير وافق: 'cat'" }, tokens: [{ t: "the", s: 'accept' }, { t: "cat", s: 'accept' }, { t: "barked", s: 'draft' }] },
  { state: { en: 'Verifying T3', ar: 'مراجعة T3' }, speed: { en: "Large model disagrees: cats don't bark!", ar: "النموذج الكبير رفض: القطط لا تنبح!" }, tokens: [{ t: "the", s: 'accept' }, { t: "cat", s: 'accept' }, { t: "barked", s: 'reject' }] },
  { state: { en: 'Correction', ar: 'تصحيح' }, speed: { en: "Generated correct token: 'meowed'.", ar: "توليد الرمز الصحيح: 'meowed'." }, tokens: [{ t: "the", s: 'accept' }, { t: "cat", s: 'accept' }, { t: "meowed", s: 'accept' }] },
];

const t = {
  next: { en: "Next Step", ar: "الخطوة التالية" },
  desc: { en: "We got 3 correct tokens in roughly the time it takes the large model to do 1 forward pass!", ar: "حصلنا على 3 رموز صحيحة في نفس الوقت الذي يستغرقه النموذج الكبير لعمل خطوة واحدة!" }
};

export default function SpeculativeDecoding() {
  const { lang } = useStore();
  const [step, setStep] = useState(0);

  const current = script[step];
  const ForwardIcon = lang === 'ar' ? RotateCcw : FastForward; // roughly
  const BackIcon = lang === 'ar' ? FastForward : RotateCcw;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4 bg-muted px-4 py-3 rounded-xl border">
        <span className="font-bold uppercase tracking-wider text-sm">{current.state[lang]}</span>
        <span className="font-mono text-sm bg-background px-3 py-1 rounded-md border text-primary" dir="auto">{current.speed[lang]}</span>
      </div>

      <div className="flex justify-center gap-3 h-24 items-center" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
        {current.tokens.map((token, i) => (
          <motion.div
            key={`${i}-${token.s}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-6 py-4 rounded-xl border-2 font-bold text-xl transition-colors font-mono
              ${token.s === 'draft' ? 'bg-muted border-dashed border-muted-foreground text-muted-foreground' : ''}
              ${token.s === 'accept' ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''}
              ${token.s === 'reject' ? 'bg-destructive/10 border-destructive text-destructive' : ''}
            `}
            dir="ltr"
          >
            {token.t}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="p-3 bg-card border rounded-full hover:bg-muted disabled:opacity-50"
        >
          <BackIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setStep(Math.min(script.length - 1, step + 1))}
          disabled={step === script.length - 1}
          className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          <ForwardIcon className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.next[lang]}
        </button>
      </div>
      
      <p className="text-center text-sm font-medium text-muted-foreground pt-4">
        {t.desc[lang]}
      </p>
    </div>
  );
}
