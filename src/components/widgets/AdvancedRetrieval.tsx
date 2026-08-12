import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

const dict = {
  title: { en: 'Advanced Retrieval Pipeline', ar: 'خط الاسترجاع المتقدم' },
  questionLabel: { en: 'Sample Question:', ar: 'سؤال تجريبي:' },
  toggleLabel: { en: 'Toggle Techniques:', ar: 'تفعيل / تعطيل التقنيات:' },
  chunksTitle: { en: 'Retrieved Chunks (sorted by relevance)', ar: 'الأجزاء المسترجعة (مرتبة حسب الصلة)' },
  relevance: { en: 'Relevance', ar: 'الصلة' },
  techniques: {
    selfQuery: { en: 'Self-Query', ar: 'الاستعلام الذاتي' },
    queryExpansion: { en: 'Query Expansion', ar: 'توسيع الاستعلام' },
    reranking: { en: 'Reranking', ar: 'إعادة الترتيب' },
  },
  effectDesc: {
    selfQuery: {
      en: 'Extracts metadata filters (author, date, category) from your question using an LLM, then applies them before the vector search — cutting irrelevant docs from the start.',
      ar: 'يستخرج فلاتر البيانات الوصفية (المؤلف، التاريخ، الفئة) من سؤالك باستخدام نموذج لغوي، ثم يطبقها قبل البحث الاتجاهي — يحذف المستندات غير الصلة منذ البداية.',
    },
    queryExpansion: {
      en: 'Generates 2–4 semantically different restatements of your question, runs a separate vector search for each, then pools the results — capturing relevant chunks that a single query would miss.',
      ar: 'يولّد 2–4 صياغات مختلفة دلاليًا لسؤالك، ينفّذ بحثًا اتجاهيًا منفصلًا لكل منها، ثم يجمع النتائج — يلتقط أجزاء ذات صلة كانت ستفوت استعلامًا منفردًا.',
    },
    reranking: {
      en: 'A cross-encoder model reads (question, chunk) together and produces a precise 0–1 relevance score. Chunks are re-sorted by this score — far more accurate than embedding distance alone.',
      ar: 'نموذج cross-encoder يقرأ (السؤال، الجزء) معًا ويعطي درجة صلة دقيقة 0–1. تُعاد مرتبة الأجزاء بحسب هذه الدرجة — أدق بكثير من مسافة التضمين وحدها.',
    },
  },
  questions: [
    { en: 'What are the best RAG retrieval techniques?', ar: 'ما أفضل تقنيات استرجاع RAG؟' },
    { en: 'How does speculative decoding speed up inference?', ar: 'كيف يسرّع فك الترميز التخميني عملية الاستدلال؟' },
    { en: 'What quantization method works best for consumer GPUs?', ar: 'ما طريقة التكميم الأنسب لبطاقات GPU الاستهلاكية؟' },
  ],
};

type ChunkQuality = 'high' | 'medium' | 'low' | 'noise';

type Chunk = {
  text: { en: string; ar: string };
  baseScore: number;
  quality: ChunkQuality;
};

const baseChunks: Chunk[] = [
  { text: { en: 'Self-querying extracts metadata to filter the search space precisely before embedding comparison.', ar: 'يستخرج الاستعلام الذاتي البيانات الوصفية لتصفية فضاء البحث بدقة قبل مقارنة التضمين.' }, baseScore: 0.55, quality: 'medium' },
  { text: { en: 'Query expansion generates multiple phrasings to cover broader areas of the embedding space.', ar: 'يولّد توسيع الاستعلام صياغات متعددة لتغطية مناطق أوسع من فضاء التضمين.' }, baseScore: 0.48, quality: 'medium' },
  { text: { en: 'Cross-encoder rerankers jointly encode query and chunk, producing highly accurate relevance signals.', ar: 'تقوم النماذج المعيدة للترتيب بترميز الاستعلام والجزء معًا، مما ينتج إشارات صلة دقيقة للغاية.' }, baseScore: 0.42, quality: 'low' },
  { text: { en: 'Advanced RAG pipelines combine pre-retrieval, retrieval, and post-retrieval optimizations.', ar: 'تجمع خطوط RAG المتقدمة تحسينات ما قبل الاسترجاع والاسترجاع وما بعده.' }, baseScore: 0.88, quality: 'high' },
  { text: { en: 'Filtered vector search narrows the candidate pool using metadata, reducing both noise and latency.', ar: 'يضيّق البحث الاتجاهي المُفلتَر مجموعة المرشحين باستخدام البيانات الوصفية، مما يقلل الضوضاء والتأخير.' }, baseScore: 0.71, quality: 'high' },
  { text: { en: 'Unrelated content about Python packaging and build systems.', ar: 'محتوى غير ذي صلة عن تعبئة Python وأنظمة البناء.' }, baseScore: 0.31, quality: 'noise' },
  { text: { en: 'Retrieval-augmented generation grounds LLM responses in external knowledge.', ar: 'يربط الاسترجاع المعزز للتوليد استجابات النماذج بمعرفة خارجية.' }, baseScore: 0.62, quality: 'medium' },
  { text: { en: 'Unrelated content about cloud storage pricing tiers.', ar: 'محتوى غير ذي صلة عن مستويات تسعير التخزين السحابي.' }, baseScore: 0.24, quality: 'noise' },
];

