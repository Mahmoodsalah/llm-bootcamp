import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/store';

const nodes = [
  { id: 'query', label: { en: 'User Query', ar: 'سؤال المستخدم' } },
  { id: 'embed', label: { en: 'Embedding Model', ar: 'نموذج التضمين (Embedding)' } },
  { id: 'vdb', label: { en: 'Vector DB Search', ar: 'بحث في قاعدة المتجهات' } },
  { id: 'prompt', label: { en: 'Prompt Assembly', ar: 'تجميع الـ Prompt' } },
  { id: 'llm', label: { en: 'LLM Generation', ar: 'توليد من النموذج' } }
];

const msgs = [
  { en: '"How do I reset my router?"', ar: '"كيف أعيد تشغيل الراوتر؟"' },
  { en: '[0.12, -0.45, 0.88, ...]', ar: '[0.12, -0.45, 0.88, ...]' },
  { en: 'Found 3 similar docs (Cosine Similarity > 0.8)', ar: 'تم إيجاد 3 مستندات مشابهة (التشابه > 0.8)' },
  { en: 'System: Answer using context.\nContext: [Doc1, Doc2]\nUser: How do I reset...', ar: 'النظام: أجب باستخدام السياق.\nالسياق: [Doc1, Doc2]\nالمستخدم: كيف أعيد تشغيل...' },
  { en: '"To reset your router, hold the back button..."', ar: '"لإعادة تشغيل الراوتر، اضغط مطولاً على الزر الخلفي..."' }
];

const btn = {
  run: { en: "Run Pipeline", ar: "شغل المسار" },
  proc: { en: "Processing...", ar: "جاري المعالجة..." }
};

export default function RAGPipeline() {
  const { lang } = useStore();
  const [activeNode, setActiveNode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveNode(a => {
        if (a === nodes.length - 1) {
          setIsPlaying(false);
          return a;
        }
        return a + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-12">
      <div className="flex justify-center">
        <button 
          onClick={() => { setActiveNode(0); setIsPlaying(true); }}
          disabled={isPlaying}
          className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-md disabled:opacity-50 hover:bg-primary/90"
        >
          {isPlaying ? btn.proc[lang] : btn.run[lang]}
        </button>
      </div>

      <div className="relative flex flex-col md:flex-row justify-between items-center gap-4" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
        {/* Connection line behind */}
        <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-muted -z-10 -translate-y-1/2 rounded-full overflow-hidden" style={{ transform: lang === 'ar' ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)' }}>
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${(activeNode / (nodes.length - 1)) * 100}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>

        {nodes.map((node, i) => {
          const isActive = activeNode === i;
          const isPassed = activeNode > i;

          return (
            <div key={node.id} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  borderColor: isActive || isPassed ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  backgroundColor: isActive ? 'hsl(var(--primary))' : isPassed ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--card))'
                }}
                className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-bold text-lg shadow-sm transition-colors font-mono ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}
                dir="ltr"
              >
                {i + 1}
              </motion.div>
              <div className={`text-xs font-bold w-24 text-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {node.label[lang]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted p-4 rounded-xl border text-center font-mono text-sm min-h-[60px] flex items-center justify-center whitespace-pre-wrap" dir={activeNode === 1 || activeNode === 3 ? 'ltr' : 'auto'}>
        {msgs[activeNode]?.[lang]}
      </div>
    </div>
  );
}
