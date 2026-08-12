import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import VectorDB from '../../components/widgets/VectorDB';
import Chunking from '../../components/widgets/Chunking';
import RAGPipeline from '../../components/widgets/RAGPipeline';

export const ragFeatureModule: ModuleDef = {
  id: "4",
  title: { en: "RAG Feature Pipeline", ar: "خط ميزات RAG" },
  description: {
    en: "Why RAG exists, how the ingestion-retrieval-generation pipeline works, embeddings and vector databases, chunking strategies, and advanced RAG optimizations.",
    ar: "لماذا وُجدت RAG، وكيف يعمل خط الاستيعاب والاسترجاع والتوليد، والتضمين وقواعد المتجهات، واستراتيجيات التقسيم، وتحسينات RAG المتقدمة."
  },
  lessons: [
    {
      id: "rag-why",
      title: { en: "Why RAG Exists", ar: "لماذا نحتاج إلى RAG" },
      content: {
        en: <>
          <p>Every language model is frozen in time. Its knowledge is encoded in its weights during training and cannot be updated without an expensive retraining cycle. This creates three fundamental gaps that <strong>Retrieval-Augmented Generation (RAG)</strong> was designed to bridge:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Hallucinations:</strong> When a model is asked about something it wasn't trained on, it doesn't say "I don't know" — it confidently fabricates. RAG forces the model to ground its answers in retrieved evidence, making it straightforward to verify whether the answer came from the data you provided.</li>
            <li><strong>Stale knowledge:</strong> New information is produced every second. Re-training an LLM daily is neither financially nor practically viable. RAG lets you update a database instead of retraining a model.</li>
            <li><strong>Private or proprietary data:</strong> Your internal documentation, customer records, or confidential reports were never part of any model's training set. RAG is the natural bridge between a general-purpose LLM and your organization's specific knowledge.</li>
          </ul>
          <p>The core idea is elegantly simple: instead of baking facts into model weights, keep facts in a searchable store and inject the relevant pieces into the prompt at question time. The LLM becomes a reasoning engine operating on evidence it receives, not on memorized trivia.</p>
          <p>It's worth clarifying when <em>not</em> to use RAG. If your task is purely stylistic (write in a specific tone), or requires deep procedural reasoning (multi-step code generation), or the corpus is so large and complex that retrieval quality is fundamentally unreliable, fine-tuning or a hybrid approach may be more appropriate. RAG excels when the answer is literally in a document — all you need is to find and present it correctly.</p>
        </>,
        ar: <>
          <p>كل نموذج لغوي مجمَّد في الزمن. معرفته مُضمَّنة في أوزانه أثناء التدريب ولا يمكن تحديثها بدون دورة إعادة تدريب مكلفة. هذا يخلق ثلاثة فجوات جوهرية صُمِّمت <strong>الاسترجاع المُعزَّز بالتوليد (<Eng>RAG</Eng>)</strong> لسدّها:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الهلوسة (<Eng>Hallucinations</Eng>):</strong> حين يُسأل النموذج عن شيء لم يُدرَّب عليه، لا يقول "لا أعرف" — بل يخترع إجابة بثقة. تُلزم <Eng>RAG</Eng> النموذج بتأسيس إجاباته على أدلة مُسترجَعة، مما يُسهّل التحقق من مصدر كل إجابة.</li>
            <li><strong>المعرفة القديمة:</strong> تُنتَج معلومات جديدة كل ثانية. إعادة تدريب نموذج ضخم يومياً ليست ممكنة مالياً ولا عملياً. تسمح <Eng>RAG</Eng> بتحديث قاعدة بيانات بدلاً من إعادة تدريب نموذج.</li>
            <li><strong>البيانات الخاصة أو المملوكة:</strong> وثائقك الداخلية وسجلات عملائك لم تكن يوماً جزءاً من مجموعات تدريب أي نموذج. <Eng>RAG</Eng> هي الجسر الطبيعي بين النموذج العام ومعرفة مؤسستك الخاصة.</li>
          </ul>
          <p>الفكرة الجوهرية بسيطة وأنيقة: بدلاً من تضمين الحقائق في أوزان النموذج، احتفظ بالحقائق في مخزن قابل للبحث وأدخل الأجزاء ذات الصلة في الأمر وقت السؤال. يصبح النموذج محرك استدلال يعمل على أدلة يستقبلها، لا على معلومات محفوظة.</p>
          <p>من المهم توضيح متى <em>لا</em> نستخدم <Eng>RAG</Eng>. إن كانت مهمتك أسلوبية بحتة، أو تتطلب استدلالاً إجرائياً معمقاً، أو كانت قاعدة البيانات ضخمة لدرجة تجعل جودة الاسترجاع غير موثوقة، فقد يكون الضبط الدقيق أو النهج الهجين أنسب. تتفوق <Eng>RAG</Eng> حين تكون الإجابة حرفياً في مستند — كل ما تحتاجه هو إيجادها وتقديمها بشكل صحيح.</p>
        </>
      }
    },
    {
      id: "rag-pipeline",
      title: { en: "The Vanilla RAG Framework", ar: "إطار RAG الأساسي" },
      content: {
        en: <>
          <p>A complete RAG system has three independent modules that work together: <strong>ingestion</strong> (preparing the knowledge base), <strong>retrieval</strong> (finding relevant information), and <strong>generation</strong> (producing the final answer). Understanding each stage separately is key to diagnosing and improving real systems.</p>
          <p><strong>Ingestion pipeline</strong> — this runs offline (on a schedule or triggered by data changes) and populates the vector database:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>Clean:</strong> standardize text — strip invalid characters, normalize whitespace, replace URLs with placeholders. The cleaning strategy depends heavily on your source data and the embedding model you use.</li>
            <li><strong>Chunk:</strong> split documents into pieces small enough for an embedding model and specific enough to be a coherent unit of retrieval. This step has the single biggest impact on system quality.</li>
            <li><strong>Embed:</strong> run each chunk through an embedding model to produce a dense vector of 384–3072 floats that encodes semantic meaning.</li>
            <li><strong>Load:</strong> store the vector (for similarity search) alongside metadata (source URL, timestamp, original text) in a vector database.</li>
          </ol>
          <p><strong>Retrieval pipeline</strong> — runs at query time. The user's question is cleaned and embedded using the <em>exact same</em> model as the ingestion step (a mismatch here — called training-serving skew — silently destroys retrieval quality). The resulting query vector is compared against the indexed vectors to find the top-K most similar chunks.</p>
          <p><strong>Generation pipeline</strong> — the retrieved chunks are assembled with the user's question into a structured prompt: a system message describing the task, numbered source passages, and an instruction to cite sources and admit uncertainty. The LLM reads this augmented context and produces its answer. Prompt templates should be version-controlled like code — a change in phrasing can noticeably shift answer quality.</p>
        </>,
        ar: <>
          <p>يضم نظام <Eng>RAG</Eng> الكامل ثلاثة وحدات مستقلة تعمل معاً: <strong>الاستيعاب</strong> (إعداد قاعدة المعرفة)، <strong>الاسترجاع</strong> (إيجاد المعلومات ذات الصلة)، و<strong>التوليد</strong> (إنتاج الإجابة النهائية). فهم كل مرحلة على حدة مفتاح لتشخيص الأنظمة الحقيقية وتحسينها.</p>
          <p><strong>خط الاستيعاب</strong> — يعمل باستمرار في الخلفية (وفق جدول أو مُثار بتغييرات البيانات) ويملأ قاعدة بيانات المتجهات:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>تنظيف (<Eng>Clean</Eng>):</strong> توحيد النص — حذف الأحرف غير الصالحة، وتطبيع المسافات، واستبدال الروابط بعناصر بديلة. تعتمد استراتيجية التنظيف كثيراً على مصدر البيانات ونموذج التضمين المستخدم.</li>
            <li><strong>تقسيم (<Eng>Chunk</Eng>):</strong> تقسيم المستندات إلى أجزاء صغيرة كفاية لنموذج التضمين ومحددة كفاية لتكون وحدة استرجاع متماسكة. هذه الخطوة لها أكبر تأثير منفرد على جودة النظام.</li>
            <li><strong>تضمين (<Eng>Embed</Eng>):</strong> تشغيل كل جزء عبر نموذج تضمين لإنتاج متجه كثيف من 384–3072 رقم يُرمِّز المعنى الدلالي.</li>
            <li><strong>تحميل (<Eng>Load</Eng>):</strong> تخزين المتجه (للبحث بالتشابه) جانباً مع البيانات الوصفية (رابط المصدر، الطابع الزمني، النص الأصلي) في قاعدة بيانات المتجهات.</li>
          </ol>
          <p><strong>خط الاسترجاع</strong> — يعمل وقت الاستعلام. يُنظَّف سؤال المستخدم ويُضمَّن بـ <em>نفس</em> النموذج المستخدم في الاستيعاب (أي اختلاف هنا — يُعرف بـ <Eng>training-serving skew</Eng> — يُدمر جودة الاسترجاع بصمت). ثم يُقارن متجه الاستعلام الناتج بالمتجهات المفهرسة لإيجاد أكثر K جزء تشابهاً.</p>
          <p><strong>خط التوليد</strong> — تُجمَّع الأجزاء المُسترجَعة مع سؤال المستخدم في أمر منظم: رسالة نظام تصف المهمة، ومقاطع مرقمة من المصادر، وتعليمات بالاستشهاد بالمصادر والإقرار بعدم اليقين. يقرأ النموذج هذا السياق المُعزَّز وينتج إجابته. يجب إصدار قوالب الأوامر كالكود — تغيير الصياغة قد يؤثر ملحوظاً على جودة الإجابات.</p>
        </>
      },
      widget: <RAGPipeline />
    },
    {
      id: "embeddings-vectordbs",
      title: { en: "Embeddings & Vector Databases", ar: "التضمين وقواعد البيانات الاتجاهية" },
      content: {
        en: <>
          <p>An <strong>embedding model</strong> — typically a small encoder transformer, separate from the chat LLM — maps any text to a dense numerical vector where <em>meaning determines geometry</em>: "password reset" and "login credentials forgotten" land near each other, while "quantum gravity" is far from both. This semantic geometry is what makes retrieval-by-meaning possible.</p>
          <p>Similarity between two vectors is measured by <strong>cosine similarity</strong>: the cosine of the angle between them. A value of 1 means identical direction (semantically equivalent), 0 means orthogonal (unrelated), and −1 means opposite. With normalized vectors, cosine similarity equals the dot product, so modern vector databases optimize for efficient dot product computation.</p>
          <p><strong>Vector databases</strong> go beyond raw FAISS indexes — they add CRUD operations, metadata filtering, real-time updates, and production-grade scalability. Under the hood they use <strong>Approximate Nearest Neighbor (ANN)</strong> algorithms rather than exact search, because comparing a query against millions of vectors exactly would take seconds per query:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>HNSW (Hierarchical Navigable Small World):</strong> builds a multi-layer graph where each layer is a coarser "skip list" of neighborhoods. Queries descend from the coarsest layer, quickly homing in on the nearest cluster, then search precisely at the bottom layer. Delivers ~1ms queries at millions of vectors; the tradeoff is that the graph lives entirely in RAM.</li>
            <li><strong>IVF + PQ (Inverted File + Product Quantization):</strong> clusters vectors into cells; at query time only the nearest cells are searched. PQ compresses each vector 10–100× by splitting it into sub-vectors and quantizing each independently. Excellent for billion-scale datasets where RAM is the constraint.</li>
          </ul>
          <p>Critical production gotchas: you <em>must</em> index and query with the same embedding model (switching models means re-embedding your entire corpus); pure semantic search misses exact identifiers like error codes or product SKUs — so production systems run <strong>hybrid search</strong> (vector + BM25 keyword) and merge results with reciprocal rank fusion.</p>
        </>,
        ar: <>
          <p><strong>نموذج التضمين</strong> — عادةً محوّل ترميز صغير، منفصل عن نموذج المحادثة — يحوّل أي نص إلى متجه رقمي كثيف حيث <em>المعنى يحدد الموقع الهندسي</em>: "إعادة ضبط كلمة المرور" و"نسيت بيانات الدخول" يقعان قريباً من بعضهما، في حين تقع "الجاذبية الكمية" بعيدة عن كليهما. هذه الهندسة الدلالية هي ما يجعل البحث بالمعنى ممكناً.</p>
          <p>يُقاس التشابه بين متجهين بـ <strong>جيب تمام الزاوية (<Eng>cosine similarity</Eng>)</strong>: جيب تمام الزاوية بينهما. القيمة 1 تعني اتجاهاً متطابقاً (تكافؤ دلالي)، 0 تعني تعامداً (لا صلة)، و−1 تعني اتجاهاً معاكساً. مع المتجهات المطبَّعة، يساوي جيب التمام الضرب النقطي، لذا تُحسِّن قواعد بيانات المتجهات الحديثة حساب الضرب النقطي بكفاءة.</p>
          <p><strong>قواعد بيانات المتجهات</strong> تتخطى مجرد فهارس <Eng>FAISS</Eng> الخام — تضيف عمليات <Eng>CRUD</Eng>، وتصفية البيانات الوصفية، والتحديثات الفورية، وقابلية التوسع الإنتاجي. تحت الغطاء تستخدم خوارزميات <strong>الجار الأقرب التقريبي (<Eng>ANN</Eng>)</strong> بدلاً من البحث الدقيق، لأن مقارنة استعلام مع ملايين المتجهات بدقة كاملة ستستغرق ثوانٍ لكل استعلام:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong><Eng>HNSW</Eng> (الرسم البياني الصغير القابل للتنقل الهرمي):</strong> يبني رسماً متعدد الطبقات يشبه قوائم القفز. تنحدر الاستعلامات من الطبقة الأخشن، وتحدد أقرب مجموعة بسرعة، ثم تبحث بدقة في الطبقة السفلى. يوفر استعلامات ~1 مللي ثانية عند ملايين المتجهات؛ مقابل أن الرسم يعيش كلياً في الذاكرة.</li>
            <li><strong><Eng>IVF + PQ</Eng> (الملف المقلوب + الضغط التحصصي):</strong> يُعنقد المتجهات في خلايا؛ وقت الاستعلام تُبحث الخلايا الأقرب فقط. يضغط <Eng>PQ</Eng> كل متجه 10–100× بتقسيمه لمتجهات فرعية وضغط كل منها مستقلاً. ممتاز لمجموعات مليارية حيث ذاكرة <Eng>RAM</Eng> هي القيد.</li>
          </ul>
          <p>فخاخ إنتاجية حرجة: يجب <em>بالضرورة</em> الفهرسة والاستعلام بنفس نموذج التضمين (تغيير النماذج يعني إعادة تضمين الكوربس كله)؛ البحث الدلالي الخالص يفوّت المعرفات الحرفية كأكواد الأخطاء وأرقام المنتجات — لذا تشغّل الأنظمة الإنتاجية <strong>بحثاً هجيناً</strong> (متجهات + كلمات <Eng>BM25</Eng>) وتدمج النتائج بـ <Eng>reciprocal rank fusion</Eng>.</p>
        </>
      },
      math: {
        en: <p dir="ltr">cosine_similarity(A, B) = (A · B) / (‖A‖ × ‖B‖) ∈ [−1, 1]. With L2-normalized vectors: cosine = dot product. HNSW build complexity: O(N log N); query: O(log N) hops. Memory: N × (d × 4 bytes for floats + M × 8 bytes for graph edges), where M is the max neighbors per node (typically 16–64).</p>,
        ar: <p dir="ltr">cosine_similarity(A, B) = (A · B) / (‖A‖ × ‖B‖) ∈ [−1, 1]. مع متجهات مطبَّعة: جيب التمام = الضرب النقطي. تعقيد بناء HNSW: O(N log N)؛ الاستعلام: O(log N) قفزة. الذاكرة: N × (d × 4 بايت للأعداد العشرية + M × 8 بايت لحواف الرسم)، حيث M هو أقصى عدد جيران لكل عقدة (عادةً 16–64).</p>
      },
      widget: <VectorDB />
    },
    {
      id: "chunking-advanced",
      title: { en: "Chunking Strategies & Advanced RAG", ar: "استراتيجيات التقسيم وRAG المتقدم" },
      content: {
        en: <>
          <p>The decision of how to split documents is unglamorous but decisive. Chunks that are too large average out meaning and waste context window; chunks that are too small lack the surrounding context to be useful. Four major chunking approaches exist:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Fixed-size with overlap:</strong> split every N tokens, with a 10–15% overlap so sentences straddling a boundary survive intact in at least one chunk. Simple but surprisingly competitive.</li>
            <li><strong>Structural / recursive:</strong> split on document structure — headings, paragraphs, code blocks, table boundaries — falling back to smaller separators only when needed. Almost always beats fixed-size because it respects semantic units.</li>
            <li><strong>Semantic:</strong> embed each sentence, cut where consecutive-sentence similarity drops sharply (a topic shift). Better boundaries, higher indexing cost — worth it for long, dense documents.</li>
            <li><strong>Contextualized chunks:</strong> prepend each chunk with metadata or an LLM-generated one-liner about where it sits ("From Q3 2024 Report → Risk Factors section"). Dramatically improves retrieval of ambiguous chunks whose meaning depends on surrounding context.</li>
          </ul>
          <p>The most robust pattern is <em>retrieve-small, read-big</em>: index small chunks for precision, but pass the surrounding parent section to the LLM as context. This gives the embedding model a focused, specific unit to match while giving the LLM the full surrounding context it needs to reason.</p>
          <p><strong>Advanced RAG</strong> layers three categories of optimizations on top of the vanilla framework. <em>Pre-retrieval:</em> rewrite the query (expand pronouns using chat history, split multi-part questions, generate a hypothetical ideal answer to use as the query — HyDE). <em>Retrieval:</em> hybrid search, metadata filtering, ensemble retrievers. <em>Post-retrieval:</em> reranking with a cross-encoder, context compression (strip irrelevant sentences from retrieved chunks), and iterative retrieval (retrieve → read → decide if more retrieval is needed). The single highest-ROI upgrade in most systems is adding a cross-encoder reranker: it reads the query and each candidate chunk <em>together</em> and scores relevance far more accurately than embedding distance alone.</p>
        </>,
        ar: <>
          <p>قرار كيفية تقسيم المستندات غير بارز لكنه حاسم. الأجزاء الكبيرة جداً تُمرّج المعنى وتهدر نافذة السياق؛ والصغيرة جداً تفتقر لسياق محيط كافٍ لتكون مفيدة. توجد أربعة مناهج رئيسية للتقسيم:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>حجم ثابت مع تداخل:</strong> تقسيم كل N رمز مع تداخل 10–15% كي تنجو الجمل الواقعة على الحدود كاملة في جزء واحد على الأقل. بسيط لكن تنافسي بشكل مفاجئ.</li>
            <li><strong>هيكلي / تكراري:</strong> التقسيم على بنية المستند — عناوين وفقرات وكتل كود وحدود جداول — مع التراجع لفواصل أصغر عند الحاجة فقط. يتفوق دائماً تقريباً على الثابت لأنه يحترم الوحدات الدلالية.</li>
            <li><strong>دلالي:</strong> تضمين كل جملة، والقطع عند هبوط حاد في تشابه الجمل المتتالية (تحول الموضوع). حدود أفضل بتكلفة فهرسة أعلى — يستحق العناء للمستندات الطويلة والكثيفة.</li>
            <li><strong>أجزاء مُسيَّقة:</strong> تسبيق كل جزء ببيانات وصفية أو سطر واحد ينتجه النموذج عن موقعه ("من تقرير 2024 الربع الثالث ← قسم عوامل المخاطرة"). يحسّن بشكل كبير استرجاع الأجزاء الغامضة التي يعتمد معناها على السياق المحيط.</li>
          </ul>
          <p>النمط الأكثر متانة هو <em>استرجع صغيراً واقرأ كبيراً</em>: فهرس أجزاء صغيرة للدقة، لكن مرّر القسم الأبوي المحيط للنموذج كسياق. هذا يمنح نموذج التضمين وحدة محددة ومركزة للمطابقة، بينما يمنح النموذج السياق الكامل المحيط الذي يحتاجه للاستدلال.</p>
          <p><strong>RAG المتقدمة</strong> تضيف ثلاث فئات من التحسينات فوق الإطار الأساسي. <em>ما قبل الاسترجاع:</em> إعادة صياغة الاستعلام (تفسير الضمائر من تاريخ المحادثة، تقسيم الأسئلة المركبة، توليد إجابة افتراضية مثالية للاستخدام كاستعلام — <Eng>HyDE</Eng>). <em>الاسترجاع:</em> بحث هجين، تصفية البيانات الوصفية، مجمّعات استرجاع. <em>ما بعد الاسترجاع:</em> إعادة الترتيب بـ <Eng>cross-encoder</Eng>، وضغط السياق (حذف الجمل غير ذات الصلة من الأجزاء المُسترجَعة)، والاسترجاع التكراري. أعلى ترقية قيمة مقابل التكلفة في معظم الأنظمة هي إضافة مُعيد ترتيب <Eng>cross-encoder</Eng>: يقرأ الاستعلام وكل جزء مرشح <em>معاً</em> ويقيّم الصلة بدقة أكبر بكثير من مسافة التضمين وحدها.</p>
        </>
      },
      widget: <Chunking />
    }
  ],
  quiz: [
    {
      question: { en: "Which problem does RAG primarily solve that fine-tuning cannot?", ar: "أي مشكلة تحلها RAG أساساً ولا يستطيع الضبط الدقيق حلها؟" },
      options: {
        en: ["Making the model faster", "Injecting fresh or private data without retraining", "Reducing model size", "Improving tokenization"],
        ar: ["تسريع النموذج", "حقن بيانات جديدة أو خاصة دون إعادة تدريب", "تقليل حجم النموذج", "تحسين تقطيع النصوص"]
      },
      correctIndex: 1
    },
    {
      question: { en: "In the RAG ingestion pipeline, what is the correct order of steps?", ar: "في خط استيعاب RAG، ما الترتيب الصحيح للخطوات؟" },
      options: {
        en: ["Embed → Clean → Chunk → Load", "Clean → Chunk → Embed → Load", "Load → Embed → Chunk → Clean", "Chunk → Embed → Clean → Load"],
        ar: ["تضمين ← تنظيف ← تقسيم ← تحميل", "تنظيف ← تقسيم ← تضمين ← تحميل", "تحميل ← تضمين ← تقسيم ← تنظيف", "تقسيم ← تضمين ← تنظيف ← تحميل"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why must you use the same embedding model for both ingestion and retrieval?", ar: "لماذا يجب استخدام نفس نموذج التضمين للاستيعاب والاسترجاع معاً؟" },
      options: {
        en: ["To save GPU memory", "Different models produce different vector spaces, making comparison meaningless", "It runs faster with one model", "The vector DB requires it"],
        ar: ["لتوفير ذاكرة GPU", "نماذج مختلفة تنتج فضاءات متجهية مختلفة مما يجعل المقارنة عديمة المعنى", "يعمل أسرع بنموذج واحد", "قاعدة البيانات تتطلب ذلك"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What is the 'retrieve-small, read-big' chunking pattern?", ar: "ما نمط التقسيم 'استرجع صغيراً واقرأ كبيراً'؟" },
      options: {
        en: ["Index small chunks for precision, but pass the surrounding parent section to the LLM", "Use a small embedding model and a large LLM", "Index large chunks and return only the first sentence", "Only use chunks with fewer than 50 tokens"],
        ar: ["فهرس أجزاء صغيرة للدقة لكن مرّر القسم الأبوي المحيط للنموذج", "استخدم نموذج تضمين صغير ونموذج لغوي كبير", "فهرس أجزاء كبيرة وأرجع الجملة الأولى فقط", "استخدم أجزاء بأقل من 50 رمز فقط"]
      },
      correctIndex: 0
    },
    {
      question: { en: "A cross-encoder reranker improves RAG quality because it:", ar: "مُعيد الترتيب cross-encoder يحسّن جودة RAG لأنه:" },
      options: {
        en: ["Uses a larger vector database", "Reads the query and each candidate chunk together to score relevance", "Indexes documents faster", "Skips the embedding step entirely"],
        ar: ["يستخدم قاعدة بيانات متجهات أكبر", "يقرأ الاستعلام وكل جزء مرشح معاً لتقييم الصلة", "يفهرس المستندات بسرعة أكبر", "يتخطى خطوة التضمين كلياً"]
      },
      correctIndex: 1
    }
  ]
};
