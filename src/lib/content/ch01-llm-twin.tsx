import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import FTIPipeline from '../../components/widgets/FTIPipeline';


export const llmTwinModule: ModuleDef = {
  id: "1",
  title: { en: "The LLM Twin & FTI Architecture", ar: "توأم LLM ومعمارية FTI" },
  description: {
    en: "What an LLM Twin is, why production ML systems need more than a model, and how the Feature/Training/Inference pipeline architecture solves the hard problems.",
    ar: "ما هو توأم LLM، ولماذا تحتاج أنظمة ML الإنتاجية إلى أكثر من مجرد نموذج، وكيف تحل معمارية خطوط الميزات/التدريب/الاستدلال المشكلات الصعبة."
  },
  lessons: [
    {
      id: "what-is-llm-twin",
      title: { en: "What Is an LLM Twin?", ar: "ما هو توأم LLM؟" },
      content: {
        en: <>
          <p>An <strong>LLM Twin</strong> is an AI character that learns to write the way <em>you</em> write — capturing your vocabulary, sentence rhythm, and perspective — by being fine-tuned on your own digital footprint: blog posts, social threads, code comments, or articles you have already published. Think of it as style transfer applied to your personal voice instead of a painting technique.</p>
          <p>The key insight is that <em>a language model reflects the data it was trained on</em>. A generic model trained on the whole internet produces generic, averaged-out prose. A model trained specifically on your writing inherits the quirks, depth, and tone that make your content recognisable. The goal is not to build a copy of you — much of who you are is invisible to text — but to build a <strong>writing co-pilot</strong> that captures your public voice well enough to accelerate content creation without erasing your identity.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>What it is not:</strong> a chatbot impersonating you to others. The LLM Twin is a productivity tool — you supply the idea skeleton, it drafts the prose in your style, you review and publish.</li>
            <li><strong>Data sources:</strong> LinkedIn posts, Medium / Substack articles, GitHub README files, or any public writing corpus you own. The richer and more diverse the corpus, the more facets of your voice the model captures.</li>
            <li><strong>Why not just use ChatGPT?</strong> Generic models are famously verbose and impersonal. More practically, they cannot automatically fetch your past writing as context, deduplicate ideas you have already covered, or replicate your formatting preferences across sessions.</li>
          </ul>
          <p>Building an LLM Twin is also a perfect vehicle for learning <em>production ML engineering</em>, because it exercises every stage of the machine learning lifecycle: data collection, cleaning, fine-tuning, retrieval-augmented generation, serving, and monitoring.</p>
        </>,
        ar: <>
          <p><strong>توأم LLM</strong> هو شخصية ذكاء اصطناعي تتعلم الكتابة بأسلوبك أنت — التقاط مفرداتك وإيقاع جملك ووجهة نظرك — من خلال ضبطها الدقيق على بصمتك الرقمية الخاصة: منشورات المدونات، والخيوط على منصات التواصل، وتعليقات الكود، أو المقالات التي نشرتها بالفعل. فكر في الأمر كنقل أسلوب مُطبَّق على صوتك الشخصي بدلاً من تقنية الرسم.</p>
          <p>الرؤية الجوهرية هي أن <em>نموذج اللغة يعكس البيانات التي دُرِّب عليها</em>. نموذج عام مدرَّب على كل الإنترنت ينتج نثراً متوسطاً وعاماً. نموذج مدرَّب تحديداً على كتاباتك يرث التفاصيل والعمق والنبرة التي تجعل محتواك مميزاً. الهدف ليس بناء نسخة منك — فكثير مما تكونه غير مرئي في النص — بل بناء <strong>مساعد كتابة</strong> يلتقط صوتك العام بما يكفي لتسريع إنشاء المحتوى دون محو هويتك.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>ما ليس هو:</strong> روبوت محادثة ينتحل شخصيتك أمام الآخرين. توأم LLM أداة إنتاجية — تقدم أنت الهيكل العظمي للفكرة، ويصيغ هو النثر بأسلوبك، ثم تراجع وتنشر.</li>
            <li><strong>مصادر البيانات:</strong> منشورات <Eng>LinkedIn</Eng>، ومقالات <Eng>Medium</Eng> / <Eng>Substack</Eng>، وملفات <Eng>README</Eng> على <Eng>GitHub</Eng>، أو أي مجموعة من كتاباتك العامة. كلما كانت المجموعة أغنى وأكثر تنوعاً، كلما التقط النموذج جوانب أكثر من صوتك.</li>
            <li><strong>لماذا لا نستخدم ChatGPT فقط؟</strong> النماذج العامة مطوَّلة وغير شخصية بشكل ملحوظ. علاوة على ذلك، لا يمكنها تلقائياً جلب كتاباتك السابقة كسياق، أو إلغاء تكرار أفكار غطيتها بالفعل، أو تكرار تفضيلاتك في التنسيق عبر الجلسات.</li>
          </ul>
          <p>بناء توأم <Eng>LLM</Eng> هو أيضاً وسيلة مثالية لتعلم <em>هندسة ML الإنتاجية</em>، لأنه يمارس كل مرحلة من مراحل دورة حياة تعلم الآلة: جمع البيانات والتنظيف والضبط الدقيق والتوليد المعزز بالاسترجاع والخدمة والمراقبة.</p>
        </>
      }
    },
    {
      id: "ml-system-challenges",
      title: { en: "Why Production ML Is Hard", ar: "لماذا ML الإنتاجي صعب؟" },
      content: {
        en: <>
          <p>Training a model on a static dataset is the <em>straightforward</em> part of an ML project. The hard part is everything around it. Before a model can reliably serve real users, a team must solve a long list of engineering problems that have nothing to do with model architecture or hyperparameter tuning:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Continuous data ingestion:</strong> real-world data changes — you publish new articles, trends shift, source formats update. The system must ingest, validate, and clean fresh data on a schedule without breaking existing features.</li>
            <li><strong>Training-serving skew:</strong> if the feature computation at training time differs even slightly from the computation at inference time, model accuracy collapses silently in production. This is one of the most common and hardest-to-debug failures in ML systems.</li>
            <li><strong>Infrastructure elasticity:</strong> training a 7B-parameter model needs GPU clusters; serving 100 concurrent users needs auto-scaling; a spike to 10 000 users should not require a rewrite. Each phase has entirely different compute characteristics.</li>
            <li><strong>Versioning:</strong> every dataset version, model checkpoint, and feature schema must be tracked so you can reproduce any past result and roll back a bad deployment safely.</li>
            <li><strong>Monitoring:</strong> once deployed, models drift as user behaviour evolves and the base model updates. Without active monitoring you will not know quality is degrading until users complain.</li>
          </ul>
          <p>A <strong>monolithic batch pipeline</strong> — the most common naive architecture — bundles feature creation, model training, and prediction into one codebase. It solves the skew problem by using identical code, but it creates severe scaling and reusability problems: any change to how features are computed forces a rewrite of the training and inference logic simultaneously, and the whole system must run on the same hardware.</p>
        </>,
        ar: <>
          <p>تدريب نموذج على مجموعة بيانات ثابتة هو الجزء <em>المباشر</em> من مشروع ML. الجزء الصعب هو كل ما حوله. قبل أن يتمكن النموذج من خدمة المستخدمين الحقيقيين بشكل موثوق، يجب على الفريق حل قائمة طويلة من مشكلات الهندسة التي لا علاقة لها ببنية النموذج أو ضبط المعاملات الفائقة:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>استيعاب البيانات المستمر:</strong> البيانات الواقعية تتغير — تنشر مقالات جديدة، وتتحول الاتجاهات، وتتحدث صيغ المصادر. يجب أن يستوعب النظام البيانات الجديدة ويتحقق منها وينظفها وفق جدول زمني دون كسر الميزات الموجودة.</li>
            <li><strong>الانحراف بين التدريب والخدمة:</strong> إذا اختلف حساب الميزة وقت التدريب ولو قليلاً عن الحساب وقت الاستدلال، تنهار دقة النموذج بصمت في الإنتاج. هذا من أكثر الأعطال شيوعاً وأصعبها تشخيصاً في أنظمة ML.</li>
            <li><strong>مرونة البنية التحتية:</strong> تدريب نموذج بسبعة مليارات معامل يحتاج مجموعات GPU؛ خدمة مئة مستخدم متزامن تحتاج توسعاً تلقائياً؛ ارتفاع إلى عشرة آلاف مستخدم لا ينبغي أن يستلزم إعادة كتابة. لكل مرحلة خصائص حوسبة مختلفة تماماً.</li>
            <li><strong>الإصدارات:</strong> يجب تتبع كل إصدار مجموعة بيانات ونقطة تفتيش نموذج ومخطط ميزة حتى تتمكن من إعادة إنتاج أي نتيجة سابقة والتراجع عن نشر خاطئ بأمان.</li>
            <li><strong>المراقبة:</strong> بمجرد النشر، تنجرف النماذج مع تطور سلوك المستخدم وتحديث النموذج الأساسي. بدون مراقبة فعّالة لن تعلم أن الجودة تتراجع حتى يشتكي المستخدمون.</li>
          </ul>
          <p><strong>الخط الأنبوبي الدفعي المتجانس</strong> — المعمارية الساذجة الأكثر شيوعاً — يجمع إنشاء الميزات والتدريب والتنبؤ في قاعدة كود واحدة. يحل مشكلة الانحراف باستخدام كود متطابق، لكنه يخلق مشاكل توسع وإعادة استخدام حادة: أي تغيير في كيفية حساب الميزات يجبر على إعادة كتابة منطق التدريب والاستدلال في آنٍ واحد.</p>
        </>
      }
    },
    {
      id: "fti-architecture",
      title: { en: "The FTI Pipeline Architecture", ar: "معمارية خط FTI" },
      content: {
        en: <>
          <p>The <strong>Feature / Training / Inference (FTI)</strong> architecture is a simple but powerful mind map: <em>every ML system can be decomposed into exactly three independent pipelines</em>, communicating through two shared data contracts — a <strong>feature store</strong> and a <strong>model registry</strong>.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Feature pipeline:</strong> ingests raw data → cleans and transforms it → stores versioned features and labels in the feature store. It runs on its own schedule and owns no knowledge of what model will consume its output.</li>
            <li><strong>Training pipeline:</strong> reads features and labels from the feature store → trains and evaluates a model → publishes passing model checkpoints to the model registry. It can be triggered manually or automatically when a new dataset version appears.</li>
            <li><strong>Inference pipeline:</strong> loads the approved model from the registry → fetches real-time features from the feature store → serves predictions via a REST API. It scales independently of training — you can add GPU replicas without touching the training code.</li>
          </ul>
          <p>The beauty of this separation is its <strong>interface stability</strong>: no matter how complex each pipeline becomes internally, its external contract never changes. The feature pipeline always writes to the feature store; the training pipeline always reads from it and writes to the registry; the inference pipeline always reads from both. Teams can own individual pipelines, each can be scaled and deployed separately, and rolling back a model is a single pointer change in the registry.</p>
          <p>This pattern mirrors the classic software separation into database, business logic, and UI — three layers, each with a defined interface, each replaceable without rewriting the others.</p>
        </>,
        ar: <>
          <p>معمارية <strong>الميزات / التدريب / الاستدلال (<Eng>FTI</Eng>)</strong> هي خريطة ذهنية بسيطة لكنها قوية: <em>يمكن تحليل كل نظام ML إلى ثلاثة خطوط أنابيب مستقلة بالضبط</em>، تتواصل عبر عقدين مشتركين للبيانات — <strong>مخزن الميزات</strong> و<strong>سجل النماذج</strong>.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>خط الميزات:</strong> يستوعب البيانات الخام → ينظفها ويحولها → يخزن الميزات والتسميات المصنوفة بإصدارات في مخزن الميزات. يعمل وفق جدوله الخاص ولا يعرف شيئاً عن النموذج الذي سيستهلك مخرجاته.</li>
            <li><strong>خط التدريب:</strong> يقرأ الميزات والتسميات من مخزن الميزات → يدرّب نموذجاً ويقيّمه → ينشر نقاط التفتيش الناجحة في سجل النماذج. يمكن تشغيله يدوياً أو تلقائياً عند ظهور إصدار مجموعة بيانات جديد.</li>
            <li><strong>خط الاستدلال:</strong> يحمّل النموذج المعتمد من السجل → يجلب الميزات في الوقت الحقيقي من مخزن الميزات → يخدم التنبؤات عبر واجهة <Eng>REST API</Eng>. يتوسع بشكل مستقل عن التدريب — يمكنك إضافة نسخ GPU دون لمس كود التدريب.</li>
          </ul>
          <p>جمال هذا الفصل هو <strong>استقرار الواجهة</strong>: بغض النظر عن مدى تعقيد كل خط داخلياً، لا تتغير عقوده الخارجية أبداً. خط الميزات يكتب دائماً في مخزن الميزات؛ خط التدريب يقرأ منه دائماً ويكتب في السجل؛ خط الاستدلال يقرأ من كليهما دائماً. يمكن للفرق امتلاك خطوط فردية، ويمكن توسيع ونشر كل منها بشكل منفصل.</p>
          <p>هذا النمط يعكس الفصل الكلاسيكي في البرمجيات إلى قاعدة بيانات ومنطق أعمال وواجهة مستخدم — ثلاث طبقات، لكل منها واجهة محددة، وكل منها قابلة للاستبدال دون إعادة كتابة الأخريات.</p>
        </>
      },
      widget: <FTIPipeline />
    },
    {
      id: "fti-applied",
      title: { en: "FTI Applied to the LLM Twin", ar: "تطبيق FTI على توأم LLM" },
      content: {
        en: <>
          <p>Mapping the LLM Twin onto the FTI architecture makes the system design concrete. The MVP has four distinct stages, two of which map to the feature pipeline:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>Data collection (ETL):</strong> crawlers pull articles, posts, and code from the internet and store raw documents in a MongoDB data warehouse. This is the raw-data layer sitting upstream of the feature pipeline.</li>
            <li><strong>Feature pipeline:</strong> reads raw documents from MongoDB, cleans and chunks text, embeds chunks with an embedding model, and writes vectors into a Qdrant vector database (the feature store). Also generates fine-tuning instruction datasets and saves them as versioned artifacts.</li>
            <li><strong>Training pipeline:</strong> reads instruction datasets from the artifact store, fine-tunes a base LLM (e.g. Llama 3.1 8B) using parameter-efficient methods, evaluates the candidate model, and publishes it to Hugging Face as the model registry.</li>
            <li><strong>Inference pipeline:</strong> exposes a REST API. At query time it loads the model from Hugging Face, retrieves the user's most relevant past embeddings from Qdrant (RAG), constructs a personalised prompt, and streams back the generated text.</li>
          </ol>
          <p>Practical system requirements follow directly from the architecture. <strong>Scalability:</strong> each pipeline scales independently — training on one A100 cluster while inference runs on a smaller auto-scaled fleet. <strong>Cost:</strong> training runs only when new data arrives; inference scales to zero at night. <strong>Latency:</strong> retrieval from Qdrant adds ~5–20 ms; the LLM generation itself dominates at ~1–5 s for typical outputs.</p>
        </>,
        ar: <>
          <p>تعيين توأم LLM على معمارية FTI يجعل تصميم النظام ملموساً. يتضمن المنتج الأساسي أربع مراحل متمايزة، اثنتان منها تُعيَّنان على خط الميزات:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>جمع البيانات (ETL):</strong> الزواحف تسحب المقالات والمنشورات والكود من الإنترنت وتخزن المستندات الخام في مستودع بيانات <Eng>MongoDB</Eng>. هذه طبقة البيانات الخام التي تسبق خط الميزات.</li>
            <li><strong>خط الميزات:</strong> يقرأ المستندات الخام من <Eng>MongoDB</Eng>، وينظف النص ويقسمه إلى أجزاء، ويضمّن الأجزاء بنموذج تضمين، ويكتب المتجهات في قاعدة بيانات <Eng>Qdrant</Eng> المتجهية (مخزن الميزات). كما يولد مجموعات بيانات تعليمية للضبط الدقيق ويحفظها كتحقق مصنوفة بإصدارات.</li>
            <li><strong>خط التدريب:</strong> يقرأ مجموعات البيانات التعليمية من مخزن التحقق، ويضبط بدقة نموذج LLM الأساسي (مثل <Eng>Llama 3.1 8B</Eng>) باستخدام طرق الكفاءة في المعاملات، ويقيّم النموذج المرشح، وينشره على <Eng>Hugging Face</Eng> كسجل نماذج.</li>
            <li><strong>خط الاستدلال:</strong> يكشف واجهة <Eng>REST API</Eng>. وقت الاستعلام يحمّل النموذج من <Eng>Hugging Face</Eng>، ويسترجع أكثر تضمينات المستخدم السابقة صلة من <Eng>Qdrant</Eng> (RAG)، ويبني أمراً مخصصاً، ويبث النص المولَّد.</li>
          </ol>
          <p>متطلبات النظام العملية تتبع مباشرة من المعمارية. <strong>قابلية التوسع:</strong> كل خط يتوسع بشكل مستقل. <strong>التكلفة:</strong> التدريب يعمل فقط عند وصول بيانات جديدة؛ الاستدلال يتوسع إلى الصفر ليلاً. <strong>التأخر:</strong> الاسترجاع من <Eng>Qdrant</Eng> يضيف ~5–20 مللي ثانية؛ توليد LLM نفسه هو المهيمن بـ ~1–5 ثوانٍ للمخرجات النموذجية.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "An LLM Twin differs from a generic chatbot mainly because it:", ar: "يختلف توأم LLM عن روبوت المحادثة العام بشكل رئيسي لأنه:" },
      options: {
        en: ["Is larger and more expensive", "Is fine-tuned on your personal writing to replicate your voice", "Requires no data to train", "Only works with code"],
        ar: ["أكبر وأغلى", "مضبوط بدقة على كتاباتك الشخصية لتقليد صوتك", "لا يحتاج إلى بيانات للتدريب", "يعمل فقط مع الكود"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What problem does training-serving skew cause?", ar: "ما المشكلة التي يسببها الانحراف بين التدريب والخدمة؟" },
      options: {
        en: ["The model trains faster than expected", "Features computed differently at training vs inference time, silently degrading accuracy", "The model becomes too large to serve", "Costs increase linearly"],
        ar: ["يتدرب النموذج أسرع من المتوقع", "تُحسب الميزات بشكل مختلف وقت التدريب والاستدلال مما يتراجع الدقة بصمت", "يصبح النموذج كبيراً جداً للخدمة", "ترتفع التكاليف خطياً"]
      },
      correctIndex: 1
    },
    {
      question: { en: "In the FTI architecture, the feature store serves as:", ar: "في معمارية FTI، يعمل مخزن الميزات كـ:" },
      options: {
        en: ["A model training accelerator", "A shared, versioned data contract between the feature, training, and inference pipelines", "A backup of the raw database", "A user-facing API"],
        ar: ["مُسرِّع تدريب النموذج", "عقد بيانات مشترك ومصنوف بإصدارات بين خطوط الميزات والتدريب والاستدلال", "نسخة احتياطية من قاعدة البيانات الخام", "واجهة برمجية للمستخدم"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why can each FTI pipeline scale independently?", ar: "لماذا يمكن لكل خط FTI التوسع بشكل مستقل؟" },
      options: {
        en: ["They all share the same process", "They communicate only through the feature store and model registry, with no direct code dependencies", "They are written in the same language", "They run on the same machine"],
        ar: ["يتشاركون نفس العملية", "يتواصلون فقط عبر مخزن الميزات وسجل النماذج، بدون تبعيات كود مباشرة", "مكتوبون بنفس اللغة", "يعملون على نفس الجهاز"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Which component does the inference pipeline use for real-time personalisation (RAG)?", ar: "أي مكون يستخدمه خط الاستدلال للتخصيص في الوقت الحقيقي (RAG)؟" },
      options: {
        en: ["The training pipeline's GPU cluster", "The feature store (vector database)", "The raw MongoDB data warehouse", "The experiment tracker"],
        ar: ["مجموعة GPU لخط التدريب", "مخزن الميزات (قاعدة البيانات المتجهية)", "مستودع بيانات MongoDB الخام", "متتبع التجارب"]
      },
      correctIndex: 1
    }
  ]
};
