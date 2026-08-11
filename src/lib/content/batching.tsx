import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import Batching from '../../components/widgets/Batching';

export const batchingModule: ModuleDef = {
  id: "4",
  title: { en: "Batching & Throughput", ar: "تجميع الطلبات والإنتاجية" },
  description: {
    en: "Prefill vs decode, continuous batching, and the latency-throughput tradeoff.",
    ar: "الـ prefill مقابل الـ decode، والتجميع المستمر، ومقايضة التأخير بالإنتاجية."
  },
  lessons: [
    {
      id: "prefill_decode",
      title: { en: "Prefill vs Decode: Two Different Workloads", ar: "Prefill مقابل Decode: عبئان مختلفان" },
      content: {
        en: <>
          <p>Every LLM request has two phases with opposite performance profiles:</p>
          <ul className="list-disc ps-6 space-y-2">
            <li><strong>Prefill:</strong> process the whole prompt at once. All prompt tokens flow through the model <em>in parallel</em> — thousands of tokens per matrix multiply. This saturates the compute units: <strong>compute-bound</strong>. It determines <strong>TTFT</strong> (time to first token).</li>
            <li><strong>Decode:</strong> generate the answer one token at a time. Each step multiplies giant weight matrices by a <em>single</em> vector — the GPU spends its time streaming weights from memory while cores idle: <strong>memory-bound</strong>. It determines <strong>TPOT</strong> (time per output token).</li>
          </ul>
          <p>Since decode at batch size 1 wastes ~99% of compute, the fix is obvious: <strong>batch many users</strong>. The weights are read from VRAM <em>once</em> per step and reused for 64 users' vectors. Throughput scales almost linearly with batch size until you become compute-bound again (or run out of KV-cache memory) — each user's individual speed barely degrades at first, then latency creeps up. Choosing the max batch size <em>is</em> the latency/cost dial of your service.</p>
          <p>Because prefill (compute-hungry) and decode (bandwidth-hungry) compete for the GPU, big deployments use <strong>chunked prefill</strong> (split long prompts into pieces interleaved with decode steps to protect TPOT) or even <strong>disaggregated serving</strong> — separate GPU pools for prefill and decode, shipping the KV cache between them.</p>
        </>,
        ar: <>
          <p>كل طلب للنموذج له مرحلتان بملامح أداء متعاكسة:</p>
          <ul className="list-disc ps-6 space-y-2">
            <li><strong><Eng>Prefill</Eng>:</strong> معالجة كامل الأمر دفعة واحدة. كل رموز الأمر تمر عبر النموذج <em>بالتوازي</em> — آلاف الرموز في كل ضرب مصفوفات. هذا يشبع وحدات الحساب: <strong>مقيّد بالحساب</strong>. وهو يحدد <Eng>TTFT</Eng> (زمن أول رمز).</li>
            <li><strong><Eng>Decode</Eng>:</strong> توليد الإجابة رمزًا رمزًا. كل خطوة تضرب مصفوفات أوزان ضخمة في متجه <em>واحد</em> — يقضي الكارت وقته في جلب الأوزان من الذاكرة بينما الأنوية عاطلة: <strong>مقيّد بالذاكرة</strong>. وهو يحدد <Eng>TPOT</Eng> (زمن كل رمز خرج).</li>
          </ul>
          <p>بما أن الـ <Eng>decode</Eng> بدفعة 1 يهدر ~99% من الحساب، فالحل بديهي: <strong>جمّع مستخدمين كثيرين</strong>. تُقرأ الأوزان من الذاكرة <em>مرة واحدة</em> في كل خطوة وتُعاد لاستخدامها مع متجهات 64 مستخدمًا. الإنتاجية تنمو خطيًا تقريبًا مع حجم الدفعة حتى تصبح مقيّدًا بالحساب مجددًا (أو تنفد ذاكرة KV) — سرعة كل مستخدم بالكاد تتأثر أولاً ثم يزحف التأخير. اختيار أقصى حجم دفعة <em>هو</em> مقبض التأخير/التكلفة لخدمتك.</p>
          <p>ولأن الـ <Eng>prefill</Eng> (نهم للحساب) والـ <Eng>decode</Eng> (نهم لعرض النطاق) يتنافسان على الكارت، تستخدم النشرات الكبيرة <strong><Eng>chunked prefill</Eng></strong> (تقسيم الأوامر الطويلة لقطع تتداخل مع خطوات التوليد لحماية <Eng>TPOT</Eng>) أو حتى <strong>فصل الخدمة (<Eng>disaggregated serving</Eng>)</strong> — مجموعتا كروت منفصلتان للمرحلتين مع شحن الـ KV cache بينهما.</p>
        </>
      },
      math: {
        en: <p>Decode arithmetic intensity ≈ 2·batch FLOPs per weight byte. GPU balance point = TFLOPS / bandwidth ≈ 1000/3.35 ≈ 300 for H100 — so decode stays memory-bound until batch ≈ 150–300. That's why throughput is nearly "free" up to large batches.</p>,
        ar: <p>الكثافة الحسابية للـ <Eng>decode</Eng> ≈ 2×الدفعة عملية لكل بايت أوزان. نقطة توازن الكارت = TFLOPS / عرض النطاق ≈ 1000/3.35 ≈ 300 لكارت H100 — لذلك يبقى الـ <Eng>decode</Eng> مقيّدًا بالذاكرة حتى دفعة ≈ 150–300. لهذا الإنتاجية شبه "مجانية" حتى دفعات كبيرة.</p>
      }
    },
    {
      id: "batch",
      title: { en: "Continuous Batching", ar: "التجميع المستمر" },
      content: {
        en: <>
          <p>Naive <strong>static batching</strong> collects N requests, runs them together, and waits for <em>all</em> to finish. One user asking for a 2000-token essay holds hostage 63 users who needed 20-token answers — GPU slots sit idle padded with nothing.</p>
          <p><strong>Continuous batching</strong> (a.k.a. in-flight batching, introduced by Orca and adopted by vLLM/TGI/TensorRT-LLM) schedules at <em>iteration granularity</em>: after every single decode step, finished sequences leave the batch immediately and queued requests join it (their prefill is interleaved). The batch composition changes every ~20ms.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>Throughput gains of 5–20× over static batching in real traffic with mixed output lengths.</li>
            <li>It requires paged KV memory (next modules) — sequences now start and end at arbitrary times, so their cache must be allocatable and freeable at any moment.</li>
            <li>The scheduler becomes real engineering: admission control (don't admit a request whose KV won't fit), fairness vs shortest-job-first, and <strong>preemption</strong> — under memory pressure, evict a sequence and recompute or swap its KV later.</li>
          </ul>
        </>,
        ar: <>
          <p>التجميع الساذج (<Eng>static batching</Eng>) يجمع N طلبًا، يشغلها معًا، وينتظر انتهاء <em>الجميع</em>. مستخدم واحد يطلب مقالاً من 2000 رمز يحتجز 63 مستخدمًا احتاجوا إجابات من 20 رمزًا — خانات الكارت تجلس عاطلة.</p>
          <p><strong>التجميع المستمر (<Eng>Continuous batching</Eng>)</strong> (قدمته ورقة Orca وتبنته vLLM/TGI/TensorRT-LLM) يجدول على <em>مستوى الخطوة الواحدة</em>: بعد كل خطوة توليد، تغادر التسلسلات المنتهية الدفعة فورًا وتنضم الطلبات المنتظرة (ويُداخَل الـ <Eng>prefill</Eng> الخاص بها). تركيبة الدفعة تتغير كل ~20 مللي ثانية.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>مكاسب إنتاجية 5–20× مقارنة بالتجميع الثابت في حركة حقيقية بأطوال خرج مختلطة.</li>
            <li>يتطلب ذاكرة KV مجزأة (الوحدات التالية) — التسلسلات تبدأ وتنتهي في أوقات عشوائية، فيجب أن تكون ذاكرتها قابلة للحجز والتحرير في أي لحظة.</li>
            <li>المجدوِل يصبح هندسة حقيقية: تحكم في القبول (لا تقبل طلبًا لن تتسع ذاكرته)، عدالة مقابل أقصر-مهمة-أولاً، و<strong>الإجلاء (<Eng>preemption</Eng>)</strong> — تحت ضغط الذاكرة، أخرج تسلسلاً وأعد حساب ذاكرته أو بدّلها لاحقًا.</li>
          </ul>
        </>
      },
      widget: <Batching />
    }
  ],
  quiz: [
    {
      question: { en: "What does batching increase?", ar: "ماذا يحسّن تجميع الطلبات؟" },
      options: { en: ["Total throughput", "Latency per user", "Model IQ", "Parameter count"], ar: ["الإنتاجية الكلية", "زمن الاستجابة للمستخدم", "ذكاء النموذج", "عدد المعاملات"] },
      correctIndex: 0
    },
    {
      question: { en: "The prefill phase is:", ar: "مرحلة الـ prefill هي:" },
      options: {
        en: ["Memory-bound", "Compute-bound", "Network-bound", "Disk-bound"],
        ar: ["مقيّدة بالذاكرة", "مقيّدة بالحساب", "مقيّدة بالشبكة", "مقيّدة بالقرص"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Continuous batching improves on static batching by:", ar: "يتفوق التجميع المستمر على الثابت عبر:" },
      options: {
        en: ["Using bigger GPUs", "Swapping sequences in/out after every decode step", "Compressing prompts", "Caching answers"],
        ar: ["كروت أكبر", "إدخال وإخراج التسلسلات بعد كل خطوة توليد", "ضغط الأوامر", "تخزين الإجابات"]
      },
      correctIndex: 1
    }
  ]
};
