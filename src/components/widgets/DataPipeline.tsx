import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

type Source = 'blog' | 'repo' | 'article';

const sources: { id: Source; label: { en: string; ar: string }; icon: string; crawlerType: { en: string; ar: string }; docType: { en: string; ar: string } }[] = [
  {
    id: 'blog',
    icon: '📝',
    label: { en: 'Medium Blog Post', ar: 'مقالة Medium' },
    crawlerType: { en: 'MediumCrawler', ar: 'MediumCrawler' },
    docType: { en: 'Article Document', ar: 'مستند مقالة' }
  },
  {
    id: 'repo',
    icon: '💻',
    label: { en: 'GitHub Repository', ar: 'مستودع GitHub' },
    crawlerType: { en: 'GithubCrawler', ar: 'GithubCrawler' },
    docType: { en: 'Repository Document', ar: 'مستند مستودع' }
  },
  {
    id: 'article',
    icon: '📰',
    label: { en: 'Substack / Blog Article', ar: 'مقالة Substack / مدونة' },
    crawlerType: { en: 'CustomArticleCrawler', ar: 'CustomArticleCrawler' },
    docType: { en: 'Article Document', ar: 'مستند مقالة' }
  }
];

type PipelineStep = {
  id: string;
  label: { en: string; ar: string };
  icon: string;
  detail: (src: Source) => { en: string; ar: string };
};

const steps: PipelineStep[] = [
  {
    id: 'crawl',
    label: { en: 'Crawl', ar: 'الزحف' },
    icon: '🕷️',
    detail: (src) => ({
      en: src === 'repo'
        ? 'The GithubCrawler clones the repository to a temp directory, walks every file (excluding .git, lock files, images), and reads the source code text.'
        : src === 'blog'
        ? 'The MediumCrawler opens a headless Chrome session, logs in, scrolls the page to load all content, then extracts the full article HTML.'
        : 'The CustomArticleCrawler fetches the URL directly (no login required) and extracts all visible text from the HTML — a safe fallback for any public web page.',
      ar: src === 'repo'
        ? 'يستنسخ GithubCrawler المستودع إلى دليل مؤقت، ويمشي على كل ملف (باستثناء .git وملفات القفل والصور)، ويقرأ نص الكود المصدري.'
        : src === 'blog'
        ? 'يفتح MediumCrawler جلسة Chrome بدون رأس، ويسجل الدخول، ويتمرر في الصفحة لتحميل كل المحتوى، ثم يستخرج HTML المقالة الكاملة.'
        : 'يجلب CustomArticleCrawler عنوان URL مباشرة (لا يتطلب تسجيل دخول) ويستخرج كل النص المرئي من HTML — احتياطي آمن لأي صفحة ويب عامة.'
    })
  },
  {
    id: 'dispatch',
    label: { en: 'Dispatch', ar: 'التوزيع' },
    icon: '🔀',
    detail: (src) => ({
      en: `The CrawlerDispatcher inspects the URL's domain and routes to the correct crawler class. For this source it selected ${sources.find(s => s.id === src)!.crawlerType.en}. Unknown domains fall back to CustomArticleCrawler automatically.`,
      ar: `يفحص CrawlerDispatcher نطاق URL ويوجه إلى فئة الزاحف الصحيحة. لهذا المصدر اختار ${sources.find(s => s.id === src)!.crawlerType.ar}. النطاقات غير المعروفة تعود تلقائياً إلى CustomArticleCrawler.`
    })
  },
  {
    id: 'clean',
    label: { en: 'Clean & Standardise', ar: 'التنظيف والتوحيد' },
    icon: '🧹',
    detail: (src) => ({
      en: `Raw HTML or code is stripped of markup, navigation elements, and noise. Text is normalised (unicode, whitespace). All sources produce the same document interface: a ${sources.find(s => s.id === src)!.docType.en} with consistent fields — content, URL, author, timestamp.`,
      ar: `يتم تجريد HTML الخام أو الكود من الترميز وعناصر التنقل والضوضاء. يتم توحيد النص (unicode والمسافات البيضاء). تنتج جميع المصادر نفس واجهة المستند: ${sources.find(s => s.id === src)!.docType.ar} مع حقول متسقة — المحتوى والرابط والمؤلف والطابع الزمني.`
    })
  },
  {
    id: 'store',
    label: { en: 'Store in MongoDB', ar: 'التخزين في MongoDB' },
    icon: '🍃',
    detail: (_src) => ({
      en: 'The cleaned document is saved to a MongoDB collection via an ODM (Object Document Mapper). MongoDB\'s schema-less nature means each data category can store extra fields without a migration. The data warehouse is now ready for the feature pipeline to read.',
      ar: 'يتم حفظ المستند المنظف في مجموعة MongoDB عبر ODM (رسام المستندات الكائنية). الطبيعة عديمة المخطط لـ MongoDB تعني أن كل فئة بيانات يمكنها تخزين حقول إضافية دون ترحيل. مستودع البيانات جاهز الآن لخط الميزات للقراءة منه.'
    })
  }
];

