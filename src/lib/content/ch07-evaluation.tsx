import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import EvalLab from '../../components/widgets/EvalLab';

export const evaluationModule: ModuleDef = {
  id: "7",
  title: { en: "Evaluating LLMs", ar: "تقييم نماذج اللغة" },
  description: {
    en: "Why evaluation is genuinely hard, how benchmarks and LLM-as-a-judge work, and how to build a reliable eval strategy for RAG and task-specific systems.",
    ar: "لماذا التقييم صعب حقًا، وكيف تعمل المعايير والنموذج كمحكّم، وكيف تبني استراتيجية تقييم موثوقة لأنظمة RAG والمهام المتخصصة.",
  },
  lessons: [
    {
      id: "why-hard",
      title: { en: "Why Evaluation Is Hard", ar: "لماذا التقييم صعب؟" },
      content: {
        en: <>
          <p>Evaluating a traditional ML model is relatively straightforward: you hold out a test set, compute accuracy or mean squared error, and compare numbers. LLMs break this workflow in almost every direction. A model can answer a question correctly, fluently, in the wrong language, with a made-up citation, and still score 100% on a simple "is it right?" check. There is no single metric that captures all the things we care about simultaneously.</p>
          <p>Three structural differences separate LLM evaluation from classical ML:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Multi-task nature:</strong> the same model is expected to summarize, translate, write code, and hold a conversation. Each capability needs its own evaluation lens — no shared numerical metric covers all of them.</li>
            <li><strong>Open-ended outputs:</strong> traditional classifiers emit a label from a fixed set. LLMs emit free-form text, so "correctness" requires judgment, not just string matching.</li>
            <li><strong>Subjectivity and context dependence:</strong> "helpful" means different things in a medical chatbot versus a creative writing assistant. Good evaluation must be anchored to the target use case.</li>
          </ul>
          <p>Because of these challenges, the field has converged on using <em>multiple signals together</em>: no single benchmark is trusted in isolation. When three independent evaluations point to the same conclusion, confidence rises — when they disagree, something is off and warrants investigation.</p>
        </>,
        ar: <>
          <p>تقييم نموذج <Eng>ML</Eng> التقليدي أمر نسبيًا بسيط: تحجز مجموعة اختبار، تحسب الدقة أو متوسط الخطأ التربيعي، وتقارن الأرقام. نماذج اللغة الكبيرة تكسر هذا المنهج من كل اتجاه تقريبًا. يمكن للنموذج أن يجيب على سؤال بشكل صحيح وبطلاقة، لكن باللغة الخاطئة، مع استشهاد مختلق، ويظل يحصل على 100% في فحص "هل هو صحيح؟" البسيط. لا يوجد مقياس واحد يلتقط كل ما نهتم به في آنٍ واحد.</p>
          <p>ثلاثة فوارق هيكلية تفصل تقييم نماذج اللغة عن تعلم الآلة الكلاسيكي:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الطبيعة متعددة المهام:</strong> يُتوقع من النموذج ذاته التلخيص والترجمة وكتابة الكود وإجراء المحادثة. تحتاج كل قدرة عدسة تقييم خاصة — لا مقياس رقمي مشترك يغطيها جميعًا.</li>
            <li><strong>المخرجات مفتوحة النهاية:</strong> المصنّفات التقليدية تصدر تسمية من مجموعة ثابتة. نماذج اللغة تصدر نصًا حرًا، فـ"الصحة" تتطلب حكمًا لا مجرد مطابقة نص.</li>
            <li><strong>الذاتية والسياقية:</strong> كلمة "مفيد" تعني أشياء مختلفة في روبوت طبي وفي مساعد الكتابة الإبداعية. يجب أن يكون التقييم الجيد مرتبطًا بحالة الاستخدام المستهدفة.</li>
          </ul>
          <p>بسبب هذه التحديات، تقاربت جهود الميدان على استخدام <em>إشارات متعددة معًا</em>: لا يُوثق بمعيار واحد منعزل. حين تشير ثلاثة تقييمات مستقلة إلى نفس الاستنتاج يرتفع مستوى الثقة — وحين تتعارض فهذا يستوجب التحقيق.</p>
        </>
      },
      math: {
        en: <p>Perplexity = exp(cross-entropy loss) — measures how "surprised" the model is by validation text. Lower is better during pre-training, but a model with low perplexity on a benchmark can still produce harmful or unhelpful outputs in production. Perplexity is a training-phase signal, not a deployment-phase quality certificate.</p>,
        ar: <p><Eng>Perplexity</Eng> = exp(cross-entropy loss) — يقيس مدى "مفاجأة" النموذج بنص التحقق. القيمة الأدنى أفضل في مرحلة التدريب، لكن نموذجًا منخفض <Eng>Perplexity</Eng> على معيار قد ينتج مخرجات ضارة أو غير مفيدة في الإنتاج. إنه إشارة مرحلة التدريب، لا شهادة جودة للنشر.</p>
      },
    },
    {
      id: "benchmarks",
      title: { en: "Benchmarks: Power and Limits", ar: "المعايير: القوة والقيود" },
      content: {
        en: <>
          <p>General-purpose benchmarks measure broad capabilities at scale, making it feasible to compare dozens of models without human annotation. Common ones cover three clusters:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Knowledge (<Eng>MMLU</Eng>-style):</strong> multiple-choice questions across 57 academic subjects, from elementary science to professional medicine. Tests whether knowledge was absorbed during pre-training. A good base model score here; fine-tuning should not significantly drop it.</li>
            <li><strong>Reasoning (<Eng>HellaSwag</Eng>, <Eng>ARC-C</Eng>, <Eng>Winogrande</Eng>):</strong> questions that require causal inference, pronoun resolution, or selecting the most plausible story continuation. Harder to game with memorization.</li>
            <li><strong>Instruction following and conversation (<Eng>IFEval</Eng>, <Eng>MT-Bench</Eng>, <Eng>AlpacaEval</Eng>):</strong> test fine-tuned models specifically — can the model follow a constrained prompt? Maintain coherence across turns?</li>
          </ul>
          <p>Domain-specific evaluation suites exist for medicine, code, legal reasoning, and language-specific LLMs. The pattern is consistent: take translated or native versions of general benchmarks, then complement them with domain-specific tasks that stress-test exactly the competencies you care about.</p>
          <p><strong>The contamination problem</strong> is real and growing. Public benchmarks, once released, risk being included in training data — either accidentally (web crawls include benchmark websites) or deliberately. A suspicious sign: a model's MMLU score jumping 10+ points after supervised fine-tuning with no plausible explanation. Treat benchmark jumps skeptically; triangulate with private holdout sets and human evaluation.</p>
        </>,
        ar: <>
          <p>المعايير العامة تقيس القدرات الواسعة بحجم كبير، مما يجعل مقارنة عشرات النماذج ممكنة دون تعليق بشري. الشائعة منها تغطي ثلاثة تجمعات:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>المعرفة (على نمط <Eng>MMLU</Eng>):</strong> أسئلة اختيار من متعدد في 57 مادة أكاديمية، من العلوم الابتدائية إلى الطب المهني. تختبر امتصاص المعرفة في مرحلة التدريب المسبق.</li>
            <li><strong>الاستدلال (<Eng>HellaSwag</Eng> و<Eng>ARC-C</Eng> و<Eng>Winogrande</Eng>):</strong> أسئلة تتطلب استنتاجًا سببيًا أو حل مرجعية الضمائر أو اختيار أكثر متابعة للقصة معقولية. أصعب من التحايل عليها بالحفظ.</li>
            <li><strong>اتباع التعليمات والمحادثة (<Eng>IFEval</Eng> و<Eng>MT-Bench</Eng> و<Eng>AlpacaEval</Eng>):</strong> تختبر النماذج المضبوطة دقيقًا تحديدًا — هل يستطيع النموذج اتباع أمر مقيّد؟ الحفاظ على التماسك عبر الأدوار؟</li>
          </ul>
          <p>توجد مجموعات تقييم متخصصة للطب والكود والاستدلال القانوني ونماذج لغات بعينها. النمط ثابت: خذ نسخًا مترجمة أو أصيلة من المعايير العامة، ثم أضف إليها مهامًا متخصصة تضغط على الكفاءات التي تهتم بها.</p>
          <p><strong>مشكلة التلوث</strong> حقيقية ومتنامية. المعايير العامة المنشورة معرضة للوقوع في بيانات التدريب — عرضيًا (زحف الويب يشمل مواقع المعايير) أو عمدًا. علامة مريبة: ارتفاع نتيجة <Eng>MMLU</Eng> أكثر من 10 نقاط بعد الضبط الدقيق دون تفسير معقول. تعامل مع القفزات في المعايير بريبة؛ وثّق بمجموعات محجوزة خاصة وتقييم بشري.</p>
        </>
      },
    },
    {
      id: "llm-judge",
      title: { en: "LLM-as-a-Judge", ar: "النموذج اللغوي كمحكّم" },
      content: {
        en: <>
          <p>When tasks are too open-ended for multiple-choice scoring — open-domain Q&A, creative writing, customer support — a strong LLM (typically GPT-4 class) can serve as an automated evaluator. There are two main patterns:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Rubric-based scoring:</strong> the judge receives the instruction, the model's answer, and a scoring rubric (e.g. 1–4 on relevance, helpfulness, and factuality). The judge outputs a score and a written explanation. The explanation matters: it helps you debug why certain answers fail.</li>
            <li><strong>Pairwise comparison:</strong> the judge receives two answers side-by-side and must select which is better, or declare a tie. This maps directly to human preference data and powers leaderboards like Chatbot Arena.</li>
          </ul>
          <p>LLM judges are not neutral. Known biases include:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Verbosity bias:</strong> longer, confident-sounding answers are systematically rated higher even when they are less accurate. Mitigate by adding an explicit length-penalty criterion.</li>
            <li><strong>Position bias:</strong> in pairwise comparisons, the judge tends to prefer whichever answer appears first. Run both orderings and average.</li>
            <li><strong>Style preferences:</strong> judges may reward nicely formatted Markdown over plain prose, independent of content quality.</li>
          </ul>
          <p>Best practice: use structured output (JSON mode or constrained generation) so scores are parseable; use at least 2–3 independent judges and average; provide ground-truth reference answers when available; iteratively refine your rubric by reviewing disagreements between judges and human raters.</p>
        </>,
        ar: <>
          <p>حين تكون المهام مفتوحة النهاية أكثر من أن تناسب تسجيل الاختيار من متعدد — أسئلة مفتوحة، كتابة إبداعية، دعم عملاء — يمكن لنموذج لغوي قوي (عادةً من فئة GPT-4) أن يكون محكّمًا آليًا. ثمة نمطان رئيسيان:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>التسجيل بمقياس محدد:</strong> يتلقى المحكّم التعليمات وإجابة النموذج ومقياس التقييم (مثلاً 1–4 في الصلة والفائدة والدقة). يُصدر المحكّم نتيجة وشرحًا مكتوبًا. الشرح مهم: يساعدك في فهم سبب فشل إجابات بعينها.</li>
            <li><strong>المقارنة الثنائية:</strong> يتلقى المحكّم إجابتين جنبًا إلى جنب ويجب أن يختار الأفضل أو يعلن التعادل. يتوافق هذا مباشرةً مع بيانات تفضيل البشر ويشغّل لوحات مثل <Eng>Chatbot Arena</Eng>.</li>
          </ul>
          <p>النماذج المحكّمة ليست محايدة. التحيزات المعروفة تشمل:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>تحيز الإطالة:</strong> الإجابات الطويلة الواثقة تُقيَّم منهجيًا أعلى حتى حين تكون أقل دقة. تصدّ لذلك بإضافة معيار صريح لعقوبة الطول.</li>
            <li><strong>تحيز الموضع:</strong> في المقارنات الثنائية، يميل المحكّم لتفضيل الإجابة الأولى. شغّل الترتيبين وخذ المتوسط.</li>
            <li><strong>تفضيلات الأسلوب:</strong> قد يكافئ المحكّم نص <Eng>Markdown</Eng> المنسق على النثر البسيط، بصرف النظر عن جودة المحتوى.</li>
          </ul>
          <p>أفضل الممارسات: استخدم مخرجات منظمة (<Eng>JSON mode</Eng> أو التوليد المقيّد) لتسهيل تحليل النتائج؛ استخدم 2–3 محكّمين مستقلين على الأقل وخذ المتوسط؛ أضف إجابات مرجعية صحيحة حين تتوفر؛ وطوّر مقياسك تكراريًا بمراجعة الاختلافات بين المحكّمين والمقيّمين البشريين.</p>
        </>
      },
      widget: <EvalLab />,
    },
    {
      id: "rag-eval",
      title: { en: "RAG-Specific Evaluation", ar: "تقييم أنظمة RAG" },
      content: {
        en: <>
          <p>A RAG system has two separable stages — retrieval and generation — and they must be evaluated independently. Treating RAG as a black box ("is the final answer good?") is the single biggest evaluation mistake practitioners make. If the answer is wrong, you cannot know whether to fix the retriever or the generator without separate measurements.</p>
          <p><strong>Retrieval metrics:</strong></p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Recall@K:</strong> of the K retrieved chunks, does at least one contain the information needed to answer? This tells you whether the answer is even reachable from the retrieved context.</li>
            <li><strong>Context Precision:</strong> of the K retrieved chunks, how many are actually relevant? High recall with low precision means you're feeding the LLM noise alongside signal.</li>
          </ul>
          <p><strong>Generation metrics:</strong></p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Faithfulness:</strong> does every claim in the generated answer trace back to a source chunk? Computed by breaking the answer into atomic claims and checking each against the context.</li>
            <li><strong>Answer Relevancy:</strong> does the answer address the question, or does it drift into tangential territory? Measured by generating hypothetical questions from the answer and computing similarity to the original.</li>
          </ul>
          <p>A practical starting point: build a <strong>custom eval set from real usage</strong>. Sample 200–500 actual queries from your system's logs, manually annotate expected answers and the documents they rely on, then track all four metrics over time as you make changes. This distribution-aligned eval is far more predictive of real-world quality than any generic benchmark.</p>
        </>,
        ar: <>
          <p>نظام <Eng>RAG</Eng> له مرحلتان قابلتان للفصل — الاسترجاع والتوليد — ويجب تقييمهما بشكل مستقل. التعامل مع <Eng>RAG</Eng> كصندوق أسود ("هل الإجابة النهائية جيدة؟") هو أكبر خطأ تقييمي يقع فيه الممارسون. إذا كانت الإجابة خاطئة، لا يمكنك معرفة هل تصلح المسترجع أم المولّد بدون قياسات منفصلة.</p>
          <p><strong>مقاييس الاسترجاع:</strong></p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Recall@K:</strong> من بين K أجزاء مسترجعة، هل يحتوي واحد على الأقل على المعلومات اللازمة للإجابة؟ يخبرك هذا إن كانت الإجابة متاحة أصلًا من السياق المسترجع.</li>
            <li><strong>دقة السياق:</strong> من بين K أجزاء مسترجعة، كم منها ذات صلة فعلًا؟ استرجاع عالٍ مع دقة منخفضة يعني إطعام النموذج ضوضاءً مع الإشارة المفيدة.</li>
          </ul>
          <p><strong>مقاييس التوليد:</strong></p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الأمانة (<Eng>Faithfulness</Eng>):</strong> هل كل ادعاء في الإجابة المولودة يعود إلى جزء مصدر؟ يُحسب بتجزئة الإجابة إلى ادعاءات ذرية والتحقق من كل منها مقابل السياق.</li>
            <li><strong>صلة الإجابة (<Eng>Answer Relevancy</Eng>):</strong> هل تعالج الإجابة السؤال، أم تنجرف لأمور جانبية؟ يُقاس بتوليد أسئلة افتراضية من الإجابة وحساب تشابهها بالسؤال الأصلي.</li>
          </ul>
          <p>نقطة بداية عملية: ابنِ <strong>مجموعة تقييم مخصصة من الاستخدام الحقيقي</strong>. استخرج 200–500 استعلام فعلي من سجلات نظامك، علّق يدويًا على الإجابات المتوقعة والمستندات التي تعتمد عليها، ثم تتبع المقاييس الأربعة بمرور الوقت مع التغييرات. هذا التقييم المنسجم مع التوزيع الحقيقي أكثر تنبؤًا بجودة الإنتاج بكثير من أي معيار عام.</p>
        </>
      },
    },
  ],
  quiz: [
    {
      question: { en: "Why is there no single metric for LLM evaluation?", ar: "لماذا لا يوجد مقياس واحد لتقييم نماذج اللغة؟" },
      options: {
        en: ["LLMs are too small", "LLMs handle multiple open-ended tasks with subjective outputs", "Metrics haven't been invented yet", "LLMs always score 100%"],
        ar: ["النماذج صغيرة جدًا", "النماذج تتعامل مع مهام متعددة مفتوحة النهاية بمخرجات ذاتية", "لم تُخترع المقاييس بعد", "النماذج دائمًا تحصل على 100%"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What does benchmark contamination mean?", ar: "ما معنى تلوث المعيار (benchmark contamination)؟" },
      options: {
        en: ["The model corrupts the test server", "Test data leaks into training, inflating scores", "The benchmark has bugs", "Evaluation is too slow"],
        ar: ["النموذج يفسد خادم الاختبار", "بيانات الاختبار تتسرب للتدريب فترتفع النتائج زورًا", "المعيار يحتوي على أخطاء", "التقييم بطيء جدًا"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Verbosity bias in LLM-as-a-judge means:", ar: "تحيز الإطالة في النموذج كمحكّم يعني:" },
      options: {
        en: ["Judges prefer shorter answers", "Judges systematically rate longer confident answers higher regardless of accuracy", "Judges refuse to score long answers", "Length is never considered"],
        ar: ["المحكّمون يفضلون الإجابات القصيرة", "المحكّمون يُقيّمون الإجابات الطويلة الواثقة أعلى منهجيًا بصرف النظر عن الدقة", "المحكّمون يرفضون تقييم الإجابات الطويلة", "الطول لا يُعتبر أبدًا"]
      },
      correctIndex: 1
    },
    {
      question: { en: "In RAG evaluation, Faithfulness measures:", ar: "في تقييم RAG، الأمانة (Faithfulness) تقيس:" },
      options: {
        en: ["Whether the retriever found the right docs", "Whether every claim in the answer traces back to retrieved context", "How long the answer is", "Whether the model used a system prompt"],
        ar: ["هل وجد المسترجع المستندات الصحيحة", "هل كل ادعاء في الإجابة يعود لسياق مسترجع", "طول الإجابة", "هل استخدم النموذج أمر النظام"]
      },
      correctIndex: 1
    },
    {
      question: { en: "The best eval set for a production RAG system comes from:", ar: "أفضل مجموعة تقييم لنظام RAG في الإنتاج تأتي من:" },
      options: {
        en: ["Random internet questions", "Real user queries sampled from production logs", "Academic benchmarks only", "The model's own outputs"],
        ar: ["أسئلة عشوائية من الإنترنت", "استعلامات حقيقية للمستخدمين مأخوذة من سجلات الإنتاج", "المعايير الأكاديمية فقط", "مخرجات النموذج ذاته"]
      },
      correctIndex: 1
    },
  ],
};
