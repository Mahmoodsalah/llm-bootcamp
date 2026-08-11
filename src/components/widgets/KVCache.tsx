import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/store';

const t = {
  on: { en: 'ON', ar: 'شغال' },
  off: { en: 'OFF', ar: 'مغلق' },
  descOn: { en: "Green tokens are loaded instantly from memory. Only the newest token is computed.", ar: "الرموز الخضراء تُحمل فوراً من الذاكرة. الرمز الأخير فقط يتم حسابه." },
  descOff: { en: "Red tokens must be re-calculated through the entire neural network every single step!", ar: "الرموز الحمراء يُعاد حسابها عبر الشبكة العصبية بالكامل في كل خطوة!" }
};

export default function KVCache() {
  const { lang } = useStore();
  const [cacheOn, setCacheOn] = useState(true);
  const [tokens, setTokens] = useState<number[]>([0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prev => {
        if (prev.length >= 8) return [0];
        return [...prev, prev.length];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <label className="flex items-center gap-3 cursor-pointer bg-muted p-2 rounded-xl border">
          <span className="font-bold px-2" dir="ltr">KV Cache</span>
          <button 
            onClick={() => setCacheOn(!cacheOn)}
            className={`w-14 h-8 rounded-full transition-colors relative ${cacheOn ? 'bg-primary' : 'bg-destructive'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${cacheOn ? (lang === 'ar' ? 'right-7' : 'left-7') : (lang === 'ar' ? 'right-1' : 'left-1')}`} />
          </button>
          <span className="font-bold px-2 text-sm">{cacheOn ? t.on[lang] : t.off[lang]}</span>
        </label>
      </div>

      <div className="flex gap-2 justify-center h-24 items-center bg-background border rounded-2xl shadow-inner overflow-hidden px-4" style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
        {tokens.map((tNum, i) => {
          const isLatest = i === tokens.length - 1;
          const isRecomputed = !cacheOn && !isLatest;
          const isCached = cacheOn && !isLatest;

          return (
            <motion.div
              key={`${tNum}-${cacheOn ? 'on' : 'off'}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-lg font-mono
                ${isLatest ? 'bg-primary text-primary-foreground border-primary-foreground/20 shadow-[0_0_15px_rgba(var(--primary),0.5)]' : ''}
                ${isRecomputed ? 'bg-destructive/20 border-destructive text-destructive animate-pulse' : ''}
                ${isCached ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : ''}
              `}
              dir="ltr"
            >
              T{tNum+1}
            </motion.div>
          );
        })}
      </div>
      
      <p className="text-center font-medium text-muted-foreground min-h-[3rem]">
        {cacheOn ? t.descOn[lang] : t.descOff[lang]}
      </p>
    </div>
  );
}
