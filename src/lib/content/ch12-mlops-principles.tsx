import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import MaturityLadder from '../../components/widgets/MaturityLadder';

export const mlopsPrinciplesModule: ModuleDef = {
  id: "12",
  title: { en: "MLOps Principles", ar: "مبادئ MLOps" },
  description: {
    en: "Master the six core MLOps principles — automation, versioning, experiment tracking, testing, monitoring, and reproducibility — and understand ML systems as far more than just code.",
    ar: "أتقن المبادئ الستة لـ MLOps — الأتمتة والإصدارات وتتبع التجارب والاختبار والمراقبة وإعادة الإنتاج — وافهم أنظمة ML بوصفها أكثر بكثير من مجرد كود."
  },
  lessons: [
    {
      id: "ml-beyond-code",
      title: { en: "ML Systems Are More Than Code", ar: "أنظمة ML أكثر من مجرد كود" },
      content: {
        en: <>
          <p>A famous paper from Google described the "hidden technical debt" in ML systems: the model code is often a tiny fraction of a production ML system. Surrounding it is a sprawling infrastructure for data collection, feature engineering, configuration management, serving, monitoring, and process management. Each layer accumulates its own form of technical debt if not treated with the same engineering discipline as application code.</p>
          <p>There is a subtle but critical difference between traditional software and ML systems. In traditional software, if you fix a bug and the tests pass, the system behaves as expected. In ML, a system can execute without errors and still produce systematically wrong outputs — because the model was trained on data that no longer reflects reality, or because a subtle upstream data pipeline change silently shifted the feature distribution. The system "works" but is broken in the ways that matter to users.</p>
          <p>This is why MLOps treats <strong>three assets as first-class citizens</strong> rather than one:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Code</strong> — the pipelines, training scripts, serving logic. Tracked with Git, tested with CI.</li>
            <li><strong>Data</strong> — the training sets, evaluation sets, production inputs. Must be versioned, validated, and monitored for drift.</li>
            <li><strong>Model</strong> — the trained artefact. Must be versioned in a registry, evaluated before promotion, and monitored in production.</li>
          </ul>
          <p>When any one of these three changes, the other two are potentially affected. A data pipeline that adds a new feature column will silently break a model that was trained without that column. A model update may render cached downstream predictions stale. MLOps practices exist to make these interactions explicit, traceable, and recoverable.</p>
        </>,
        ar: <>
          <p>ورقة بحثية شهيرة من Google وصفت "الديون التقنية المخفية" في أنظمة ML: كود النموذج غالبًا جزء ضئيل من نظام ML إنتاجي. يُحيط به بنية تحتية ضخمة لجمع البيانات وهندسة الميزات وإدارة التهيئة والخدمة والمراقبة وإدارة العمليات. كل طبقة تتراكم ديونها التقنية الخاصة إذا لم تُعامَل بنفس الانضباط الهندسي الذي يُعامَل به كود التطبيق.</p>
          <p>هناك فارق دقيق لكنه حاسم بين البرمجيات التقليدية وأنظمة ML. في البرمجيات التقليدية، إذا أصلحت خطأ ونجحت الاختبارات، يتصرف النظام كما هو متوقع. في ML، يمكن للنظام أن ينفّذ دون أخطاء وأن يُنتج مخرجات خاطئة بشكل منهجي — لأن النموذج دُرِّب على بيانات لم تعد تعكس الواقع.</p>
          <p>هذا هو سبب معاملة MLOps لـ <strong>ثلاثة أصول كمواطنين من الدرجة الأولى</strong> لا واحد فقط:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الكود</strong> — الخطوط وسكريبتات التدريب ومنطق الخدمة. يُتتبع بـ <Eng>Git</Eng> ويُختبر بـ CI.</li>
            <li><strong>البيانات</strong> — مجموعات التدريب والتقييم ومدخلات الإنتاج. يجب إصدارها والتحقق منها ومراقبة انجرافها.</li>
            <li><strong>النموذج</strong> — المخرج المُدرَّب. يجب إصداره في سجل وتقييمه قبل الترقية ومراقبته في الإنتاج.</li>
          </ul>
          <p>عندما يتغير أي من هذه الثلاثة، قد يتأثر الآخران. خط بيانات يُضيف عمود ميزة جديد قد يكسر صامتًا نموذجًا دُرِّب بدون ذلك العمود. ممارسات MLOps موجودة لجعل هذه التفاعلات صريحة وقابلة للتتبع والاسترداد.</p>
        </>
      },
      widget: <MaturityLadder />
    },
    {
      id: "versioning-tracking",
      title: { en: "Versioning & Experiment Tracking", ar: "الإصدارات وتتبع التجارب" },
      content: {
        en: <>
          <p>Versioning means maintaining a complete, retrievable history of every change to code, data, and models — individually. This sounds obvious, but many early-stage ML projects version only code (via Git) and treat data and models as mutable artefacts managed informally. The result is a system where nobody can reproduce last month's model, or explain why a performance regression occurred.</p>
          <p><strong>Code versioning</strong> with Git is mature and well-understood. Every commit is a snapshot. Branches isolate experiments. Tags mark releases. Use semantic versioning (major.minor.patch) for model versions following the same convention as software releases.</p>
          <p><strong>Model versioning</strong> is handled by a model registry — a specialised store that records not just the weights, but associated metadata: the dataset version used for training, hyperparameters, evaluation metrics, and environment info. A well-maintained registry lets you answer "what changed between v1.3 and v1.4 that caused the accuracy drop?" in minutes rather than days.</p>
          <p><strong>Data versioning</strong> is the most operationally difficult. Options range from DVC (Git-like tracking of large file hashes), to artifact tracking in tools like ZenML or W&B Artifacts, to a version column in a feature store. The minimum viable approach: every time your training data changes, create a new named snapshot (even just a dated copy in object storage) and record which snapshot was used to train each model version.</p>
          <p><strong>Experiment tracking</strong> sits adjacent to versioning. Training an ML model is inherently experimental — you run dozens of variants with different architectures, learning rates, regularisation, and data mixes. An experiment tracker (Comet ML, MLflow, W&B) logs every run's hyperparameters, metrics, loss curves, and artefacts so you can compare runs at a glance and always identify which configuration produced the best result.</p>
        </>,
        ar: <>
          <p>الإصدارات تعني الحفاظ على تاريخ كامل وقابل للاسترجاع لكل تغيير على الكود والبيانات والنماذج — بشكل مستقل. يبدو هذا واضحًا، لكن كثيرًا من مشاريع ML في مراحلها المبكرة تُصدِّر فقط الكود (عبر <Eng>Git</Eng>) وتُعامل البيانات والنماذج كمخرجات قابلة للتعديل تُدار بشكل غير رسمي.</p>
          <p><strong>إصدار الكود</strong> مع Git ناضج ومفهوم جيدًا. كل إيداع هو لقطة. الفروع تعزل التجارب. الوسوم تُعلّم الإصدارات. استخدم الإصدار الدلالي (رئيسي.ثانوي.رقعة) لإصدارات النموذج.</p>
          <p><strong>إصدار النموذج</strong> يتعامل معه سجل النموذج — مخزن متخصص يُسجّل ليس فقط الأوزان، بل البيانات الوصفية المرتبطة: إصدار مجموعة البيانات المستخدمة للتدريب، وفرط المعاملات، ومقاييس التقييم، ومعلومات البيئة.</p>
          <p><strong>إصدار البيانات</strong> هو الأصعب تشغيليًا. تتراوح الخيارات من <Eng>DVC</Eng> (تتبع Git لتجزئات الملفات الكبيرة)، إلى تتبع المخرجات في أدوات مثل <Eng>ZenML</Eng> أو <Eng>W&B Artifacts</Eng>، إلى عمود إصدار في مخزن الميزات.</p>
          <p><strong>تتبع التجارب</strong> يجلس بجانب الإصدارات. تدريب نموذج ML تجريبي بطبيعته — تُشغّل عشرات المتغيرات بمعاملات مختلفة. أداة تتبع التجارب (<Eng>Comet ML</Eng>، <Eng>MLflow</Eng>، <Eng>W&B</Eng>) تُسجّل فرط معاملات كل تشغيل ومقاييسه ومنحنيات الخسارة ومخرجاته حتى تتمكن من مقارنة التشغيلات بنظرة وتحديد أيها أنتج أفضل النتائج.</p>
        </>
      }
    },
    {
      id: "testing",
      title: { en: "Testing: Code, Data, and Model", ar: "الاختبار: الكود والبيانات والنموذج" },
      content: {
        en: <>
          <p>Software engineering has a well-developed testing culture: unit tests, integration tests, system tests. MLOps extends testing across all three ML assets — code, data, and the model itself — because each can fail in distinct ways.</p>
          <p><strong>Code tests</strong> follow standard software engineering practices. Unit tests verify individual functions (does the tokeniser handle empty strings? does the chunk-overlap logic produce correct boundaries?). Integration tests verify that pipeline stages work together — the feature pipeline produces the right schema, the training pipeline reads it correctly, the output model passes a shape check. Run in CI on every commit.</p>
          <p><strong>Data tests</strong> are validation checks on incoming data before it enters training or serving. For text data: check character encoding, expected language, absence of null or empty strings, length bounds. For tabular features: check numeric ranges, categorical cardinality, no unexpected nulls. These tests catch upstream data pipeline breakage early — a common source of silent model degradation.</p>
          <p><strong>Model tests</strong> validate model behaviour rather than just code execution. Key checks: does the training loss decrease after one gradient step (verifies forward+backward pass is correct)? Can the model overfit a batch of 8 examples (verifies sufficient model capacity)? Do output shapes match expectations? Does the model perform above a minimum acceptable threshold on a held-out evaluation set?</p>
          <p>Behavioural tests treat the model as a black box. Invariance tests: changing synonyms in the input should not change the output category. Directional tests: adding a sentiment-flipping word should change the output. Minimum functionality tests: simple, obvious cases the model must always get right. These are especially valuable for regression testing — detecting when a model update breaks a previously working behaviour.</p>
        </>,
        ar: <>
          <p>لهندسة البرمجيات ثقافة اختبار متطورة: اختبارات الوحدة والتكامل والنظام. يمتد الاختبار في MLOps عبر الأصول الثلاثة لـ ML — الكود والبيانات والنموذج نفسه — لأن كلًا منها يمكن أن يفشل بطرق مختلفة.</p>
          <p><strong>اختبارات الكود</strong> تتبع ممارسات هندسة البرمجيات القياسية. اختبارات الوحدة تتحقق من الدوال الفردية. اختبارات التكامل تتحقق من أن مراحل الخط تعمل معًا بصورة صحيحة. تُشغَّل في CI عند كل إيداع.</p>
          <p><strong>اختبارات البيانات</strong> هي فحوصات التحقق على البيانات الواردة قبل دخولها للتدريب أو الخدمة. للبيانات النصية: تحقق من ترميز الأحرف واللغة المتوقعة وغياب السلاسل الفارغة وحدود الطول. للميزات الجدولية: تحقق من النطاقات الرقمية والقيم الفئوية وغياب القيم المفقودة غير المتوقعة.</p>
          <p><strong>اختبارات النموذج</strong> تتحقق من سلوك النموذج لا مجرد تنفيذ الكود. الفحوصات الرئيسية: هل تنخفض خسارة التدريب بعد خطوة تدرج واحدة؟ هل يمكن للنموذج الإفراط في الملاءمة على دفعة من 8 أمثلة؟ هل تتطابق أشكال المخرجات مع التوقعات؟</p>
          <p>الاختبارات السلوكية تُعامل النموذج كصندوق أسود. اختبارات التغير: تغيير المرادفات في المدخل لا ينبغي أن يغيّر فئة المخرج. اختبارات الاتجاه: إضافة كلمة تعكس المشاعر ينبغي أن تغيّر المخرج. اختبارات الوظيفة الأدنى: حالات بسيطة وواضحة يجب على النموذج الحصول عليها دائمًا.</p>
        </>
      }
    },
    {
      id: "monitoring-drift",
      title: { en: "Monitoring, Drift & Reproducibility", ar: "المراقبة والانجراف وإعادة الإنتاج" },
      content: {
        en: <>
          <p>A model that works perfectly at launch may degrade over months as the real world changes. Monitoring is the feedback mechanism that detects this degradation and triggers corrective action — before users notice.</p>
          <p><strong>System metrics</strong> (latency, throughput, error rate, GPU utilisation) tell you whether the infrastructure is healthy. <strong>Model metrics</strong> (accuracy, F1, hallucination rate, user rating) tell you whether the model is still useful. In practice, ground-truth labels are often unavailable in production (you don't know the "correct" answer for a freeform generation), so you rely on <em>proxy signals</em> like user thumbs-down rates, session abandonment, or automated LLM-as-judge scoring.</p>
          <p><strong>Drift</strong> is the underlying cause of most long-term model degradation. Three types matter:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Data drift (covariate shift):</strong> the distribution of input features changes — users start asking questions in a different style, or a new product category appears that was absent during training. The model was never trained on these inputs and generalises poorly.</li>
            <li><strong>Concept drift:</strong> the relationship between inputs and the correct output changes — what was considered "positive sentiment" two years ago may differ from today. The model's learned mapping is now stale.</li>
            <li><strong>Target drift:</strong> the label space changes — a new output category appears, or an existing one is redefined.</li>
          </ul>
          <p>Drift is detected statistically by comparing a <em>reference window</em> (training data distribution) to a <em>test window</em> (recent production data). The Kolmogorov-Smirnov test works for continuous univariate features; chi-squared for categoricals; Maximum Mean Discrepancy (MMD) for high-dimensional embeddings. A detected drift should trigger an alert and, depending on severity, a CT run to retrain the model.</p>
          <p><strong>Reproducibility</strong> underpins all of this. Every training run should be reproducible given the same code version, data version, and random seed. Without reproducibility you cannot determine whether a performance change is caused by a real improvement or random noise. Set seeds for all random number generators; log all hyperparameters; use pinned dependency versions in containers.</p>
        </>,
        ar: <>
          <p>النموذج الذي يعمل بشكل مثالي عند الإطلاق قد يتراجع على مدى أشهر مع تغيّر العالم الحقيقي. المراقبة هي آلية التغذية الراجعة التي تكشف هذا التراجع وتُطلق الإجراءات التصحيحية — قبل أن يلاحظ المستخدمون.</p>
          <p><strong>مقاييس النظام</strong> (الكمون والإنتاجية ومعدل الخطأ واستخدام GPU) تُخبرك ما إذا كانت البنية التحتية سليمة. <strong>مقاييس النموذج</strong> (الدقة، F1، معدل الهلوسة، تقييم المستخدم) تُخبرك ما إذا كان النموذج لا يزال مفيدًا.</p>
          <p><strong>الانجراف</strong> هو السبب الكامن وراء معظم تراجع النموذج على المدى البعيد. ثلاثة أنواع مهمة:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>انجراف البيانات (إزاحة التغطية):</strong> توزيع ميزات المدخلات يتغيّر — المستخدمون يبدؤون بطرح أسئلة بأسلوب مختلف، أو تظهر فئة منتج جديدة غائبة أثناء التدريب.</li>
            <li><strong>انجراف المفهوم:</strong> العلاقة بين المدخلات والمخرج الصحيح تتغيّر — ما كان يُعدّ "مشاعر إيجابية" قبل عامين قد يختلف عن اليوم. التعيين المُتعلَّم للنموذج أصبح قديمًا.</li>
            <li><strong>انجراف الهدف:</strong> فضاء التسمية يتغيّر — تظهر فئة مخرج جديدة أو تُعاد تعريف فئة موجودة.</li>
          </ul>
          <p>يُكتشف الانجراف إحصائيًا بمقارنة <em>نافذة مرجعية</em> (توزيع بيانات التدريب) بـ <em>نافذة اختبار</em> (بيانات الإنتاج الأخيرة). اختبار <Eng>Kolmogorov-Smirnov</Eng> يعمل للميزات الأحادية المستمرة؛ مربع كاي للميزات الفئوية؛ <Eng>Maximum Mean Discrepancy (MMD)</Eng> للتضمينات عالية الأبعاد.</p>
          <p><strong>إعادة الإنتاج</strong> تدعم كل هذا. كل تشغيل تدريب يجب أن يكون قابلًا لإعادة الإنتاج بنفس إصدار الكود وإصدار البيانات والبذرة العشوائية. بدون إعادة الإنتاج لا يمكنك تحديد ما إذا كان تغيير الأداء ناتجًا عن تحسن حقيقي أم ضوضاء عشوائية.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "MLOps treats which three assets as first-class citizens?", ar: "MLOps يُعامل أي ثلاثة أصول كمواطنين من الدرجة الأولى؟" },
      options: {
        en: ["CPU, GPU, TPU", "Code, data, and model", "Latency, cost, accuracy", "Training, validation, test sets"],
        ar: ["CPU وGPU وTPU", "الكود والبيانات والنموذج", "الكمون والتكلفة والدقة", "مجموعات التدريب والتحقق والاختبار"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Data drift (covariate shift) occurs when:", ar: "انجراف البيانات (إزاحة التغطية) يحدث عندما:" },
      options: {
        en: ["The model architecture changes", "The distribution of production input features diverges from training data", "The label space expands", "The learning rate is too high"],
        ar: ["تتغير بنية النموذج", "توزيع ميزات مدخلات الإنتاج يتباعد عن بيانات التدريب", "يتوسع فضاء التسميات", "معدل التعلم مرتفع جدًا"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Which test checks that changing synonyms in the input does NOT change the model's output category?", ar: "أي اختبار يتحقق من أن تغيير المرادفات في المدخل لا يغيّر فئة مخرج النموذج؟" },
      options: {
        en: ["Integration test", "Invariance test", "Stress test", "Acceptance test"],
        ar: ["اختبار التكامل", "اختبار الثبات", "اختبار الإجهاد", "اختبار القبول"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why is reproducibility critical in ML systems?", ar: "لماذا إعادة الإنتاج حاسمة في أنظمة ML؟" },
      options: {
        en: ["It makes training faster", "It ensures you can attribute performance changes to real causes rather than random noise", "It reduces GPU costs", "It automates deployment"],
        ar: ["تجعل التدريب أسرع", "تضمن نسب تغييرات الأداء لأسباب حقيقية لا لضوضاء عشوائية", "تُقلل تكاليف GPU", "تُؤتمت النشر"]
      },
      correctIndex: 1
    },
    {
      question: { en: "The 'hidden technical debt' insight about ML systems states that:", ar: "تُؤكد رؤية 'الديون التقنية المخفية' في أنظمة ML أن:" },
      options: {
        en: ["Model code is the largest part of the system", "Model code is a small fraction; the surrounding data, serving, and monitoring infrastructure is most of the complexity", "GPUs have no debt", "MLOps eliminates all technical debt"],
        ar: ["كود النموذج هو الجزء الأكبر من النظام", "كود النموذج جزء ضئيل؛ البنية التحتية المحيطة للبيانات والخدمة والمراقبة هي معظم التعقيد", "GPU ليس له ديون", "MLOps يُزيل كل الديون التقنية"]
      },
      correctIndex: 1
    }
  ]
};
