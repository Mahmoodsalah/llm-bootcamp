import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import DPOExplorer from '../../components/widgets/DPOExplorer';

export const preferenceAlignmentModule: ModuleDef = {
  id: "6",
  title: { en: "Preference Alignment (DPO)", ar: "محاذاة التفضيلات (DPO)" },
  description: {
    en: "Why SFT alone is insufficient, preference datasets with chosen/rejected pairs, RLHF with PPO overview, and Direct Preference Optimization — training a model to prefer better responses without a separate reward model.",
    ar: "لماذا الضبط الموجَّه وحده غير كافٍ، ومجموعات بيانات التفضيلات بأزواج المختار/المرفوض، ونظرة عامة على RLHF بـPPO، والتحسين المباشر للتفضيلات — تدريب النموذج لتفضيل الإجابات الأفضل بدون نموذج مكافأة منفصل."
  },
  lessons: [
    {
      id: "why-alignment",
      title: { en: "Beyond SFT: Why Alignment Matters", ar: "ما وراء SFT: لماذا تهم المحاذاة" },
      content: {
        en: <>
          <p>Supervised fine-tuning teaches a model to imitate labeled examples — but human preferences are not simply "correct vs. incorrect". They involve <em>style</em>, <em>tone</em>, <em>safety</em>, <em>helpfulness</em>, and countless subtle judgments that are impossible to capture in a single right answer. A model that has learned to follow instructions can still produce responses that are technically accurate but verbose, condescending, or stylistically off-brand.</p>
          <p>Preference alignment addresses this with a different kind of training signal: instead of asking "what is the right answer?", it asks "given two answers, which is better?" — and trains the model to systematically prefer the better one. The key insight is that humans are much better at <em>comparing</em> two responses than at <em>producing</em> ideal responses from scratch. This comparative signal is richer and more reliable than absolute labels.</p>
          <p>Real-world scenarios where preference alignment outperforms SFT alone:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Chatbots:</strong> naturalness and engagement are inherently comparative — users prefer one response over another without there being a "ground truth".</li>
            <li><strong>Safety and content moderation:</strong> borderline cases require nuanced judgment that binary labels can't capture.</li>
            <li><strong>Code generation:</strong> multiple solutions may be correct; preference data teaches which solutions are idiomatic, readable, and maintainable.</li>
            <li><strong>Style transfer:</strong> making a model's voice match a specific author or brand identity, where SFT-generated synthetic examples would miss the point.</li>
          </ul>
          <p>Alignment is also less destructive than SFT — it nudges the model rather than overwriting its behavior — so it can repair models that have drifted after merging or pruning.</p>
        </>,
        ar: <>
          <p>الضبط الدقيق الموجَّه يُعلِّم النموذج تقليد أمثلة موسومة — لكن تفضيلات البشر ليست مجرد "صحيح مقابل خاطئ". تنطوي على <em>أسلوب</em> و<em>نبرة</em> و<em>سلامة</em> و<em>فائدة</em> وأحكام دقيقة لا حصر لها يستحيل التقاطها في إجابة صحيحة واحدة. نموذج تعلّم اتباع التعليمات لا يزال يمكنه إنتاج إجابات دقيقة تقنياً لكنها مطوّلة أو مُتعالية أو مخالفة للأسلوب المطلوب.</p>
          <p>تعالج محاذاة التفضيلات هذا بنوع مختلف من إشارة التدريب: بدلاً من السؤال "ما الإجابة الصحيحة؟"، تسأل "بين إجابتين، أيهما أفضل؟" — وتُدرِّب النموذج لتفضيل الأفضل بشكل منهجي. الرؤية الجوهرية هي أن البشر أفضل بكثير في <em>مقارنة</em> إجابتين من <em>إنتاج</em> إجابات مثالية من الصفر. هذه الإشارة المقارنة أغنى وأوثق من التسميات المطلقة.</p>
          <p>سيناريوهات واقعية تتفوق فيها محاذاة التفضيلات على الضبط الموجَّه وحده:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>روبوتات المحادثة:</strong> الطبيعية والإشراك بطبيعتهما مقارنيَّان — يُفضِّل المستخدمون إجابة على أخرى دون وجود "حقيقة أرضية".</li>
            <li><strong>السلامة وإشراف المحتوى:</strong> الحالات الحدية تتطلب حكماً دقيقاً لا تستطيع التسميات الثنائية التقاطه.</li>
            <li><strong>توليد الكود:</strong> حلول متعددة قد تكون صحيحة؛ بيانات التفضيل تُعلِّم أي الحلول أكثر صحة من الناحية البرمجية وقابلية القراءة والصيانة.</li>
            <li><strong>نقل الأسلوب:</strong> جعل صوت النموذج يطابق مؤلفاً أو هوية علامة تجارية محددة، حيث الأمثلة الاصطناعية المولَّدة بالضبط الموجَّه ستفوّت الهدف.</li>
          </ul>
          <p>المحاذاة أيضاً أقل تدميراً من الضبط الموجَّه — تُعدِّل النموذج بدلاً من الكتابة فوق سلوكه — لذا يمكنها إصلاح النماذج التي انحرفت بعد الدمج أو التشذيب.</p>
        </>
      }
    },
    {
      id: "preference-datasets",
      title: { en: "Preference Datasets: Structure & Creation", ar: "مجموعات بيانات التفضيلات: البنية والإنشاء" },
      content: {
        en: <>
          <p>A preference dataset contains triples: a <strong>prompt</strong> (instruction), a <strong>chosen</strong> response (the preferred one), and a <strong>rejected</strong> response (the one to move away from). Without the rejected response, the dataset is just an instruction dataset — the contrast is what carries the preference signal.</p>
          <p>The rejected response is as important as the chosen one. It represents the behavior the model should learn to avoid, giving enormous flexibility: you can use preference data to teach the model to refuse harmful requests, adopt a specific writing style, generate more concise responses, or even deny a fabricated origin story. A surprisingly small dataset — 200–500 carefully constructed pairs — can achieve focused behavioral changes.</p>
          <p>Four approaches to generating preference pairs, ordered by scalability:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Human-generated, human-evaluated:</strong> highest quality but extremely expensive. Used by large AI labs for their flagship models.</li>
            <li><strong>LLM-generated, human-evaluated:</strong> an LLM produces multiple response candidates; humans rank them. Humans judge better than they write — this is the sweet spot for quality-efficiency.</li>
            <li><strong>Human-generated, LLM-evaluated:</strong> rarely used — inefficient since generation still requires human effort.</li>
            <li><strong>Fully synthetic:</strong> an LLM generates and evaluates all pairs. Scalable and increasingly effective as models improve. Requires careful prompt engineering to avoid quality collapse and the "verbosity bias" of LLM judges (they tend to prefer longer answers).</li>
          </ul>
          <p>A clever natural approach: use a high-quality model to generate the "chosen" responses and a weaker or deliberately-flawed model for "rejected" responses — no explicit evaluation step needed, the quality gap is built in. For style transfer, the original human-written text becomes "chosen" and the model-generated paraphrase becomes "rejected".</p>
        </>,
        ar: <>
          <p>تحتوي مجموعة بيانات التفضيلات على ثلاثيات: <strong>أمر</strong> (تعليمات)، وإجابة <strong>مختارة</strong> (المُفضَّلة)، وإجابة <strong>مرفوضة</strong> (التي يجب الابتعاد عنها). بدون الإجابة المرفوضة، مجموعة البيانات مجرد مجموعة تعليمات — التباين هو ما يحمل إشارة التفضيل.</p>
          <p>الإجابة المرفوضة بنفس أهمية المختارة. تمثل السلوك الذي يجب أن يتعلم النموذج تجنبه، مما يُعطي مرونة هائلة: يمكنك استخدام بيانات التفضيل لتعليم النموذج رفض الطلبات الضارة، أو تبني أسلوب كتابة محدد، أو توليد إجابات أكثر إيجازاً، أو حتى نفي قصة أصل مختلقة. مجموعة بيانات صغيرة بشكل مدهش — 200–500 زوج مُصمَّم بعناية — يمكنها تحقيق تغييرات سلوكية محددة.</p>
          <p>أربعة مناهج لتوليد أزواج التفضيل، مرتبة حسب قابلية التوسع:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>بشري التوليد، بشري التقييم:</strong> أعلى جودة لكن باهظ التكلفة. تستخدمه مختبرات الذكاء الاصطناعي الكبرى لنماذجها الرائدة.</li>
            <li><strong>مولَّد بنموذج، مُقيَّم بشرياً:</strong> يُنتج نموذج عدة مرشحين للإجابة؛ البشر يرتبونها. البشر أفضل في الحكم من الكتابة — هذه النقطة المثلى للجودة والكفاءة.</li>
            <li><strong>بشري التوليد، مُقيَّم بنموذج:</strong> نادر الاستخدام — غير فعال لأن التوليد لا يزال يتطلب جهداً بشرياً.</li>
            <li><strong>اصطناعي كلياً:</strong> نموذج يُولِّد ويُقيِّم جميع الأزواج. قابل للتوسع وفعّال بشكل متزايد مع تحسن النماذج. يتطلب هندسة أوامر حذرة لتجنب انهيار الجودة وـ"تحيز الإطالة" لدى قضاة النماذج (يميلون لتفضيل الإجابات الأطول).</li>
          </ul>
          <p>نهج طبيعي ذكي: استخدام نموذج عالي الجودة لتوليد إجابات "المختار" ونموذج أضعف أو مُعيب عمداً للإجابات "المرفوضة" — لا حاجة لخطوة تقييم صريحة، فجوة الجودة مُدمجة في العملية. لنقل الأسلوب، النص المكتوب بشرياً يصبح "المختار" والاقتباس المُولَّد بالنموذج يصبح "المرفوض".</p>
        </>
      }
    },
    {
      id: "rlhf-dpo",
      title: { en: "RLHF vs DPO", ar: "RLHF مقابل DPO" },
      content: {
        en: <>
          <p>The original approach to preference alignment is <strong>RLHF with PPO</strong> (Reinforcement Learning from Human Feedback using Proximal Policy Optimization). It works in two stages: first, train a <em>reward model</em> on the preference pairs (a separate model that scores any response); then, use RL to optimize the policy (chat model) to maximize that reward score while a KL-divergence penalty keeps it from straying too far from a frozen reference copy. The math works, but the engineering complexity is formidable: two models in memory simultaneously, hyperparameters for both the reward model and the RL loop, reward hacking (the chat model discovers responses that score high on the reward model but are nonsensical), and unstable training dynamics.</p>
          <p><strong>Direct Preference Optimization (DPO)</strong> achieves the same objective — pulling the model toward chosen responses and away from rejected ones — but eliminates the separate reward model entirely. The key insight is mathematical: the optimal reward function for any RLHF objective can be expressed in closed form using the policy itself and a reference model. This lets you rearrange the training loss into a form that operates directly on preference pairs:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>The <strong>policy model</strong> (the model being trained) sees both chosen and rejected responses and adjusts to increase the log-probability ratio of chosen over rejected.</li>
            <li>The <strong>frozen reference model</strong> (a fixed copy of the base model, never updated) provides an anchor — the training loss penalizes the policy for diverging too far from it.</li>
            <li>The <strong>beta (β)</strong> hyperparameter controls this tightness: low β allows dramatic shifts toward chosen; high β keeps the model close to the reference distribution. Practical values range from 0.01 to 0.5; DPO is known to make models more verbose at low β, so start conservatively around 0.1.</li>
          </ul>
          <p>DPO in practice: it is less destructive than SFT, trains in a single stage, needs only one model in GPU memory (the reference can be off-loaded), and converges quickly — 1–3 epochs is typically enough. The main failure mode is that DPO can degrade general capabilities if the preference dataset is narrow or if β is too low. Always evaluate on general benchmarks alongside task-specific ones after training.</p>
        </>,
        ar: <>
          <p>النهج الأصلي لمحاذاة التفضيلات هو <strong><Eng>RLHF</Eng> بـ<Eng>PPO</Eng></strong> (التعلم المعزز من تغذية راجعة بشرية باستخدام تحسين السياسة القريبة). يعمل في مرحلتين: أولاً، تدريب <em>نموذج مكافأة</em> على أزواج التفضيل (نموذج منفصل يُسجِّل أي إجابة)؛ ثم، استخدام التعلم المعزز لتحسين السياسة (نموذج المحادثة) لتعظيم نتيجة المكافأة بينما تُبقي عقوبة <Eng>KL-divergence</Eng> عليه من الانحراف بعيداً عن نسخة مرجعية مجمَّدة. الرياضيات تعمل، لكن تعقيد الهندسة هائل: نموذجان في الذاكرة في آنٍ واحد، معاملات فائقة لنموذج المكافأة وحلقة التعلم المعزز، اختراق المكافأة (نموذج المحادثة يكتشف إجابات تسجّل عالياً لكنها لا معنى لها)، وديناميكيات تدريب غير مستقرة.</p>
          <p><strong>التحسين المباشر للتفضيلات (<Eng>DPO</Eng>)</strong> يحقق نفس الهدف — سحب النموذج نحو الإجابات المختارة وابتعاداً عن المرفوضة — لكنه يُزيل نموذج المكافأة المنفصل كلياً. الرؤية الجوهرية رياضية: دالة المكافأة المثلى لأي هدف <Eng>RLHF</Eng> يمكن التعبير عنها في صورة مغلقة باستخدام السياسة نفسها ونموذج مرجعي. هذا يُتيح إعادة ترتيب خسارة التدريب في شكل يعمل مباشرة على أزواج التفضيل:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>نموذج السياسة</strong> (النموذج المُدرَّب) يرى كلاً من الإجابات المختارة والمرفوضة ويتعدَّل لزيادة نسبة اللوغاريتم الاحتمالي للمختار على المرفوض.</li>
            <li><strong>النموذج المرجعي المجمَّد</strong> (نسخة ثابتة من النموذج الأساسي، لا تُحدَّث أبداً) يوفر مرساة — خسارة التدريب تُعاقب السياسة على الانحراف البعيد عنه.</li>
            <li>المعلمة الفائقة <strong>بيتا (β)</strong> تتحكم في هذه الإحكام: β منخفض يُتيح تحولات كبيرة نحو المختار؛ β مرتفع يُبقي النموذج قريباً من التوزيع المرجعي. القيم العملية تتراوح من 0.01 إلى 0.5؛ <Eng>DPO</Eng> معروف بجعل النماذج أكثر إطالةً عند β منخفض، لذا ابدأ بحذر حول 0.1.</li>
          </ul>
          <p><Eng>DPO</Eng> عملياً: أقل تدميراً من الضبط الموجَّه، يُدرَّب في مرحلة واحدة، يحتاج نموذجاً واحداً فقط في ذاكرة GPU (يمكن إزاحة المرجعي)، ويتقارب بسرعة — 1–3 عصور كافية عادةً. الفشل الرئيسي هو أن <Eng>DPO</Eng> يمكنه تدهور القدرات العامة إن كانت مجموعة بيانات التفضيل ضيقة أو β منخفضاً جداً. قيّم دائماً على معايير قياسية عامة جانباً مع المهام المحددة بعد التدريب.</p>
        </>
      },
      math: {
        en: <p dir="ltr">DPO loss: L(π) = −E_(x,y_w,y_l) [ log σ( β · log(π(y_w|x)/π_ref(y_w|x)) − β · log(π(y_l|x)/π_ref(y_l|x)) ) ] where π is the policy, π_ref is the frozen reference, y_w is chosen, y_l is rejected, and σ is the sigmoid. Higher β → stronger KL penalty → policy stays closer to reference.</p>,
        ar: <p dir="ltr">خسارة DPO: L(π) = −E_(x,y_w,y_l) [ log σ( β · log(π(y_w|x)/π_ref(y_w|x)) − β · log(π(y_l|x)/π_ref(y_l|x)) ) ] حيث π هي السياسة، π_ref هو المرجع المجمَّد، y_w المختار، y_l المرفوض، وσ هي الدالة السينية. β أعلى ← عقوبة KL أقوى ← السياسة تبقى أقرب للمرجع.</p>
      },
      widget: <DPOExplorer />
    },
    {
      id: "alignment-practice",
      title: { en: "Creating Custom Preference Data & Choosing a Method", ar: "إنشاء بيانات تفضيل مخصصة واختيار الطريقة" },
      content: {
        en: <>
          <p>For the LLM Twin project — where the goal is to make a model write in the style of a specific author — the preference data construction is elegant: the <em>chosen</em> response is an extract directly from the author's original writing (ground truth), and the <em>rejected</em> response is what the SFT-trained model would generate given the same prompt. No explicit evaluation step is needed because the quality gap is structural: authentic human prose vs. model-generated imitation.</p>
          <p>Two practical quality filters help keep the dataset clean: filter out chosen responses that are shorter than 100 characters (too short to carry style) and filter out responses that don't start with a capital letter and end with proper punctuation (formatting artifacts that would teach the model bad habits). Simple heuristics like these save the cost of running an LLM judge on thousands of pairs.</p>
          <p>Guidance on choosing between alignment methods:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>RLHF + PPO:</strong> when you have the engineering resources of a large AI lab, need very fine-grained reward shaping, and are training a general-purpose assistant at scale.</li>
            <li><strong>DPO:</strong> the default choice for most teams. Simpler, faster, requires fewer resources, and achieves comparable results for most preference tasks.</li>
            <li><strong>ORPO / SimPO:</strong> newer single-stage variants that don't even require a reference model, further simplifying the pipeline.</li>
            <li><strong>SFT only:</strong> sufficient when you have high-quality instruction data and the task is well-defined without significant preference ambiguity.</li>
          </ul>
          <p>A typical post-training pipeline for a production model runs both: SFT first (to teach the chat format and task-specific skills), followed by DPO (to align style, safety, and helpfulness). The two stages are complementary — SFT teaches the model <em>what</em> to do, DPO teaches it to do it <em>well</em> by human standards.</p>
        </>,
        ar: <>
          <p>لمشروع التوأم اللغوي (<Eng>LLM Twin</Eng>) — حيث الهدف جعل نموذج يكتب بأسلوب مؤلف محدد — بناء بيانات التفضيل أنيق: إجابة <em>المختار</em> هي مقتطف مباشر من كتابات المؤلف الأصلية (الحقيقة الأرضية)، وإجابة <em>المرفوض</em> هي ما سيولّده النموذج المضبوط بالضبط الموجَّه بنفس الأمر. لا حاجة لخطوة تقييم صريحة لأن فجوة الجودة بنيوية: نثر بشري أصيل مقابل محاكاة مولَّدة بنموذج.</p>
          <p>مرشحان عمليان للجودة يساعدان في إبقاء مجموعة البيانات نظيفة: تصفية الإجابات المختارة الأقصر من 100 حرف (قصيرة جداً لحمل الأسلوب) وتصفية الإجابات التي لا تبدأ بحرف كبير وتنتهي بعلامة ترقيم صحيحة (آثار تنسيقية ستُعلِّم النموذج عادات سيئة). إرشادات بسيطة كهذه توفر تكلفة تشغيل قاضٍ نموذجي على آلاف الأزواج.</p>
          <p>توجيه لاختيار بين طرق المحاذاة:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong><Eng>RLHF + PPO</Eng>:</strong> حين تملك موارد هندسية مختبر ذكاء اصطناعي كبير، وتحتاج تشكيل مكافأة دقيق جداً، وتُدرِّب مساعداً عاماً على نطاق واسع.</li>
            <li><strong><Eng>DPO</Eng>:</strong> الاختيار الافتراضي لمعظم الفرق. أبسط وأسرع ويحتاج موارد أقل ويحقق نتائج مقارنة لمعظم مهام التفضيل.</li>
            <li><strong><Eng>ORPO / SimPO</Eng>:</strong> متغيرات أحدث أحادية المرحلة لا تحتاج حتى نموذجاً مرجعياً، مما يُبسِّط الخط أكثر.</li>
            <li><strong>الضبط الموجَّه فقط:</strong> كافٍ حين لديك بيانات تعليمات عالية الجودة والمهمة محددة جيداً بدون غموض تفضيلي كبير.</li>
          </ul>
          <p>خط ما بعد التدريب النموذجي للنموذج الإنتاجي يُشغِّل كليهما: الضبط الموجَّه أولاً (لتعليم تنسيق المحادثة والمهارات الخاصة بالمهمة)، يتبعه <Eng>DPO</Eng> (لمحاذاة الأسلوب والسلامة والفائدة). المرحلتان متكاملتان — الضبط الموجَّه يُعلِّم النموذج <em>ماذا</em> يفعل، و<Eng>DPO</Eng> يُعلِّمه كيف يفعله <em>بشكل جيد</em> وفق المعايير البشرية.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "What does a preference dataset contain that a regular instruction dataset does not?", ar: "ماذا تحتوي مجموعة بيانات التفضيلات مما لا تحتويه مجموعة تعليمات عادية؟" },
      options: {
        en: ["Longer instructions", "A rejected response alongside the chosen one", "Multiple programming languages", "Image inputs"],
        ar: ["تعليمات أطول", "إجابة مرفوضة جانباً للإجابة المختارة", "لغات برمجة متعددة", "مدخلات صور"]
      },
      correctIndex: 1
    },
    {
      question: { en: "In DPO, the frozen reference model serves to:", ar: "في DPO، يعمل النموذج المرجعي المجمَّد على:" },
      options: {
        en: ["Generate the rejected responses", "Anchor the policy model — preventing it from drifting too far from the base", "Score the quality of training data", "Replace the embedding model"],
        ar: ["توليد الإجابات المرفوضة", "تثبيت نموذج السياسة — منعه من الانحراف بعيداً عن القاعدة", "تسجيل جودة بيانات التدريب", "استبدال نموذج التضمين"]
      },
      correctIndex: 1
    },
    {
      question: { en: "A higher DPO β (beta) value means:", ar: "قيمة β أعلى في DPO تعني:" },
      options: {
        en: ["The model drifts further from the reference model", "The policy stays closer to the reference model distribution", "Training is faster", "The dataset needs to be larger"],
        ar: ["النموذج ينحرف أكثر عن النموذج المرجعي", "السياسة تبقى أقرب لتوزيع النموذج المرجعي", "التدريب يصبح أسرع", "مجموعة البيانات تحتاج أن تكون أكبر"]
      },
      correctIndex: 1
    },
    {
      question: { en: "The main engineering advantage of DPO over RLHF+PPO is:", ar: "الميزة الهندسية الرئيسية لـDPO على RLHF+PPO هي:" },
      options: {
        en: ["DPO uses more training data", "DPO eliminates the need for a separate reward model, simplifying the pipeline", "DPO always achieves higher accuracy", "DPO works only for text classification"],
        ar: ["DPO يستخدم بيانات تدريب أكثر", "DPO يُزيل الحاجة لنموذج مكافأة منفصل مما يُبسِّط الخط", "DPO يحقق دائماً دقة أعلى", "DPO يعمل فقط لتصنيف النصوص"]
      },
      correctIndex: 1
    },
    {
      question: { en: "For fine-tuning a model to imitate an author's writing style, a good 'rejected' response is:", ar: "لضبط نموذج دقيقاً لتقليد أسلوب كتابة مؤلف، الإجابة 'المرفوضة' الجيدة هي:" },
      options: {
        en: ["Another human author's writing", "The model's own generated paraphrase of the author's text", "A randomly sampled web document", "A response in a different language"],
        ar: ["كتابات مؤلف بشري آخر", "اقتباس النموذج الذاتي لنص المؤلف", "مستند ويب مختار عشوائياً", "إجابة بلغة مختلفة"]
      },
      correctIndex: 1
    }
  ]
};
