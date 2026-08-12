import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

const stages = [
  {
    id: 'sources',
    icon: '📥',
    label: { en: 'Data Sources', ar: 'مصادر البيانات' },
    color: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-600',
    detail: {
      en: 'Raw digital data — blog posts, social media threads, GitHub repositories, and articles — flows in from the real world. This is the fuel: without fresh, diverse, personal data the model has nothing meaningful to learn from.',
      ar: 'تتدفق البيانات الرقمية الخام — منشورات المدونات، والخيوط على منصات التواصل الاجتماعي، ومستودعات GitHub، والمقالات — من العالم الحقيقي. هذا هو الوقود: بدون بيانات شخصية متنوعة وحديثة، لا يوجد شيء ذو معنى يتعلمه النموذج.'
    }
  },
  {
    id: 'feature',
    icon: '⚙️',
    label: { en: 'Feature Pipeline', ar: 'خط الميزات' },
    color: 'bg-violet-500',
    border: 'border-violet-500',
    text: 'text-violet-600',
    detail: {
      en: 'The feature pipeline ingests raw data, cleans it, normalises it, chunks it, and embeds it into vectors. Its job is to transform messy real-world text into a clean, consistent representation ready for both training and retrieval. It runs independently — you can re-run it whenever new data arrives.',
      ar: 'يستوعب خط الميزات البيانات الخام، وينظفها، ويوحدها، ويقسمها إلى أجزاء، ويحولها إلى متجهات. وظيفته تحويل النص الفوضوي من العالم الحقيقي إلى تمثيل نظيف ومتسق جاهز للتدريب والاسترجاع. يعمل بشكل مستقل — يمكنك إعادة تشغيله كلما وصلت بيانات جديدة.'
    }
  },
  {
    id: 'store',
    icon: '🗄️',
    label: { en: 'Feature Store (Vector DB)', ar: 'مخزن الميزات (قاعدة المتجهات)' },
    color: 'bg-emerald-500',
    border: 'border-emerald-500',
    text: 'text-emerald-600',
    detail: {
      en: 'The feature store is the central hub that decouples the three pipelines. It stores versioned, searchable embeddings in a vector database. The training pipeline reads features from here; so does the inference pipeline at query time. Versioning ensures training and serving always use matching data.',
      ar: 'مخزن الميزات هو المحور المركزي الذي يفصل بين الخطوط الثلاثة. يخزن التضمينات المصنوفة بإصدارات والقابلة للبحث في قاعدة بيانات متجهية. يقرأ خط التدريب الميزات من هنا؛ كذلك يفعل خط الاستدلال وقت الاستعلام. تضمن الإصدارات أن التدريب والخدمة يستخدمان دائماً بيانات متطابقة.'
    }
  },
  {
    id: 'training',
    icon: '🏋️',
    label: { en: 'Training Pipeline', ar: 'خط التدريب' },
    color: 'bg-orange-500',
    border: 'border-orange-500',
    text: 'text-orange-600',
    detail: {
      en: 'The training pipeline reads features from the feature store, fine-tunes a base LLM on them, evaluates the resulting model, and pushes passing checkpoints to the model registry. It runs on demand — triggered manually or by a new dataset version — and scales independently to large GPU clusters.',
      ar: 'يقرأ خط التدريب الميزات من مخزن الميزات، ويضبط نموذج LLM الأساسي عليها بدقة، ويقيّم النموذج الناتج، ويرفع النقاط التفتيشية الناجحة إلى سجل النماذج. يعمل عند الطلب — يُشغَّل يدوياً أو بإصدار مجموعة بيانات جديدة — ويتوسع بشكل مستقل إلى مجموعات GPU كبيرة.'
    }
  },
  {
    id: 'registry',
    icon: '📦',
    label: { en: 'Model Registry', ar: 'سجل النماذج' },
    color: 'bg-rose-500',
    border: 'border-rose-500',
    text: 'text-rose-600',
    detail: {
      en: 'The model registry stores every trained model checkpoint with its version, training metadata, and evaluation scores. The inference pipeline always fetches the model from here — this clean interface makes rollbacks trivial: just point to the previous version if the new one regresses.',
      ar: 'يخزن سجل النماذج كل نقطة تفتيش نموذج مدرَّب مع إصدارها وبيانات التدريب الوصفية ودرجات التقييم. يجلب خط الاستدلال النموذج من هنا دائماً — هذه الواجهة النظيفة تجعل التراجع أمراً بسيطاً: فقط أشر إلى الإصدار السابق إذا تراجع الجديد.'
    }
  },
  {
    id: 'inference',
    icon: '🚀',
    label: { en: 'Inference Pipeline', ar: 'خط الاستدلال' },
    color: 'bg-cyan-500',
    border: 'border-cyan-500',
    text: 'text-cyan-600',
    detail: {
      en: 'The inference pipeline loads the model from the registry, retrieves relevant embeddings from the feature store in real time (RAG), assembles a personalised prompt, and returns the response. It scales independently via auto-scaling — no changes needed in the training code when traffic spikes.',
      ar: 'يحمّل خط الاستدلال النموذج من السجل، ويسترجع التضمينات ذات الصلة من مخزن الميزات في الوقت الحقيقي (RAG)، ويجمع أمراً مخصصاً، ويعيد الاستجابة. يتوسع بشكل مستقل عبر التوسع التلقائي — لا تغييرات مطلوبة في كود التدريب عند ارتفاع حركة المرور.'
    }
  },
  {
    id: 'user',
    icon: '👤',
    label: { en: 'User / Client', ar: 'المستخدم / العميل' },
    color: 'bg-slate-500',
    border: 'border-slate-500',
    text: 'text-slate-600',
    detail: {
      en: 'The end user sends a prompt — a topic idea, a draft outline — and receives content written in their own voice. The client knows nothing about the pipelines behind it; it simply calls a REST API and gets back personalised text.',
      ar: 'يرسل المستخدم النهائي أمراً — فكرة موضوع، أو مخطط مسودة — ويتلقى محتوى مكتوباً بصوته الخاص. العميل لا يعرف شيئاً عن الخطوط خلفه؛ فهو ببساطة يستدعي واجهة برمجة REST ويحصل على نص مخصص.'
    }
  }
];

