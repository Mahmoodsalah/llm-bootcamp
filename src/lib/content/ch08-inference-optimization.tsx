import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import KVCache from '../../components/widgets/KVCache';
import SpeculativeDecoding from '../../components/widgets/SpeculativeDecoding';
import Quantization from '../../components/widgets/Quantization';

export const inferenceOptimizationModule: ModuleDef = {
  id: "8",
  title: { en: "Inference Optimization", ar: "تحسين الاستدلال" },
  description: {
    en: "Why LLM inference is memory-bound, how KV caching, speculative decoding, and quantization speed things up, and what the major inference engines optimize.",
    ar: "لماذا استدلال نماذج اللغة مقيّد بالذاكرة، وكيف تسرّع ذاكرة KV والترميز التخميني والتكميم الأداء، وما الذي تحسّنه محركات الاستدلال الرئيسية.",
  },
  lessons: [
    {
      id: "memory-bound",
      title: { en: "Memory-Bound Inference & Key Metrics", ar: "الاستدلال المقيّد بالذاكرة والمقاييس الأساسية" },
      content: {
        en: <>
          <p>Running a large language model at inference time is fundamentally a <strong>memory bandwidth problem</strong>, not a compute problem. Each new token requires loading the entire set of model weights from GPU memory into the computation units. A 7B-parameter model in 16-bit precision occupies roughly 14 GB — that weight data must be streamed from high-bandwidth memory for every single token generated. The arithmetic work is trivially fast by comparison; the bottleneck is the memory bus.</p>
          <p>Two metrics capture the latency-throughput tradeoff you are always navigating:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>TTFT (Time-to-First-Token):</strong> how long a user waits before seeing any output. Dominated by the prefill phase, where all input tokens are processed in parallel. Optimizing TTFT feels most important for interactive applications.</li>
            <li><strong>Tokens/sec throughput:</strong> how many output tokens the system generates per second across all users. Dominated by the decode phase, which is inherently sequential. Batching is the primary lever here.</li>
          </ul>
          <p>These two metrics pull in opposite directions. A small batch processes fewer requests but gives each one a fast first token. A large batch keeps the GPU fully saturated but individual requests wait longer. Finding the right operating point for your application is a continuous tuning exercise — and it changes with traffic patterns.</p>
          <p>The <strong>KV cache</strong> is the foundational fix for the sequential decode bottleneck. Instead of recomputing the attention keys and values for every previously generated token on each new step, the model stores them in a fast buffer. Only the newest token requires fresh computation; all prior context is read from cache. This is active in essentially every production inference stack.</p>
        </>,
        ar: <>
          <p>تشغيل نموذج لغوي كبير وقت الاستدلال هو في جوهره <strong>مشكلة عرض نطاق الذاكرة</strong>، لا مشكلة حوسبة. كل رمز جديد يستلزم تحميل مجموعة أوزان النموذج كاملةً من ذاكرة GPU إلى وحدات الحساب. نموذج بسبعة مليارات وزن بدقة 16 بت يشغل نحو 14 جيجابايت — يجب بث هذه البيانات من الذاكرة عالية العرض النطاقي لكل رمز مولَّد. عمل الحساب الرياضي بسيط بالمقارنة؛ الاختناق هو ناقل الذاكرة.</p>
          <p>مقياسان يصفان مقايضة الكمون والإنتاجية التي تتنقل بينها دائمًا:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>TTFT (زمن أول رمز):</strong> كم ينتظر المستخدم قبل رؤية أي مخرج. يهيمن عليه طور التعبئة، حيث تُعالَج رموز المدخلات كلها معًا. تحسين <Eng>TTFT</Eng> أهم ما يشعر به المستخدم في التطبيقات التفاعلية.</li>
            <li><strong>إنتاجية الرموز/ثانية:</strong> كم رمزًا ينتجه النظام في الثانية عبر جميع المستخدمين. يهيمن عليه طور فك الترميز التسلسلي بطبيعته. التجميع <Eng>(Batching)</Eng> هو الرافعة الرئيسية هنا.</li>
          </ul>
          <p>هذان المقياسان يسحبان في اتجاهين متعاكسين. الدفعة الصغيرة تعالج طلبات أقل لكن تمنح كل منها أول رمز سريع. الدفعة الكبيرة تُشبع GPU كليًا لكن الطلبات الفردية تنتظر أطول. إيجاد نقطة التشغيل الصحيحة لتطبيقك هو تمرين ضبط مستمر — ويتغير مع أنماط الحركة.</p>
          <p><strong>ذاكرة KV</strong> هي الحل الأساسي لاختناق فك الترميز التسلسلي. بدلًا من إعادة حساب مفاتيح الانتباه وقيمه لكل رمز سبق توليده في كل خطوة جديدة، يخزّنها النموذج في مخزن مؤقت سريع. الرمز الأحدث فقط يحتاج حسابًا جديدًا؛ كل السياق السابق يُقرأ من الذاكرة المؤقتة. هذا نشط في كل تجميع استدلال إنتاجي تقريبًا.</p>
        </>
      },
      widget: <KVCache />,
    },
    {
      id: "speculative",
      title: { en: "Speculative Decoding", ar: "فك الترميز التخميني" },
      content: {
        en: <>
          <p>Even with a KV cache, token-by-token generation cannot fully saturate a modern GPU: the compute cores sit idle while waiting for memory transfers. <strong>Speculative decoding</strong> exploits this spare compute by pairing a large target model with a much smaller <em>draft model</em>.</p>
          <p>The process runs in two alternating phases:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>Draft phase:</strong> the small model autoregressively proposes 4–8 tokens in a single forward pass. Because it is tiny, this is cheap. The draft tokens are tentative — they reflect the small model's distribution, not the target model's.</li>
            <li><strong>Verify phase:</strong> the large target model scores all proposed tokens <em>in a single batched forward pass</em>. Tokens that match what the large model would have generated are accepted; the first mismatched token is corrected and all subsequent drafts are discarded.</li>
          </ol>
          <p>The key insight: the verification pass is nearly the same cost as a single token forward pass on the large model, but it can accept multiple tokens simultaneously. If the draft model has a 90% agreement rate, each verify step yields ~3–4 tokens on average instead of 1. Real-world speedups of 2–4× are common on tasks where the draft model generalizes well (code completion, summarization with heavy prompt overlap).</p>
          <p>One hard constraint: both models must share the <em>identical tokenizer</em>. A mismatch makes the token-level comparison meaningless. For this reason, speculative decoding is easiest when the draft model is a smaller member of the same model family (e.g. a 0.5B model drafting for a 7B model of the same series).</p>
        </>,
        ar: <>
          <p>حتى مع ذاكرة <Eng>KV</Eng>، لا يستطيع التوليد رمزًا بعد رمز إشباع <Eng>GPU</Eng> الحديثة تمامًا: نوى الحوسبة تظل خاملة في انتظار نقل الذاكرة. <strong>فك الترميز التخميني</strong> يستغل هذه الحوسبة الفائضة بإقران نموذج هدف كبير بنموذج <em>مسودة</em> أصغر بكثير.</p>
          <p>تسير العملية في طورين متناوبين:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>طور المسودة:</strong> النموذج الصغير يقترح 4–8 رموز ذاتيًا في تمرير أمامي واحد. لأنه صغير الحجم، هذا رخيص. رموز المسودة مؤقتة — تعكس توزيع النموذج الصغير لا توزيع النموذج الهدف.</li>
            <li><strong>طور التحقق:</strong> نموذج الهدف الكبير يُقيّم جميع الرموز المقترحة <em>في تمرير أمامي مُجمَّع واحد</em>. الرموز المطابقة لما كان النموذج الكبير سيولّده تُقبل؛ الرمز المغاير الأول يُصحَّح وتُلغى المسودات التالية.</li>
          </ol>
          <p>الفكرة الجوهرية: تمرير التحقق تكلفته تقريبًا نفس تكلفة تمرير رمز واحد على النموذج الكبير، لكنه قد يقبل رموزًا متعددة في آنٍ واحد. إذا كان معدل توافق نموذج المسودة 90%، ينتج كل تمرير تحقق ~3–4 رموز في المتوسط بدلًا من رمز واحد. تسريعات 2–4× في العالم الحقيقي شائعة في المهام التي يتعمم فيها نموذج المسودة جيدًا (إكمال الكود، والتلخيص مع تداخل كبير في الأمر).</p>
          <p>قيد صارم واحد: يجب أن يتشارك كلا النموذجين <em>نفس أداة التقطيع</em> تمامًا. أي اختلاف يجعل مقارنة مستوى الرموز بلا معنى. لهذا السبب، فك الترميز التخميني أيسر حين يكون نموذج المسودة عضوًا أصغر من نفس عائلة النماذج.</p>
        </>
      },
      widget: <SpeculativeDecoding />,
    },
    {
      id: "parallelism",
      title: { en: "Model Parallelism", ar: "توازي النماذج" },
      content: {
        en: <>
          <p>When a model is too large to fit on a single GPU, or when serving demands more throughput than one card can provide, the workload must be distributed. There are three orthogonal strategies, each splitting the model differently:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Data Parallelism (DP):</strong> replicate the full model on N GPUs; each GPU processes a different batch of requests. The simplest approach, but only works when the model fits on a single device. Primarily used to scale throughput by handling more concurrent requests.</li>
            <li><strong>Pipeline Parallelism (PP):</strong> split the model's layers across GPUs depth-wise (e.g. GPU 0 runs layers 1–8, GPU 1 runs layers 9–16, …). Reduces per-GPU memory footprint dramatically. The downside is "pipeline bubbles" — GPUs idle while waiting for the previous stage to finish. Micro-batching reduces bubble size by streaming multiple sub-batches through the pipeline simultaneously.</li>
            <li><strong>Tensor Parallelism (TP):</strong> split individual weight matrices across GPUs width-wise. Each GPU computes a slice of the attention heads or MLP projections in parallel, then all-reduce to combine partial results. This is the most communication-intensive approach but yields the lowest latency per token — ideal when fast interconnects (NVLink) are available between GPUs on the same node.</li>
          </ul>
          <p>In large production clusters, these are combined: a model might be split with TP within each node (fast intra-node links) and PP across nodes (fewer, but slower inter-node links). Tuning the degree of each parallelism is a significant engineering challenge when deploying very large models.</p>
        </>,
        ar: <>
          <p>حين يكون النموذج كبيرًا جدًا ليتسع في GPU واحدة، أو حين تستلزم الخدمة إنتاجية أكبر مما تستطيع بطاقة واحدة تقديمه، يجب توزيع العمل. ثمة ثلاث استراتيجيات متعامدة، كل منها تقسّم النموذج بطريقة مختلفة:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>توازي البيانات (<Eng>DP</Eng>):</strong> نسخ النموذج الكامل على N بطاقات GPU؛ كل بطاقة تعالج دفعة مختلفة من الطلبات. أبسط مقاربة، لكنها تشتغل فقط حين يتسع النموذج في بطاقة واحدة. تُستخدم أساسًا لتوسيع الإنتاجية بمعالجة طلبات متزامنة أكثر.</li>
            <li><strong>توازي الخط (<Eng>PP</Eng>):</strong> تقسيم طبقات النموذج عبر البطاقات بعمقيًا (مثلاً GPU 0 يشغّل طبقات 1–8، GPU 1 يشغّل 9–16، …). يقلل بشكل كبير البصمة الذاكرية لكل بطاقة. الجانب السلبي هو "فقاعات الخط" — البطاقات خاملة في انتظار اكتمال المرحلة السابقة. المعالجة الدقيقة تقلل حجم الفقاعات ببث دفعات فرعية متعددة عبر الخط في آنٍ واحد.</li>
            <li><strong>توازي الموترات (<Eng>TP</Eng>):</strong> تقسيم مصفوفات الأوزان الفردية عرضيًا عبر البطاقات. كل بطاقة تحسب شريحة من رؤوس الانتباه أو إسقاطات <Eng>MLP</Eng> بالتوازي، ثم يجمع <Eng>all-reduce</Eng> النتائج الجزئية. هذا أكثر المقاربات كثافةً في الاتصال لكنه يعطي أدنى كمون للرمز — مثالي حين تتوفر وصلات سريعة (<Eng>NVLink</Eng>) بين البطاقات على نفس الخادم.</li>
          </ul>
          <p>في عناقيد الإنتاج الكبيرة، تُدمج هذه الاستراتيجيات: قد يُقسَّم نموذج بـ<Eng>TP</Eng> داخل كل عقدة (وصلات داخل العقدة السريعة) وبـ<Eng>PP</Eng> عبر العقد (وصلات بين العقد أبطأ وأقل). ضبط درجة كل نوع توازٍ هو تحدٍّ هندسي كبير عند نشر نماذج ضخمة جدًا.</p>
        </>
      },
    },
    {
      id: "quantization",
      title: { en: "Quantization & Inference Engines", ar: "التكميم ومحركات الاستدلال" },
      content: {
        en: <>
          <p><strong>Quantization</strong> reduces the numerical precision of model weights from the training-time default (FP16 or BF16, 16 bits per parameter) to a smaller representation. The primary payoff is memory: at INT8, a 7B model fits in ~7 GB instead of 14 GB; at INT4, it drops to ~3.5 GB — allowing models that would otherwise require multiple GPUs to run on a single consumer card.</p>
          <p>The main approaches differ in when quantization happens and how quality loss is minimized:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>GPTQ:</strong> post-training quantization applied layer-by-layer with a small calibration dataset. Compensates for rounding errors by adjusting remaining weights. Widely used for 4-bit weights with near-FP16 quality on most benchmarks.</li>
            <li><strong>GGUF (llama.cpp format):</strong> CPU-friendly quantization format designed for running models on laptops and consumer hardware. Supports mixed-precision (e.g. higher precision for attention layers, lower for MLP weights). Excellent for local deployment.</li>
            <li><strong>AWQ (Activation-Aware Weight Quantization):</strong> observes which weights are most important by profiling activations, then protects those weights with higher precision. Tends to outperform GPTQ at very low bit widths (3–4 bit).</li>
          </ul>
          <p>The major inference engines each target a different optimization niche. <strong>vLLM</strong> pioneered <em>PagedAttention</em> — managing KV cache memory like an operating system manages virtual memory, in fixed-size pages. This eliminates memory fragmentation and enables large batches with long contexts. <strong>TGI (Text Generation Inference)</strong> by Hugging Face offers continuous batching and speculative decoding with a simple HTTP API. <strong>TensorRT-LLM</strong> by NVIDIA fuses operations into custom CUDA kernels for maximum GPU utilization. All three implement continuous batching as a baseline — no modern serving stack should leave GPUs idle waiting for slow requests to finish.</p>
        </>,
        ar: <>
          <p><strong>التكميم</strong> يقلص الدقة العددية لأوزان النموذج من الافتراضي في التدريب (FP16 أو BF16، 16 بتًا لكل وزن) إلى تمثيل أصغر. العائد الأساسي هو الذاكرة: بـ<Eng>INT8</Eng>، نموذج 7B يتسع في ~7 جيجابايت بدلًا من 14؛ بـ<Eng>INT4</Eng> ينخفض إلى ~3.5 جيجابايت — مما يتيح تشغيل نماذج كانت تحتاج بطاقات متعددة على بطاقة استهلاكية واحدة.</p>
          <p>المقاربات الرئيسية تختلف في توقيت التكميم وطريقة تقليل فقدان الجودة:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>GPTQ:</strong> تكميم ما بعد التدريب يُطبَّق طبقةً بطبقة مع مجموعة بيانات معايرة صغيرة. يعوّض أخطاء التقريب بتعديل الأوزان المتبقية. مستخدم على نطاق واسع بأوزان 4 بت بجودة قريبة من FP16 في معظم المعايير.</li>
            <li><strong>GGUF (تنسيق llama.cpp):</strong> تنسيق تكميم صديق لـ<Eng>CPU</Eng> مصمم لتشغيل النماذج على أجهزة الكمبيوتر المحمول والأجهزة الاستهلاكية. يدعم الدقة المختلطة (مثلاً دقة أعلى لطبقات الانتباه وأدنى لأوزان <Eng>MLP</Eng>). ممتاز للنشر المحلي.</li>
            <li><strong>AWQ (التكميم الواعي بالتنشيط):</strong> يرصد الأوزان الأهم بتحليل التنشيطات، ثم يحمي هذه الأوزان بدقة أعلى. يتفوق عادةً على <Eng>GPTQ</Eng> عند عروض بت منخفضة جدًا (3–4 بت).</li>
          </ul>
          <p>محركات الاستدلال الرئيسية تستهدف كل منها تحسينًا مختلفًا. <strong>vLLM</strong> رائد <Eng>PagedAttention</Eng> — إدارة ذاكرة <Eng>KV</Eng> كما يدير نظام التشغيل الذاكرة الافتراضية في صفحات ثابتة الحجم. يُزيل تجزؤ الذاكرة ويتيح دفعات كبيرة بسياقات طويلة. <strong>TGI</strong> من <Eng>Hugging Face</Eng> يقدم التجميع المستمر وفك الترميز التخميني بواجهة <Eng>HTTP</Eng> بسيطة. <strong>TensorRT-LLM</strong> من <Eng>NVIDIA</Eng> يدمج العمليات في نوى <Eng>CUDA</Eng> مخصصة لأقصى استخدام للـ<Eng>GPU</Eng>. الثلاثة يطبّقون التجميع المستمر كخط أساسي — لا تجميع استدلال حديث يجب أن يترك البطاقات خاملة بانتظار طلبات بطيئة.</p>
        </>
      },
      widget: <Quantization />,
    },
  ],
  quiz: [
    {
      question: { en: "LLM inference is primarily bottlenecked by:", ar: "الاختناق الأساسي في استدلال نماذج اللغة هو:" },
      options: {
        en: ["CPU integer math", "Memory bandwidth (loading weights from GPU memory)", "Network latency", "Tokenization speed"],
        ar: ["حساب الأعداد الصحيحة في CPU", "عرض نطاق الذاكرة (تحميل الأوزان من ذاكرة GPU)", "كمون الشبكة", "سرعة التقطيع"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What does the KV cache store?", ar: "ما الذي تخزّنه ذاكرة KV؟" },
      options: {
        en: ["The model weights", "Attention key and value tensors for previously generated tokens", "The tokenizer vocabulary", "API request/response pairs"],
        ar: ["أوزان النموذج", "موترات المفاتيح والقيم للانتباه للرموز المولودة سابقًا", "مفردات أداة التقطيع", "أزواج طلبات/استجابات API"]
      },
      correctIndex: 1
    },
    {
      question: { en: "In speculative decoding, why must both models share the same tokenizer?", ar: "في فك الترميز التخميني، لماذا يجب أن يتشارك النموذجان نفس أداة التقطيع؟" },
      options: {
        en: ["To save memory", "Token-level comparison between draft and target is meaningless if tokens differ", "It's optional — only recommended", "To match output length"],
        ar: ["لتوفير الذاكرة", "مقارنة الرموز بين المسودة والهدف بلا معنى إذا اختلفت الرموز", "اختيارية — مجرد توصية", "لمطابقة طول المخرجات"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Tensor parallelism splits the model:", ar: "توازي الموترات يقسّم النموذج:" },
      options: {
        en: ["Depth-wise (layers to different GPUs)", "Width-wise (weight matrices across GPUs)", "By request (each GPU handles different users)", "By data type (floats to one GPU, ints to another)"],
        ar: ["عمقيًا (طبقات لبطاقات مختلفة)", "عرضيًا (مصفوفات الأوزان عبر البطاقات)", "حسب الطلب (كل بطاقة تعالج مستخدمين مختلفين)", "حسب نوع البيانات (فاصلة عائمة لبطاقة، أعداد صحيحة لأخرى)"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Compared to GPTQ, AWQ is better at:", ar: "مقارنةً بـ GPTQ، يتفوق AWQ في:" },
      options: {
        en: ["Quantizing during training", "Very low bit widths (3–4 bit) by protecting the most important weights", "CPU-only deployment", "Quantizing embedding layers only"],
        ar: ["التكميم خلال التدريب", "عروض البت المنخفضة جدًا (3–4 بت) بحماية الأوزان الأهم", "النشر على CPU فقط", "تكميم طبقات التضمين فقط"]
      },
      correctIndex: 1
    },
  ],
};
