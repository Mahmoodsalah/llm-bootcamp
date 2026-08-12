import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

type ToolEntry = {
  icon: string;
  category: { en: string; ar: string };
  role: { en: string; ar: string };
  example: { en: string; ar: string };
  broken: { en: string; ar: string };
  color: string;
  border: string;
  bg: string;
};

const tools: ToolEntry[] = [
  {
    icon: '🔁',
    category: { en: 'Orchestration', ar: 'التنسيق (Orchestration)' },
    role: {
      en: 'An orchestrator schedules and coordinates every pipeline step — data ingestion, training, evaluation, deployment — in the right order, retrying on failure and tracking exactly what ran when. Without it you run steps manually and lose reproducibility.',
      ar: 'ينسق المنسق كل خطوة من خطوات الخط الأنبوبي — استيعاب البيانات والتدريب والتقييم والنشر — بالترتيب الصحيح، مع إعادة المحاولة عند الفشل وتتبع ما تم تشغيله ومتى.'
    },
    example: {
      en: 'ZenML: decorates Python functions with @pipeline and @step, builds a DAG, and runs it locally or on cloud compute with no code changes.',
      ar: 'ZenML: يزين دوال Python بـ @pipeline و@step، ويبني رسماً بيانياً DAG، ويشغله محلياً أو على الحوسبة السحابية بدون تغييرات في الكود.'
    },
    broken: {
      en: 'Without an orchestrator, pipelines are shell scripts that break silently, produce unreproducible results, and cannot be scheduled or monitored.',
      ar: 'بدون منسق، تكون الخطوط الأنبوبية نصوص shell تفشل بصمت، وتنتج نتائج غير قابلة للتكرار، ولا يمكن جدولتها أو مراقبتها.'
    },
    color: 'text-violet-600',
    border: 'border-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30'
  },
  {
    icon: '📊',
    category: { en: 'Experiment Tracking', ar: 'تتبع التجارب' },
    role: {
      en: 'Every training run produces hyperparameters, loss curves, evaluation metrics, and model artifacts. An experiment tracker logs all of these automatically and lets you compare runs side-by-side so you know what change caused an improvement.',
      ar: 'كل عملية تدريب تنتج معاملات hyperparameters ومنحنيات الخسارة ومقاييس التقييم والتحقق من النموذج. يسجل متتبع التجارب كل هذه البيانات تلقائياً ويتيح لك مقارنة التشغيلات جنباً إلى جنب.'
    },
    example: {
      en: 'Comet ML: logs metrics, parameters, and code versions per run; surfaces comparisons in a browser dashboard with no extra infrastructure.',
      ar: 'Comet ML: يسجل المقاييس والمعاملات وإصدارات الكود لكل تشغيل؛ ويعرض المقارنات في لوحة معلومات المتصفح دون بنية تحتية إضافية.'
    },
    broken: {
      en: 'Without tracking you rely on notes and memory. You cannot reproduce your best run, cannot explain why the model regressed, and cannot safely hand off work to a teammate.',
      ar: 'بدون التتبع تعتمد على الملاحظات والذاكرة. لا يمكنك إعادة إنتاج أفضل تشغيل، ولا يمكنك شرح سبب تراجع النموذج، ولا يمكنك نقل العمل بأمان إلى زميل.'
    },
    color: 'text-blue-600',
    border: 'border-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30'
  },
  {
    icon: '🗃️',
    category: { en: 'Object Storage & Data Warehouse', ar: 'تخزين الكائنات ومستودع البيانات' },
    role: {
      en: 'Large artifacts — model checkpoints, raw crawled documents, instruction datasets — must live somewhere durable, versioned, and accessible by every pipeline step regardless of where it runs. Object storage (like S3) handles binary blobs; a NoSQL warehouse (like MongoDB) handles flexible unstructured documents.',
      ar: 'يجب أن تعيش التحقق الكبيرة — نقاط تفتيش النموذج والمستندات المُزحفة الخام ومجموعات البيانات التعليمية — في مكان متين ومصنف بإصدارات ويمكن لكل خطوة خط أنبوبي الوصول إليه.'
    },
    example: {
      en: 'AWS S3 for binary artifacts and trained model weights; MongoDB as a schema-free document store for raw crawled text that varies in shape per source.',
      ar: 'AWS S3 للتحقق الثنائية وأوزان النموذج المدرَّب؛ MongoDB كمخزن مستندات بدون مخطط للنص المُزحف الخام الذي يتباين في شكله حسب المصدر.'
    },
    broken: {
      en: 'Without durable storage, data lives only on one machine. A restart wipes training data; a scaling event loses the model; and pipelines cannot share large artifacts.',
      ar: 'بدون تخزين متين، تعيش البيانات فقط على جهاز واحد. يمحو إعادة التشغيل بيانات التدريب؛ وتفقد حدثة التوسع النموذج؛ ولا يمكن للخطوط مشاركة التحقق الكبيرة.'
    },
    color: 'text-amber-600',
    border: 'border-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30'
  },
  {
    icon: '🔍',
    category: { en: 'Vector Database', ar: 'قاعدة البيانات المتجهية' },
    role: {
      en: 'A vector database indexes high-dimensional embedding vectors and retrieves the nearest neighbors to a query vector in milliseconds using approximate nearest neighbor (ANN) algorithms. This powers real-time RAG: at inference time the LLM fetches the user\'s own past content as context before generating.',
      ar: 'تفهرس قاعدة البيانات المتجهية متجهات التضمين عالية الأبعاد وتسترجع الجيران الأقرب لمتجه استعلام في ميلي ثانية باستخدام خوارزميات الجار الأقرب التقريبي. هذا يشغّل RAG في الوقت الحقيقي.'
    },
    example: {
      en: 'Qdrant: open-source, supports HNSW indexing, filtering on payload metadata, and hybrid (dense + sparse) search in a single query. Runs locally via Docker or as a managed cloud service.',
      ar: 'Qdrant: مفتوح المصدر، يدعم فهرسة HNSW والتصفية على بيانات وصفية payload والبحث الهجين (كثيف + متفرق) في استعلام واحد.'
    },
    broken: {
      en: 'Without a vector DB, RAG requires scanning every document at query time — impossible at scale. The LLM loses access to personalised context and generates generic content.',
      ar: 'بدون قاعدة بيانات متجهية، يتطلب RAG فحص كل مستند وقت الاستعلام — مستحيل على نطاق واسع. يفقد LLM الوصول إلى السياق المخصص ويولد محتوى عاماً.'
    },
    color: 'text-emerald-600',
    border: 'border-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30'
  },
  {
    icon: '☁️',
    category: { en: 'Cloud Compute', ar: 'الحوسبة السحابية' },
    role: {
      en: 'Fine-tuning a 7B+ parameter LLM demands far more GPU memory than a laptop can provide. Cloud compute lets you rent exactly the hardware you need — high-memory A100 instances for training, smaller instances for inference — paying only for what you use.',
      ar: 'يتطلب الضبط الدقيق لنموذج LLM بأكثر من 7 مليار معامل ذاكرة GPU أكثر بكثير مما يمكن أن يوفره جهاز محمول. تتيح لك الحوسبة السحابية استئجار الأجهزة التي تحتاجها بالضبط.'
    },
    example: {
      en: 'AWS SageMaker: managed training jobs that provision GPU clusters, run your training container, save checkpoints to S3, and shut down automatically when done — no cluster management.',
      ar: 'AWS SageMaker: مهام تدريب مُدارة تُنشئ مجموعات GPU وتشغل حاوية التدريب وتحفظ نقاط التفتيش إلى S3 وتغلق تلقائياً عند الانتهاء.'
    },
    broken: {
      en: 'Without cloud compute, training large models is practically impossible. You are locked to a single machine, cannot scale inference to multiple users, and have no managed auto-scaling.',
      ar: 'بدون الحوسبة السحابية، تدريب النماذج الكبيرة غير ممكن عملياً. أنت مقيد بجهاز واحد، ولا يمكنك توسيع الاستدلال لمستخدمين متعددين.'
    },
    color: 'text-sky-600',
    border: 'border-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/30'
  },
  {
    icon: '🔭',
    category: { en: 'Prompt Monitoring', ar: 'مراقبة الأوامر' },
    role: {
      en: 'Once a model is in production it can drift: users send prompts your evaluations never covered; the base model updates underneath you; quality silently degrades. A prompt monitoring tool logs every request and response, scores them for quality, and alerts you to regressions before users notice.',
      ar: 'بمجرد أن يكون النموذج في الإنتاج يمكن أن ينجرف: يرسل المستخدمون أوامر لم تغطها تقييماتك؛ يتحدث النموذج الأساسي من تحتك؛ وتتراجع الجودة بصمت.'
    },
    example: {
      en: 'Opik: logs LLM traces, scores responses automatically with LLM-as-judge evaluators, and surfaces problematic examples in a dashboard — closing the feedback loop from production back to training.',
      ar: 'Opik: يسجل آثار LLM ويقيّم الاستجابات تلقائياً مع مُقيّمات LLM-as-judge، ويعرض الأمثلة الإشكالية في لوحة معلومات.'
    },
    broken: {
      en: 'Without monitoring you are blind in production. Bad outputs accumulate unnoticed, you cannot measure actual quality, and you have no signal for when to retrain.',
      ar: 'بدون المراقبة أنت أعمى في الإنتاج. تتراكم المخرجات السيئة دون ملاحظة، ولا يمكنك قياس الجودة الفعلية، وليس لديك إشارة متى تعيد التدريب.'
    },
    color: 'text-rose-600',
    border: 'border-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30'
  }
];

