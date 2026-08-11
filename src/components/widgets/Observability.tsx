import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../../lib/store';

const t = {
  live: { en: 'Live Metrics', ar: 'مقاييس مباشرة' },
  avgTtft: { en: 'Avg TTFT', ar: 'متوسط TTFT' },
  descTtft: { en: 'Time To First Token', ar: 'الوقت لأول رمز' },
  avgTpot: { en: 'Avg TPOT', ar: 'متوسط TPOT' },
  descTpot: { en: 'Time Per Output Token', ar: 'الوقت لكل رمز مُولد' },
  req: { en: 'Req', ar: 'طلب' },
  ms: { en: 'ms', ar: 'ملي ثانية' }
};

export default function Observability() {
  const { lang } = useStore();
  const [data, setData] = useState<{name: string, ttft: number, tpot: number}[]>([]);

  useEffect(() => {
    // Generate initial mock data
    const initial = Array.from({length: 10}).map((_, i) => ({
      name: `${t.req[lang]} ${i}`,
      ttft: 100 + Math.random() * 400,
      tpot: 15 + Math.random() * 20
    }));
    setData(initial);

    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1), {
          name: `${t.req[lang]} ${Math.floor(Math.random()*1000)}`,
          ttft: 100 + Math.random() * 400,
          tpot: 15 + Math.random() * 20
        }];
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [lang]);

  const avgTTFT = data.length ? data.reduce((a,b)=>a+b.ttft,0)/data.length : 0;
  const avgTPOT = data.length ? data.reduce((a,b)=>a+b.tpot,0)/data.length : 0;

  return (
    <div className="space-y-6 p-4 bg-gray-900 rounded-2xl text-gray-100" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="font-bold font-mono flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {t.live[lang]}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-xs font-bold uppercase mb-1">{t.avgTtft[lang]}</div>
          <div className="text-3xl font-mono text-emerald-400" dir="ltr">{avgTTFT.toFixed(0)}<span className="text-sm text-gray-500 ml-1">ms</span></div>
          <div className="text-xs text-gray-500 mt-2">{t.descTtft[lang]}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-xs font-bold uppercase mb-1">{t.avgTpot[lang]}</div>
          <div className="text-3xl font-mono text-blue-400" dir="ltr">{avgTPOT.toFixed(1)}<span className="text-sm text-gray-500 ml-1">ms</span></div>
          <div className="text-xs text-gray-500 mt-2">{t.descTpot[lang]}</div>
        </div>
      </div>

      <div className="h-48 pt-4">
        <ResponsiveContainer width="100%" height="100%" style={{ direction: 'ltr' }}>
          <BarChart data={data}>
            <XAxis dataKey="name" hide />
            <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6'}} formatter={(value: number) => [`${value.toFixed(0)} ${t.ms[lang]}`]} />
            <Bar dataKey="ttft" stackId="a" fill="#10b981" name="TTFT" isAnimationActive={false} />
            <Bar dataKey="tpot" stackId="a" fill="#3b82f6" name="TPOT" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
