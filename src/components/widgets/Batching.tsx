import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../../lib/store';

const t = {
  max: { en: 'Max Batch Size', ar: 'أقصى حجم تجميع (Batch Size)' },
  reqs: { en: 'reqs', ar: 'طلبات' },
  desc: { en: 'Larger batch sizes increase total throughput (tokens/sec) but might delay the first token for some users.', ar: 'زيادة التجميع ترفع الإنتاجية الكلية (tokens بالثانية) لكن قد تؤخر أول رمز لبعض المستخدمين.' },
  throughput: { en: 'throughput', ar: 'الإنتاجية' }
};

export default function Batching() {
  const { lang } = useStore();
  const [batchSize, setBatchSize] = useState(4);
  const [data, setData] = useState<{time: number, throughput: number}[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setData(prev => {
        const newData = [...prev, { time: tick, throughput: batchSize * (10 + Math.random() * 5) }];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [tick, batchSize]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <label className="flex justify-between text-sm font-bold mb-2">
            <span>{t.max[lang]}</span>
            <span className="text-primary font-mono" dir="ltr">{batchSize} {t.reqs[lang]}</span>
          </label>
          <input 
            type="range" min="1" max="16" step="1" 
            value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))}
            className="w-full accent-primary"
            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
          />
        </div>
      </div>

      <div className="h-64 bg-background border rounded-xl p-4 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis orientation={lang === 'ar' ? 'right' : 'left'} />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(0)}`, t.throughput[lang]]}
            />
            <Line type="monotone" dataKey="throughput" stroke="hsl(var(--primary))" strokeWidth={3} isAnimationActive={false} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-sm font-medium text-muted-foreground">
        {t.desc[lang]}
      </p>
    </div>
  );
}