export default function ToolStack() {
  const { lang } = useStore();
  const [openId, setOpenId] = useState<number | null>(null);

  const dict = {
    title: { en: 'MLOps Tool Stack', ar: 'حزمة أدوات MLOps' },
    subtitle: { en: 'Click a category to explore its role, an example tool, and what breaks without it', ar: 'انقر على فئة لاستكشاف دورها ومثال على الأداة وما يفشل بدونها' },
    role: { en: '🎯 Role', ar: '🎯 الدور' },
    example: { en: '🔧 Example Tool', ar: '🔧 مثال على الأداة' },
    broken: { en: '⚠️ Without this…', ar: '⚠️ بدون هذا…' }
  };

  return (
    <div className="space-y-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-1">
        <h3 className="font-bold text-lg">{dict.title[lang]}</h3>
        <p className="text-sm text-muted-foreground">{dict.subtitle[lang]}</p>
      </div>

      <div className="space-y-2">
        {tools.map((tool, i) => (
          <div key={i} className={`rounded-2xl border-2 overflow-hidden transition-colors ${openId === i ? tool.border : 'border-border'}`}>
            <button
              onClick={() => setOpenId(openId === i ? null : i)}
              className={`w-full flex items-center gap-3 p-4 text-start transition-colors ${openId === i ? tool.bg : 'hover:bg-muted/50'}`}
            >
              <span className="text-2xl flex-shrink-0">{tool.icon}</span>
              <span className={`font-bold flex-1 ${openId === i ? tool.color : 'text-foreground'}`}>
                {tool.category[lang]}
              </span>
              <motion.span
                animate={{ rotate: openId === i ? 180 : 0 }}
                className="text-muted-foreground flex-shrink-0"
              >
                ▾
              </motion.span>
            </button>

            <AnimatePresence>
              {openId === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className={`px-5 pb-5 pt-2 space-y-4 ${tool.bg}`}>
                    <div className="space-y-1">
                      <div className={`text-xs font-bold uppercase tracking-wide ${tool.color}`}>{dict.role[lang]}</div>
                      <p className="text-sm leading-relaxed">{tool.role[lang]}</p>
                    </div>
                    <div className="space-y-1">
                      <div className={`text-xs font-bold uppercase tracking-wide ${tool.color}`}>{dict.example[lang]}</div>
                      <p className="text-sm leading-relaxed">{tool.example[lang]}</p>
                    </div>
                    <div className="space-y-1 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3">
                      <div className="text-xs font-bold uppercase tracking-wide text-amber-700">{dict.broken[lang]}</div>
                      <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">{tool.broken[lang]}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