export default function DataPipeline() {
  const { lang } = useStore();
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const dict = {
    pick: { en: 'Pick a data source to simulate the pipeline:', ar: 'اختر مصدر بيانات لمحاكاة الخط الأنبوبي:' },
    run: { en: 'Run Pipeline', ar: 'تشغيل الخط' },
    running: { en: 'Processing…', ar: 'جارٍ المعالجة…' },
    done: { en: '✅ Stored in MongoDB!', ar: '✅ تم التخزين في MongoDB!' },
    step: { en: 'Step', ar: 'خطوة' },
    what: { en: 'What happens:', ar: 'ما الذي يحدث:' }
  };

  const runPipeline = () => {
    if (!selectedSource || running) return;
    setRunning(true);
    setDone(false);
    setActiveStep(0);
    let s = 0;
    const interval = setInterval(() => {
      s++;
      if (s >= steps.length) {
        clearInterval(interval);
        setActiveStep(steps.length - 1);
        setRunning(false);
        setDone(true);
        return;
      }
      setActiveStep(s);
    }, 900);
  };

  const reset = () => {
    setActiveStep(-1);
    setDone(false);
    setRunning(false);
    setSelectedSource(null);
  };

  return (
    <div className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Source picker */}
      <div className="space-y-3">
        <p className="font-bold text-sm text-muted-foreground">{dict.pick[lang]}</p>
        <div className="grid grid-cols-3 gap-3">
          {sources.map((src) => (
            <button
              key={src.id}
              onClick={() => { setSelectedSource(src.id); setActiveStep(-1); setDone(false); setRunning(false); }}
              disabled={running}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer disabled:opacity-50 ${
                selectedSource === src.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/40 bg-card'
              }`}
            >
              <span className="text-3xl">{src.icon}</span>
              <span className="text-xs font-bold text-center leading-tight">{src.label[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Run button */}
      <div className="flex gap-3">
        <button
          onClick={runPipeline}
          disabled={!selectedSource || running}
          className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          {running ? dict.running[lang] : dict.run[lang]}
        </button>
        {(activeStep >= 0 || done) && (
          <button
            onClick={reset}
            className="px-4 py-3 border-2 border-border rounded-xl font-bold text-sm hover:bg-muted transition-colors"
          >
            ↺
          </button>
        )}
      </div>

      {/* Pipeline visualization */}
      {activeStep >= 0 && selectedSource && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
            {steps.map((step, i) => {
              const isActive = activeStep === i;
              const isPast = activeStep > i;
              return (
                <React.Fragment key={step.id}>
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isPast ? 'hsl(var(--primary))' : isActive ? 'hsl(var(--primary)/0.15)' : 'hsl(var(--muted))'
                    }}
                    className={`flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-2xl min-w-[80px] border-2 ${
                      isActive ? 'border-primary' : isPast ? 'border-primary/60' : 'border-border'
                    }`}
                  >
                    <span className="text-xl">{step.icon}</span>
                    <span className={`text-xs font-bold text-center ${isPast ? 'text-primary-foreground' : isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.label[lang]}
                    </span>
                  </motion.div>
                  {i < steps.length - 1 && (
                    <motion.span
                      animate={{ opacity: isPast ? 1 : 0.3 }}
                      className="text-primary font-bold text-lg flex-shrink-0"
                    >
                      {lang === 'ar' ? '←' : '→'}
                    </motion.span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-muted border border-border space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{steps[activeStep].icon}</span>
                <span className="font-bold text-primary">{steps[activeStep].label[lang]}</span>
              </div>
              <p className="text-sm leading-relaxed">{steps[activeStep].detail(selectedSource)[lang]}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Done banner */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 text-center font-bold text-emerald-700 dark:text-emerald-300 text-lg"
          >
            {dict.done[lang]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
