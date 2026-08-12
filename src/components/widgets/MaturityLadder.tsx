import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

const dict = {
  title: { en: 'MLOps Maturity Ladder', ar: 'سلم نضج MLOps' },
  clickHint: { en: 'Click a level to explore', ar: 'انقر على مستوى للاستكشاف' },
  exists: { en: 'What exists', ar: 'ما هو موجود' },
  pain: { en: 'Remaining pain', ar: 'الألم المتبقي' },
  levels: [
    {
      id: 'manual',
      labelEn: 'Level 1 — Manual',
      labelAr: 'المستوى 1 — يدوي',
      icon: '📓',
      colorClass: 'bg-red-100 border-red-300 text-red-800',
      activeClass: 'bg-red-500 text-white border-red-500',
      checksEn: ['Jupyter notebooks', 'Manual data prep', 'Ad-hoc training runs', 'Model stored as a file'],
      checksAr: ['دفاتر Jupyter', 'تحضير بيانات يدوي', 'تدريب عشوائي', 'النموذج ملف فقط'],
      missingEn: ['No versioning (code, data, model)', 'No reproducibility', 'No CI/CD', 'No monitoring', 'Deployment is manual copy-paste'],
      missingAr: ['لا إصدارات (كود، بيانات، نموذج)', 'لا قابلية إعادة الإنتاج', 'لا CI/CD', 'لا مراقبة', 'النشر نسخ ولصق يدوي'],
    },
    {
      id: 'semi',
      labelEn: 'Level 2 — Semi-Automated',
      labelAr: 'المستوى 2 — شبه آلي',
      icon: '⚙️',
      colorClass: 'bg-amber-100 border-amber-300 text-amber-800',
      activeClass: 'bg-amber-500 text-white border-amber-500',
      checksEn: ['Code in Git (versioned)', 'Model registry (versioned)', 'Experiment tracking', 'CI pipeline (tests on push)', 'Semi-automated deployment'],
      checksAr: ['الكود في Git (مُصدَّر)', 'سجل نماذج (مُصدَّر)', 'تتبع التجارب', 'خط CI (اختبارات عند الرفع)', 'نشر شبه آلي'],
      missingEn: ['Data still not versioned', 'No continuous training (CT)', 'Monitoring is manual / fragile', 'No automated alerts on drift'],
      missingAr: ['البيانات غير مُصدَّرة', 'لا تدريب مستمر (CT)', 'المراقبة يدوية / هشة', 'لا تنبيهات آلية على الانجراف'],
    },
    {
      id: 'full',
      labelEn: 'Level 3 — Fully Automated',
      labelAr: 'المستوى 3 — آلي بالكامل',
      icon: '🚀',
      colorClass: 'bg-emerald-100 border-emerald-300 text-emerald-800',
      activeClass: 'bg-emerald-500 text-white border-emerald-500',
      checksEn: ['Code + data + model all versioned', 'CI/CD/CT pipeline end-to-end', 'Drift detection with auto-alerts', 'CT triggered by data or performance drift', 'Full observability & tracing', 'Reproducible experiments with seeds'],
      checksAr: ['كود + بيانات + نموذج كلها مُصدَّرة', 'خط CI/CD/CT شامل من البداية للنهاية', 'كشف الانجراف مع تنبيهات آلية', 'CT تُطلَق بالبيانات أو انجراف الأداء', 'مراقبة كاملة وتتبع الأثر', 'تجارب قابلة لإعادة الإنتاج بالبذور'],
      missingEn: ['High infrastructure complexity', 'Requires MLOps team expertise', 'Risk of over-automation without human oversight'],
      missingAr: ['تعقيد بنية تحتية عالٍ', 'يتطلب خبرة فريق MLOps', 'خطر الأتمتة المفرطة دون إشراف بشري'],
    },
  ],
};

export default function MaturityLadder() {
  const { lang } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const level = dict.levels.find(l => l.id === selected);

  return (
    <div className="space-y-5">
      <h3 className="font-bold text-base text-center">{dict.title[lang]}</h3>
      <p className="text-xs text-center text-muted-foreground">{dict.clickHint[lang]}</p>

      {/* Ladder rungs */}
      <div className="flex flex-col gap-3">
        {dict.levels.map((lvl) => {
          const isActive = selected === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => setSelected(isActive ? null : lvl.id)}
              className={`w-full text-start flex items-center gap-4 px-5 py-4 rounded-2xl border-2 font-bold text-sm transition-all shadow-sm
                ${isActive ? lvl.activeClass : lvl.colorClass}`}
            >
              <span className="text-2xl">{lvl.icon}</span>
              <span>{lang === 'ar' ? lvl.labelAr : lvl.labelEn}</span>
              <span className="ms-auto text-lg">{isActive ? '▲' : '▼'}</span>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {level && (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border bg-background p-5 space-y-4"
          >
            <div>
              <h4 className="font-bold text-sm text-emerald-700 mb-2 flex items-center gap-1">
                <span>✅</span> {dict.exists[lang]}
              </h4>
              <ul className="space-y-1">
                {(lang === 'ar' ? level.checksAr : level.checksEn).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-destructive mb-2 flex items-center gap-1">
                <span>⚠️</span> {dict.pain[lang]}
              </h4>
              <ul className="space-y-1">
                {(lang === 'ar' ? level.missingAr : level.missingEn).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-destructive mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
