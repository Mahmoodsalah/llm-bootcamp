import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import PagedAttention from '../../components/widgets/PagedAttention';

export const enginesModule: ModuleDef = {
  id: "6",
  title: { en: "Inference Engines", ar: "محركات التشغيل" },
  description: {
    en: "PagedAttention, CUDA graphs, kernel fusion — what vLLM and TensorRT-LLM actually do.",
    ar: "PagedAttention ودمج الأنوية — ما تفعله vLLM وTensorRT-LLM فعليًا."
  },
  lessons: [
    {
      id: "paged",
      title: { en: "PagedAttention: Virtual Memory for KV", ar: "PagedAttention: ذاكرة افتراضية للـ KV" },
      content: {
        en: <>
          <p>Before vLLM (2023), servers reserved KV-cache memory as one <strong>contiguous block per request</strong>, sized for the <em>maximum possible</em> output. A user who might generate 2048 tokens but stops at 50 wastes 97% of the reservation. Measurements showed real-world KV memory utilization of only <strong>20–40%</strong>.</p>
          <p><strong>PagedAttention</strong> copies the operating-system playbook — virtual memory and paging:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>KV memory is divided into fixed-size <strong>blocks</strong> (e.g. 16 tokens each).</li>
            <li>A sequence's cache is a <strong>block table</strong> — a list of pointers to physically scattered blocks, allocated on demand as generation proceeds.</li>
            <li>No reservation, no contiguity requirement → fragmentation drops to &lt;4% waste, so 2–4× more concurrent sequences fit → 2–4× throughput from the same GPU.</li>
            <li>Bonus: <strong>copy-on-write sharing</strong>. Parallel sampling (n answers to one prompt) and beam search share the prompt's blocks; a block is copied only when branches diverge. Prefix caching (Module 11) also falls out of this design naturally.</li>
          </ul>
          <p>This is a beautiful case study for infrastructure engineers: a 40-year-old OS idea, transplanted, tripled the industry's serving efficiency overnight.</p>
        </>,
        ar: <>
          <p>قبل vLLM (‏2023) كانت الخوادم تحجز ذاكرة KV ككتلة <strong>متصلة واحدة لكل طلب</strong> بحجم الخرج <em>الأقصى الممكن</em>. مستخدم قد يولّد 2048 رمزًا لكنه يتوقف عند 50 يهدر 97% من الحجز. القياسات أظهرت استغلالاً حقيقيًا لذاكرة KV بنسبة <strong>20–40%</strong> فقط.</p>
          <p><strong><Eng>PagedAttention</Eng></strong> تنسخ دفتر نظام التشغيل — الذاكرة الافتراضية والصفحات:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>تُقسم ذاكرة KV إلى <strong>كتل</strong> ثابتة الحجم (مثلاً 16 رمزًا).</li>
            <li>ذاكرة كل تسلسل هي <strong>جدول كتل</strong> — قائمة مؤشرات لكتل متناثرة فيزيائيًا، تُحجز عند الحاجة مع تقدم التوليد.</li>
            <li>لا حجز مسبق ولا شرط اتصال ← تنخفض التجزئة إلى أقل من 4% هدر، فيتسع 2–4 أضعاف التسلسلات المتزامنة ← 2–4 أضعاف الإنتاجية من نفس الكارت.</li>
            <li>ميزة إضافية: <strong>مشاركة بنسخ-عند-الكتابة</strong>. أخذ عينات متوازية (n إجابات لأمر واحد) والبحث الشعاعي يتشاركان كتل الأمر؛ ولا تُنسخ كتلة إلا عند تفرع الفروع. وتخزين البادئة (وحدة لاحقة) ينبثق من هذا التصميم طبيعيًا.</li>
          </ul>
          <p>دراسة حالة جميلة لمهندسي البنية التحتية: فكرة من أنظمة التشغيل عمرها 40 عامًا، زُرعت هنا، فضاعفت كفاءة الصناعة ثلاث مرات بين ليلة وضحاها.</p>
        </>
      },
      math: {
        en: <p>Waste per sequence (old): (max_len − actual_len) × KV bytes/token. Paged waste: &lt; block_size × KV bytes/token (only the last partial block). With 16-token blocks and 131KB/token, worst-case waste ≈ 2MB vs potentially GBs before.</p>,
        ar: <p>الهدر لكل تسلسل (قديمًا): (الطول الأقصى − الفعلي) × بايت KV/رمز. الهدر المجزأ: أقل من حجم الكتلة × بايت KV/رمز (فقط الكتلة الأخيرة الناقصة). بكتل 16 رمزًا و131 كيلوبايت/رمز، أسوأ هدر ≈ 2 ميجابايت مقابل جيجابايتات محتملة سابقًا.</p>
      },
      widget: <PagedAttention />
    },
    {
      id: "engine_stack",
      title: { en: "What Else an Engine Does", ar: "ماذا يفعل المحرك أيضًا" },
      content: {
        en: <>
          <p>PagedAttention is the headline, but a production engine (vLLM, TensorRT-LLM, SGLang, llama.cpp) is a stack of optimizations:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Kernel fusion:</strong> instead of separate GPU launches for norm → matmul → activation (each writing intermediates to slow memory), fuse them into one kernel that keeps data in registers. FlashAttention is the most famous fused kernel.</li>
            <li><strong>CUDA graphs:</strong> decode steps are tiny; CPU launch overhead can dominate. Record the whole step's kernel sequence once, then replay it as a single graph — removing per-kernel CPU overhead.</li>
            <li><strong>Optimized sampling:</strong> top-k/top-p over 128k logits on GPU, plus <strong>guided decoding</strong> (grammar/JSON-schema constraints that mask invalid tokens each step — this is how "JSON mode" works).</li>
            <li><strong>Scheduling policies:</strong> continuous batching, chunked prefill, priority queues, and preemption (Module 5).</li>
          </ul>
          <p>Choosing an engine in practice: <strong>vLLM</strong> — the default for flexibility and model coverage; <strong>TensorRT-LLM</strong> — peak NVIDIA performance if you can afford per-model compilation; <strong>SGLang</strong> — excels at structured output and heavy prefix reuse (agents); <strong>llama.cpp/Ollama</strong> — CPU/consumer hardware and local development. All expose an OpenAI-compatible API, so switching later is cheap — benchmark on <em>your</em> traffic shape (prompt/output length distribution) rather than trusting headline numbers.</p>
        </>,
        ar: <>
          <p><Eng>PagedAttention</Eng> هي العنوان، لكن المحرك الإنتاجي (vLLM، TensorRT-LLM، SGLang، llama.cpp) رزمة تحسينات كاملة:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>دمج الأنوية (<Eng>Kernel fusion</Eng>):</strong> بدل إطلاقات GPU منفصلة للتطبيع ← الضرب ← التفعيل (كل واحدة تكتب وسيطًا للذاكرة البطيئة)، تُدمج في نواة واحدة تبقي البيانات في السجلات. <Eng>FlashAttention</Eng> أشهر نواة مدموجة.</li>
            <li><strong><Eng>CUDA graphs</Eng>:</strong> خطوات التوليد صغيرة جدًا؛ وقد يهيمن عبء الإطلاق من المعالج المركزي. نسجل تسلسل أنوية الخطوة كاملة مرة، ثم نعيد تشغيله كرسم واحد — فيختفي العبء لكل نواة.</li>
            <li><strong>أخذ عينات محسَّن:</strong> ‏top-k/top-p على 128 ألف <Eng>logit</Eng> داخل الكارت، + <strong>التوليد الموجَّه</strong> (قيود قواعد/JSON schema تحجب الرموز غير الصالحة كل خطوة — هكذا يعمل "وضع JSON").</li>
            <li><strong>سياسات الجدولة:</strong> تجميع مستمر، prefill مجزأ، طوابير أولوية، وإجلاء.</li>
          </ul>
          <p>اختيار المحرك عمليًا: <strong>vLLM</strong> — الافتراضي للمرونة وتغطية النماذج؛ <strong>TensorRT-LLM</strong> — ذروة أداء NVIDIA إن تحملت ترجمة لكل نموذج؛ <strong>SGLang</strong> — يتفوق في الخرج المهيكل وإعادة استخدام البادئات الكثيفة (الوكلاء)؛ <strong>llama.cpp/Ollama</strong> — المعالجات المركزية والعتاد الاستهلاكي والتطوير المحلي. كلها تقدم واجهة متوافقة مع OpenAI، فالتبديل لاحقًا رخيص — قِس على شكل حركتك <em>أنت</em> (توزيع أطوال الأوامر والمخرجات) بدل الوثوق بالأرقام الدعائية.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "PagedAttention solves:", ar: "ماذا تحل تقنية PagedAttention؟" },
      options: { en: ["Slow disks", "KV memory fragmentation and over-reservation", "Network latency", "Bad outputs"], ar: ["البطء في القرص", "تجزئة ذاكرة KV والحجز الزائد", "تأخير الشبكة", "المخرجات السيئة"] },
      correctIndex: 1
    },
    {
      question: { en: "Kernel fusion speeds things up by:", ar: "دمج الأنوية يسرّع عبر:" },
      options: {
        en: ["Using more VRAM", "Avoiding round-trips of intermediate data to slow memory", "Skipping layers", "Lowering precision"],
        ar: ["استخدام ذاكرة أكبر", "تجنب ذهاب النتائج الوسيطة وإيابها للذاكرة البطيئة", "تخطي طبقات", "خفض الدقة"]
      },
      correctIndex: 1
    },
    {
      question: { en: "\"JSON mode\" in engines is implemented by:", ar: "\"وضع JSON\" في المحركات يُنفَّذ عبر:" },
      options: {
        en: ["Fine-tuning", "Masking invalid tokens at each sampling step", "A second model that fixes output", "Regular expressions after generation"],
        ar: ["ضبط دقيق", "حجب الرموز غير الصالحة في كل خطوة توليد", "نموذج ثانٍ يصلح الخرج", "تعبيرات نمطية بعد التوليد"]
      },
      correctIndex: 1
    }
  ]
};