function computeScore(chunk: Chunk, selfQuery: boolean, queryExpansion: boolean, reranking: boolean): number {
  let score = chunk.baseScore;
  if (selfQuery && chunk.quality === 'noise') score *= 0.4;
  if (selfQuery && chunk.quality !== 'noise') score = Math.min(score + 0.08, 1.0);
  if (queryExpansion && chunk.quality === 'high') score = Math.min(score + 0.07, 1.0);
  if (queryExpansion && chunk.quality === 'medium') score = Math.min(score + 0.05, 1.0);
  if (reranking && chunk.quality === 'high') score = Math.min(score + 0.1, 1.0);
  if (reranking && chunk.quality === 'noise') score *= 0.3;
  if (reranking && chunk.quality === 'low') score *= 0.7;
  return Math.round(score * 100) / 100;
}

const qualityColor: Record<ChunkQuality, string> = {
  high: 'border-emerald-400 bg-emerald-50',
  medium: 'border-blue-300 bg-blue-50',
  low: 'border-amber-300 bg-amber-50',
  noise: 'border-red-300 bg-red-50',
};

const scoreBarColor: Record<ChunkQuality, string> = {
  high: 'bg-emerald-500',
  medium: 'bg-blue-400',
  low: 'bg-amber-400',
  noise: 'bg-red-400',
};

export default function AdvancedRetrieval() {
  const { lang } = useStore();
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selfQuery, setSelfQuery] = useState(false);
  const [queryExpansion, setQueryExpansion] = useState(false);
  const [reranking, setReranking] = useState(false);

  const scored = baseChunks
    .map(c => ({ ...c, score: computeScore(c, selfQuery, queryExpansion, reranking) }))
    .sort((a, b) => b.score - a.score);

  const toggles = [
    { key: 'selfQuery', label: dict.techniques.selfQuery, value: selfQuery, set: setSelfQuery },
    { key: 'queryExpansion', label: dict.techniques.queryExpansion, value: queryExpansion, set: setQueryExpansion },
    { key: 'reranking', label: dict.techniques.reranking, value: reranking, set: setReranking },
  ];

  const activeEffects = toggles.filter(t => t.value);

  return (
    <div className="space-y-6">
      {/* Question picker */}
      <div>
        <p className="font-semibold text-sm mb-2">{dict.questionLabel[lang]}</p>
        <div className="flex flex-wrap gap-2">
          {dict.questions.map((q, i) => (
            <button
              key={i}
              onClick={() => setQuestionIdx(i)}
              className={`text-sm px-3 py-2 rounded-lg border-2 transition-all font-medium ${questionIdx === i ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted'}`}
            >
              {q[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div>
        <p className="font-semibold text-sm mb-3">{dict.toggleLabel[lang]}</p>
        <div className="flex flex-wrap gap-3">
          {toggles.map(tog => (
            <button
              key={tog.key}
              onClick={() => tog.set(!tog.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all shadow-sm
                ${tog.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted'}`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${tog.value ? 'bg-white border-white' : 'border-muted-foreground'}`} />
              {tog.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Active effect descriptions */}
      <AnimatePresence>
        {activeEffects.map(ef => (
          <motion.div
            key={ef.key}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
              <span className="font-bold text-primary">{ef.label[lang]}: </span>
              <span className="text-foreground/80">{dict.effectDesc[ef.key as keyof typeof dict.effectDesc][lang]}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Chunks */}
      <div>
        <p className="font-semibold text-sm mb-3">{dict.chunksTitle[lang]}</p>
        <div className="space-y-2">
          <AnimatePresence>
            {scored.map((chunk, i) => (
              <motion.div
                key={chunk.text.en}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`rounded-xl border-2 p-3 flex items-start gap-3 ${qualityColor[chunk.quality]}`}
              >
                <span className="font-mono font-bold text-sm w-6 flex-shrink-0 mt-0.5 text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">{chunk.text[lang]}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{dict.relevance[lang]}</span>
                    <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${scoreBarColor[chunk.quality]}`}
                        initial={{ width: `${chunk.baseScore * 100}%` }}
                        animate={{ width: `${chunk.score * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold">{(chunk.score * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
