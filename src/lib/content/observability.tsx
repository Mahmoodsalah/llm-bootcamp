import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import Observability from '../../components/widgets/Observability';

export const observabilityModule: ModuleDef = {
  id: "11",
  title: { en: "Observability & Evaluation", ar: "المراقبة والتقييم" },
  description: {
    en: "TTFT, TPOT, goodput, tracing — and how to know whether your model is actually good.",
    ar: "TTFT وTPOT والتتبع — وكيف تعرف إن كان نموذجك جيدًا فعلاً."
  },
  lessons: [
    {
      id: "obs",
      title: { en: "Latency Metrics That Matter", ar: "مقاييس التأخير المهمة" },
      content: {
        en: <>
          <p>LLM latency is not one number. The metrics vocabulary, mapped to what users feel:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>TTFT</strong> (Time To First Token): the "is it alive?" delay before streaming begins. Driven by queueing + prefill, so it degrades with long prompts and busy servers. Target: &lt;1s chat, &lt;200ms autocomplete.</li>
            <li><strong>TPOT</strong> (Time Per Output Token): streaming smoothness. 1/TPOT = tokens/sec; 20+ tok/s reads faster than humans. Driven by decode bandwidth and batch pressure.</li>
            <li><strong>E2E latency</strong> = TTFT + TPOT × output tokens. For agents, multiply by the number of chained calls — a 10-step agent at 3s/step is a 30-second product experience.</li>
            <li><strong>Goodput:</strong> throughput <em>that meets your SLO</em>. A server pushing 10k tok/s where half the requests violate TTFT targets has great throughput and terrible goodput — always optimize the latter.</li>
          </ul>
          <p>Report <strong>percentiles, not averages</strong> (p50/p95/p99): batching and shared caches make LLM latency wildly variable, and your unhappiest users live at p99. Standard dashboards track: request rate, TTFT/TPOT percentiles, queue depth, batch size, KV-cache utilization, prefix-cache hit rate, GPU utilization, and error/timeout rates — each maps to a specific fix you've learned in earlier modules.</p>
        </>,
        ar: <>
          <p>تأخير النماذج ليس رقمًا واحدًا. مفردات القياس مربوطة بما يشعر به المستخدم:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong><Eng>TTFT</Eng></strong> (زمن أول رمز): تأخير "هل هو حي؟" قبل بدء البث. يحكمه الطابور + الـ prefill، فيسوء مع الأوامر الطويلة والخوادم المزدحمة. الهدف: أقل من ثانية للمحادثة و200 مللي ثانية للإكمال التلقائي.</li>
            <li><strong><Eng>TPOT</Eng></strong> (زمن كل رمز خرج): سلاسة البث. 1/TPOT = رموز/ثانية؛ ‏20+ رمزًا/ثانية أسرع من قراءة البشر. يحكمه عرض نطاق التوليد وضغط الدفعات.</li>
            <li><strong>التأخير الكلي</strong> = TTFT + TPOT × رموز الخرج. وللوكلاء اضربه في عدد الاستدعاءات المتسلسلة — وكيل من 10 خطوات بـ 3 ثوانٍ/خطوة تجربة منتج مدتها 30 ثانية.</li>
            <li><strong><Eng>Goodput</Eng>:</strong> الإنتاجية <em>التي تحقق اتفاقية الخدمة</em>. خادم يدفع 10 آلاف رمز/ثانية ونصف طلباته تخرق هدف TTFT إنتاجيته عظيمة وgoodput رديء — حسّن الأخير دائمًا.</li>
          </ul>
          <p>قدّم <strong>المئينات لا المتوسطات</strong> (p50/p95/p99): التجميع والتخزين المشترك يجعلان التأخير شديد التقلب، وأتعس مستخدميك يعيشون عند p99. لوحات القياس المعيارية تتابع: معدل الطلبات، مئينات TTFT/TPOT، عمق الطابور، حجم الدفعة، استغلال ذاكرة KV، نسبة إصابة تخزين البادئة، استغلال الكارت، ومعدلات الأخطاء — كل واحدة تشير لعلاج محدد تعلمته في الوحدات السابقة.</p>
        </>
      },
      widget: <Observability />
    },
    {
      id: "evals",
      title: { en: "Evaluating Quality: Evals", ar: "تقييم الجودة: الاختبارات" },
      content: {
        en: <>
          <p>Latency dashboards can't tell you the model started giving <em>worse answers</em>. Quality needs its own discipline — <strong>evals</strong>, the LLM equivalent of a test suite:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Golden datasets:</strong> 50–500 real (input → expected property) examples from your product, including known hard cases and past failures. Tiny but representative beats huge and generic.</li>
            <li><strong>Programmatic checks</strong> where possible: JSON parses, code runs, the cited source exists, the answer contains the required fields. Cheap, objective, run on every change.</li>
            <li><strong>LLM-as-judge</strong> for subjective qualities (helpfulness, tone, faithfulness): a strong model grades outputs against a rubric. Powerful but biased — judges prefer longer answers and their own family's style; calibrate against a sample of human labels, and use pairwise comparison (A vs B) rather than absolute scores where possible.</li>
            <li><strong>Online signals:</strong> thumbs up/down, retry rate, edit distance between draft and what the user actually kept, task completion.</li>
          </ul>
          <p>Run evals like CI: on every prompt change, model swap, temperature tweak, or RAG index rebuild. Teams that skip this ship "small prompt improvements" that silently break three other behaviors — the LLM version of deploying without tests. Together with tracing (recording each request's full chain: prompt version, retrieved chunks, tool calls, final output), evals close the loop: <em>observe → diagnose → fix → verify</em>.</p>
        </>,
        ar: <>
          <p>لوحات التأخير لا تخبرك أن النموذج بدأ يعطي <em>إجابات أسوأ</em>. الجودة تحتاج نظامها الخاص — <strong>الاختبارات (<Eng>evals</Eng>)</strong>، مكافئ حزمة الاختبارات في البرمجيات:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>بيانات ذهبية:</strong> ‏50–500 مثال حقيقي (دخل ← خاصية متوقعة) من منتجك، تشمل الحالات الصعبة والإخفاقات السابقة. صغيرة وممثِّلة أفضل من ضخمة وعامة.</li>
            <li><strong>فحوص برمجية</strong> حيثما أمكن: JSON يُفكَّك، الكود يعمل، المصدر المستشهد به موجود، الإجابة تحوي الحقول المطلوبة. رخيصة وموضوعية وتعمل مع كل تغيير.</li>
            <li><strong>النموذج كحكم (<Eng>LLM-as-judge</Eng>)</strong> للصفات الذاتية (الإفادة، النبرة، الأمانة): نموذج قوي يقيّم المخرجات وفق معايير. قوي لكنه منحاز — الحكام يفضلون الإجابات الأطول وأسلوب عائلتهم؛ عايره على عينة تقييمات بشرية، وفضّل المقارنة الزوجية (A مقابل B) على الدرجات المطلقة.</li>
            <li><strong>إشارات حية:</strong> الإعجاب/عدمه، معدل إعادة المحاولة، مسافة التحرير بين المسودة وما أبقاه المستخدم فعلاً، إتمام المهمة.</li>
          </ul>
          <p>شغّل الاختبارات كأنها CI: مع كل تغيير أمر أو تبديل نموذج أو تعديل حرارة أو إعادة بناء فهرس RAG. الفرق التي تتخطى هذا تشحن "تحسينات صغيرة" تكسر ثلاثة سلوكيات أخرى بصمت — نسخة النماذج من النشر بلا اختبارات. ومع التتبع (تسجيل سلسلة كل طلب كاملة: نسخة الأمر، الأجزاء المسترجعة، استدعاءات الأدوات، الخرج النهائي) تُغلق الحلقة: <em>راقب ← شخّص ← أصلح ← تحقق</em>.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "Which metric matters most for perceived responsiveness?", ar: "أي مقياس يهم أكثر للاستجابة الملموسة؟" },
      options: { en: ["Total generation time", "TTFT", "GPU temperature", "VRAM size"], ar: ["إجمالي وقت التوليد", "TTFT", "حرارة المعالج", "حجم الذاكرة"] },
      correctIndex: 1
    },
    {
      question: { en: "Goodput measures throughput that:", ar: "يقيس goodput الإنتاجية التي:" },
      options: {
        en: ["Uses the least power", "Meets the latency SLO", "Comes from cache hits", "Is billed to users"],
        ar: ["تستهلك أقل طاقة", "تحقق هدف التأخير المتفق عليه", "تأتي من إصابات التخزين", "تُفوتَر للمستخدمين"]
      },
      correctIndex: 1
    },
    {
      question: { en: "A known bias of LLM-as-judge is preferring:", ar: "انحياز معروف للنموذج-كحكم هو تفضيل:" },
      options: {
        en: ["Shorter answers", "Longer answers and its own model family's style", "Arabic text", "Numbered lists only"],
        ar: ["الإجابات الأقصر", "الإجابات الأطول وأسلوب عائلته", "النص العربي", "القوائم المرقمة فقط"]
      },
      correctIndex: 1
    }
  ]
};
