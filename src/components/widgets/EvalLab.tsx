import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

const dict = {
  title: { en: 'Evaluation Lab', ar: 'مختبر التقييم' },
  pick: { en: 'Choose your application type:', ar: 'اختر نوع تطبيقك:' },
  scenarios: [
    { id: 'chatbot', label: { en: 'General Chatbot', ar: 'روبوت محادثة عام' } },
    { id: 'domain', label: { en: 'Domain Assistant', ar: 'مساعد متخصص' } },
    { id: 'rag', label: { en: 'RAG Application', ar: 'تطبيق RAG' } },
  ],
  strategyTitle: { en: 'Recommended Eval Strategy', ar: 'استراتيجية التقييم المقترحة' },
  pitfallLabel: { en: '⚠️ Key Pitfall', ar: '⚠️ تحذير أساسي' },
};

type ScenarioId = 'chatbot' | 'domain' | 'rag';

type MetricCard = {
  name: { en: string; ar: string };
  desc: { en: string; ar: string };
  color: string;
};

const strategies: Record<ScenarioId, { cards: MetricCard[]; pitfall: { en: string; ar: string } }> = {
  chatbot: {
    cards: [
      {
        name: { en: 'MT-Bench / AlpacaEval', ar: 'MT-Bench / AlpacaEval' },
        desc: { en: 'Multi-turn conversation quality rated by an LLM judge — checks coherence, helpfulness, and instruction following across dialogue turns.', ar: 'جودة المحادثة متعددة الأدوار تُقيَّم بنموذج لغوي — يفحص التماسك والفائدة واتباع التعليمات عبر أدوار الحوار.' },
        color: 'bg-blue-50 border-blue-300 text-blue-800',
      },
      {
        name: { en: 'IFEval (Instruction Following)', ar: 'IFEval (اتباع التعليمات)' },
        desc: { en: 'Verifiable constraints: "reply without commas", "use exactly 3 bullet points". Binary pass/fail — no judge bias.', ar: 'قيود قابلة للتحقق: "أجب دون فواصل"، "استخدم 3 نقاط فقط". نتيجة ثنائية — لا تحيز للمحكّم.' },
        color: 'bg-emerald-50 border-emerald-300 text-emerald-800',
      },
      {
        name: { en: 'LLM-as-a-Judge (Rubric)', ar: 'النموذج كمحكّم (بمعايير)' },
        desc: { en: 'Rate responses on dimensions like relevance (1–4), toxicity, and verbosity. Use a strong model (GPT-4 class) and structured output to reduce variance.', ar: 'تقييم الإجابات على أبعاد كالصلة (1–4) والسمية والإطالة. استخدم نموذجًا قويًا ومخرجات منظمة لتقليل التباين.' },
        color: 'bg-purple-50 border-purple-300 text-purple-800',
      },
    ],
    pitfall: {
      en: 'Verbosity bias: judges often reward longer, confident-sounding answers even when they are less accurate. Counteract by adding explicit length-penalty criteria to your rubric.',
      ar: 'تحيز الإطالة: تكافئ النماذج المحكّمة الإجابات الطويلة الواثقة حتى حين تكون أقل دقة. تصدَّ لذلك بإضافة معيار صريح لعقوبة الطول في مقياسك.',
    },
  },
  domain: {
    cards: [
      {
        name: { en: 'Domain Benchmark Suite', ar: 'مجموعة معايير متخصصة' },
        desc: { en: 'Curated multiple-choice questions from your domain (medicine, law, finance, code). Combine translated general benchmarks with native domain questions for full coverage.', ar: 'أسئلة اختيار من متعدد منتقاة من مجالك (طب، قانون، مالية، كود). ادمج معايير عامة مترجمة مع أسئلة أصيلة من المجال لتغطية شاملة.' },
        color: 'bg-orange-50 border-orange-300 text-orange-800',
      },
      {
        name: { en: 'Task-Specific Metrics', ar: 'مقاييس الأداء بالمهمة' },
        desc: { en: 'For classification: F1-score and recall. For summarization: ROUGE-L overlap with reference. For code: Pass@1 on executable test cases.', ar: 'للتصنيف: F1 والاسترجاع. للتلخيص: تداخل ROUGE-L مع مرجع. للكود: Pass@1 على حالات اختبار قابلة للتنفيذ.' },
        color: 'bg-teal-50 border-teal-300 text-teal-800',
      },
      {
        name: { en: 'Custom Eval Set (Real Usage)', ar: 'مجموعة تقييم مخصصة (من الاستخدام الفعلي)' },
        desc: { en: 'Sample 200–500 real queries from logs, annotate expected outputs, and track performance over model versions. Nothing beats evaluation on your actual distribution.', ar: 'استخرج 200–500 استعلام حقيقي من السجلات، ضع لها مخرجات متوقعة، وتتبع الأداء عبر إصدارات النموذج. لا شيء يتفوق على التقييم من توزيعك الفعلي.' },
        color: 'bg-yellow-50 border-yellow-300 text-yellow-800',
      },
    ],
    pitfall: {
      en: 'Contamination creep: if your custom eval set leaks into fine-tuning data, scores inflate but real quality does not improve. Keep a strict holdout — never use eval examples in training.',
      ar: 'تسرب التلوث: إذا تسربت مجموعة التقييم إلى بيانات الضبط الدقيق، ترتفع النتائج دون تحسن حقيقي. احتفظ بمجموعة محجوزة صارمة — لا تستخدم أمثلة التقييم أبدًا في التدريب.',
    },
  },
  rag: {
    cards: [
      {
        name: { en: 'Retrieval: Recall@K', ar: 'استرجاع: Recall@K' },
        desc: { en: 'For K retrieved chunks, what fraction contain the answer? Measure retrieval independently before ever touching generation — if this fails, no prompt tricks can save you.', ar: 'من بين K أجزاء مسترجعة، كم تحتوي على الإجابة؟ قيّم الاسترجاع مستقلًا قبل التوليد — إذا فشل هذا، لن تنجح أي حيلة في الأمر.' },
        color: 'bg-blue-50 border-blue-300 text-blue-800',
      },
      {
        name: { en: 'Retrieval: Context Precision', ar: 'استرجاع: دقة السياق' },
        desc: { en: 'Of the K retrieved chunks, how many are actually relevant? High recall + low precision means the LLM is flooded with noise — fix your reranker or lower K.', ar: 'من بين K أجزاء مسترجعة، كم منها ذات صلة فعلًا؟ استرجاع عالٍ + دقة منخفضة يعني إغراق النموذج بضوضاء — أصلح إعادة الترتيب أو قلّل K.' },
        color: 'bg-emerald-50 border-emerald-300 text-emerald-800',
      },
      {
        name: { en: 'Generation: Faithfulness', ar: 'توليد: الأمانة' },
        desc: { en: 'Does every claim in the answer trace back to a retrieved source chunk? An LLM judge checks each atomic claim against the context. Score = verifiable claims / total claims.', ar: 'هل كل ادعاء في الإجابة يعود إلى جزء مصدر مسترجع؟ محكّم لغوي يفحص كل ادعاء ذري مقابل السياق. النتيجة = الادعاءات القابلة للتحقق / مجموع الادعاءات.' },
        color: 'bg-purple-50 border-purple-300 text-purple-800',
      },
      {
        name: { en: 'Generation: Answer Relevancy', ar: 'توليد: صلة الإجابة' },
        desc: { en: 'Does the answer actually address the question asked? Generate hypothetical questions from the answer, then measure cosine similarity back to the original question.', ar: 'هل الإجابة تعالج السؤال المطروح فعلًا؟ ولّد أسئلة افتراضية من الإجابة، ثم قس تشابه جيب التمام مقارنةً بالسؤال الأصلي.' },
        color: 'bg-rose-50 border-rose-300 text-rose-800',
      },
    ],
    pitfall: {
      en: 'Evaluating RAG as a black box: if you only measure the final answer quality, you cannot tell whether retrieval or generation is causing problems. Always evaluate the two stages separately.',
      ar: 'تقييم RAG كصندوق أسود: إذا قست جودة الإجابة النهائية فقط، لن تعرف إن كان الاسترجاع أو التوليد هو المشكلة. قيّم المرحلتين دائمًا بشكل منفصل.',
    },
  },
};

