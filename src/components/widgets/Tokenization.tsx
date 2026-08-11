import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

export default function Tokenization() {
  const { lang } = useStore();
  const [text, setText] = useState('LLMs are powerful, but they read in chunks!');

  const t = {
    type: { en: 'Type something...', ar: 'اكتب شيئاً...' },
    placeholder: { en: 'Try typing here...', ar: 'جرب الكتابة هنا...' },
    chars: { en: 'Characters:', ar: 'الحروف:' },
    tokens: { en: 'Estimated Tokens:', ar: 'الـ tokens المتوقعة:' }
  };

  const tokens = text.match(/([a-zA-Z\u0600-\u06FF]+|[0-9]+|[^a-zA-Z\u0600-\u06FF0-9\s]|\s+)/g) || [];

  const colors = [
    'bg-blue-100 text-blue-900 border-blue-200',
    'bg-emerald-100 text-emerald-900 border-emerald-200',
    'bg-purple-100 text-purple-900 border-purple-200',
    'bg-amber-100 text-amber-900 border-amber-200',
    'bg-rose-100 text-rose-900 border-rose-200',
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground">{t.type[lang]}</label>
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 rounded-xl border-2 bg-background focus:border-primary outline-none text-lg"
          placeholder={t.placeholder[lang]}
          dir="auto"
        />
      </div>

      <div className="p-6 bg-muted/30 rounded-xl border min-h-[120px] flex flex-wrap gap-2 items-start content-start" dir={text.match(/[\u0600-\u06FF]/) ? 'rtl' : 'ltr'}>
        <AnimatePresence>
          {tokens.map((token, i) => (
            <motion.div
              key={i + token}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-2 py-1 rounded-md border shadow-sm font-mono text-lg whitespace-pre ${colors[i % colors.length]}`}
            >
              {token.replace(/ /g, '·')}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between text-sm font-medium text-muted-foreground">
        <span>{t.chars[lang]} {text.length}</span>
        <span>{t.tokens[lang]} {tokens.length}</span>
      </div>
    </div>
  );
}
