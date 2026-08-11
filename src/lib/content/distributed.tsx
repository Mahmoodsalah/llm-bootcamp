import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import Distributed from '../../components/widgets/Distributed';

export const distributedModule: ModuleDef = {
  id: "7",
  title: { en: "Distributed Training & Inference", ar: "التدريب والتشغيل الموزع" },
  description: {
    en: "Data, tensor, and pipeline parallelism; ZeRO/FSDP; and the communication costs that shape them.",
    ar: "توازي البيانات والمصفوفات والمسار؛ ZeRO/FSDP؛ وتكاليف الاتصال التي تحكمها."
  },
  lessons: [
    {
      id: "parallelism",
      title: { en: "The Four Parallelisms", ar: "أنواع التوازي الأربعة" },
      content: {
        en: <>
          <p>A 70B model needs ~1.1TB during training (16 bytes/param + activations) — that's 14+ H100s minimum, and frontier runs use thousands. The art is <em>how to split</em>, because each split has a different communication bill:</p>
          <ul className="list-disc ps-6 space-y-2">
            <li><strong>Data Parallelism (DP):</strong> every GPU holds a full model copy and processes different batches; gradients are averaged with an <strong>all-reduce</strong> each step. Simple, scales wide — but each GPU must fit the whole model, and gradient sync (2× model size of traffic per step) needs fast interconnect.</li>
            <li><strong>ZeRO / FSDP:</strong> keep data parallelism, but <strong>shard</strong> the optimizer states, gradients, and finally the weights themselves across GPUs, gathering each layer's weights just-in-time for its computation. Memory per GPU drops ~linearly with GPU count. This is the default way to train 7–70B models today.</li>
            <li><strong>Tensor Parallelism (TP):</strong> split <em>individual matrices</em>: each GPU holds a slice of every weight matrix and computes a partial result, combined with all-reduces <em>inside every layer</em>. Communication is constant and heavy → TP stays <em>within a node</em> where NVLink (900GB/s) makes it viable. TP is also the standard way to <em>serve</em> a model too big for one GPU.</li>
            <li><strong>Pipeline Parallelism (PP):</strong> split by <em>layers</em>: GPU 1 holds layers 1–20, GPU 2 holds 21–40… Only activations cross the boundary (small traffic → fine across slower links between nodes). The catch is the <strong>pipeline bubble</strong>: stages idle while waiting for each other; micro-batching shrinks but never removes it.</li>
          </ul>
          <p>Frontier training combines all of them ("3D parallelism"): TP within nodes, PP across nodes, DP across replicas — e.g. Llama 3 405B on 16,000 H100s. And one operational truth: at that scale, <em>hardware fails daily</em>; checkpointing and automatic restart are as important as the math.</p>
        </>,
        ar: <>
          <p>نموذج 70B يحتاج ~1.1 تيرابايت أثناء التدريب (16 بايت/معامل + تفعيلات) — أي 14+ كارت H100 كحد أدنى، والتدريبات الرائدة تستخدم الآلاف. الفن في <em>كيفية التقسيم</em>، لأن لكل تقسيم فاتورة اتصال مختلفة:</p>
          <ul className="list-disc ps-6 space-y-2">
            <li><strong>توازي البيانات (<Eng>DP</Eng>):</strong> كل كارت يحمل نسخة كاملة ويعالج دفعات مختلفة؛ تُجمَع الاشتقاقات بعملية <Eng>all-reduce</Eng> كل خطوة. بسيط ويتوسع عرضيًا — لكن يجب أن يتسع النموذج كاملاً في كل كارت، ومزامنة الاشتقاقات (حركة بحجم ضعف النموذج كل خطوة) تحتاج ربطًا سريعًا.</li>
            <li><strong><Eng>ZeRO / FSDP</Eng>:</strong> نبقي توازي البيانات لكن <strong>نجزّئ</strong> حالات المُحسِّن والاشتقاقات ثم الأوزان نفسها عبر الكروت، ونجمع أوزان كل طبقة لحظيًا وقت حسابها. الذاكرة لكل كارت تنخفض ~خطيًا مع عددها. هذه الطريقة الافتراضية لتدريب نماذج 7–70B اليوم.</li>
            <li><strong>توازي المصفوفات (<Eng>TP</Eng>):</strong> تقسيم <em>المصفوفات نفسها</em>: كل كارت يحمل شريحة من كل مصفوفة ويحسب نتيجة جزئية تُدمج بـ <Eng>all-reduce</Eng> <em>داخل كل طبقة</em>. الاتصال ثابت وثقيل ← يبقى TP <em>داخل الخادم الواحد</em> حيث يجعله <Eng>NVLink</Eng> (‏900 جيجابايت/ثانية) مجديًا. وهو أيضًا الطريقة المعيارية <em>لتشغيل</em> نموذج أكبر من كارت واحد.</li>
            <li><strong>توازي المسار (<Eng>PP</Eng>):</strong> تقسيم <em>بالطبقات</em>: الكارت 1 يحمل الطبقات 1–20، والكارت 2 الطبقات 21–40… فقط التفعيلات تعبر الحدود (حركة صغيرة ← مناسب عبر الروابط الأبطأ بين الخوادم). العيب هو <strong>فقاعة المسار</strong>: المراحل تنتظر بعضها؛ الدفعات الدقيقة تقلصها ولا تزيلها.</li>
          </ul>
          <p>التدريب الرائد يجمعها كلها ("توازي ثلاثي الأبعاد"): TP داخل الخوادم، PP بينها، DP عبر النسخ — مثل Llama 3 405B على 16 ألف H100. وحقيقة تشغيلية: على هذا النطاق <em>يتعطل العتاد يوميًا</em>؛ حفظ نقاط الاستعادة وإعادة التشغيل الآلي بأهمية الرياضيات نفسها.</p>
        </>
      },
      math: {
        en: <p>DP all-reduce traffic per step ≈ 2 × model bytes × (n−1)/n. Pipeline bubble fraction = (p−1)/(m+p−1) for p stages and m micro-batches: p = 8, m = 32 → 18% idle. TP all-reduce happens 2× per layer per token — hence the NVLink requirement.</p>,
        ar: <p>حركة <Eng>all-reduce</Eng> في DP لكل خطوة ≈ 2 × حجم النموذج × (n−1)/n. نسبة فقاعة المسار = (p−1)/(m+p−1) لعدد مراحل p ودفعات دقيقة m: عند p = 8 وm = 32 ← ‏18% خمول. وall-reduce في TP يحدث مرتين لكل طبقة لكل رمز — ومن هنا اشتراط NVLink.</p>
      },
      widget: <Distributed />
    }
  ],
  quiz: [
    {
      question: { en: "Splitting layers across GPUs is called:", ar: "تقسيم الطبقات عبر كروت الشاشة يسمى:" },
      options: { en: ["Pipeline Parallelism", "Tensor Parallelism", "Data Parallelism", "Zero Redundancy"], ar: ["توازي المسار", "توازي المصفوفات", "توازي البيانات", "الصفرية المكررة"] },
      correctIndex: 0
    },
    {
      question: { en: "Why must Tensor Parallelism stay within a node?", ar: "لماذا يجب أن يبقى توازي المصفوفات داخل الخادم الواحد؟" },
      options: {
        en: ["Licensing limits", "It needs all-reduce inside every layer, requiring NVLink bandwidth", "GPUs overheat otherwise", "The OS forbids it"],
        ar: ["قيود ترخيص", "يحتاج all-reduce داخل كل طبقة مما يتطلب عرض نطاق NVLink", "الكروت تسخن", "نظام التشغيل يمنعه"]
      },
      correctIndex: 1
    },
    {
      question: { en: "ZeRO/FSDP reduces per-GPU memory by:", ar: "تقلل ZeRO/FSDP ذاكرة كل كارت عبر:" },
      options: {
        en: ["Quantizing weights", "Sharding optimizer states, gradients, and weights across GPUs", "Shorter contexts", "Removing layers"],
        ar: ["ضغط الأوزان", "تجزئة حالات المُحسِّن والاشتقاقات والأوزان عبر الكروت", "سياقات أقصر", "حذف طبقات"]
      },
      correctIndex: 1
    }
  ]
};
