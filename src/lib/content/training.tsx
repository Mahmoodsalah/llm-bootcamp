import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';

export const trainingModule: ModuleDef = {
  id: "training",
  title: { en: "Training an LLM from Scratch", ar: "تدريب نموذج لغوي من الصفر" },
  description: {
    en: "Data pipelines, the loss function, optimizers, scaling laws, fine-tuning, and RLHF.",
    ar: "خط البيانات ودالة الخسارة والمُحسِّنات وقوانين التوسع والضبط الدقيق وRLHF."
  },
  lessons: [
    {
      id: "data",
      title: { en: "The Data Pipeline", ar: "خط أنابيب البيانات" },
      content: {
        en: <>
          <p>An LLM is a compressed reflection of its training data. Frontier models train on <strong>10–15 trillion tokens</strong> (Llama 3: 15T). Getting there is mostly a data-engineering problem:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>Collection:</strong> web crawls (Common Crawl is the backbone), code (GitHub), books, papers, Wikipedia, and increasingly licensed and synthetic data.</li>
            <li><strong>Extraction:</strong> strip HTML boilerplate, ads, navigation. Bad extraction = a model that speaks "cookie banner".</li>
            <li><strong>Quality filtering:</strong> heuristics (length, symbol ratio, repetition) plus <em>model-based filters</em> — a small classifier trained to score "does this look like a textbook page or spam?". Quality filtering is the single highest-leverage step: Phi models proved a small model on curated "textbook-quality" data beats bigger models on raw web.</li>
            <li><strong>Deduplication:</strong> exact (hashing) and fuzzy (MinHash) dedup. Duplicated documents cause memorization, wasted compute, and benchmark contamination.</li>
            <li><strong>Decontamination:</strong> remove test sets of public benchmarks, or your eval numbers are lies.</li>
            <li><strong>Mixing:</strong> decide proportions (e.g. 50% web, 20% code, 10% multilingual…). Code data measurably improves <em>reasoning</em>, even for non-coding tasks. The mixture is tuned via small-scale proxy experiments.</li>
          </ol>
          <p>Rule of thumb: the team building a serious LLM spends more engineer-hours on data than on model code.</p>
        </>,
        ar: <>
          <p>النموذج اللغوي هو انعكاس مضغوط لبيانات تدريبه. النماذج الرائدة تتدرب على <strong>10–15 تريليون رمز</strong> (Llama 3: 15 تريليون). الوصول لذلك مشكلة هندسة بيانات في الأساس:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>الجمع:</strong> زحف الويب (<Eng>Common Crawl</Eng> هو العمود الفقري)، الكود (GitHub)، الكتب، الأبحاث، ويكيبيديا، وبشكل متزايد بيانات مرخصة واصطناعية.</li>
            <li><strong>الاستخراج:</strong> إزالة قوالب HTML والإعلانات والقوائم. استخراج سيئ = نموذج يتحدث بلغة "لافتات الكوكيز".</li>
            <li><strong>ترشيح الجودة:</strong> قواعد بسيطة (الطول، نسبة الرموز، التكرار) + <em>مرشحات نموذجية</em> — مصنِّف صغير يقيّم "هل يبدو هذا كصفحة كتاب دراسي أم سبام؟". الترشيح هو الخطوة الأعلى تأثيرًا: نماذج Phi أثبتت أن نموذجًا صغيرًا على بيانات منتقاة "بجودة الكتب" يتفوق على نماذج أكبر على ويب خام.</li>
            <li><strong>إزالة التكرار:</strong> مطابقة تامة (<Eng>hashing</Eng>) وضبابية (<Eng>MinHash</Eng>). المستندات المكررة تسبب الحفظ الحرفي وهدر الحساب وتلوث الاختبارات.</li>
            <li><strong>إزالة التلوث:</strong> حذف أسئلة الاختبارات المعيارية العامة، وإلا فأرقام التقييم أكاذيب.</li>
            <li><strong>الخلط:</strong> تحديد النسب (مثلاً 50% ويب، 20% كود، 10% لغات أخرى…). بيانات الكود تحسّن <em>الاستدلال</em> بشكل ملموس حتى للمهام غير البرمجية. تُضبط الخلطة عبر تجارب صغيرة تمثيلية.</li>
          </ol>
          <p>قاعدة عملية: فريق بناء نموذج جاد يقضي في البيانات ساعات هندسية أكثر مما يقضي في كود النموذج.</p>
        </>
      }
    },
    {
      id: "objective",
      title: { en: "The Objective: Next-Token Prediction", ar: "الهدف: التنبؤ بالرمز التالي" },
      content: {
        en: <>
          <p>Pretraining has exactly one task: given tokens 1…n, predict token n+1. The loss is <strong>cross-entropy</strong>: −log(probability the model assigned to the true next token).</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>Perfect prediction (p = 1) → loss 0. Assigning the true token p = 0.01 → loss ≈ 4.6. The model is punished in proportion to its surprise.</li>
            <li>Thanks to the causal mask, <em>every position in the sequence is a training example simultaneously</em> — a 8k-token document gives 8k predictions in one forward pass. This efficiency is why the transformer won.</li>
            <li><strong>Perplexity</strong> = e^loss = "the model is as confused as if choosing uniformly among N tokens". A perplexity of 8 means ≈ choosing among 8 plausible options per step.</li>
          </ul>
          <p>Why does such a "dumb" objective produce reasoning? Because predicting the next token of <em>all human text</em> requires implicitly modeling grammar, facts, code semantics, and the intentions of writers. Compression forces understanding — a model that truly "gets" arithmetic predicts the digits of "17 × 23 =" better than one that memorizes.</p>
          <p>One practical detail: documents are packed back-to-back into fixed-length rows (e.g. 8192 tokens) separated by an <code>&lt;|endoftext|&gt;</code> token, so no GPU cycle is wasted on padding.</p>
        </>,
        ar: <>
          <p>للتدريب المسبق مهمة واحدة بالضبط: بمعرفة الرموز 1…n، تنبأ بالرمز n+1. الخسارة هي <Eng>cross-entropy</Eng>: −log(الاحتمال الذي أعطاه النموذج للرمز الصحيح التالي).</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>تنبؤ مثالي (p = 1) ← خسارة 0. إعطاء الرمز الصحيح p = 0.01 ← خسارة ≈ 4.6. يُعاقَب النموذج بقدر مفاجأته.</li>
            <li>بفضل القناع السببي، <em>كل موقع في التسلسل هو مثال تدريبي في نفس الوقت</em> — مستند من 8 آلاف رمز يعطي 8 آلاف تنبؤ في تمريرة واحدة. هذه الكفاءة هي سبب فوز المحول.</li>
            <li><strong><Eng>Perplexity</Eng></strong> = e^الخسارة = "النموذج محتار كأنه يختار عشوائيًا بين N رمزًا". قيمة 8 تعني ≈ الاختيار بين 8 خيارات معقولة في كل خطوة.</li>
          </ul>
          <p>لماذا ينتج هدف "ساذج" كهذا قدرة على الاستدلال؟ لأن التنبؤ بالرمز التالي في <em>كل نصوص البشر</em> يتطلب نمذجة ضمنية للقواعد والحقائق ودلالات الكود ونوايا الكُتّاب. الضغط يفرض الفهم — النموذج الذي "يفهم" الحساب فعلاً يتنبأ بأرقام "17 × 23 =" أفضل ممن يحفظ.</p>
          <p>تفصيلة عملية: تُرصّ المستندات خلف بعضها في صفوف ثابتة الطول (مثلاً 8192 رمزًا) يفصلها رمز <code>&lt;|endoftext|&gt;</code>، فلا تُهدر دورة GPU على الحشو.</p>
        </>
      },
      math: {
        en: <p>L = −(1/N) Σₜ log p<sub>θ</sub>(xₜ | x₁…xₜ₋₁). Perplexity = exp(L). Frontier pretraining ends around L ≈ 1.7–2.0 nats/token on held-out web text. The gradient ∂L/∂logits = p − onehot(true): beautifully simple — push probability mass from wrong tokens onto the right one.</p>,
        ar: <p>L = −(1/N) Σₜ log p<sub>θ</sub>(xₜ | x₁…xₜ₋₁). و<Eng>Perplexity</Eng> = exp(L). التدريب المسبق للنماذج الرائدة ينتهي حول L ≈ 1.7–2.0 لكل رمز على نص ويب محجوز. الاشتقاق ∂L/∂logits = p − onehot(الصحيح): بساطة جميلة — انقل كتلة الاحتمال من الرموز الخاطئة إلى الصحيح.</p>
      }
    },
    {
      id: "optimizer",
      title: { en: "Optimizers, LR Schedules & Stability", ar: "المُحسِّنات وجداول التعلم والاستقرار" },
      content: {
        en: <>
          <p>Training = repeat billions of times: forward pass → compute loss → backpropagate gradients → update weights. The updater is almost always <strong>AdamW</strong>:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>Keeps two running averages per parameter: the gradient's <em>mean</em> (momentum) and its <em>variance</em> (adaptive step size). Parameters with noisy gradients get smaller steps.</li>
            <li>Cost: 2 extra states per parameter. In FP32 that's <strong>8 bytes/param</strong> — a 70B model needs ~560GB just for optimizer states. This (not the weights!) is why training needs GPU clusters even when inference doesn't.</li>
            <li>"W" = decoupled <strong>weight decay</strong>: gently shrink all weights each step — regularization against memorizing.</li>
          </ul>
          <p><strong>The learning-rate schedule</strong> is the most sensitive hyperparameter:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Warmup</strong> (first ~2000 steps): ramp LR from 0. Early gradients are garbage; a full-size step would destroy the random init irrecoverably.</li>
            <li><strong>Cosine decay</strong> to ~10% of peak: big steps early (explore), small steps late (settle into a minimum).</li>
            <li><strong>Gradient clipping</strong> (norm ≤ 1.0): one bad batch can produce a huge gradient that catapults the weights. Clipping caps the step size.</li>
          </ul>
          <p>Stability at scale is a real battle: loss <em>spikes</em> happen after weeks of training. Teams checkpoint constantly, and on a spike they rewind, skip the offending data batch, and continue. Mixed precision (BF16 compute + FP32 master weights) balances speed and numerical safety.</p>
        </>,
        ar: <>
          <p>التدريب = كرر مليارات المرات: تمريرة أمامية ← حساب الخسارة ← نشر عكسي للاشتقاقات ← تحديث الأوزان. المُحدِّث دائمًا تقريبًا هو <Eng>AdamW</Eng>:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>يحتفظ بمتوسطين جاريين لكل معامل: <em>متوسط</em> الاشتقاق (الزخم) و<em>تباينه</em> (حجم خطوة تكيفي). المعاملات ذات الاشتقاقات المشوشة تحصل على خطوات أصغر.</li>
            <li>التكلفة: حالتان إضافيتان لكل معامل. بدقة FP32 هذا <strong>8 بايت/معامل</strong> — نموذج 70B يحتاج ~560 جيجابايت لحالات المُحسِّن وحدها. هذا (لا الأوزان!) هو سبب حاجة التدريب لعناقيد GPU حتى عندما لا يحتاجها التشغيل.</li>
            <li>حرف "W" = <strong>اضمحلال الأوزان</strong> المنفصل: تقليص كل الأوزان قليلاً كل خطوة — تنظيم ضد الحفظ الحرفي.</li>
          </ul>
          <p><strong>جدول معدل التعلم</strong> هو أكثر المعاملات الفائقة حساسية:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الإحماء (<Eng>Warmup</Eng>)</strong> (أول ~2000 خطوة): رفع تدريجي من صفر. الاشتقاقات المبكرة عشوائية؛ خطوة كاملة الحجم ستدمر التهيئة العشوائية بلا رجعة.</li>
            <li><strong>اضمحلال جيب التمام (<Eng>Cosine decay</Eng>)</strong> حتى ~10% من الذروة: خطوات كبيرة أولاً (استكشاف)، صغيرة أخيرًا (استقرار في حد أدنى).</li>
            <li><strong>قصّ الاشتقاق (<Eng>Gradient clipping</Eng>)</strong> (معيار ≤ 1.0): دفعة بيانات سيئة واحدة قد تنتج اشتقاقًا ضخمًا يقذف الأوزان بعيدًا. القصّ يحدّ حجم الخطوة.</li>
          </ul>
          <p>الاستقرار على نطاق واسع معركة حقيقية: <em>قفزات</em> الخسارة تحدث بعد أسابيع تدريب. الفرق تحفظ نقاط استعادة باستمرار، وعند قفزة تعود للخلف، تتخطى دفعة البيانات المسببة، وتكمل. الدقة المختلطة (حساب BF16 + أوزان رئيسية FP32) توازن السرعة والأمان العددي.</p>
        </>
      },
      math: {
        en: <p>AdamW: m = β₁m + (1−β₁)g; v = β₂v + (1−β₂)g²; θ = θ − η·(m̂/(√v̂ + ε) + λθ). Typical: β₁ = 0.9, β₂ = 0.95, peak η ≈ 3e-4 (7B) down to ~1.5e-4 (70B) — bigger models need smaller learning rates.</p>,
        ar: <p><Eng>AdamW</Eng>: m = β₁m + (1−β₁)g؛ v = β₂v + (1−β₂)g²؛ θ = θ − η·(m̂/(√v̂ + ε) + λθ). القيم المعتادة: β₁ = 0.9، β₂ = 0.95، ذروة η ≈ 3e-4 لنموذج 7B وتنخفض إلى ~1.5e-4 لنموذج 70B — النماذج الأكبر تحتاج معدلات تعلم أصغر.</p>
      }
    },
    {
      id: "scaling",
      title: { en: "Scaling Laws & Compute Budgets", ar: "قوانين التوسع وميزانيات الحساب" },
      content: {
        en: <>
          <p>Before spending $50M on a training run you must answer: <em>given a compute budget, how big should the model be, and how much data does it need?</em> Scaling laws answer this empirically — loss falls as a smooth power law in model size, data, and compute.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Chinchilla (2022):</strong> compute-optimal training uses ≈ <strong>20 tokens per parameter</strong>. GPT-3 (175B on 300B tokens, 1.7 tok/param) was badly undertrained — Chinchilla (70B on 1.4T) beat it with the same compute.</li>
            <li><strong>The inference correction:</strong> Chinchilla optimizes <em>training</em> compute only. If a model will serve billions of requests, a smaller model trained far longer is cheaper overall. Llama 3 8B trained on 15T tokens = <strong>1875 tok/param</strong> — hugely "overtrained" by Chinchilla, and exactly right for deployment economics.</li>
            <li><strong>Compute accounting:</strong> training FLOPs ≈ 6 × N × D (N params, D tokens). Llama-3-70B: 6 × 70e9 × 15e12 ≈ 6.3e24 FLOPs ≈ 4 months on 6,000 H100s.</li>
          </ul>
          <p>Scaling laws are also the everyday tool for <em>de-risking decisions</em>: test a data mixture or architecture change at 100M scale, fit the curve, extrapolate to 70B. If the curves cross, your cheap experiment just predicted the expensive outcome.</p>
        </>,
        ar: <>
          <p>قبل إنفاق 50 مليون دولار على تدريب يجب أن تجيب: <em>بميزانية حسابية معينة، ما الحجم الأمثل للنموذج وكم يحتاج من البيانات؟</em> قوانين التوسع تجيب تجريبيًا — الخسارة تنخفض كقانون قوى سلس مع حجم النموذج والبيانات والحساب.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Chinchilla (2022):</strong> التدريب الأمثل حسابيًا يستخدم ≈ <strong>20 رمزًا لكل معامل</strong>. كان GPT-3 (175B على 300 مليار رمز، أي 1.7 رمز/معامل) ناقص التدريب بشدة — تفوق عليه Chinchilla (70B على 1.4 تريليون) بنفس الحساب.</li>
            <li><strong>تصحيح التشغيل:</strong> Chinchilla يُحسِّن حساب <em>التدريب</em> فقط. إذا كان النموذج سيخدم مليارات الطلبات، فنموذج أصغر مدرَّب أطول بكثير أرخص إجمالاً. تدرب Llama 3 8B على 15 تريليون رمز = <strong>1875 رمز/معامل</strong> — "مفرط التدريب" جدًا بمعيار Chinchilla، وصحيح تمامًا لاقتصاديات النشر.</li>
            <li><strong>محاسبة الحساب:</strong> عمليات التدريب ≈ 6 × N × D (المعاملات × الرموز). Llama-3-70B: 6 × 70e9 × 15e12 ≈ 6.3e24 عملية ≈ 4 أشهر على 6000 كارت H100.</li>
          </ul>
          <p>قوانين التوسع أيضًا الأداة اليومية <em>لتقليل المخاطر</em>: جرّب خلطة بيانات أو تغييرًا معماريًا على نطاق 100 مليون معامل، ارسم المنحنى، ومدّه إلى 70 مليارًا. إذا تقاطعت المنحنيات، فتجربتك الرخيصة تنبأت بالنتيجة الغالية.</p>
        </>
      },
      math: {
        en: <p>Chinchilla loss model: L(N, D) = E + A/N^α + B/D^β with α ≈ 0.34, β ≈ 0.28, E ≈ 1.69 (irreducible entropy of text). Minimizing under 6ND = C gives N ∝ C^0.5 and D ∝ C^0.5 — scale model and data equally.</p>,
        ar: <p>نموذج خسارة Chinchilla: L(N, D) = E + A/N^α + B/D^β حيث α ≈ 0.34، β ≈ 0.28، E ≈ 1.69 (الإنتروبيا غير القابلة للاختزال للنص). التصغير تحت قيد 6ND = C يعطي N ∝ C^0.5 وD ∝ C^0.5 — وسّع النموذج والبيانات بالتساوي.</p>
      }
    },
    {
      id: "finetune",
      title: { en: "SFT & Parameter-Efficient Fine-Tuning (LoRA)", ar: "الضبط الدقيق وLoRA" },
      content: {
        en: <>
          <p>A pretrained "base" model only continues text — ask it a question and it may reply with three more questions (that's what internet text looks like). Turning it into an assistant starts with <strong>Supervised Fine-Tuning (SFT)</strong>:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>Train on tens of thousands of high-quality (instruction → response) pairs, formatted with a <strong>chat template</strong> (special tokens marking system/user/assistant turns).</li>
            <li>The loss is <em>masked to response tokens only</em> — the model learns to write answers, not to imitate user questions.</li>
            <li>Quality ≫ quantity: 10k excellent examples beat 1M mediocre ones (the LIMA result). SFT teaches <em>style and format</em>; knowledge mostly comes from pretraining.</li>
          </ul>
          <p><strong>LoRA</strong> makes fine-tuning affordable. Instead of updating all 7B weights (which needs optimizer states = ~112GB), freeze the model and inject small trainable matrices:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>Each weight update is factored as ΔW = B·A where A is r×d and B is d×r with rank r ≈ 8–64. For d = 4096, r = 16: 2 × 4096×16 ≈ 131k params instead of 16.7M per matrix — <strong>~1% of the parameters</strong>.</li>
            <li><strong>QLoRA</strong> goes further: keep the frozen base in 4-bit, train LoRA adapters in 16-bit on top → fine-tune a 70B model on a single 48GB GPU.</li>
            <li>Deployment bonus: adapters are tiny files (~100MB); one base model can serve many customers' adapters, swapped per request.</li>
          </ul>
        </>,
        ar: <>
          <p>النموذج "الأساسي" المدرَّب مسبقًا يكمل النص فقط — اسأله سؤالاً وقد يرد بثلاثة أسئلة أخرى (هكذا يبدو نص الإنترنت). تحويله لمساعد يبدأ بـ <strong>الضبط الدقيق المُشرَف (<Eng>SFT</Eng>)</strong>:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>تدريب على عشرات آلاف الأزواج عالية الجودة (تعليمة ← إجابة)، منسقة بـ <strong>قالب محادثة (<Eng>chat template</Eng>)</strong>: رموز خاصة تحدد أدوار النظام/المستخدم/المساعد.</li>
            <li>الخسارة <em>مقنَّعة على رموز الإجابة فقط</em> — يتعلم النموذج كتابة الإجابات لا تقليد أسئلة المستخدم.</li>
            <li>الجودة ≫ الكمية: عشرة آلاف مثال ممتاز تتفوق على مليون متوسط (نتيجة LIMA). الـ <Eng>SFT</Eng> يعلّم <em>الأسلوب والتنسيق</em>؛ المعرفة تأتي أساسًا من التدريب المسبق.</li>
          </ul>
          <p><strong><Eng>LoRA</Eng></strong> يجعل الضبط الدقيق في المتناول. بدل تحديث كل أوزان 7B (يتطلب حالات مُحسِّن ≈ 112 جيجابايت)، جمّد النموذج واحقن مصفوفات صغيرة قابلة للتدريب:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>كل تحديث وزن يُحلَّل إلى ΔW = B·A حيث A بحجم r×d وB بحجم d×r برتبة r ≈ 8–64. لـ d = 4096 وr = 16: نحو 131 ألف معامل بدل 16.7 مليون لكل مصفوفة — <strong>~1% من المعاملات</strong>.</li>
            <li><strong><Eng>QLoRA</Eng></strong> يذهب أبعد: أبقِ الأساس المجمد بدقة 4-بت ودرّب محولات <Eng>LoRA</Eng> بدقة 16-بت فوقه ← ضبط نموذج 70B على كارت واحد بذاكرة 48 جيجابايت.</li>
            <li>ميزة نشر: المحولات ملفات صغيرة (~100 ميجابايت)؛ نموذج أساسي واحد يخدم محولات عملاء كثيرين تُبدَّل مع كل طلب.</li>
          </ul>
        </>
      },
      math: {
        en: <p>LoRA: h = Wx + (α/r)·B·A·x, with A ~ N(0, σ²) and B = 0 at init (so training starts as identity). Trainable fraction = 2rd/(d²) = 2r/d; for r = 16, d = 4096 → 0.8%. At serving time merge W' = W + BA — zero extra latency.</p>,
        ar: <p><Eng>LoRA</Eng>: h = Wx + (α/r)·B·A·x، حيث A عشوائية وB = 0 عند البداية (فيبدأ التدريب كتحويل محايد). نسبة المعاملات المدرَّبة = 2r/d؛ لـ r = 16 وd = 4096 ← 0.8%. عند التشغيل ندمج W' = W + BA — صفر تأخير إضافي.</p>
      }
    },
    {
      id: "rlhf",
      title: { en: "Alignment: RLHF & DPO", ar: "المواءمة: RLHF وDPO" },
      content: {
        en: <>
          <p>SFT teaches the model to <em>answer</em>; alignment teaches it to answer the way humans <em>prefer</em> — helpful, honest, harmless. The classic pipeline is <strong>RLHF</strong> (Reinforcement Learning from Human Feedback):</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>Collect preferences:</strong> for each prompt, sample 2+ model answers; human labelers pick the better one. This is easier and more reliable than asking humans to write perfect answers.</li>
            <li><strong>Train a Reward Model:</strong> a copy of the LLM with a scalar head, trained so score(chosen) &gt; score(rejected). It becomes a learned proxy for human taste.</li>
            <li><strong>RL (PPO):</strong> the policy model generates answers, the reward model scores them, PPO nudges the policy toward higher reward — with a <strong>KL penalty</strong> keeping it close to the SFT model. Without the KL leash the policy finds <em>reward hacks</em>: sycophancy, confident-sounding nonsense, endless hedging.</li>
          </ol>
          <p><strong>DPO (Direct Preference Optimization)</strong> collapses steps 2–3 into one supervised loss applied directly to the preference pairs: raise the likelihood of chosen answers, lower that of rejected ones, relative to a frozen reference model. No reward model, no RL loop, far more stable — which is why most open models use DPO or its variants today.</p>
          <p>The current frontier extends this with <strong>RLVR</strong> (RL with verifiable rewards): for math and code, correctness can be <em>checked automatically</em> (run the tests, verify the answer), giving unhackable reward signals — the engine behind reasoning models.</p>
        </>,
        ar: <>
          <p>الـ <Eng>SFT</Eng> يعلّم النموذج أن <em>يجيب</em>؛ والمواءمة تعلّمه أن يجيب كما <em>يفضّل</em> البشر — مفيدًا وصادقًا وغير مؤذٍ. الخط الكلاسيكي هو <strong><Eng>RLHF</Eng></strong> (التعلم المعزز من ملاحظات البشر):</p>
            <ol className="list-decimal ps-6 space-y-1">
            <li><strong>جمع التفضيلات:</strong> لكل سؤال نسحب إجابتين أو أكثر من النموذج؛ يختار المقيّمون البشر الأفضل. هذا أسهل وأدق من مطالبة البشر بكتابة إجابات مثالية.</li>
            <li><strong>تدريب نموذج المكافأة:</strong> نسخة من النموذج برأس رقمي واحد، تُدرَّب بحيث درجة(المُختار) &gt; درجة(المرفوض). يصبح وكيلًا مُتعلَّمًا لذوق البشر.</li>
            <li><strong>التعلم المعزز (<Eng>PPO</Eng>):</strong> نموذج السياسة يولّد إجابات، نموذج المكافأة يقيّمها، و<Eng>PPO</Eng> يدفع السياسة نحو مكافأة أعلى — مع <strong>عقوبة KL</strong> تبقيه قريبًا من نموذج الـ <Eng>SFT</Eng>. بدون هذا اللجام يجد النموذج <em>ثغرات المكافأة</em>: التملق، هراء بنبرة واثقة، وتحفظ لا ينتهي.</li>
          </ol>
          <p><strong><Eng>DPO</Eng></strong> يدمج الخطوتين 2–3 في خسارة مُشرَفة واحدة تطبَّق مباشرة على أزواج التفضيل: ارفع احتمال الإجابات المختارة واخفض المرفوضة، نسبةً إلى نموذج مرجعي مجمد. لا نموذج مكافأة ولا حلقة تعلم معزز، واستقرار أعلى بكثير — لذلك تستخدمه أغلب النماذج المفتوحة اليوم.</p>
          <p>الحدود الحالية تمتد بـ <strong><Eng>RLVR</Eng></strong> (تعلم معزز بمكافآت قابلة للتحقق): في الرياضيات والكود يمكن <em>فحص الصحة آليًا</em> (شغّل الاختبارات، تحقق من الناتج)، فتكون إشارات المكافأة غير قابلة للتحايل — وهذا محرك نماذج الاستدلال.</p>
        </>
      },
      math: {
        en: <p>Reward model loss: −log σ(r(x, y_chosen) − r(x, y_rejected)). RLHF objective: max E[r(x, y)] − β·KL(π ‖ π_SFT). DPO loss: −log σ(β·[log π(y_c|x)/π_ref(y_c|x) − log π(y_r|x)/π_ref(y_r|x)]) — the reward model is implicit in the likelihood ratios.</p>,
        ar: <p>خسارة نموذج المكافأة: −log σ(r(x, y_المختار) − r(x, y_المرفوض)). هدف <Eng>RLHF</Eng>: تعظيم E[r(x, y)] − β·KL(π ‖ π_SFT). خسارة <Eng>DPO</Eng>: −log σ(β·[log نسبة احتمال المختار − log نسبة احتمال المرفوض]) — نموذج المكافأة ضمني في نسب الاحتمال.</p>
      }
    }
  ],
  quiz: [
    {
      question: { en: "What is the single highest-leverage step in the data pipeline?", ar: "ما الخطوة الأعلى تأثيرًا في خط البيانات؟" },
      options: {
        en: ["Collecting more raw web data", "Quality filtering", "Compressing files", "Sorting alphabetically"],
        ar: ["جمع المزيد من الويب الخام", "ترشيح الجودة", "ضغط الملفات", "الترتيب الأبجدي"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Pretraining loss is:", ar: "خسارة التدريب المسبق هي:" },
      options: {
        en: ["Mean squared error on embeddings", "Cross-entropy of next-token prediction", "Cosine similarity", "Human ratings"],
        ar: ["مربع الخطأ على التضمين", "cross-entropy للتنبؤ بالرمز التالي", "تشابه جيب التمام", "تقييمات بشرية"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why does training need far more GPU memory than inference?", ar: "لماذا يحتاج التدريب ذاكرة GPU أكبر بكثير من التشغيل؟" },
      options: {
        en: ["Bigger vocabulary", "Optimizer states + gradients + activations", "Longer prompts", "More users"],
        ar: ["قاموس أكبر", "حالات المُحسِّن + الاشتقاقات + التفعيلات", "أوامر أطول", "مستخدمون أكثر"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Chinchilla-optimal training uses roughly:", ar: "التدريب الأمثل حسب Chinchilla يستخدم تقريبًا:" },
      options: {
        en: ["2 tokens per parameter", "20 tokens per parameter", "200 tokens per parameter", "1 token per parameter"],
        ar: ["رمزين لكل معامل", "20 رمزًا لكل معامل", "200 رمز لكل معامل", "رمزًا واحدًا لكل معامل"]
      },
      correctIndex: 1
    },
    {
      question: { en: "LoRA reduces fine-tuning cost by:", ar: "يقلل LoRA تكلفة الضبط الدقيق عبر:" },
      options: {
        en: ["Deleting layers", "Training small low-rank matrices while freezing the base", "Using a smaller vocabulary", "Skipping the loss function"],
        ar: ["حذف طبقات", "تدريب مصفوفات صغيرة منخفضة الرتبة مع تجميد الأساس", "استخدام قاموس أصغر", "تخطي دالة الخسارة"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What keeps the RLHF policy from reward-hacking?", ar: "ما الذي يمنع سياسة RLHF من التحايل على المكافأة؟" },
      options: {
        en: ["Bigger batch size", "The KL penalty toward the SFT model", "More GPUs", "Higher temperature"],
        ar: ["دفعات أكبر", "عقوبة KL نحو نموذج SFT", "كروت شاشة أكثر", "حرارة أعلى"]
      },
      correctIndex: 1
    }
  ]
};
