import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import ToolStack from '../../components/widgets/ToolStack';

export const toolingModule: ModuleDef = {
  id: "2",
  title: { en: "Tooling & MLOps Stack", ar: "الأدوات وحزمة MLOps" },
  description: {
    en: "What each category of MLOps tooling does, why it exists, and what breaks in production when you skip it — from dependency management to prompt monitoring.",
    ar: "ما الذي تفعله كل فئة من أدوات MLOps، ولماذا توجد، وما الذي يفشل في الإنتاج عند تخطيها — من إدارة التبعيات إلى مراقبة الأوامر."
  },
  lessons: [
    {
      id: "python-ecosystem",
      title: { en: "Python Ecosystem & Dependency Management", ar: "بيئة Python وإدارة التبعيات" },
      content: {
        en: <>
          <p>Any non-trivial Python project needs three foundational pieces before you write a single line of ML code: a way to <em>pin the right Python version</em>, a way to <em>isolate project dependencies</em>, and a way to <em>run common tasks without memorising long commands</em>. Skipping any of these creates "works on my machine" bugs that are painful to debug across a team.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Version management (e.g. pyenv):</strong> different projects often need different Python versions. A version manager lets you switch the interpreter per directory without touching your system Python, avoiding cryptic import errors caused by incompatible C extensions.</li>
            <li><strong>Dependency manager (e.g. Poetry):</strong> a dependency manager goes beyond a simple <code dir="ltr">requirements.txt</code>. It resolves the entire dependency tree, pins exact versions of every direct and transitive package in a lock file, and creates an isolated virtual environment. This means two engineers installing the project on different machines get <em>identical byte-for-byte environments</em>. Competing tools like <code dir="ltr">uv</code> (built in Rust) follow the same philosophy but are significantly faster to resolve.</li>
            <li><strong>Task runner (e.g. Poe the Poet):</strong> instead of documenting long commands in a README that quickly goes stale, a task runner lets you define short aliases in the same config file Poetry already uses. <code dir="ltr">poe train</code> can trigger a full training run with all correct flags; new team members have one command to learn.</li>
          </ul>
          <p>Together, these three tools eliminate an entire class of environment-related failures, freeing you to focus on the ML problem rather than debugging import paths and version conflicts.</p>
        </>,
        ar: <>
          <p>يحتاج أي مشروع Python غير بسيط إلى ثلاثة عناصر تأسيسية قبل أن تكتب سطراً واحداً من كود ML: طريقة لـ<em>تثبيت إصدار Python الصحيح</em>، وطريقة لـ<em>عزل تبعيات المشروع</em>، وطريقة لـ<em>تشغيل المهام الشائعة دون حفظ أوامر طويلة</em>. تخطي أي منها يخلق أخطاء "يعمل على جهازي" المؤلمة تشخيصها عبر فريق.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>إدارة الإصدارات (مثل <Eng>pyenv</Eng>):</strong> تحتاج مشاريع مختلفة في الغالب إلى إصدارات Python مختلفة. يتيح لك مدير الإصدارات تبديل المترجم حسب الدليل دون لمس Python النظامي.</li>
            <li><strong>مدير التبعيات (مثل <Eng>Poetry</Eng>):</strong> يتجاوز مدير التبعيات <Eng>requirements.txt</Eng> البسيط. يحل شجرة التبعيات بأكملها، ويثبت الإصدارات الدقيقة لكل حزمة مباشرة وغير مباشرة في ملف قفل، وينشئ بيئة افتراضية معزولة. هذا يعني أن مهندسَين يثبتان المشروع على أجهزة مختلفة يحصلان على <em>بيئات متطابقة تماماً</em>.</li>
            <li><strong>مشغّل المهام (مثل <Eng>Poe the Poet</Eng>):</strong> بدلاً من توثيق الأوامر الطويلة في <Eng>README</Eng> الذي يصبح قديماً بسرعة، يتيح لك مشغّل المهام تعريف اختصارات قصيرة في نفس ملف الإعداد الذي تستخدمه <Eng>Poetry</Eng>. <code dir="ltr">poe train</code> يمكن أن يشغّل تشغيل تدريب كامل بجميع الأعلام الصحيحة.</li>
          </ul>
          <p>معاً، تتخلص هذه الأدوات الثلاثة من فئة كاملة من الأعطال المتعلقة بالبيئة، مما يحررك للتركيز على مشكلة ML بدلاً من تشخيص مسارات الاستيراد وتعارضات الإصدارات.</p>
        </>
      }
    },
    {
      id: "orchestration-tracking",
      title: { en: "Orchestration & Experiment Tracking", ar: "التنسيق وتتبع التجارب" },
      content: {
        en: <>
          <p>As soon as an ML project moves beyond a single Jupyter notebook, you need two categories of tooling that notebooks cannot provide: something to <em>coordinate and schedule pipeline runs</em>, and something to <em>record what you tried and what worked</em>.</p>
          <p><strong>Orchestrators</strong> automate the execution of multi-step workflows. The core concepts are universal across tools:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>A <strong>pipeline</strong> is a high-level function that chains steps together. Visually it forms a directed acyclic graph (DAG) — each node is a step, edges are data dependencies.</li>
            <li>A <strong>step</strong> is a single atomic unit of work (fetch data, train, evaluate). Each step runs as an independent process, potentially on different hardware.</li>
            <li>An <strong>artifact</strong> is any output a step produces — a dataset, a trained model, a metrics file. Artifacts are versioned and stored so every step output is reproducible and shareable without re-running the whole pipeline.</li>
            <li>A <strong>stack</strong> is the configured set of infrastructure the orchestrator uses: compute (cloud VM or GPU cluster), storage (S3-compatible bucket), container registry. Swapping a stack lets you move the exact same Python code from local laptop to AWS without code changes.</li>
          </ul>
          <p><strong>Experiment trackers</strong> record everything about each training run automatically: hyperparameters, loss and metric curves, system resource usage, and the exact code version. The payoff is a queryable history — you can compare twenty runs side-by-side, identify which hyperparameter change caused a 2% accuracy improvement, and share a link to that specific run with a collaborator. Without tracking, ML experimentation degenerates into guesswork with no audit trail.</p>
        </>,
        ar: <>
          <p>بمجرد أن يتجاوز مشروع ML دفتر <Eng>Jupyter</Eng> واحداً، تحتاج إلى فئتين من الأدوات لا توفرهما الدفاتر: شيء لـ<em>تنسيق وجدولة تشغيلات الخط الأنبوبي</em>، وشيء لـ<em>تسجيل ما جربته وما نجح</em>.</p>
          <p><strong>المنسقات</strong> تؤتمت تنفيذ سير العمل متعدد الخطوات. المفاهيم الجوهرية عالمية عبر الأدوات:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الخط الأنبوبي (<Eng>pipeline</Eng>):</strong> دالة عالية المستوى تربط الخطوات معاً. بصرياً تشكل رسماً بيانياً موجهاً بلا دورات (<Eng>DAG</Eng>) — كل عقدة خطوة، والحواف تبعيات البيانات.</li>
            <li><strong>الخطوة (<Eng>step</Eng>):</strong> وحدة عمل ذرية واحدة (جلب البيانات، التدريب، التقييم). كل خطوة تعمل كعملية مستقلة، ربما على أجهزة مختلفة.</li>
            <li><strong>التحقق (<Eng>artifact</Eng>):</strong> أي مخرج تنتجه خطوة — مجموعة بيانات، نموذج مدرَّب، ملف مقاييس. التحقق مصنوفة بإصدارات ومخزونة حتى يكون كل مخرج قابلاً للتكرار والمشاركة.</li>
            <li><strong>المكدس (<Eng>stack</Eng>):</strong> مجموعة البنية التحتية المُعدَّة التي يستخدمها المنسق: الحوسبة، والتخزين، وسجل الحاويات. تبديل مكدس يتيح لك نقل نفس كود Python من الجهاز المحلي إلى AWS بدون تغييرات في الكود.</li>
          </ul>
          <p><strong>متتبعات التجارب</strong> تسجل كل شيء عن كل تشغيل تدريب تلقائياً: المعاملات الفائقة، ومنحنيات الخسارة والمقاييس، واستخدام موارد النظام، وإصدار الكود بالضبط. الفائدة هي تاريخ قابل للاستعلام — يمكنك مقارنة عشرين تشغيلاً جنباً إلى جنب، وتحديد تغيير المعاملات الفائقة الذي أحدث تحسناً بنسبة 2%.</p>
        </>
      },
      widget: <ToolStack />
    },
    {
      id: "storage-databases",
      title: { en: "Storage: Object, Document & Vector", ar: "التخزين: الكائنات والمستندات والمتجهات" },
      content: {
        en: <>
          <p>An LLM system touches three fundamentally different storage concerns, and each requires a different storage paradigm:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Object storage (e.g. S3-compatible):</strong> binary blobs — model weights, training data archives, Docker image layers. Object storage is cheap, infinitely scalable, durable, and accessible from any pipeline regardless of where it runs. It is not queryable; you retrieve objects by key.</li>
            <li><strong>Document database (e.g. MongoDB):</strong> semi-structured, schema-flexible documents — raw crawled text, user records, configuration objects. A NoSQL document store is ideal for data whose shape varies between records (a Medium article has different metadata than a GitHub repository). Queries are by field value, not semantic similarity. For the LLM Twin MVP at hundreds-of-documents scale, this doubles as a data warehouse.</li>
            <li><strong>Vector database (e.g. Qdrant):</strong> high-dimensional embedding vectors indexed for fast approximate nearest-neighbor search. This is the feature store for RAG: at inference time the system encodes the query, searches the vector DB in ~5–20 ms, and retrieves the user's most semantically relevant past content. Without a vector DB, retrieval at scale is computationally impossible.</li>
          </ul>
          <p>A practical gotcha: vector databases also support <strong>payload filtering</strong> — you can restrict nearest-neighbor search to vectors that match metadata criteria (e.g. "only embeddings from articles, not posts"). This is essential for building personalised retrieval that respects data categories.</p>
        </>,
        ar: <>
          <p>يلمس نظام LLM ثلاثة اهتمامات تخزين مختلفة بشكل أساسي، وكل منها يتطلب نموذج تخزين مختلفاً:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>تخزين الكائنات (مثل S3):</strong> كتل ثنائية — أوزان النموذج، وأرشيفات بيانات التدريب، وطبقات صور Docker. تخزين الكائنات رخيص وقابل للتوسع بلا حدود ومتين ويمكن الوصول إليه من أي خط بغض النظر عن مكان تشغيله.</li>
            <li><strong>قاعدة بيانات المستندات (مثل <Eng>MongoDB</Eng>):</strong> مستندات شبه منظمة ومرنة المخطط — نص مُزحف خام، سجلات المستخدمين، كائنات الإعدادات. مخزن المستندات <Eng>NoSQL</Eng> مثالي للبيانات التي يتباين شكلها بين السجلات. الاستعلامات تتم حسب قيمة الحقل، لا التشابه الدلالي.</li>
            <li><strong>قاعدة البيانات المتجهية (مثل <Eng>Qdrant</Eng>):</strong> متجهات تضمين عالية الأبعاد مفهرسة للبحث التقريبي عن الجار الأقرب بسرعة. هذا هو مخزن الميزات لـ RAG: وقت الاستدلال يشفّر النظام الاستعلام، ويبحث في قاعدة البيانات المتجهية في ~5–20 مللي ثانية، ويسترجع المحتوى الأكثر صلة دلالياً للمستخدم.</li>
          </ul>
          <p>تحذير عملي: تدعم قواعد البيانات المتجهية أيضاً <strong>تصفية البيانات الوصفية</strong> — يمكنك تقييد بحث الجار الأقرب على المتجهات التي تطابق معايير البيانات الوصفية (مثلاً "فقط تضمينات من المقالات، لا المنشورات"). هذا ضروري لبناء استرجاع مخصص يحترم فئات البيانات.</p>
        </>
      }
    },
    {
      id: "cloud-monitoring",
      title: { en: "Cloud Compute & Prompt Monitoring", ar: "الحوسبة السحابية ومراقبة الأوامر" },
      content: {
        en: <>
          <p>Two final tool categories complete the MLOps stack: cloud compute for training at scale, and prompt monitoring to keep quality measurable in production.</p>
          <p><strong>Cloud compute</strong> enters the picture because fine-tuning even a 7B-parameter model requires far more GPU memory than a typical developer machine holds. Managed training services let you specify a machine type, provide a container image with your training code, and launch a job that provisions the hardware, runs training, saves checkpoints to object storage, and terminates — no cluster management required. The key principle is <em>ephemerality</em>: pay for GPU time only during training, pay for smaller instances during inference, and pay nothing when idle. Autoscaling inference endpoints extend this: the service adds replicas when request rate climbs and scales to zero during quiet periods.</p>
          <p><strong>Prompt monitoring</strong> closes the feedback loop from production back to your training pipeline. Once a model serves real users, you must track:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>Every request and response pair — the raw trace of what the model is doing in the wild.</li>
            <li>Automated quality scores using LLM-as-judge evaluators that assess faithfulness, relevance, and style consistency without human review of every response.</li>
            <li>Distribution shift alerts — flagging when the incoming prompt distribution diverges significantly from your evaluation set, signalling that the model has moved out of distribution.</li>
          </ul>
          <p>Without monitoring you are effectively deploying blind. Models degrade silently as user prompts evolve and as the underlying base model updates. Monitoring provides the signal that tells you <em>when</em> to collect new data and retrain — completing the continuous learning loop.</p>
        </>,
        ar: <>
          <p>فئتان نهائيتان من الأدوات تكملان حزمة MLOps: الحوسبة السحابية للتدريب على نطاق واسع، ومراقبة الأوامر للحفاظ على قابلية قياس الجودة في الإنتاج.</p>
          <p><strong>الحوسبة السحابية</strong> تدخل الصورة لأن ضبط نموذج بسبعة مليارات معامل بدقة يتطلب ذاكرة GPU أكثر بكثير مما يحتويه جهاز المطور النموذجي. تتيح لك خدمات التدريب المُدارة تحديد نوع الجهاز وتوفير صورة حاوية بكود التدريب وإطلاق مهمة تُنشئ الأجهزة وتشغّل التدريب وتحفظ نقاط التفتيش وتنهي — لا إدارة للمجموعة مطلوبة. المبدأ الجوهري هو <em>الزوال</em>: ادفع لوقت GPU فقط أثناء التدريب، وادفع لحالات أصغر أثناء الاستدلال، ولا تدفع شيئاً عند الخمول.</p>
          <p><strong>مراقبة الأوامر</strong> تغلق حلقة التغذية الراجعة من الإنتاج إلى خط التدريب. بمجرد أن يخدم النموذج المستخدمين الحقيقيين، يجب تتبع:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>كل زوج طلب واستجابة — الأثر الخام لما يفعله النموذج في البرية.</li>
            <li>درجات الجودة الآلية باستخدام مُقيّمات <Eng>LLM-as-judge</Eng> التي تقيّم الأمانة والصلة واتساق الأسلوب دون مراجعة بشرية لكل استجابة.</li>
            <li>تنبيهات انجراف التوزيع — الإشارة عندما يتباعد توزيع الأوامر الواردة بشكل كبير عن مجموعة التقييم، مما يشير إلى خروج النموذج من التوزيع.</li>
          </ul>
          <p>بدون المراقبة أنت تنشر فعلياً بشكل أعمى. تتراجع النماذج بصمت مع تطور أوامر المستخدم وتحديث النموذج الأساسي. توفر المراقبة الإشارة التي تخبرك <em>متى</em> تجمع بيانات جديدة وتعيد التدريب.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "What is the main advantage of a dependency lock file (like poetry.lock)?", ar: "ما هي الميزة الرئيسية لملف قفل التبعيات (مثل poetry.lock)؟" },
      options: {
        en: ["It speeds up model training", "It ensures every installation gets byte-identical package versions, eliminating 'works on my machine' bugs", "It compresses model weights", "It documents the project's README"],
        ar: ["يسرّع تدريب النموذج", "يضمن أن كل تثبيت يحصل على إصدارات حزم متطابقة تماماً، مما يلغي أخطاء 'يعمل على جهازي'", "يضغط أوزان النموذج", "يوثق README المشروع"]
      },
      correctIndex: 1
    },
    {
      question: { en: "In an ML orchestrator, what is an 'artifact'?", ar: "في منسق ML، ما هو 'التحقق' (artifact)؟" },
      options: {
        en: ["A bug introduced during training", "Any versioned, storable output produced by a pipeline step (dataset, model, metrics)", "A Python decorator", "A cloud billing unit"],
        ar: ["خطأ أُدخل أثناء التدريب", "أي مخرج مصنوف بإصدارات ومخزون تنتجه خطوة خط أنبوبي (مجموعة بيانات، نموذج، مقاييس)", "زخرفة Python", "وحدة فواتير سحابية"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why is a vector database necessary for RAG, rather than a regular document database?", ar: "لماذا تعدّ قاعدة البيانات المتجهية ضرورية لـ RAG بدلاً من قاعدة بيانات المستندات العادية؟" },
      options: {
        en: ["It stores more documents", "It indexes high-dimensional embeddings for fast semantic nearest-neighbor retrieval", "It supports SQL queries", "It is cheaper than MongoDB"],
        ar: ["تخزن مستندات أكثر", "تفهرس التضمينات عالية الأبعاد للاسترجاع الدلالي السريع للجار الأقرب", "تدعم استعلامات SQL", "أرخص من MongoDB"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What does 'ephemerality' mean in the context of cloud training compute?", ar: "ماذا تعني 'الزوال' في سياق حوسبة التدريب السحابية؟" },
      options: {
        en: ["Models are deleted after training", "GPU instances are provisioned for training and shut down when done, paying only for actual use", "Data is deleted after one week", "All training runs are temporary"],
        ar: ["النماذج تُحذف بعد التدريب", "يتم توفير حالات GPU للتدريب وإغلاقها عند الانتهاء، والدفع فقط مقابل الاستخدام الفعلي", "البيانات تُحذف بعد أسبوع واحد", "جميع تشغيلات التدريب مؤقتة"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What does prompt monitoring detect that static evaluation sets cannot?", ar: "ما الذي تكشفه مراقبة الأوامر لا تستطيع مجموعات التقييم الثابتة اكتشافه؟" },
      options: {
        en: ["Training loss", "Distribution shift — when real-world prompts diverge from the evaluation set over time", "Model size", "Python version conflicts"],
        ar: ["خسارة التدريب", "انجراف التوزيع — عندما تتباعد الأوامر الواقعية عن مجموعة التقييم بمرور الوقت", "حجم النموذج", "تعارضات إصدارات Python"]
      },
      correctIndex: 1
    }
  ]
};
