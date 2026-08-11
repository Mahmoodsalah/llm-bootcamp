import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/store';

const t = {
  reqs: { en: 'Incoming Requests', ar: 'الطلبات الواردة' },
  reqsSec: { en: 'req/s', ar: 'طلب/ث' },
  status: { en: 'Status:', ar: 'الحالة:' },
  stable: { en: 'Stable', ar: 'مستقر' },
  cold: { en: 'Cold Starting...', ar: 'تشغيل بارد...' },
  replicas: { en: 'Replicas:', ar: 'النسخ (Replicas):' },
  gpu: { en: 'GPU', ar: 'GPU' }
};

export default function Autoscaling() {
  const { lang } = useStore();
  const [traffic, setTraffic] = useState(10);
  const [replicas, setReplicas] = useState(1);
  const [status, setStatus] = useState('Stable');

  useEffect(() => {
    const desired = Math.ceil(traffic / 30);
    if (desired > replicas) {
      setStatus('Cold Starting...');
      const tTimer = setTimeout(() => {
        setReplicas(desired);
        setStatus('Stable');
      }, 1500); // simulate cold start delay
      return () => clearTimeout(tTimer);
    } else if (desired < replicas && status !== 'Cold Starting...') {
      setReplicas(desired || 1);
    }
    return undefined;
  }, [traffic, replicas, status]);

  return (
    <div className="space-y-8">
      <div>
        <label className="flex justify-between text-sm font-bold mb-2">
          <span>{t.reqs[lang]}</span>
          <span className="text-primary font-mono" dir="ltr">{traffic} {t.reqsSec[lang]}</span>
        </label>
        <input 
          type="range" min="0" max="150" step="1" 
          value={traffic} onChange={(e) => setTraffic(Number(e.target.value))}
          className="w-full accent-primary"
          style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
        />
      </div>

      <div className="flex justify-between items-center px-4 py-3 bg-muted rounded-xl">
        <span className="font-bold">{t.status[lang]} <span className={status === 'Stable' ? 'text-emerald-600' : 'text-amber-500 animate-pulse'}>{status === 'Stable' ? t.stable[lang] : t.cold[lang]}</span></span>
        <span className="font-bold text-lg">{t.replicas[lang]} <span className="font-mono ml-1">{replicas}</span></span>
      </div>

      <div className="grid grid-cols-5 gap-2 h-32" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ 
              opacity: i < replicas ? 1 : 0.2,
              scale: i < replicas ? 1 : 0.9,
              backgroundColor: i < replicas ? (status === 'Cold Starting...' && i === replicas - 1 ? 'hsl(var(--amber-500))' : 'hsl(var(--primary))') : 'hsl(var(--muted))'
            }}
            className="rounded-xl flex items-center justify-center shadow-sm"
          >
            <div className="text-white font-bold opacity-50" dir="ltr">{t.gpu[lang]} {i+1}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
