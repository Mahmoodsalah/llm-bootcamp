import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

const dict = {
  title: { en: 'CI / CD / CT Pipeline Simulator', ar: 'محاكي خط CI / CD / CT' },
  simulate: { en: 'Simulate Drift', ar: 'محاكاة الانجراف' },
  reset: { en: 'Reset', ar: 'إعادة ضبط' },
  driftDetected: { en: 'Drift Detected! Triggering CT…', ar: 'انجراف مكتشف! تشغيل CT…' },
  done: { en: 'Pipeline healthy ✓', ar: 'الخط سليم ✓' },
  running: { en: 'Running', ar: 'يعمل' },
  waiting: { en: 'Waiting', ar: 'انتظار' },
  complete: { en: 'Complete', ar: 'مكتمل' },
};

type StepState = 'idle' | 'running' | 'done';

const NORMAL_STEPS = [
  { id: 'commit', labelEn: 'Code Commit', labelAr: 'رفع الكود', color: 'bg-violet-500' },
  { id: 'ci', labelEn: 'CI (Tests)', labelAr: 'CI (اختبارات)', color: 'bg-blue-500' },
  { id: 'cd', labelEn: 'CD (Deploy)', labelAr: 'CD (نشر)', color: 'bg-emerald-500' },
  { id: 'monitor', labelEn: 'Monitoring', labelAr: 'المراقبة', color: 'bg-amber-500' },
];

const CT_STEPS = [
  { id: 'ct', labelEn: 'CT (Retrain)', labelAr: 'CT (إعادة تدريب)', color: 'bg-red-500' },
  { id: 'registry', labelEn: 'Model Registry', labelAr: 'سجل النماذج', color: 'bg-pink-500' },
  { id: 'redeploy', labelEn: 'Re-deploy', labelAr: 'نشر جديد', color: 'bg-emerald-600' },
];

export default function CICDCT() {
  const { lang } = useStore();
  const [stepStates, setStepStates] = useState<Record<string, StepState>>({});
  const [driftMode, setDriftMode] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allSteps = driftMode ? [...NORMAL_STEPS, ...CT_STEPS] : NORMAL_STEPS;

  const runPipeline = (withDrift: boolean) => {
    if (running) return;
    setRunning(true);
    setDriftMode(withDrift);
    setStepStates({});
    setMessage(null);
    const steps = withDrift ? [...NORMAL_STEPS, ...CT_STEPS] : NORMAL_STEPS;

    steps.forEach((step, i) => {
      const delay = i * 900;
      timerRef.current = setTimeout(() => {
        setStepStates(prev => ({ ...prev, [step.id]: 'running' }));
        if (withDrift && step.id === 'monitor') {
          setTimeout(() => setMessage(dict.driftDetected[lang]), 300);
        }
        setTimeout(() => {
          setStepStates(prev => ({ ...prev, [step.id]: 'done' }));
          if (i === steps.length - 1) {
            setMessage(dict.done[lang]);
            setRunning(false);
          }
        }, 700);
      }, delay);
    });
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStepStates({});
    setDriftMode(false);
    setMessage(null);
    setRunning(false);
  };

  const getStateLabel = (state: StepState | undefined) => {
    if (!state || state === 'idle') return dict.waiting[lang];
    if (state === 'running') return dict.running[lang];
    return dict.complete[lang];
  };

  return (
    <div className="space-y-5">
      <h3 className="font-bold text-base text-center">{dict.title[lang]}</h3>

      <div className="relative" dir="ltr">
        {/* Normal pipeline */}
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {NORMAL_STEPS.map((step, i) => {
            const state = stepStates[step.id];
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  animate={{ opacity: state ? 1 : 0.45 }}
                  className={`relative px-3 py-3 rounded-xl text-white text-xs font-bold shadow min-w-[80px] text-center ${step.color}`}
                >
                  <div>{lang === 'ar' ? step.labelAr : step.labelEn}</div>
                  {state === 'running' && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-white/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                  )}
                  {state === 'done' && (
                    <div className="absolute -top-2 -end-2 w-5 h-5 bg-white rounded-full flex items-center justify-center text-emerald-600 text-xs font-black">✓</div>
                  )}
                  <div className="text-[10px] font-normal opacity-80 mt-1">{getStateLabel(state)}</div>
                </motion.div>
                {i < NORMAL_STEPS.length - 1 && <span className="text-muted-foreground">→</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* CT loop (appears on drift) */}
        <AnimatePresence>
          {driftMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <span className="text-destructive font-bold text-xs pe-2">↳ CT loop:</span>
                {CT_STEPS.map((step, i) => {
                  const state = stepStates[step.id];
                  return (
                    <React.Fragment key={step.id}>
                      <motion.div
                        animate={{ opacity: state ? 1 : 0.4 }}
                        className={`relative px-3 py-3 rounded-xl text-white text-xs font-bold shadow min-w-[80px] text-center ${step.color}`}
                      >
                        <div>{lang === 'ar' ? step.labelAr : step.labelEn}</div>
                        {state === 'running' && (
                          <motion.div
                            className="absolute inset-0 rounded-xl border-2 border-white/60"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                          />
                        )}
                        {state === 'done' && (
                          <div className="absolute -top-2 -end-2 w-5 h-5 bg-white rounded-full flex items-center justify-center text-emerald-600 text-xs font-black">✓</div>
                        )}
                        <div className="text-[10px] font-normal opacity-80 mt-1">{getStateLabel(state)}</div>
                      </motion.div>
                      {i < CT_STEPS.length - 1 && <span className="text-muted-foreground">→</span>}
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-center text-sm font-bold px-4 py-2 rounded-xl ${message.includes('Drift') || message.includes('انجراف') ? 'bg-destructive/10 text-destructive' : 'bg-emerald-50 text-emerald-700'}`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          disabled={running}
          onClick={() => runPipeline(false)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition"
        >
          ▶ {lang === 'ar' ? 'تشغيل عادي' : 'Run Pipeline'}
        </button>
        <button
          disabled={running}
          onClick={() => runPipeline(true)}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition"
        >
          ⚠ {dict.simulate[lang]}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-muted text-foreground rounded-xl text-sm font-bold hover:opacity-80 transition"
        >
          {dict.reset[lang]}
        </button>
      </div>
    </div>
  );
}