export default function EvalLab() {
  const { lang } = useStore();
  const [selected, setSelected] = useState<ScenarioId | null>(null);

  const strategy = selected ? strategies[selected] : null;

  return (
    <div className="space-y-6">
      <p className="font-semibold text-center">{dict.pick[lang]}</p>

      <div className="flex flex-wrap gap-3 justify-center">
        {dict.scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id as ScenarioId)}
            className={`px-5 py-3 rounded-xl font-bold border-2 transition-all text-sm shadow-sm
              ${selected === s.id
                ? 'bg-primary text-primary-foreground border-primary scale-105'
                : 'bg-background hover:bg-muted border-border'
              }`}
          >
            {s.label[lang]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {strategy && selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <h3 className="font-bold text-center text-primary">{dict.strategyTitle[lang]}</h3>

            <div className="grid gap-3">
              {strategy.cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-xl border-2 p-4 ${card.color}`}
                >
                  <p className="font-bold text-sm mb-1" dir="ltr">{card.name[lang === 'ar' ? 'ar' : 'en']}</p>
                  <p className="text-sm leading-relaxed">{card.desc[lang]}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: strategy.cards.length * 0.1 }}
              className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4"
            >
              <p className="font-bold text-amber-800 text-sm mb-1">{dict.pitfallLabel[lang]}</p>
              <p className="text-sm text-amber-900 leading-relaxed">{strategy.pitfall[lang]}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <p className="text-center text-muted-foreground text-sm py-8">
          {lang === 'en'
            ? 'Select a scenario above to see the tailored evaluation strategy.'
            : 'اختر سيناريو من الأعلى لرؤية استراتيجية التقييم المناسبة.'}
        </p>
      )}
    </div>
  );
}