const arrows = [0, 1, 2, 3, 4, 5];

export default function FTIPipeline() {
  const { lang } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);
  const [flowStep, setFlowStep] = useState(-1);

  const selectedStage = stages.find(s => s.id === selected);

  const runAnimation = () => {
    setAnimated(true);
    setFlowStep(0);
    setSelected(null);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= stages.length) {
        clearInterval(interval);
        setFlowStep(stages.length - 1);
        setTimeout(() => { setAnimated(false); setFlowStep(-1); }, 800);
        return;
      }
      setFlowStep(step);
    }, 500);
  };

  const dict = {
    title: { en: 'FTI Pipeline Architecture', ar: 'معمارية خط FTI' },
    subtitle: { en: 'Click any stage to learn its role', ar: 'انقر على أي مرحلة لتعرف دورها' },
    animate: { en: 'Animate Data Flow', ar: 'حرّك تدفق البيانات' },
    close: { en: 'Close', ar: 'إغلاق' },
    role: { en: 'Role in the system:', ar: 'الدور في النظام:' }
  };

  return (
    <div className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-1">
        <h3 className="font-bold text-lg">{dict.title[lang]}</h3>
        <p className="text-sm text-muted-foreground">{dict.subtitle[lang]}</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={runAnimation}
          disabled={animated}
          className="px-5 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          {dict.animate[lang]}
        </button>
      </div>

      {/* Pipeline stages — horizontal scroll on small screens */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
        {stages.map((stage, i) => {
          const isActive = flowStep >= i;
          const isSelected = selected === stage.id;
          return (
            <React.Fragment key={stage.id}>
              <motion.button
                onClick={() => setSelected(isSelected ? null : stage.id)}
                animate={{
                  scale: isSelected ? 1.08 : flowStep === i ? 1.12 : 1,
                  opacity: flowStep >= 0 && !isActive ? 0.35 : 1
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 cursor-pointer min-w-[90px] transition-colors ${
                  isSelected ? `${stage.border} bg-primary/5` : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                <span className="text-2xl">{stage.icon}</span>
                <span className={`text-xs font-bold text-center leading-tight ${isSelected ? stage.text : 'text-foreground'}`}>
                  {stage.label[lang]}
                </span>
                {(isActive && flowStep >= 0) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-2 h-2 rounded-full ${stage.color}`}
                  />
                )}
              </motion.button>
              {i < stages.length - 1 && (
                <motion.div
                  animate={{ opacity: flowStep > i ? 1 : 0.2, scaleX: flowStep > i ? 1 : 0.5 }}
                  className="flex-shrink-0 text-muted-foreground font-bold text-lg select-none"
                  style={{ transformOrigin: lang === 'ar' ? 'right' : 'left' }}
                >
                  {lang === 'ar' ? '←' : '→'}
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            key={selectedStage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`p-5 rounded-2xl border-2 ${selectedStage.border} bg-card space-y-3`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedStage.icon}</span>
                <span className={`font-bold text-base ${selectedStage.text}`}>{selectedStage.label[lang]}</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold px-3 py-1 rounded-lg hover:bg-muted transition-colors"
              >
                {dict.close[lang]}
              </button>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{selectedStage.detail[lang]}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
