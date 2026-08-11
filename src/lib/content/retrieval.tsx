import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import VectorDB from '../../components/widgets/VectorDB';
import Chunking from '../../components/widgets/Chunking';
import RAGPipeline from '../../components/widgets/RAGPipeline';

export const retrievalModule: ModuleDef = {
  id: "9",
  title: { en: "Vector DBs & Retrieval (RAG)", ar: "قواعد البيانات الاتجاهية والاسترجاع" },
  description: {
    en: "Embeddings, ANN indexes, chunking strategies, and building a RAG pipeline that actually works.",
    ar: "التضمين وفهارس ANN واستراتيجيات التقسيم وبناء RAG يعمل فعلاً."
  },
  lessons: [
    {
      id: "vector",
      title: { en: "Embeddings & ANN Search", ar: "التضمين والبحث التقريبي" },
      content: {
        en: <>
          <p>An <strong>embedding model</strong> (a small transformer, distinct from your chat LLM) maps a text to a vector of e.g. 768–3072 floats such that <em>semantically similar texts get nearby vectors</em>. "How do I reset my password?" and "forgot login credentials" share almost no words but land close in embedding space — this is search by <em>meaning</em>, not keywords.</p>
          <p>Similarity is measured with <strong>cosine similarity</strong> (angle between vectors). But comparing a query against 10 million vectors exactly is too slow, so vector DBs use <strong>Approximate Nearest Neighbor (ANN)</strong> indexes:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>HNSW</strong> (the standard): a multi-layer "skip-list of neighborhoods" graph — greedy search from a top coarse layer down to exact neighbors. ~1ms queries at millions of vectors, at the cost of RAM (the graph lives in memory).</li>
            <li><strong>IVF + PQ:</strong> cluster vectors into cells; search only the nearest cells; compress vectors 10–100× with product quantization. Better for billion-scale, slightly lower recall.</li>
          </ul>
          <p>Practical gotchas that break real systems: you must use the <em>same embedding model</em> for indexing and querying (switching models means re-embedding everything); embeddings truncate long inputs silently; and pure semantic search misses exact identifiers (error codes, SKUs) — production systems run <strong>hybrid search</strong> (vector + BM25 keyword) and merge results.</p>
        </>,
        ar: <>
          <p><strong>نموذج التضمين</strong> (محول صغير، منفصل عن نموذج المحادثة) يحوّل نصًا إلى متجه من 768–3072 رقمًا بحيث <em>تحصل النصوص المتشابهة دلاليًا على متجهات متقاربة</em>. "كيف أعيد ضبط كلمة المرور؟" و"نسيت بيانات الدخول" لا تتشاركان كلمة تقريبًا لكنهما تهبطان متجاورتين في فضاء التضمين — هذا بحث <em>بالمعنى</em> لا بالكلمات.</p>
          <p>يُقاس التشابه بـ <strong>جيب تمام الزاوية (<Eng>cosine similarity</Eng>)</strong>. لكن مقارنة استعلام مع 10 ملايين متجه بدقة كاملة أبطأ من اللازم، لذا تستخدم قواعد المتجهات فهارس <strong>الجار الأقرب التقريبي (<Eng>ANN</Eng>)</strong>:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong><Eng>HNSW</Eng></strong> (المعيار): رسم متعدد الطبقات — بحث جشع من طبقة خشنة علوية نزولاً للجيران الدقيقين. استعلامات ~1 مللي ثانية عند ملايين المتجهات، مقابل استهلاك RAM (الرسم يسكن الذاكرة).</li>
            <li><strong><Eng>IVF + PQ</Eng>:</strong> عنقدة المتجهات في خلايا؛ البحث في أقرب الخلايا فقط؛ وضغط المتجهات 10–100× بـ <Eng>product quantization</Eng>. أنسب لمليارات المتجهات مع استرجاع أقل قليلاً.</li>
          </ul>
          <p>فخاخ عملية تكسر الأنظمة الحقيقية: يجب استخدام <em>نفس نموذج التضمين</em> للفهرسة والاستعلام (تغيير النموذج يعني إعادة تضمين كل شيء)؛ التضمين يقصّ المدخلات الطويلة بصمت؛ والبحث الدلالي الخالص يفوّت المعرفات الحرفية (أكواد الأخطاء، أرقام المنتجات) — الأنظمة الإنتاجية تشغّل <strong>بحثًا هجينًا</strong> (متجهات + كلمات BM25) وتدمج النتائج.</p>
        </>
      },
      math: {
        en: <p>cos(a, b) = a·b / (‖a‖‖b‖) ∈ [−1, 1]. With normalized vectors, cosine ranking ≡ dot product ≡ euclidean ranking. HNSW: search O(log N) hops; build O(N log N); memory ≈ N × (d × 4 bytes + M × 8 bytes of graph links).</p>,
        ar: <p>cos(a, b) = a·b / (‖a‖‖b‖) ∈ [−1, 1]. مع متجهات مطبَّعة، ترتيب جيب التمام ≡ الضرب النقطي ≡ ترتيب المسافة الإقليدية. ‏<Eng>HNSW</Eng>: بحث O(log N) قفزة؛ بناء O(N log N)؛ ذاكرة ≈ N × (d × 4 بايت + M × 8 بايت روابط).</p>
      },
      widget: <VectorDB />
    },
    {
      id: "chunking",
      title: { en: "Chunking Strategies", ar: "استراتيجيات تقسيم النصوص" },
      content: {
        en: <>
          <p>You can't embed a whole book as one vector — meaning gets averaged into mush, and you'd feed the LLM whole books as "context". So documents are split into <strong>chunks</strong>. This unglamorous step decides more of your RAG quality than the choice of vector DB:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Fixed-size</strong> (e.g. 500 tokens + 10–15% overlap): the baseline. Overlap exists so a sentence straddling a boundary survives intact in at least one chunk.</li>
            <li><strong>Recursive/structural:</strong> split on document structure — headings, paragraphs, code blocks, table boundaries — falling back to smaller separators. Almost always beats fixed-size.</li>
            <li><strong>Semantic:</strong> embed sentences, cut where consecutive-sentence similarity drops (topic shift). Better boundaries, higher indexing cost.</li>
            <li><strong>Contextualized chunks:</strong> prepend each chunk with metadata or an LLM-generated one-line summary of where it sits ("From: Q3 report → Risks section"). Cheap and dramatically improves retrieval of ambiguous chunks ("it increased by 12%" — what did?).</li>
          </ul>
          <p>The core tension: <strong>small chunks retrieve precisely but lack context; large chunks carry context but dilute the embedding.</strong> A robust pattern is <em>retrieve-small, read-big</em>: index small chunks for precision, but hand the LLM the surrounding section (parent-document retrieval).</p>
        </>,
        ar: <>
          <p>لا يمكن تضمين كتاب كامل كمتجه واحد — يتحول المعنى لمتوسط بلا ملامح، وستطعم النموذج كتبًا كاملة "كسياق". لذلك تُقسم المستندات إلى <strong>أجزاء (<Eng>chunks</Eng>)</strong>. هذه الخطوة غير البراقة تحدد من جودة RAG أكثر مما يحدده اختيار قاعدة البيانات:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>حجم ثابت</strong> (مثلاً 500 رمز + تداخل 10–15%): الأساس. التداخل موجود كي تنجو الجملة الواقعة على الحدود كاملة في جزء واحد على الأقل.</li>
            <li><strong>هيكلي/تكراري:</strong> التقسيم على بنية المستند — العناوين والفقرات وكتل الكود وحدود الجداول — مع التراجع لفواصل أصغر. يتفوق على الثابت دائمًا تقريبًا.</li>
            <li><strong>دلالي:</strong> ضمّن الجمل واقطع حيث يهبط تشابه الجمل المتتالية (تحول الموضوع). حدود أفضل بتكلفة فهرسة أعلى.</li>
            <li><strong>أجزاء مسيَّقة:</strong> أسبِق كل جزء ببيانات وصفية أو سطر ملخص يولده نموذج عن موقعه ("من: تقرير الربع الثالث ← قسم المخاطر"). رخيص ويحسّن كثيرًا استرجاع الأجزاء الغامضة ("ارتفعت بنسبة 12%" — ما الذي ارتفع؟).</li>
          </ul>
          <p>التوتر الجوهري: <strong>الأجزاء الصغيرة تُسترجع بدقة لكن ينقصها السياق؛ والكبيرة تحمل السياق لكنها تميّع التضمين.</strong> النمط المتين هو <em>استرجع صغيرًا واقرأ كبيرًا</em>: فهرس أجزاء صغيرة للدقة، لكن سلّم النموذج القسم المحيط كاملاً (<Eng>parent-document retrieval</Eng>).</p>
        </>
      },
      widget: <Chunking />
    },
    {
      id: "rag",
      title: { en: "The Full RAG Pipeline", ar: "خط RAG الكامل" },
      content: {
        en: <>
          <p><strong>RAG</strong> exists because fine-tuning is a terrible way to teach a model <em>facts</em>: it's expensive, slow to update, and the model still hallucinates. Instead, keep knowledge in a database and inject the relevant pieces into the prompt at question time. The production pipeline:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>Query transformation:</strong> the user's message is often a bad search query. Rewrite it with the LLM (expand pronouns from chat history, split multi-part questions, generate hypothetical answers — HyDE).</li>
            <li><strong>Hybrid retrieval:</strong> top-k from vector search + BM25, merged (e.g. reciprocal rank fusion). Retrieve generously — k = 20–50.</li>
            <li><strong>Reranking:</strong> a <strong>cross-encoder</strong> reads (query, chunk) <em>together</em> and scores relevance far more accurately than embedding distance. Keep the top 3–8. This step is the single biggest quality upgrade per dollar in most RAG systems.</li>
            <li><strong>Prompt assembly:</strong> instructions + numbered source chunks + the question, with an explicit "answer only from the sources; say 'I don't know' otherwise; cite source numbers".</li>
            <li><strong>Generation + citation checking:</strong> optionally verify cited chunks actually support the claims.</li>
          </ol>
          <p>Evaluate the two stages <em>separately</em>: retrieval (recall@k — is the answer in the retrieved set?) and generation (faithfulness — did the model stick to it?). When RAG "doesn't work", measuring the two separately tells you which half to fix — it's usually retrieval.</p>
        </>,
        ar: <>
          <p>وجدت <Eng>RAG</Eng> لأن الضبط الدقيق طريقة رديئة لتعليم النموذج <em>حقائق</em>: مكلف وبطيء التحديث والنموذج يهلوس رغمه. بدلاً من ذلك، أبقِ المعرفة في قاعدة بيانات واحقن الأجزاء ذات الصلة في الأمر وقت السؤال. الخط الإنتاجي:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>تحويل الاستعلام:</strong> رسالة المستخدم غالبًا استعلام بحث سيئ. أعد صياغتها بالنموذج (فك الضمائر من تاريخ المحادثة، قسّم الأسئلة المركبة، ولّد إجابة افتراضية — <Eng>HyDE</Eng>).</li>
            <li><strong>استرجاع هجين:</strong> أفضل k من بحث المتجهات + BM25 مدمجة (مثلاً <Eng>reciprocal rank fusion</Eng>). استرجع بسخاء — k = 20–50.</li>
            <li><strong>إعادة الترتيب (<Eng>Reranking</Eng>):</strong> نموذج <Eng>cross-encoder</Eng> يقرأ (الاستعلام، الجزء) <em>معًا</em> ويقيّم الصلة بدقة تفوق كثيرًا مسافة التضمين. أبقِ أفضل 3–8. هذه الخطوة أكبر ترقية جودة مقابل الدولار في معظم أنظمة RAG.</li>
            <li><strong>تجميع الأمر:</strong> تعليمات + أجزاء مصادر مرقمة + السؤال، مع نص صريح: "أجب من المصادر فقط؛ قل لا أعرف إن لم تجد؛ استشهد بأرقام المصادر".</li>
            <li><strong>التوليد + فحص الاستشهادات:</strong> اختياريًا تحقق أن الأجزاء المستشهد بها تدعم الادعاءات فعلاً.</li>
          </ol>
          <p>قيّم المرحلتين <em>منفصلتين</em>: الاسترجاع (recall@k — هل الإجابة ضمن المسترجَع؟) والتوليد (الأمانة — هل التزم النموذج به؟). عندما "لا يعمل RAG"، القياس المنفصل يخبرك أي نصف تصلح — وغالبًا هو الاسترجاع.</p>
        </>
      },
      widget: <RAGPipeline />
    }
  ],
  quiz: [
    {
      question: { en: "In embedding space, similar texts are:", ar: "في مساحة التضمين، النصوص المتشابهة تكون:" },
      options: { en: ["Far apart", "Close together", "Deleted", "Random"], ar: ["متباعدة", "متقاربة", "محذوفة", "عشوائية"] },
      correctIndex: 1
    },
    {
      question: { en: "Why add overlap between chunks?", ar: "لماذا نضيف تداخلاً بين الأجزاء؟" },
      options: { en: ["To save memory", "To preserve context at boundaries", "To run faster", "To train the model"], ar: ["لتوفير الذاكرة", "للحفاظ على السياق عند الحواف", "لتسريع العمل", "لتدريب النموذج"] },
      correctIndex: 1
    },
    {
      question: { en: "A reranker (cross-encoder) is more accurate than embedding distance because it:", ar: "معيد الترتيب أدق من مسافة التضمين لأنه:" },
      options: {
        en: ["Uses a bigger database", "Reads the query and chunk together", "Caches results", "Uses keywords only"],
        ar: ["يستخدم قاعدة أكبر", "يقرأ الاستعلام والجزء معًا", "يخزن النتائج", "يستخدم الكلمات فقط"]
      },
      correctIndex: 1
    },
    {
      question: { en: "When RAG answers are wrong, the failing stage is usually:", ar: "عندما تخطئ إجابات RAG، المرحلة الفاشلة عادة هي:" },
      options: { en: ["Generation", "Retrieval", "Tokenization", "The GPU"], ar: ["التوليد", "الاسترجاع", "تقطيع النصوص", "كارت الشاشة"] },
      correctIndex: 1
    }
  ]
};
