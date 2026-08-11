import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/store';

const tokensEn = ["The", "robot", "didn't", "cross", "the", "road", "because", "it", "was", "too", "tired", "."];
const tokensAr = ["الـ", "robot", "لم", "يعبر", "الـ", "road", "لأنه", "it", "كان", "جداً", "tired", "."];

// Hardcoded attention weights mapped by index (works roughly for both, as they align 1:1)
const attentionMatrix: Record<number, number[]> = {
  0: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  1: [0.2, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [0.1, 0.4, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [0.1, 0.3, 0.3, 0.3, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [0, 0, 0, 0.1, 0.9, 0, 0, 0, 0, 0, 0, 0],
  5: [0, 0.1, 0.1, 0.4, 0.2, 0.2, 0, 0, 0, 0, 0, 0],
  6: [0, 0, 0.3, 0.4, 0, 0, 0.3, 0, 0, 0, 0, 0],
  7: [0, 0.7, 0.1, 0, 0, 0.1, 0.1, 0, 0, 0, 0, 0], // "it" attends to "robot"
  8: [0, 0.1, 0.1, 0, 0, 0, 0.2, 0.3, 0.3, 0, 0, 0],
  9: [0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.8, 0, 0],
  10: [0, 0.3, 0, 0, 0, 0, 0, 0.1, 0.2, 0.1, 0.3, 0], // "tired" attends to "robot"
  11: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
};

const t = {
  hint: {
    en: 'Hover over any word to see what it "pays attention" to from the past context. Notice how "it" focuses on "robot".',
    ar: 'مرر الماوس فوق أي كلمة لترى ما "تنتبه" إليه من السياق السابق. لاحظ كيف تركز "it" على "robot".'
  }
};

export default function AttentionHeatmap() {
  const { lang } = useStore();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const tokens = lang === 'en' ? tokensEn : tokensAr;

  return (
    <div className="space-y-6">
      <p className="text-sm font-medium text-muted-foreground text-center">
        {t.hint[lang]}
      </p>
      
      <div className="flex flex-wrap justify-center gap-2 p-8 bg-muted/30 rounded-2xl border" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {tokens.map((token, i) => {
          let weight = 0;
          if (hoveredIdx !== null) {
            // A token only attends to past tokens (i <= hoveredIdx)
            if (i <= hoveredIdx) {
              weight = attentionMatrix[hoveredIdx]?.[i] || 0;
            }
          }

          return (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="px-3 py-2 rounded-xl text-lg font-bold cursor-default border transition-all duration-200"
              style={{
                backgroundColor: hoveredIdx !== null && i <= hoveredIdx 
                  ? `rgba(var(--primary), ${weight * 0.8})` 
                  : 'transparent',
                borderColor: hoveredIdx === i ? 'hsl(var(--primary))' : 'var(--border)',
                color: hoveredIdx !== null && weight > 0.4 ? 'hsl(var(--primary-foreground))' : 'inherit'
              }}
              dir={token === 'robot' || token === 'road' || token === 'it' || token === 'tired' ? 'ltr' : 'auto'}
            >
              {token}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
