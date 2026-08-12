import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import RAGPipeline from '../../components/widgets/RAGPipeline';
import AdvancedRetrieval from '../../components/widgets/AdvancedRetrieval';

export const ragInferenceModule: ModuleDef = {
  id: "9",
  title: { en: "RAG Inference Pipeline", ar: "خط استدلال RAG" },
  description: {
    en: "Advanced retrieval at inference time: self-query, query expansion, filtered vector search, cross-encoder reranking, and assembling a testable, modular RAG pipeline.",
    ar: "الاسترجاع المتقدم وقت الاستدلال: الاستعلام الذاتي وتوسيع الاستعلام والبحث الاتجاهي المُفلتَر وإعادة الترتيب بمشفّر متقاطع، وبناء خط RAG معياري قابل للاختبار.",
  },
  lessons: [
    {
      id: "overview",
      title: { en: "The RAG Inference Flow", ar: "تدفق استدلال RAG" },
      content: {
        en: <>
          <p>A <strong>RAG inference pipeline</strong> is structurally different from the feature pipeline that built the vector database. The feature pipeline runs on a schedule — it ingests documents, chunks them, embeds them, and loads them into the vector store. The inference pipeline runs on demand, once per user request, and its job is to retrieve the most relevant stored chunks and use them to ground the LLM's answer.</p>
          <p>Separating these two concerns is what allows a RAG system to remain fresh without retraining: new documents can be indexed by the feature pipeline at any time, and the inference pipeline will automatically pick them up on the next request. The inference pipeline is therefore stateless with respect to document content — it reads from the vector store but never writes to it.</p>
          <p>A well-structured inference pipeline has two independently testable modules:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Retrieval module:</strong> takes the user query, applies pre-retrieval optimizations, runs the vector search, applies post-retrieval reranking, and returns a ranked list of context chunks. This module owns all the RAG "magic" — the majority of RAG engineering effort lives here.</li>
            <li><strong>Generation module:</strong> takes the ranked chunks and the original query, assembles the final prompt from a template, calls the LLM (via API or local endpoint), and returns the answer. This module is deliberately thin — it should contain almost no business logic.</li>
          </ul>
          <p>Keeping the two modules separate makes debugging straightforward: you can unit-test the retriever with a fixed query and verify that the right chunks come back, completely independently of whether the LLM produces a good answer from those chunks.</p>
        </>,
        ar: <>
          <p><strong>خط استدلال RAG</strong> مختلف هيكليًا عن خط المعالجة الذي بنى قاعدة البيانات الاتجاهية. خط المعالجة يعمل وفق جدول زمني — يستوعب المستندات ويقسّمها ويضمّنها ويحمّلها في مخزن المتجهات. خط الاستدلال يعمل عند الطلب، مرة واحدة لكل طلب مستخدم، ومهمته استرجاع الأجزاء الأنسب المخزّنة واستخدامها لتأريض إجابة النموذج اللغوي.</p>
          <p>فصل هاتين المسؤوليتين هو ما يُبقي نظام RAG منتعشًا دون إعادة تدريب: يمكن فهرسة مستندات جديدة بواسطة خط المعالجة في أي وقت، وسيلتقطها خط الاستدلال تلقائيًا في الطلب التالي. لذلك، خط الاستدلال عديم الحالة تجاه محتوى المستندات — يقرأ من مخزن المتجهات لكنه لا يكتب إليه أبدًا.</p>
          <p>خط الاستدلال المُهيكل جيدًا له وحدتان قابلتان للاختبار بشكل مستقل:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>وحدة الاسترجاع:</strong> تأخذ استعلام المستخدم، تطبّق تحسينات ما قبل الاسترجاع، تنفّذ البحث الاتجاهي، تطبّق إعادة الترتيب بعده، وتعيد قائمة مرتّبة من الأجزاء السياقية. هذه الوحدة تملك كل "السحر" في RAG — معظم جهد هندسة RAG يسكن هنا.</li>
            <li><strong>وحدة التوليد:</strong> تأخذ الأجزاء المرتّبة والاستعلام الأصلي، تجمّع الأمر النهائي من قالب، تستدعي النموذج اللغوي (عبر API أو نقطة نهاية محلية)، وتعيد الإجابة. هذه الوحدة رقيقة عمدًا — يجب ألا تحتوي على أي منطق عمل تقريبًا.</li>
          </ul>
          <p>إبقاء الوحدتين منفصلتين يُبسّط تشخيص الأخطاء: يمكنك اختبار المسترجع بوحدة باستعلام ثابت والتحقق من عودة الأجزاء الصحيحة، بشكل مستقل تمامًا عما إذا كان النموذج ينتج إجابة جيدة من تلك الأجزاء.</p>
        </>
      },
      widget: <RAGPipeline />,
    },
    {
      id: "pre-retrieval",
      title: { en: "Pre-Retrieval: Self-Query & Query Expansion", ar: "ما قبل الاسترجاع: الاستعلام الذاتي وتوسيع الاستعلام" },
      content: {
        en: <>
          <p>A user's raw question is often a poor vector search query. It may be vague, contain implicit context ("write something like my last post"), or embed metadata signals (author names, dates, categories) that pure embedding cannot reliably capture. Two techniques address these problems before the actual vector search begins.</p>
          <p><strong>Self-querying</strong> uses an LLM to parse the user's question and extract structured metadata that should be applied as hard filters during retrieval. For example, the question "Write an article in the style of Paul Iusztin about RAG" contains an author name that cannot be reliably separated from the semantic content in embedding space. A self-query step extracts "author = Paul Iusztin" as a filter, so the vector search operates only over that author's content. The filter is applied <em>before</em> computing similarity — it shrinks the search space, not just the result list, making retrieval both faster and more precise. The critical implementation detail: the LLM must return a structured sentinel ("none") when no metadata is present, so the downstream code can skip the filter gracefully.</p>
          <p><strong>Query expansion</strong> addresses the complementary problem: a single embedding vector covers only a small region of the embedding space, and relevant documents may be phrased in ways that land in adjacent but not identical regions. An LLM generates 2–4 semantically distinct restatements of the original question, each capturing a different facet or level of specificity. Each variant is embedded and searched independently, and the result sets are merged before reranking. The cost is N parallel vector searches instead of one — worth parallelizing to keep latency reasonable. The gain is substantially higher recall, especially for vague or ambiguous queries.</p>
          <p>Both techniques are implemented as lightweight LLM calls with zero-shot prompts. In production, they are often run with a small, fast model (not the main generation model) to minimize latency overhead.</p>
        </>,
        ar: <>
          <p>سؤال المستخدم الخام غالبًا ما يكون استعلام بحث اتجاهي سيئ. قد يكون غامضًا، أو يحمل سياقًا ضمنيًا ("اكتب شيئًا كآخر منشور لي")، أو يتضمن إشارات بيانات وصفية (أسماء مؤلفين، تواريخ، فئات) يعجز التضمين الخالص عن التقاطها بشكل موثوق. تقنيتان تعالجان هذه المشاكل قبل أن يبدأ البحث الاتجاهي الفعلي.</p>
          <p><strong>الاستعلام الذاتي</strong> يستخدم نموذجًا لغويًا لتحليل سؤال المستخدم واستخراج البيانات الوصفية الهيكلية التي يجب تطبيقها كفلاتر صارمة خلال الاسترجاع. مثلًا، السؤال "اكتب مقالًا بأسلوب Paul Iusztin عن RAG" يحتوي على اسم مؤلف لا يمكن فصله بشكل موثوق عن المحتوى الدلالي في فضاء التضمين. خطوة الاستعلام الذاتي تستخرج "المؤلف = Paul Iusztin" كفلتر، فيعمل البحث الاتجاهي فقط على محتوى ذلك المؤلف. يُطبَّق الفلتر <em>قبل</em> حساب التشابه — يُضيّق فضاء البحث لا مجرد قائمة النتائج، مما يجعل الاسترجاع أسرع وأدق. تفصيل التنفيذ الحاسم: يجب أن يعيد النموذج قيمة رمزية ("none") حين لا توجد بيانات وصفية، لتتجاوز الشفرة البعدية الفلتر بسلاسة.</p>
          <p><strong>توسيع الاستعلام</strong> يعالج المشكلة المكملة: متجه تضمين واحد يغطي منطقة صغيرة فقط من فضاء التضمين، وقد تقع المستندات ذات الصلة في مناطق مجاورة لكن غير مطابقة. نموذج لغوي يولّد 2–4 صياغات مختلفة دلاليًا للسؤال الأصلي، كل منها تلتقط جانبًا أو مستوى تخصص مختلفًا. تُضمَّن كل صياغة وتُبحث بشكل مستقل، وتُدمج مجموعات النتائج قبل إعادة الترتيب. التكلفة هي N بحث اتجاهي موازٍ بدلًا من واحد — يستحق التوازي للحفاظ على الكمون في حدود معقولة. المكسب هو استرجاع أعلى بشكل ملموس، خاصةً للاستعلامات الغامضة أو المبهمة.</p>
          <p>تُنفَّذ كلتا التقنيتين كاستدعاءات نماذج لغوية خفيفة بأوامر بدون أمثلة. في الإنتاج، غالبًا ما تُشغَّل بنموذج صغير سريع (لا نموذج التوليد الرئيسي) لتقليل تأثير الكمون.</p>
        </>
      },
    },
    {
      id: "retrieval-reranking",
      title: { en: "Filtered Vector Search & Reranking", ar: "البحث الاتجاهي المُفلتَر وإعادة الترتيب" },
      content: {
        en: <>
          <p>With the query (or queries) prepared, the retrieval step runs a <strong>filtered vector search</strong>: embed each query variant, compute approximate nearest neighbors against the stored chunk embeddings, and apply any metadata filters extracted by the self-query step as pre-conditions on the search. Modern vector databases (Qdrant, Weaviate, Pinecone) handle this natively and efficiently — the filter narrows the candidate set before ANN traversal, not after, so it genuinely reduces both computation and noise.</p>
          <p>After pooling results from all N query variants, you typically have N × K candidate chunks — far more than the LLM context window can or should consume. This is where <strong>reranking</strong> provides its largest value. A <em>cross-encoder</em> model receives each (query, chunk) pair concatenated into a single input and outputs a precise relevance score between 0 and 1. This is fundamentally different from the embedding similarity used during retrieval:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>The embedding model encodes query and chunk <em>separately</em> and measures distance — it cannot capture interactions between the specific words of the query and the specific words of the chunk.</li>
            <li>The cross-encoder reads them <em>together</em>, enabling attention across the full concatenated sequence. This allows it to notice, for example, that a chunk about "Java" is about the programming language when the query mentions "API calls", even if embedding distance was similar for both Java meanings.</li>
          </ul>
          <p>The practical cost: cross-encoding is much slower than embedding lookup, so it is only applied to the candidate set (20–50 chunks), not to the full corpus. After scoring, you sort by score and keep the top K (typically 3–8 chunks), which are handed to the prompt assembly step. Reranking is one of the highest-ROI improvements in a RAG stack — in many systems it is the single biggest quality upgrade available for its compute cost.</p>
        </>,
        ar: <>
          <p>بعد إعداد الاستعلام (أو الاستعلامات)، تنفّذ خطوة الاسترجاع <strong>بحثًا اتجاهيًا مُفلتَرًا</strong>: تضمّن كل صياغة استعلام، تحسب الجيران الأقرب التقريبيين مقابل تضمينات الأجزاء المخزّنة، وتطبّق أي فلاتر بيانات وصفية استخرجها خطوة الاستعلام الذاتي كشروط مسبقة على البحث. قواعد البيانات الاتجاهية الحديثة (<Eng>Qdrant</Eng> و<Eng>Weaviate</Eng> و<Eng>Pinecone</Eng>) تتعامل مع هذا بكفاءة طبيعية — الفلتر يضيّق مجموعة المرشحين قبل اجتياز <Eng>ANN</Eng> لا بعده، فيقلل الحوسبة والضوضاء فعليًا.</p>
          <p>بعد تجميع النتائج من كل N صياغة استعلام، عادةً يكون لديك N × K جزء مرشح — أكثر بكثير مما يستطيع نافذة سياق النموذج استيعابه. هنا تقدّم <strong>إعادة الترتيب</strong> أكبر قيمتها. نموذج <em>cross-encoder</em> يتلقى كل زوج (استعلام، جزء) مسلسلًا في مدخل واحد ويخرج درجة صلة دقيقة بين 0 و1. هذا مختلف جوهريًا عن تشابه التضمين المستخدم في الاسترجاع:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>نموذج التضمين يشفّر الاستعلام والجزء <em>بشكل منفصل</em> ويقيس المسافة — لا يستطيع التقاط التفاعلات بين كلمات الاستعلام وكلمات الجزء بالتحديد.</li>
            <li>النموذج المتقاطع يقرأهما <em>معًا</em>، مما يتيح الانتباه عبر التسلسل المسلسل كاملًا. هذا يمكّنه من ملاحظة، مثلًا، أن جزءًا عن "Java" يتحدث عن لغة البرمجة حين يذكر الاستعلام "استدعاءات API"، حتى لو كانت مسافة التضمين متشابهة لمعنيي Java.</li>
          </ul>
          <p>التكلفة العملية: الترميز المتقاطع أبطأ بكثير من بحث التضمين، لذلك يُطبَّق فقط على مجموعة المرشحين (20–50 جزءًا)، لا على المجموعة الكاملة. بعد التسجيل، ترتيب حسب الدرجة والاحتفاظ بأعلى K (عادةً 3–8 أجزاء) التي تُسلَّم لخطوة تجميع الأمر. إعادة الترتيب من أعلى التحسينات عائدًا على الاستثمار في بنية RAG — في كثير من الأنظمة هي أكبر ترقية جودة متاحة مقابل تكلفتها الحوسبية.</p>
        </>
      },
      widget: <AdvancedRetrieval />,
    },
    {
      id: "prompt-assembly",
      title: { en: "Prompt Assembly & Keeping Stages Testable", ar: "تجميع الأمر وإبقاء المراحل قابلة للاختبار" },
      content: {
        en: <>
          <p>After reranking, the top K chunks are assembled into the final prompt. A reliable prompt template for RAG answers follows a consistent structure:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>System instruction:</strong> "Answer only using the provided context. If the context does not contain enough information, say so explicitly. Cite the source number for each claim."</li>
            <li><strong>Numbered context blocks:</strong> each retrieved chunk is prefixed with its source number, so the LLM can attribute claims. Ordering matters — put the highest-relevance chunks first, since models attend more strongly to early context.</li>
            <li><strong>User question:</strong> the original, unmodified user query. Do not pass expanded query variants to the LLM — those were only for retrieval.</li>
          </ol>
          <p>The "cite source numbers" instruction is not just for user transparency — it lets you programmatically verify that the LLM's claims can be traced back to specific retrieved chunks, which is a valuable automated faithfulness check.</p>
          <p>Keeping the pipeline <strong>modular and independently testable</strong> is the discipline that separates production-ready RAG from prototype RAG:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>Test the self-query step with known inputs and check that the right metadata is extracted — no LLM generation involved in the assertion.</li>
            <li>Test the retriever end-to-end with a fixed eval set: given this query, do the right chunks appear in the top K? Measure Recall@K before and after any change to chunking, embedding models, or retrieval settings.</li>
            <li>Test the prompt assembly by checking that the formatted string matches an expected template — pure string logic, no model call needed.</li>
            <li>Test generation faithfulness separately using your chosen LLM judge — only once retrieval is proven to be working correctly.</li>
          </ul>
          <p>This decomposition means that when a RAG system starts misbehaving in production, you run each module's tests independently and pinpoint which layer broke — rather than staring at a final answer and guessing.</p>
        </>,
        ar: <>
          <p>بعد إعادة الترتيب، تُجمَّع أعلى K أجزاء في الأمر النهائي. قالب أمر موثوق لإجابات RAG يتبع بنية ثابتة:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>تعليمة النظام:</strong> "أجب فقط باستخدام السياق المُقدَّم. إذا لم يحتوِ السياق على معلومات كافية، قل ذلك صراحةً. استشهد برقم المصدر لكل ادعاء."</li>
            <li><strong>كتل السياق المرقّمة:</strong> كل جزء مسترجع مسبوق برقم مصدره، ليتمكن النموذج من نسب الادعاءات. الترتيب مهم — ضع الأجزاء الأعلى صلةً أولًا، إذ تنتبه النماذج بقوة أكبر للسياق المبكر.</li>
            <li><strong>سؤال المستخدم:</strong> الاستعلام الأصلي غير المعدَّل. لا تمرّر صياغات الاستعلام الموسّعة للنموذج — تلك كانت للاسترجاع فقط.</li>
          </ol>
          <p>تعليمة "استشهد بأرقام المصادر" ليست فقط لشفافية المستخدم — إنها تتيح لك التحقق برمجيًا من إمكانية تتبع ادعاءات النموذج إلى أجزاء مسترجعة محددة، وهو فحص أمانة آلي قيّم.</p>
          <p>إبقاء الخط <strong>معياريًا وقابلًا للاختبار المستقل</strong> هو الانضباط الذي يفصل RAG الجاهز للإنتاج عن النموذج الأوّلي:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>اختبر خطوة الاستعلام الذاتي بمدخلات معروفة وتحقق أن البيانات الوصفية الصحيحة تُستخرج — بلا توليد نماذج في التأكيد.</li>
            <li>اختبر المسترجع كاملًا بمجموعة تقييم ثابتة: لاستعلام معين، هل تظهر الأجزاء الصحيحة في أعلى K؟ قس <Eng>Recall@K</Eng> قبل وبعد أي تغيير في التقطيع أو نماذج التضمين أو إعدادات الاسترجاع.</li>
            <li>اختبر تجميع الأمر بالتحقق أن السلسلة المنسّقة تطابق القالب المتوقع — منطق نصي خالص، لا حاجة لاستدعاء نموذج.</li>
            <li>اختبر أمانة التوليد بشكل مستقل باستخدام محكّمك اللغوي المختار — فقط بعد إثبات أن الاسترجاع يعمل بشكل صحيح.</li>
          </ul>
          <p>هذا التفكيك يعني أنه حين يبدأ نظام RAG بالتصرف بشكل خاطئ في الإنتاج، تشغّل اختبارات كل وحدة بشكل مستقل وتحدد الطبقة المعطوبة — بدلًا من التحديق في الإجابة النهائية والتخمين.</p>
        </>
      },
    },
  ],
  quiz: [
    {
      question: { en: "What is the main purpose of the self-query technique?", ar: "ما الغرض الرئيسي من تقنية الاستعلام الذاتي؟" },
      options: {
        en: ["Generate a better answer", "Extract metadata from the question to use as retrieval filters", "Re-rank the retrieved chunks", "Compress the prompt"],
        ar: ["توليد إجابة أفضل", "استخراج بيانات وصفية من السؤال لاستخدامها كفلاتر استرجاع", "إعادة ترتيب الأجزاء المسترجعة", "ضغط الأمر"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Query expansion helps because a single embedding vector:", ar: "يساعد توسيع الاستعلام لأن متجه تضمين واحد:" },
      options: {
        en: ["Is too large to search efficiently", "Covers only a small region of embedding space, missing relevant docs phrased differently", "Cannot be stored in the vector DB", "Takes too long to compute"],
        ar: ["كبير جدًا للبحث بكفاءة", "يغطي منطقة صغيرة فقط من فضاء التضمين، يفوّت مستندات ذات صلة بصياغات مختلفة", "لا يمكن تخزينه في قاعدة البيانات الاتجاهية", "يستغرق وقتًا طويلًا للحساب"]
      },
      correctIndex: 1
    },
    {
      question: { en: "A cross-encoder reranker is more accurate than embedding distance because it:", ar: "النموذج المعيد للترتيب أدق من مسافة التضمين لأنه:" },
      options: {
        en: ["Uses a larger vocabulary", "Reads the query and chunk together in one sequence, enabling cross-attention", "Searches the entire corpus at once", "Uses keyword matching"],
        ar: ["يستخدم مفردات أكبر", "يقرأ الاستعلام والجزء معًا في تسلسل واحد مما يتيح الانتباه المتقاطع", "يبحث في المجموعة كاملة في آنٍ واحد", "يستخدم مطابقة الكلمات المفتاحية"]
      },
      correctIndex: 1
    },
    {
      question: { en: "When assembling the final RAG prompt, expanded query variants should:", ar: "عند تجميع الأمر النهائي لـ RAG، صياغات الاستعلام الموسّعة يجب أن:" },
      options: {
        en: ["Be included to give the LLM more context", "Not be included — only the original user question goes in the prompt", "Replace the original question", "Be added as footnotes"],
        ar: ["تُضمَّن لإعطاء النموذج سياقًا أكثر", "لا تُضمَّن — سؤال المستخدم الأصلي فقط يدخل الأمر", "تحل محل السؤال الأصلي", "تُضاف كحواشٍ"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why should the retrieval and generation modules be independently testable?", ar: "لماذا يجب أن تكون وحدتا الاسترجاع والتوليد قابلتين للاختبار بشكل مستقل؟" },
      options: {
        en: ["To save compute costs", "To pinpoint which stage is failing when RAG misbehaves, without guessing", "Because they run on different servers", "To improve tokenization speed"],
        ar: ["لتوفير تكاليف الحوسبة", "لتحديد المرحلة الفاشلة حين يتصرف RAG بشكل خاطئ، دون تخمين", "لأنهما تعملان على خوادم مختلفة", "لتحسين سرعة التقطيع"]
      },
      correctIndex: 1
    },
  ],
};
