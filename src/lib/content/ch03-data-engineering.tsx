import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import DataPipeline from '../../components/widgets/DataPipeline';

export const dataEngineeringModule: ModuleDef = {
  id: "3",
  title: { en: "Data Engineering & Collection", ar: "هندسة البيانات وجمعها" },
  description: {
    en: "Why real-world data collection beats static datasets, how to design an ETL pipeline with crawlers, a dispatcher pattern, and MongoDB — the foundation every downstream ML step depends on.",
    ar: "لماذا تتفوق مجموعات البيانات الواقعية على الثابتة، وكيفية تصميم خط ETL بالزواحف ونمط الموزع وMongoDB — الأساس الذي تعتمد عليه كل خطوات ML اللاحقة."
  },
  lessons: [
    {
      id: "why-real-data",
      title: { en: "Why Real-World Data Beats Static Datasets", ar: "لماذا تتفوق البيانات الواقعية على المجموعات الثابتة؟" },
      content: {
        en: <>
          <p>Research projects and tutorials almost always hand you a clean, pre-split dataset. Production ML almost never does. For an LLM Twin the situation is even more pronounced: <em>your personal writing is, by definition, only available from your own digital presence</em> — there is no Kaggle dataset of your LinkedIn posts or your GitHub commit messages.</p>
          <p>Collecting data yourself rather than relying on static datasets gives you three critical advantages:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Freshness:</strong> a static dataset captures the world at the moment it was frozen. A live collection pipeline can re-run on a schedule, pulling in articles you published last week and social posts from yesterday. The model's fine-tuning corpus stays current.</li>
            <li><strong>Control:</strong> you decide exactly which sources to include and exclude. You can ensure the corpus covers the range of topics and writing styles you want the model to represent, and you can remove content you no longer stand behind.</li>
            <li><strong>Provenance:</strong> because you own the collection pipeline, every document in your warehouse has a known URL, author, timestamp, and category. This metadata is invaluable downstream — the retrieval system can filter by category or date, and the training pipeline can sample proportionally across data types.</li>
          </ul>
          <p>The trade-off is <strong>engineering cost</strong>: you must build crawlers, handle authentication, deal with HTML parsing edge cases, and manage infrastructure. This chapter shows how to contain that cost with clean abstractions so the collection layer can evolve without rewriting the rest of the system.</p>
        </>,
        ar: <>
          <p>مشاريع البحث والبرامج التعليمية تسلمك دائماً تقريباً مجموعة بيانات نظيفة مقسمة مسبقاً. ML الإنتاجي لا يفعل ذلك تقريباً أبداً. بالنسبة لتوأم LLM يكون الوضع أكثر وضوحاً: <em>كتاباتك الشخصية متاحة بحكم التعريف فقط من حضورك الرقمي</em> — لا توجد مجموعة بيانات على Kaggle لمنشوراتك على LinkedIn أو رسائل commits على GitHub.</p>
          <p>جمع البيانات بنفسك بدلاً من الاعتماد على مجموعات ثابتة يمنحك ثلاث مزايا حاسمة:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الحداثة:</strong> مجموعة البيانات الثابتة تلتقط العالم في لحظة تجميدها. يمكن لخط جمع حي إعادة التشغيل وفق جدول، وسحب مقالات نشرتها الأسبوع الماضي ومنشورات من الأمس. تظل مجموعة الضبط الدقيق للنموذج محدَّثة.</li>
            <li><strong>التحكم:</strong> أنت تقرر بالضبط المصادر التي تشملها وتستبعدها. يمكنك ضمان تغطية المجموعة لنطاق المواضيع وأساليب الكتابة التي تريد النموذج تمثيلها.</li>
            <li><strong>المصدر:</strong> لأنك تملك خط الجمع، كل مستند في مستودعك له URL معروف ومؤلف وطابع زمني وفئة. هذه البيانات الوصفية لا تقدر بثمن في المراحل اللاحقة — يمكن لنظام الاسترجاع التصفية حسب الفئة أو التاريخ.</li>
          </ul>
          <p>المقايضة هي <strong>تكلفة الهندسة</strong>: يجب عليك بناء زواحف والتعامل مع المصادقة ومعالجة حالات حافة تحليل HTML وإدارة البنية التحتية. يوضح هذا الفصل كيفية احتواء تلك التكلفة بتجريدات نظيفة حتى تتطور طبقة الجمع دون إعادة كتابة بقية النظام.</p>
        </>
      }
    },
    {
      id: "etl-design",
      title: { en: "ETL Design & the Dispatcher Pattern", ar: "تصميم ETL ونمط الموزع" },
      content: {
        en: <>
          <p>An <strong>ETL pipeline</strong> — Extract, Transform, Load — is the standard architecture for moving data from external sources into a system where it can be used. Each phase has a distinct responsibility:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Extract:</strong> reach out to the external source (a web page, an API, a git repository) and pull the raw content. This phase is inherently messy — network failures, authentication requirements, rate limits, and wildly varying HTML structures are all normal.</li>
            <li><strong>Transform:</strong> clean and normalise the raw content into a consistent, structured format. Strip HTML tags, extract meaningful text, normalise Unicode, remove boilerplate (navigation menus, footers, cookie banners). Every source produces a different shape of raw data; this phase produces a uniform shape.</li>
            <li><strong>Load:</strong> write the cleaned document into a durable store where downstream processes can reliably read it. The separation of load from transform means the storage layer can be swapped without touching extraction logic.</li>
          </ul>
          <p>The <strong>dispatcher pattern</strong> solves a key problem: as you add more data sources, you do not want a growing pile of if/else logic scattered across your pipeline. Instead, a central dispatcher inspects each URL's domain and instantiates the correct crawler class — Medium gets a MediumCrawler, GitHub gets a GithubCrawler, and anything unrecognised falls back to a generic CustomArticleCrawler. This follows the <em>open/closed principle</em>: adding a new source means adding a new class, not modifying existing code. All crawlers share a common interface with a single <code dir="ltr">extract(link, user)</code> method, so the pipeline can call them polymorphically without knowing their concrete type.</p>
          <p>Practically, three document categories cover nearly all personal writing: <strong>articles</strong> (blog posts, essays), <strong>repositories</strong> (GitHub code with README), and <strong>posts</strong> (short-form social content). Reducing every source to one of these three categories means the downstream feature pipeline never needs to know which platform a document came from — only its category.</p>
        </>,
        ar: <>
          <p>خط أنابيب <strong>ETL</strong> — استخراج وتحويل وتحميل — هو المعمارية المعيارية لنقل البيانات من مصادر خارجية إلى نظام يمكن استخدامها فيه. لكل مرحلة مسؤولية متمايزة:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الاستخراج:</strong> التواصل مع المصدر الخارجي (صفحة ويب، أو API، أو مستودع git) وسحب المحتوى الخام. هذه المرحلة فوضوية بطبيعتها — أعطال الشبكة ومتطلبات المصادقة وحدود معدل الطلب وهياكل HTML المتباينة جداً كلها طبيعية.</li>
            <li><strong>التحويل:</strong> تنظيف المحتوى الخام وتوحيده في تنسيق منظم ومتسق. تجريد وسوم HTML، واستخراج النص ذي المعنى، وتوحيد Unicode، وإزالة القوالب الجاهزة. كل مصدر ينتج شكلاً مختلفاً من البيانات الخام؛ هذه المرحلة تنتج شكلاً موحداً.</li>
            <li><strong>التحميل:</strong> كتابة المستند المنظف في مخزن دائم حيث يمكن للعمليات اللاحقة قراءته بشكل موثوق. الفصل بين التحميل والتحويل يعني أن طبقة التخزين يمكن استبدالها دون لمس منطق الاستخراج.</li>
          </ul>
          <p><strong>نمط الموزع</strong> يحل مشكلة جوهرية: عند إضافة المزيد من مصادر البيانات، لا تريد كومة متنامية من منطق if/else منتشراً عبر خطك الأنبوبي. بدلاً من ذلك، يفحص موزع مركزي نطاق كل URL ويُنشئ فئة الزاحف الصحيحة. هذا يتبع <em>مبدأ الانفتاح/الإغلاق</em>: إضافة مصدر جديد تعني إضافة فئة جديدة، ليس تعديل الكود الموجود. جميع الزواحف تشترك في واجهة مشتركة مع طريقة <code dir="ltr">extract(link, user)</code> واحدة.</p>
          <p>عملياً، ثلاث فئات مستندات تغطي كل الكتابة الشخصية تقريباً: <strong>المقالات</strong> (منشورات المدونات والمقالات)، <strong>المستودعات</strong> (كود GitHub مع README)، و<strong>المنشورات</strong> (محتوى اجتماعي قصير). اختزال كل مصدر في إحدى هذه الفئات الثلاث يعني أن خط الميزات اللاحق لا يحتاج أبداً معرفة المنصة التي جاء منها المستند.</p>
        </>
      },
      widget: <DataPipeline />
    },
    {
      id: "mongodb-odm",
      title: { en: "MongoDB as a Data Warehouse & ODM Pattern", ar: "MongoDB كمستودع بيانات ونمط ODM" },
      content: {
        en: <>
          <p>A traditional data warehouse is a columnar, SQL-based system optimised for analytical queries over millions of rows. For the LLM Twin's raw data layer — a few hundred to a few thousand varied text documents — a <strong>NoSQL document database like MongoDB</strong> is a pragmatic and justified choice:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Schema flexibility:</strong> a Medium article and a GitHub repository have almost no fields in common. A relational schema forces you to handle this with nullable columns or complex joins. MongoDB stores each document as a JSON-like object that can carry exactly the fields it needs — no migration required when you add a new field to one document type.</li>
            <li><strong>Developer ergonomics:</strong> read and write operations feel like working with Python dictionaries, not SQL. The Python SDK is stable and intuitive.</li>
            <li><strong>Cloud-native free tier:</strong> MongoDB Atlas provides a free, hosted cluster sufficient for proof-of-concept data volumes, so you can develop locally and deploy to the cloud with minimal configuration change.</li>
          </ul>
          <p>The <strong>Object-Document Mapper (ODM)</strong> pattern sits between your application code and the raw database driver. Like an ORM in the relational world, an ODM lets you define Python classes that map to MongoDB collections, with field types, validation rules, and query methods baked in. Benefits are concrete: you get type safety (the IDE tells you if you access a field that doesn't exist), automatic serialisation/deserialisation, and a <code dir="ltr">get_or_create()</code> method that atomically either fetches an existing document or inserts a new one — eliminating a common race condition in naive ETL code.</p>
          <p>The ETL pipeline and the feature pipeline are <em>decoupled through MongoDB</em>: the ETL writes raw documents; the feature pipeline reads them on its own schedule and transforms them into embeddings. Neither pipeline knows the implementation details of the other — they communicate only through the shared database schema.</p>
        </>,
        ar: <>
          <p>مستودع البيانات التقليدي نظام قائم على SQL وعمودي ومحسَّن للاستعلامات التحليلية على ملايين الصفوف. بالنسبة لطبقة البيانات الخام لتوأم LLM — بضع مئات إلى بضعة آلاف من المستندات النصية المتنوعة — <strong>قاعدة بيانات المستندات NoSQL مثل MongoDB</strong> هي اختيار عملي ومبرر:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>مرونة المخطط:</strong> مقالة Medium ومستودع GitHub لا يشتركان في أي حقول تقريباً. يجبرك المخطط العلائقي على التعامل مع هذا بأعمدة قابلة للتهيئة بـ null أو صلات معقدة. يخزن MongoDB كل مستند ككائن JSON يمكنه حمل الحقول التي يحتاجها بالضبط — لا ترحيل مطلوب عند إضافة حقل جديد.</li>
            <li><strong>سهولة التطوير:</strong> عمليات القراءة والكتابة تشعر كالعمل مع قواميس Python، ليس SQL.</li>
            <li><strong>الطبقة المجانية السحابية:</strong> يوفر MongoDB Atlas مجموعة مستضافة مجانية كافية لأحجام بيانات إثبات المفهوم، حتى تتمكن من التطوير محلياً والنشر على السحابة بتغيير إعداد بسيط.</li>
          </ul>
          <p>نمط <strong>رسام المستندات الكائنية (<Eng>ODM</Eng>)</strong> يجلس بين كود تطبيقك ومشغّل قاعدة البيانات الخام. مثل ORM في العالم العلائقي، يتيح لك ODM تعريف فئات Python تُعيَّن على مجموعات MongoDB، مع أنواع الحقول وقواعد التحقق وطرق الاستعلام. الفوائد ملموسة: تحصل على سلامة الأنواع، والتسلسل/إلغاء التسلسل التلقائي، وطريقة <code dir="ltr">get_or_create()</code> التي تجلب مستنداً موجوداً أو تدرج مستنداً جديداً بشكل ذري.</p>
          <p>خط ETL وخط الميزات <em>مقطوعا الاقتران عبر MongoDB</em>: يكتب ETL المستندات الخام؛ يقرأها خط الميزات وفق جدوله الخاص ويحولها إلى تضمينات. لا يعرف أي خط تفاصيل تنفيذ الآخر — يتواصلان فقط عبر مخطط قاعدة البيانات المشترك.</p>
        </>
      }
    },
    {
      id: "data-quality",
      title: { en: "Data Quality & Standardisation", ar: "جودة البيانات والتوحيد" },
      content: {
        en: <>
          <p>Data quality is the single biggest multiplier on downstream ML quality. A model fine-tuned on noisy, inconsistent, or duplicated data will learn noise. There is no training trick that compensates for bad data — the classic expression is <em>garbage in, garbage out</em>. For the LLM Twin, data quality problems are especially visible because the output is text that humans read and judge instantly.</p>
          <p>The key standardisation steps applied during the transform phase:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Deduplication:</strong> crawling the same URL twice or crawling an article that was cross-posted on two platforms produces duplicate training examples. At best this wastes compute; at worst it causes the model to over-represent repeated content. Deduplication is applied at both the raw document level (same URL → skip) and optionally at the near-duplicate level (very similar text hashes).</li>
            <li><strong>Noise removal:</strong> web pages contain navigation menus, cookie consent dialogs, social share buttons, and advertisement text. All of this is extracted HTML noise that must be stripped before the document reaches the feature pipeline. The transform phase uses heuristics (tag allowlists, minimum-length filters) to remove it.</li>
            <li><strong>Unicode normalisation:</strong> different platforms encode the same character in different ways (e.g. "é" as a single code point vs. "e" + combining accent). Normalising to a canonical form prevents the tokeniser from treating visually identical strings as different tokens.</li>
            <li><strong>Length filtering:</strong> documents below a minimum length (say, fewer than 50 words) are unlikely to be informative training examples. Documents above a maximum length may need to be split or truncated before embedding.</li>
          </ul>
          <p>Standardisation also means enforcing a <strong>consistent document schema</strong> across all sources. Every stored document carries the same mandatory fields — <code dir="ltr">content</code>, <code dir="ltr">link</code>, <code dir="ltr">author_id</code>, <code dir="ltr">created_at</code>, <code dir="ltr">category</code> — regardless of where it came from. This contract is what lets the feature pipeline treat all documents uniformly without source-specific logic.</p>
        </>,
        ar: <>
          <p>جودة البيانات هي المضاعف الأكبر على جودة ML اللاحقة. النموذج المضبوط بدقة على بيانات صاخبة أو غير متسقة أو مكررة سيتعلم الضوضاء. لا توجد حيلة تدريب تعوض البيانات السيئة — التعبير الكلاسيكي هو <em>قمامة تدخل، قمامة تخرج</em>. بالنسبة لتوأم LLM، مشاكل جودة البيانات واضحة بشكل خاص لأن المخرج نص يقرأه البشر ويحكمون عليه فوراً.</p>
          <p>خطوات التوحيد الرئيسية المُطبَّقة أثناء مرحلة التحويل:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>إزالة التكرار:</strong> زحف نفس URL مرتين أو زحف مقالة نُشرت على منصتين ينتج أمثلة تدريب مكررة. في أحسن الأحوال يهدر الحوسبة؛ في أسوأها يجعل النموذج يفرط في تمثيل المحتوى المتكرر.</li>
            <li><strong>إزالة الضوضاء:</strong> تحتوي صفحات الويب على قوائم تنقل ونوافذ موافقة ملفات تعريف الارتباط وأزرار المشاركة ونص إعلانات. كل هذا ضوضاء HTML مستخرجة يجب تجريدها قبل أن يصل المستند إلى خط الميزات.</li>
            <li><strong>توحيد Unicode:</strong> تنسّق منصات مختلفة نفس الحرف بطرق مختلفة. التوحيد إلى شكل قانوني يمنع المحلل اللغوي من معاملة سلاسل متطابقة بصرياً كرموز مختلفة.</li>
            <li><strong>تصفية الطول:</strong> المستندات التي تقل عن طول أدنى (مثلاً أقل من 50 كلمة) لا تحتمل أن تكون أمثلة تدريب مفيدة. المستندات الطويلة جداً قد تحتاج إلى تقسيم أو اقتطاع قبل التضمين.</li>
          </ul>
          <p>يعني التوحيد أيضاً فرض <strong>مخطط مستند متسق</strong> عبر جميع المصادر. كل مستند مخزون يحمل نفس الحقول الإلزامية — <code dir="ltr">content</code>، و<code dir="ltr">link</code>، و<code dir="ltr">author_id</code>، و<code dir="ltr">created_at</code>، و<code dir="ltr">category</code> — بغض النظر عن مصدره. هذا العقد هو ما يتيح لخط الميزات معالجة جميع المستندات بشكل موحد دون منطق خاص بالمصدر.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "What is the main advantage of collecting your own data over using a static dataset for an LLM Twin?", ar: "ما هي الميزة الرئيسية لجمع بياناتك الخاصة مقارنة باستخدام مجموعة بيانات ثابتة لتوأم LLM؟" },
      options: {
        en: ["Static datasets are always too small", "Self-collected data can be kept fresh, controlled, and fully attributed to you", "Static datasets require a GPU to download", "Self-collected data needs no cleaning"],
        ar: ["مجموعات البيانات الثابتة صغيرة دائماً", "يمكن إبقاء البيانات المجمَّعة ذاتياً حديثة ومُتحكَّماً بها ومنسوبة بالكامل إليك", "مجموعات البيانات الثابتة تتطلب GPU للتنزيل", "البيانات المجمَّعة ذاتياً لا تحتاج تنظيفاً"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What does the dispatcher pattern solve in a multi-source crawling system?", ar: "ما الذي يحله نمط الموزع في نظام الزحف متعدد المصادر؟" },
      options: {
        en: ["It speeds up network requests", "It routes each URL to the correct crawler class without growing if/else chains, keeping the code open for extension", "It compresses HTML before storing", "It handles database connection pooling"],
        ar: ["يسرّع طلبات الشبكة", "يوجه كل URL إلى فئة الزاحف الصحيحة دون تنمية سلاسل if/else، مما يبقي الكود مفتوحاً للتوسع", "يضغط HTML قبل التخزين", "يتعامل مع تجميع اتصالات قاعدة البيانات"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why is MongoDB's schema-less nature an advantage for the LLM Twin's raw data layer?", ar: "لماذا تُعدّ الطبيعة عديمة المخطط لـ MongoDB ميزة لطبقة البيانات الخام لتوأم LLM؟" },
      options: {
        en: ["It allows unlimited storage at no cost", "Different data sources have different fields; a flexible schema avoids migrations when a new field or source is added", "It automatically embeds text into vectors", "It is faster than all SQL databases"],
        ar: ["يتيح تخزيناً غير محدود بدون تكلفة", "مصادر البيانات المختلفة لها حقول مختلفة؛ المخطط المرن يتجنب الترحيل عند إضافة حقل أو مصدر جديد", "يضمّن النصوص في متجهات تلقائياً", "أسرع من جميع قواعد بيانات SQL"]
      },
      correctIndex: 1
    },
    {
      question: { en: "How are the ETL pipeline and the feature pipeline decoupled from each other?", ar: "كيف يكون خط ETL وخط الميزات مقطوعَي الاقتران عن بعضهما؟" },
      options: {
        en: ["They share a process ID", "They communicate only through the MongoDB data warehouse — ETL writes, feature pipeline reads, with no direct code dependency", "They use the same Python module", "They run on the same schedule"],
        ar: ["يتشاركان معرّف العملية", "يتواصلان فقط عبر مستودع بيانات MongoDB — يكتب ETL ويقرأ خط الميزات بدون تبعية كود مباشرة", "يستخدمان نفس وحدة Python", "يعملان وفق نفس الجدول"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What problem does deduplication in the transform phase prevent?", ar: "ما المشكلة التي تمنعها إزالة التكرار في مرحلة التحويل؟" },
      options: {
        en: ["Slow database queries", "The model over-representing repeated content and wasting training compute on duplicate examples", "Authentication failures during crawling", "Embedding vectors becoming too large"],
        ar: ["استعلامات قاعدة بيانات بطيئة", "النموذج يُفرط في تمثيل المحتوى المتكرر ويهدر حوسبة التدريب على أمثلة مكررة", "أعطال المصادقة أثناء الزحف", "متجهات التضمين تصبح كبيرة جداً"]
      },
      correctIndex: 1
    }
  ]
};
