import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

const dict = {
  title: { en: 'Deployment Strategy Explorer', ar: 'مستكشف استراتيجية النشر' },
  q1: { en: 'Response needed immediately (< 2 s)?', ar: 'هل تحتاج الاستجابة فوراً (< 2 ثانية)؟' },
  q2: { en: 'Traffic spikes are unpredictable?', ar: 'هل حركة المرور تتذبذب بشكل غير متوقع؟' },
  q3: { en: 'Process millions of records at once?', ar: 'هل تعالج ملايين السجلات دفعة واحدة؟' },
  yes: { en: 'Yes', ar: 'نعم' },
  no: { en: 'No', ar: 'لا' },
  recommended: { en: 'Recommended Strategy', ar: 'الاستراتيجية الموصى بها' },
  flow: { en: 'Request Flow', ar: 'تدفق الطلبات' },
  realtime: {
    label: { en: 'Online Real-Time', ar: 'مباشر فوري' },
    desc: { en: 'Client sends HTTP request → Model responds immediately. Best for chatbots, live APIs, interactive tools.', ar: 'العميل يرسل طلب HTTP ← النموذج يستجيب فوراً. الأفضل للروبوتات، واجهات API المباشرة، الأدوات التفاعلية.' },
    color: 'bg-emerald-500',
    steps: ['Client', 'REST API', 'LLM Service', 'Response'],
    stepsAr: ['العميل', 'REST API', 'خدمة LLM', 'الاستجابة'],
  },
  async: {
    label: { en: 'Asynchronous (Queue)', ar: 'غير متزامن (طابور)' },
    desc: { en: 'Request enters a queue → Workers process when ready → Client polls or gets notified. Best for cost-optimized, spike-tolerant systems.', ar: 'الطلب يدخل طابوراً ← العمال يعالجون عند الجاهزية ← العميل يستطلع أو يُخطَر. الأفضل لأنظمة موفرة التكلفة وتتحمل الذروات.' },
    color: 'bg-amber-500',
    steps: ['Client', 'Queue', 'Worker Pool', 'Storage', 'Notify'],
    stepsAr: ['العميل', 'الطابور', 'مجموعة العمال', 'التخزين', 'إشعار'],
  },
  batch: {
    label: { en: 'Offline Batch', ar: 'دُفعي غير متصل' },
    desc: { en: 'Scheduled job pulls large datasets from storage → processes them all → writes results back. Best for analytics, reporting, pre-computation.', ar: 'مهمة مجدولة تسحب بيانات ضخمة من التخزين ← تعالجها كلها ← تكتب النتائج. الأفضل للتحليلات والتقارير والحساب المسبق.' },
    color: 'bg-blue-500',
    steps: ['Scheduler', 'Data Store', 'Batch Job', 'Results DB'],
    stepsAr: ['المجدول', 'مخزن البيانات', 'المهمة الدُفعية', 'قاعدة النتائج'],
  },
};

type Strategy = 'realtime' | 'async' | 'batch';

function decide(immediate: boolean | null, spiky: boolean | null, bulk: boolean | null): Strategy | null {
  if (immediate === null || spiky === null || bulk === null) return null;
  if (bulk) return 'batch';
  if (immediate) return 'realtime';
  if (spiky) return 'async';
  return 'realtime';
}

function ToggleQ({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  const { lang } = useStore();
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-muted rounded-xl">
      <span className="font-medium text-sm flex-1">{label}</span>
      <div className="flex gap-2" dir="ltr">
        <button
          onClick={() => onChange(true)}
          className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${value === true ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}
        >{dict.yes[lang]}</button>
        <button
          onClick={() => onChange(false)}
          className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${value === false ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}
        >{dict.no[lang]}</button>
      </div>
    </div>
  );
}

function FlowDiagram({ strategy }: { strategy: Strategy }) {
  const { lang } = useStore();
  const s = dict[strategy];
  const steps = lang === 'ar' ? s.stepsAr : s.steps;
  return (
    <div className="flex items-center gap-1 flex-wrap justify-center mt-4" dir="ltr">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className={`px-3 py-2 rounded-lg text-white text-xs font-bold shadow ${s.color}`}
          >
            {step}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.12 + 0.08 }}
              className="text-muted-foreground font-mono text-sm"
            >→</motion.span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function DeployStrategy() {
  const { lang } = useStore();
  const [immediate, setImmediate] = useState<boolean | null>(null);
  const [spiky, setSpiky] = useState<boolean | null>(null);
  const [bulk, setBulk] = useState<boolean | null>(null);

  const strategy = decide(immediate, spiky, bulk);
  const stratData = strategy ? dict[strategy] : null;

  return (
    <div className="space-y-5">
      <h3 className="font-bold text-base text-center">{dict.title[lang]}</h3>
      <div className="space-y-3">
        <ToggleQ label={dict.q1[lang]} value={immediate} onChange={setImmediate} />
        <ToggleQ label={dict.q2[lang]} value={spiky} onChange={setSpiky} />
        <ToggleQ label={dict.q3[lang]} value={bulk} onChange={setBulk} />
      </div>

      <AnimatePresence mode="wait">
        {strategy && stratData && (
          <motion.div
            key={strategy}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="border-2 border-primary rounded-2xl p-5 bg-background space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">{dict.recommended[lang]}</span>
            </div>
            <div className={`inline-block px-4 py-2 rounded-xl text-white font-bold text-sm ${stratData.color}`}>
              {stratData.label[lang]}
            </div>
            <p className="text-sm text-muted-foreground">{stratData.desc[lang]}</p>
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">{dict.flow[lang]}</span>
              <FlowDiagram strategy={strategy} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
