import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import LoRACompare from '../../components/widgets/LoRACompare';

export const sftModule: ModuleDef = {
  id: "5",
  title: { en: "Supervised Fine-Tuning", ar: "الضبط الدقيق الموجّه" },
  description: {
    en: "When to fine-tune vs prompt vs RAG, building high-quality instruction datasets, chat templates, LoRA and QLoRA adapters, and a practical fine-tuning playbook for an 8B model.",
    ar: "متى نضبط دقيقاً مقابل الأوامر مقابل RAG، وبناء مجموعات بيانات تعليمات عالية الجودة، وقوالب المحادثة، ومحوّلات LoRA وQLoRA، ودليل عملي للضبط الدقيق لنموذج 8B."
  },
  lessons: [
    {
      id: "when-to-sft",
      title: { en: "Fine-Tuning vs Prompting vs RAG", ar: "الضبط الدقيق مقابل الأوامر مقابل RAG" },
      content: {
        en: <>
          <p><strong>Supervised Fine-Tuning (SFT)</strong> adjusts a pre-trained model's weights using labeled examples of the exact behavior you want. Before reaching for it, consider the alternatives — they are cheaper and often sufficient:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Prompt engineering first:</strong> a well-crafted system prompt with 3–5 few-shot examples can capture a surprising amount of desired behavior at zero training cost. Always establish this baseline before anything else.</li>
            <li><strong>RAG next:</strong> if the problem is missing factual knowledge — your model doesn't know about internal documents, recent events, or domain-specific data — RAG solves it without touching model weights.</li>
            <li><strong>Fine-tuning when:</strong> you need to instill a consistent output <em>format</em> (structured JSON, a specific markdown style), a new <em>vocabulary</em> or <em>domain</em> that is poorly represented in pre-training data, a particular <em>tone or persona</em> that is hard to enforce via prompts alone, or when you need to run a smaller model efficiently in production.</li>
          </ul>
          <p>SFT does not reliably teach new <em>facts</em> — models have a tendency to "hallucinate over" new factual content injected through fine-tuning. For facts, use RAG. Fine-tuning excels at teaching <em>style, format, and instruction-following patterns</em>.</p>
          <p>One more nuance: fine-tuning a large model (70B+) generally requires fewer examples — as few as 1,000 carefully curated samples can produce excellent results (the "LIMA" finding). Smaller models (7–8B) need more examples to even internalize the chat template correctly. Quality dominates quantity at every scale.</p>
        </>,
        ar: <>
          <p><strong>الضبط الدقيق الموجَّه (<Eng>SFT</Eng>)</strong> يُعدِّل أوزان نموذج مُدرَّب مسبقاً باستخدام أمثلة موسومة للسلوك المطلوب بالضبط. قبل اللجوء إليه، فكّر في البدائل — فهي أرخص وغالباً كافية:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الأوامر أولاً:</strong> أمر نظام مصاغ جيداً مع 3–5 أمثلة قليلة يمكنه استيعاب قدر مفاجئ من السلوك المطلوب بدون تكلفة تدريب. أسّس هذا الخط الأساسي دائماً قبل أي شيء آخر.</li>
            <li><strong>RAG تالياً:</strong> إن كانت المشكلة معرفة حقيقية مفقودة — مستندات داخلية، أحداث حديثة، أو بيانات متخصصة — فـ <Eng>RAG</Eng> تحلها دون المساس بأوزان النموذج.</li>
            <li><strong>الضبط الدقيق عند:</strong> الحاجة لإرساء <em>تنسيق</em> متسق للمخرجات (JSON منظم، أسلوب محدد)، أو <em>مفردات</em> أو <em>مجال</em> ضعيف التمثيل في بيانات التدريب المسبق، أو <em>نبرة أو شخصية</em> يصعب تطبيقها عبر الأوامر وحدها، أو عند الحاجة لتشغيل نموذج أصغر بكفاءة في الإنتاج.</li>
          </ul>
          <p>الضبط الدقيق لا يُعلِّم <em>حقائق</em> جديدة بشكل موثوق — النماذج تميل لـ"الهلوسة فوق" المحتوى الحقيقي الجديد المحقون بالضبط الدقيق. للحقائق، استخدم <Eng>RAG</Eng>. يتفوق الضبط الدقيق في تعليم <em>الأسلوب والتنسيق وأنماط اتباع التعليمات</em>.</p>
          <p>دقة إضافية: ضبط نموذج كبير (+70B) يتطلب عموماً أمثلة أقل — 1,000 عينة منتقاة بعناية يمكنها إنتاج نتائج ممتازة (نتيجة ورقة "LIMA"). النماذج الأصغر (7–8B) تحتاج أمثلة أكثر لاستيعاب قالب المحادثة بشكل صحيح حتى. الجودة تتفوق على الكمية في كل الأحجام.</p>
        </>
      }
    },
    {
      id: "instruction-datasets",
      title: { en: "Building Instruction Datasets", ar: "بناء مجموعات بيانات التعليمات" },
      content: {
        en: <>
          <p>An instruction dataset is a collection of (instruction, response) pairs that teach the model the desired input-output behavior. Building a good one is typically the hardest and most time-consuming part of fine-tuning. Quality always beats quantity — a model fine-tuned on 500 excellent examples will outperform one trained on 50,000 mediocre ones.</p>
          <p>Three dimensions define quality:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Accuracy:</strong> factually correct answers aligned with the intent of the instruction. Inaccurate training data produces inaccurate models — simple as that.</li>
            <li><strong>Diversity:</strong> cover the real distribution of queries the deployed model will face. If 80% of your data is product FAQs but users also ask for troubleshooting steps and config advice, your model will be lopsided.</li>
            <li><strong>Complexity:</strong> include multi-step reasoning, edge cases, and nuanced instructions. Trivial examples teach the model to be superficially responsive without depth.</li>
          </ul>
          <p>The typical curation pipeline: <strong>collect</strong> raw data (existing open-source datasets, internal documents, human-written Q&amp;A pairs), <strong>deduplicate</strong> (exact hash deduplication first, then MinHash for near-duplicates), <strong>decontaminate</strong> (remove anything that overlaps with your evaluation set — otherwise you're measuring memorization, not capability), and <strong>filter</strong> by quality (length checks, keyword exclusions, LLM-as-a-judge scoring).</p>
          <p>When you lack sufficient real data, <strong>synthetic data generation</strong> fills the gap: prompt a capable model (GPT-4o-mini works well) to generate instructions and answers given some seed context. This is especially effective for domain-specific tasks where the seed context is your proprietary knowledge. Iteratively validate samples with a judge LLM using pairwise ranking rather than absolute scoring — it is more consistent and better correlated with human judgment.</p>
        </>,
        ar: <>
          <p>مجموعة بيانات التعليمات مجموعة من أزواج (تعليمات، استجابة) تُعلِّم النموذج السلوك المدخل-المخرج المطلوب. بناء مجموعة جيدة هو عادةً الجزء الأصعب والأكثر استهلاكاً للوقت في الضبط الدقيق. الجودة تتفوق دائماً على الكمية — نموذج مضبوط على 500 مثال ممتاز سيتفوق على آخر مدرَّب على 50,000 مثال متوسط.</p>
          <p>ثلاثة أبعاد تحدد الجودة:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الدقة:</strong> إجابات صحيحة حقيقياً ومتوافقة مع نية التعليمات. بيانات التدريب غير الدقيقة تنتج نماذج غير دقيقة — بهذه البساطة.</li>
            <li><strong>التنوع:</strong> تغطية التوزيع الفعلي للاستعلامات التي سيواجهها النموذج المُنشَر. إن كان 80% من بياناتك أسئلة شائعة عن المنتج لكن المستخدمين يطرحون أيضاً خطوات استكشاف الأخطاء ونصائح الإعداد، سيكون نموذجك مختلاً.</li>
            <li><strong>التعقيد:</strong> تضمين استدلال متعدد الخطوات وحالات حافة وتعليمات دقيقة. الأمثلة التافهة تُعلِّم النموذج أن يكون سطحياً دون عمق.</li>
          </ul>
          <p>خط التنسيق النموذجي: <strong>جمع</strong> البيانات الخام (مجموعات بيانات مفتوحة المصدر موجودة، وثائق داخلية، أزواج أسئلة وأجوبة مكتوبة بشرياً)، <strong>إزالة التكرار</strong> (إزالة التكرار بالهاش الدقيق أولاً، ثم <Eng>MinHash</Eng> لشبه المكررات)، <strong>إزالة التلوث</strong> (إزالة أي شيء يتداخل مع مجموعة التقييم — وإلا ستقيس الحفظ لا القدرة)، و<strong>التصفية</strong> بالجودة (فحوصات الطول، استثناء الكلمات المفتاحية، تسجيل درجات <Eng>LLM-as-a-judge</Eng>).</p>
          <p>حين تفتقر لبيانات حقيقية كافية، <strong>توليد البيانات الاصطناعية</strong> يسد الفجوة: أَمِر نموذجاً قادراً (<Eng>GPT-4o-mini</Eng> يعمل جيداً) لتوليد تعليمات وإجابات بالسياق البذري. هذا فعّال بشكل خاص للمهام المتخصصة حيث السياق البذري هو معرفتك المملوكة. تحقق من العينات تكرارياً بنموذج قاضٍ باستخدام الترتيب الثنائي بدلاً من التسجيل المطلق — فهو أكثر اتساقاً وأفضل ارتباطاً بالحكم البشري.</p>
        </>
      }
    },
    {
      id: "lora-qlora",
      title: { en: "LoRA, QLoRA, and Chat Templates", ar: "LoRA وQLoRA وقوالب المحادثة" },
      content: {
        en: <>
          <p>Before training starts, your dataset must be formatted into a <strong>chat template</strong> that the base model understands. The most common is <strong>ChatML</strong>, which wraps each message in special tokens marking the role (system, user, assistant) and turn boundaries. Every fine-tuning library applies the correct template automatically given the model name — but if you assemble prompts by hand, a format mismatch silently destroys model quality.</p>
          <p><strong>Full fine-tuning</strong> updates all parameters simultaneously. For an 8B-parameter model in bfloat16, the model alone needs ~16GB; add gradient buffers, optimizer states (AdamW stores two moments per parameter), and activations, and you need ~160GB of GPU VRAM. This is prohibitive for most teams.</p>
          <p><strong>LoRA (Low-Rank Adaptation)</strong> sidesteps this by keeping the original weights <em>frozen</em> and inserting two small trainable matrices at each attention layer: a "down-projection" A of shape (d, r) and an "up-projection" B of shape (r, d), where r is the rank — typically 8–64. The effective weight update is A × B. Since r &lt;&lt; d, trainable parameter count drops from ~8B to &lt;1% of that. The frozen base model uses fp16; only A and B are updated, so VRAM requirements collapse to ~20GB for an 8B model. After training, the adapter can be merged back into the base weights or swapped out, making it easy to maintain multiple task-specific adapters on the same base.</p>
          <p><strong>QLoRA</strong> pushes further: it quantizes the frozen base model to 4-bit (using NF4 quantization with double quantization for accuracy), runs only the LoRA adapters in bf16, and adds paged optimizers to handle gradient memory spikes. An 8B model can be fine-tuned on a single 24GB consumer GPU. The accuracy tradeoff is roughly 1–2% below full fine-tuning, which is acceptable for most applications.</p>
          <p>Key hyperparameters: <strong>rank r</strong> (higher = more expressive adapters but more VRAM; start at 16–32), <strong>alpha</strong> (scaling factor for the LoRA update, usually set to 2× rank), <strong>learning rate</strong> (2e-4 is a common starting point for LoRA; full FT needs 1e-5 range), <strong>epochs</strong> (1–3 for large datasets; watch for overfitting), and <strong>batch size</strong> with gradient accumulation to simulate a larger effective batch.</p>
        </>,
        ar: <>
          <p>قبل بدء التدريب، يجب تنسيق مجموعة بياناتك في <strong>قالب محادثة</strong> يفهمه النموذج الأساسي. الأكثر شيوعاً هو <strong><Eng>ChatML</Eng></strong>، الذي يلف كل رسالة في رموز خاصة تُحدِّد الدور (نظام، مستخدم، مساعد) وحدود الأدوار. كل مكتبة ضبط دقيق تُطبِّق القالب الصحيح تلقائياً بالاسم النموذج — لكن إن جمّعت الأوامر يدوياً، أي اختلاف في التنسيق يُدمر جودة النموذج بصمت.</p>
          <p><strong>الضبط الكامل</strong> يُحدِّث جميع المعاملات في آنٍ واحد. لنموذج 8B معاملات بـ <Eng>bfloat16</Eng>، النموذج وحده يحتاج ~16GB؛ أضف مخازن التدرج وحالات المحسِّن (<Eng>AdamW</Eng> يخزن لحظتين لكل معامل) والتفعيلات، وستحتاج ~160GB من <Eng>VRAM</Eng> للـGPU. هذا مُحظور للفرق الأغلبية.</p>
          <p><strong><Eng>LoRA</Eng> (التكيف منخفض الرتبة)</strong> يتحايل على ذلك بإبقاء الأوزان الأصلية <em>مجمَّدة</em> وإدراج مصفوفتين تدريبيتين صغيرتين في كل طبقة انتباه: "إسقاط للأسفل" A بشكل (d, r) و"إسقاط للأعلى" B بشكل (r, d)، حيث r هي الرتبة — عادةً 8–64. تحديث الوزن الفعّال هو A × B. بما أن r &lt;&lt; d، يتراجع عدد المعاملات القابلة للتدريب من ~8B إلى أقل من 1% منها. النموذج الأساسي المجمَّد يستخدم fp16؛ A وB فقط يُحدَّثان، فمتطلبات <Eng>VRAM</Eng> تنهار إلى ~20GB لنموذج 8B. بعد التدريب، يمكن دمج المحوّل مرة أخرى في الأوزان الأساسية أو استبداله، مما يُسهِّل الحفاظ على محوّلات متعددة خاصة بالمهام على نفس القاعدة.</p>
          <p><strong><Eng>QLoRA</Eng></strong> يمضي أبعد: يُكمِّم النموذج الأساسي المجمَّد إلى 4-بت (باستخدام تكميم <Eng>NF4</Eng> مع تكميم مزدوج للدقة)، ويشغّل محوّلات <Eng>LoRA</Eng> فقط بـ <Eng>bf16</Eng>، ويُضيف محسّنات بالترحيل لمعالجة ارتفاعات ذاكرة التدرج. يمكن ضبط نموذج 8B دقيقاً على GPU مستهلك واحد بذاكرة 24GB. التضحية في الدقة تبلغ تقريباً 1–2% أقل من الضبط الكامل، وهذا مقبول لمعظم التطبيقات.</p>
          <p>المعاملات الفائقة الرئيسية: <strong>الرتبة r</strong> (أعلى = محوّلات أكثر تعبيراً لكن بـVRAM أكبر؛ ابدأ بـ 16–32)، <strong>ألفا</strong> (عامل التحجيم لتحديث <Eng>LoRA</Eng>، يُعيَّن عادةً بضعفَي الرتبة)، <strong>معدل التعلم</strong> (2e-4 نقطة بداية شائعة لـ<Eng>LoRA</Eng>؛ الضبط الكامل يحتاج نطاق 1e-5)، <strong>العصور</strong> (1–3 لمجموعات البيانات الكبيرة؛ راقب الإفراط في التخصيص)، و<strong>حجم الدفعة</strong> مع تراكم التدرج لمحاكاة دفعة فعّالة أكبر.</p>
        </>
      },
      widget: <LoRACompare />
    },
    {
      id: "sft-practice",
      title: { en: "Practical Fine-Tuning Flow for an 8B Model", ar: "سير عمل الضبط الدقيق العملي لنموذج 8B" },
      content: {
        en: <>
          <p>A practical walkthrough for fine-tuning a Llama-class 8B model with QLoRA on a single GPU:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>Prepare and validate the dataset.</strong> Format into ChatML, inspect 50–100 random samples manually, ensure no evaluation data contamination, check length distribution (most samples should be &lt;2,048 tokens for efficiency).</li>
            <li><strong>Set up the model in 4-bit.</strong> Load the base model with BitsAndBytes NF4 quantization, enable gradient checkpointing to trade compute for activation memory.</li>
            <li><strong>Attach LoRA adapters.</strong> Target the Q and V projection matrices (sometimes also K and the output projection). Start with r=16, alpha=32. The target modules vary by architecture — always check the model config.</li>
            <li><strong>Configure training.</strong> Use AdamW with a cosine LR schedule, warmup for 3–5% of steps, pack sequences to maximize GPU utilization. A batch size that fills ~80% of VRAM is the sweet spot.</li>
            <li><strong>Train and monitor.</strong> Watch training loss (should descend smoothly), validation loss (early stop if it diverges), and periodically sample generations manually — perplexity alone won't catch "technically low-loss but unusable output" failures.</li>
            <li><strong>Evaluate properly.</strong> Run the fine-tuned model on a held-out task-specific benchmark. For chat, use LLM-as-a-judge against baseline outputs. For structured tasks, check format compliance and correctness rates.</li>
            <li><strong>Merge and export.</strong> Optionally merge the LoRA weights into the base model for a single clean checkpoint that doesn't require the LoRA inference overhead.</li>
          </ol>
          <p>Common failure modes: training loss drops but the model ignores instructions (the chat template was applied incorrectly); the model only outputs in one style (low diversity in training data); catastrophic forgetting of general capabilities (learning rate too high, or trained too many epochs). Always compare outputs to the base model to sanity-check both wins and regressions.</p>
        </>,
        ar: <>
          <p>دليل عملي لضبط نموذج Llama 8B دقيقاً بـ <Eng>QLoRA</Eng> على GPU واحد:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>تحضير مجموعة البيانات والتحقق منها.</strong> تنسيق إلى <Eng>ChatML</Eng>، فحص 50–100 عينة عشوائية يدوياً، التأكد من عدم تلوث بيانات التقييم، فحص توزيع الأطوال (معظم العينات يجب أن تكون &lt;2,048 رمز للكفاءة).</li>
            <li><strong>إعداد النموذج بـ 4-بت.</strong> تحميل النموذج الأساسي بتكميم <Eng>NF4</Eng> من <Eng>BitsAndBytes</Eng>، تفعيل <Eng>gradient checkpointing</Eng> لمقايضة الحساب مع ذاكرة التفعيل.</li>
            <li><strong>إرفاق محوّلات LoRA.</strong> استهداف مصفوفات إسقاط Q وV (أحياناً K ومصفوفة الإخراج أيضاً). ابدأ بـ r=16، alpha=32. الوحدات المستهدفة تتفاوت حسب البنية — تحقق دائماً من إعداد النموذج.</li>
            <li><strong>تكوين التدريب.</strong> استخدم <Eng>AdamW</Eng> مع جدول زمني كوسيني لمعدل التعلم، وإحماء لـ 3–5% من الخطوات، وتعبئة التسلسلات لزيادة استخدام GPU. حجم دفعة يملأ ~80% من VRAM هو النقطة المثلى.</li>
            <li><strong>التدريب والمراقبة.</strong> راقب خسارة التدريب (يجب أن تهبط بسلاسة)، وخسارة التحقق (أوقف مبكراً إن تباعدت)، وأخذ عينات من التوليدات يدوياً بشكل دوري — التشويش وحده لن يرصد أعطال "انخفاض الخسارة تقنياً لكن المخرجات غير قابلة للاستخدام".</li>
            <li><strong>التقييم الصحيح.</strong> شغّل النموذج المضبوط دقيقاً على معيار قياسي خاص بالمهمة محجوز مسبقاً. للمحادثة، استخدم <Eng>LLM-as-a-judge</Eng> مقارنةً بمخرجات الخط الأساسي. للمهام المنظمة، تحقق من معدلات الامتثال للتنسيق والدقة.</li>
            <li><strong>الدمج والتصدير.</strong> اختيارياً ادمج أوزان <Eng>LoRA</Eng> في النموذج الأساسي للحصول على نقطة تفتيش واحدة نظيفة لا تتطلب تكلفة استدلال <Eng>LoRA</Eng>.</li>
          </ol>
          <p>أسباب الفشل الشائعة: تهبط خسارة التدريب لكن النموذج يتجاهل التعليمات (قالب المحادثة طُبِّق بشكل غير صحيح)؛ النموذج يُخرج بأسلوب واحد فقط (تنوع منخفض في بيانات التدريب)؛ النسيان الكارثي للقدرات العامة (معدل التعلم مرتفع جداً، أو تدرّب لعصور كثيرة جداً). قارن دائماً المخرجات مع النموذج الأساسي للتحقق السليم من الاكتسابات والانتكاسات.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "When is fine-tuning preferred over RAG?", ar: "متى يُفضَّل الضبط الدقيق على RAG؟" },
      options: {
        en: ["When the model needs access to private documents", "When you need to instill a consistent output format or tone", "When recent news must be included", "When the GPU is too small"],
        ar: ["حين يحتاج النموذج للوصول لمستندات خاصة", "حين تحتاج لإرساء تنسيق مخرجات أو نبرة متسقة", "حين يجب تضمين أخبار حديثة", "حين يكون الـGPU صغيراً جداً"]
      },
      correctIndex: 1
    },
    {
      question: { en: "In LoRA, the frozen base model weights are augmented by:", ar: "في LoRA، أوزان النموذج الأساسي المجمَّدة تُعزَّز بـ:" },
      options: {
        en: ["A new optimizer", "Two low-rank matrices A and B whose product approximates the weight update", "Extra attention heads", "A copy of the model in fp32"],
        ar: ["محسِّن جديد", "مصفوفتين منخفضتي الرتبة A وB ضربهما يُقرِّب تحديث الوزن", "رؤوس انتباه إضافية", "نسخة من النموذج بـ fp32"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What does QLoRA do differently from LoRA?", ar: "ما الذي يفعله QLoRA بشكل مختلف عن LoRA؟" },
      options: {
        en: ["It uses a higher rank for adapters", "It quantizes the frozen base model to 4-bit, enabling training on much less VRAM", "It trains all layers simultaneously", "It removes the need for chat templates"],
        ar: ["يستخدم رتبة أعلى للمحوّلات", "يُكمِّم النموذج الأساسي المجمَّد إلى 4-بت مما يُتيح التدريب بـVRAM أقل بكثير", "يُدرِّب جميع الطبقات في آنٍ واحد", "يُزيل الحاجة لقوالب المحادثة"]
      },
      correctIndex: 1
    },
    {
      question: { en: "For a large 70B model, approximately how many high-quality samples can produce good fine-tuning results?", ar: "لنموذج كبير 70B، كم عينة عالية الجودة يمكنها إنتاج نتائج ضبط دقيق جيدة تقريباً؟" },
      options: {
        en: ["At least 1 million", "Around 1,000", "Exactly 100", "10 million or more"],
        ar: ["مليون على الأقل", "حوالي 1,000", "100 بالضبط", "10 ملايين أو أكثر"]
      },
      correctIndex: 1
    },
    {
      question: { en: "The LoRA alpha hyperparameter is typically set to:", ar: "معلمة ألفا الفائقة في LoRA تُعيَّن عادةً على:" },
      options: {
        en: ["1", "2× the rank (r)", "0.0001", "Equal to the learning rate"],
        ar: ["1", "ضعفَي الرتبة (r)", "0.0001", "مساوية لمعدل التعلم"]
      },
      correctIndex: 1
    }
  ]
};
