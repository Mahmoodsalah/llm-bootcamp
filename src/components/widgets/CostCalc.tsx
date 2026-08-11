import React, { useState } from 'react';
import { useStore } from '../../lib/store';

const t = {
  len: { en: 'System Prompt Length', ar: 'طول الأمر الأساسي (System Prompt)' },
  tok: { en: 'tokens', ar: 'رموز (tokens)' },
  reqs: { en: 'Requests per day', ar: 'الطلبات يومياً' },
  rate: { en: 'Prefix Cache Hit Rate', ar: 'نسبة توفر الـ Prefix Cache' },
  wo: { en: 'Without Caching (Daily)', ar: 'بدون تخزين (يومياً)' },
  with: { en: 'With Prefix Caching', ar: 'مع الـ Prefix Caching' },
  savings: { en: 'Savings:', ar: 'التوفير:' }
};

export default function CostCalc() {
  const { lang } = useStore();
  const [tokens, setTokens] = useState(5000); // system prompt length
  const [requests, setRequests] = useState(10000);
  const [cacheHitRate, setCacheHitRate] = useState(80);

  const basePricePer1M = 0.50; // $0.50 per 1M input tokens
  
  const totalTokens = (tokens * requests) / 1000000;
  const standardCost = totalTokens * basePricePer1M;
  
  // Cached tokens are usually 50% cheaper or even free depending on provider. Let's say 50% cheaper.
  const cachedTokens = totalTokens * (cacheHitRate / 100);
  const uncachedTokens = totalTokens - cachedTokens;
  const cachedCost = (uncachedTokens * basePricePer1M) + (cachedTokens * basePricePer1M * 0.5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="flex justify-between text-sm font-bold mb-2">
              <span>{t.len[lang]}</span>
              <span className="font-mono" dir="ltr">{tokens.toLocaleString()} {t.tok[lang]}</span>
            </label>
            <input type="range" min="100" max="32000" step="100" value={tokens} onChange={e => setTokens(Number(e.target.value))} className="w-full" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }} />
          </div>
          <div>
            <label className="flex justify-between text-sm font-bold mb-2">
              <span>{t.reqs[lang]}</span>
              <span className="font-mono" dir="ltr">{requests.toLocaleString()}</span>
            </label>
            <input type="range" min="1000" max="100000" step="1000" value={requests} onChange={e => setRequests(Number(e.target.value))} className="w-full" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }} />
          </div>
          <div>
            <label className="flex justify-between text-sm font-bold mb-2">
              <span>{t.rate[lang]}</span>
              <span className="text-emerald-600 font-mono" dir="ltr">{cacheHitRate}%</span>
            </label>
            <input type="range" min="0" max="100" step="5" value={cacheHitRate} onChange={e => setCacheHitRate(Number(e.target.value))} className="w-full accent-emerald-500" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }} />
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 flex flex-col justify-center space-y-4 shadow-sm">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">{t.wo[lang]}</div>
            <div className="text-2xl font-bold line-through text-muted-foreground font-mono" dir="ltr">${standardCost.toFixed(2)}</div>
          </div>
          <div className="w-full h-px bg-border" />
          <div className="space-y-1">
            <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider">{t.with[lang]}</div>
            <div className="text-5xl font-extrabold text-foreground font-mono" dir="ltr">${cachedCost.toFixed(2)}</div>
          </div>
          <div className="text-sm font-medium text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full w-max">
            {t.savings[lang]} <span className="font-mono" dir="ltr">{((1 - cachedCost/standardCost) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
