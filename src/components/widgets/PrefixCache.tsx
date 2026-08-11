import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';

const t = {
  add: { en: '+ Simulate New Request', ar: '+ محاكاة طلب جديد' },
  saved: { en: 'Tokens Saved', ar: 'الـ tokens الموفرة' },
  sys: { en: 'System Prompt (2,000 tokens)', ar: 'الأمر الأساسي (2,000 tokens)' },
  hit: { en: 'Cached Hit', ar: 'موجود بالذاكرة (Hit)' },
  desc: { en: "If the beginning of the prompt matches exactly, the server reuses the KV cache. This makes long system prompts nearly free for concurrent users.", ar: "إذا تطابقت بداية الطلبات تماماً، يعيد الخادم استخدام الـ KV cache. هذا يجعل الأوامر الطويلة شبه مجانية للمستخدمين في نفس الوقت." },
  query: { en: "User Query", ar: "سؤال المستخدم" }
};

export default function PrefixCache() {
  const { lang } = useStore();
  const [requests, setRequests] = useState([
    { id: 1, char: "A" }
  ]);
  const [tokensSaved, setTokensSaved] = useState(0);

  const addRequest = () => {
    setRequests(r => [...r, { id: Math.random(), char: String.fromCharCode(65 + r.length) }]);
    setTokensSaved(s => s + 2000); // simulating 2k tokens of system prompt
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card border rounded-2xl p-4 shadow-sm">
        <button onClick={addRequest} className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg">
          {t.add[lang]}
        </button>
        <div className={`text-${lang === 'ar' ? 'left' : 'right'}`}>
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{t.saved[lang]}</div>
          <div className="text-2xl font-mono text-emerald-600 font-bold" dir="ltr">+{tokensSaved.toLocaleString()}</div>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {requests.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-stretch h-14 rounded-xl overflow-hidden border shadow-sm"
              style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
            >
              <div className={`flex items-center px-4 font-mono text-sm w-[70%] sm:w-3/4 ${lang === 'ar' ? 'border-l' : 'border-r'} ${i === 0 ? 'bg-blue-100 text-blue-900 border-blue-200' : 'bg-emerald-100 text-emerald-900 border-emerald-200'}`}>
                <span dir="ltr">{t.sys[lang]}</span>
                {i > 0 && <span className={`font-bold bg-emerald-200 px-2 py-1 rounded text-xs uppercase ${lang === 'ar' ? 'mr-auto' : 'ml-auto'}`}>{t.hit[lang]}</span>}
              </div>
              <div className="flex items-center justify-center flex-1 bg-background text-foreground font-mono text-sm font-bold">
                <span dir="ltr">{t.query[lang]} {r.char}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-center text-sm font-medium text-muted-foreground">
        {t.desc[lang]}
      </p>
    </div>
  );
}
