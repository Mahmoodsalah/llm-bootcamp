import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import Autoscaling from '../../components/widgets/Autoscaling';

export const servingModule: ModuleDef = {
  id: "8",
  title: { en: "Model Serving & Autoscaling", ar: "تقديم النماذج والتوسع" },
  description: {
    en: "Cold starts, routing, capacity planning, and keeping GPUs busy without burning money.",
    ar: "التشغيل البارد والتوجيه وتخطيط السعة وإبقاء الكروت مشغولة دون حرق المال."
  },
  lessons: [
    {
      id: "scale",
      title: { en: "Autoscaling GPUs & the Cold-Start Problem", ar: "التوسع التلقائي ومشكلة التشغيل البارد" },
      content: {
        en: <>
          <p>Web servers autoscale in seconds. GPU model servers don't, because a replica must, in order:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li>Get a GPU node scheduled (minutes if the cloud has capacity; sometimes never in a GPU shortage).</li>
            <li>Pull a 10–20GB container image.</li>
            <li>Download 15–140GB of weights from object storage.</li>
            <li>Load weights into VRAM, compile kernels / capture CUDA graphs, warm up.</li>
          </ol>
          <p>Total: <strong>2–15 minutes of cold start</strong> — an eternity when a traffic spike lasts 5. The engineering countermeasures:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Scale on the right signal:</strong> not CPU! Use queue depth, concurrent sequences, or KV-cache utilization — and scale <em>predictively</em> (traffic is diurnal and forecastable).</li>
            <li><strong>Shrink the start:</strong> bake weights into node-local NVMe or images, stream weights directly to GPU (e.g. tensorizer/safetensors mmap), keep <strong>warm pools</strong> of loaded-but-idle replicas.</li>
            <li><strong>Absorb while scaling:</strong> queues with backpressure, per-tier rate limits, and graceful degradation (route overflow to a smaller model or an external API).</li>
            <li><strong>Scale-to-zero</strong> only for dev/internal tools where a minute of first-request latency is acceptable.</li>
          </ul>
          <p>Capacity planning rule of thumb: measure tokens/second per replica at your target latency (not the max!), then replicas = peak demand ÷ that number, plus ~30% headroom. GPUs at 90% utilization are profitable; at 20% they're the most expensive idle hardware you'll ever rent.</p>
        </>,
        ar: <>
          <p>خوادم الويب تتوسع في ثوانٍ. خوادم النماذج لا، لأن النسخة الجديدة يجب أن، بالترتيب:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li>تحصل على خادم GPU (دقائق إن توفرت السعة؛ وأحيانًا أبدًا في نقص الكروت).</li>
            <li>تسحب صورة حاوية 10–20 جيجابايت.</li>
            <li>تنزّل 15–140 جيجابايت أوزان من التخزين السحابي.</li>
            <li>تحمّل الأوزان إلى VRAM وتترجم الأنوية وتلتقط <Eng>CUDA graphs</Eng> وتُحمى.</li>
          </ol>
          <p>الإجمالي: <strong>2–15 دقيقة تشغيل بارد</strong> — دهر عندما تستمر موجة الزيارات 5 دقائق. الإجراءات الهندسية المضادة:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>توسّع على الإشارة الصحيحة:</strong> ليس المعالج المركزي! استخدم عمق الطابور أو التسلسلات المتزامنة أو استغلال ذاكرة KV — وتوسّع <em>تنبؤيًا</em> (الحركة يومية النمط وقابلة للتوقع).</li>
            <li><strong>قلّص البداية:</strong> اخبز الأوزان في أقراص NVMe المحلية أو الصور، بثّ الأوزان مباشرة للكارت (mmap لملفات <Eng>safetensors</Eng>)، واحتفظ بـ <strong>مجمعات دافئة</strong> من نسخ محمَّلة خاملة.</li>
            <li><strong>امتص أثناء التوسع:</strong> طوابير بضغط عكسي، وحدود معدل لكل فئة، وتدهور رشيق (وجّه الفائض لنموذج أصغر أو واجهة خارجية).</li>
            <li><strong>التوسع للصفر</strong> فقط لأدوات التطوير الداخلية حيث دقيقة تأخير لأول طلب مقبولة.</li>
          </ul>
          <p>قاعدة تخطيط السعة: قِس رموز/ثانية لكل نسخة عند التأخير المستهدف (لا الأقصى!)، ثم النسخ = ذروة الطلب ÷ ذلك الرقم + ~30% احتياطًا. كارت بنسبة استغلال 90% مربح؛ وبنسبة 20% هو أغلى عتاد خامل ستستأجره في حياتك.</p>
        </>
      },
      widget: <Autoscaling />
    },
    {
      id: "routing",
      title: { en: "Routers, Fallbacks & Multi-Model Fleets", ar: "التوجيه والبدائل وأساطيل النماذج" },
      content: {
        en: <>
          <p>Real products rarely serve one model. A serving layer in front of the fleet handles:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Model routing:</strong> send easy/cheap requests (classification, extraction) to a small model, hard ones to the flagship. Even a simple heuristic router cuts cost 30–70%.</li>
            <li><strong>KV-aware load balancing:</strong> round-robin is wrong for LLMs — you want requests sharing a prefix (same agent system prompt) to land on the replica that already has it cached. Session affinity or cache-aware routing multiplies prefix-cache hit rates.</li>
            <li><strong>Fallbacks & retries:</strong> provider outages happen; timeouts must not retry non-idempotent tool-calling requests blindly; streaming responses need mid-stream failure handling.</li>
            <li><strong>Canary deploys of new model versions</strong> with quality metrics (not just error rates) before full rollout — a model can be "up" and silently worse.</li>
          </ul>
          <p>If you build one thing well here, make it the <strong>token-level observability</strong> to feed the router: per-request model, tokens in/out, latency, cost, and outcome quality signals. Module 12 goes deeper.</p>
        </>,
        ar: <>
          <p>المنتجات الحقيقية نادرًا ما تخدم نموذجًا واحدًا. طبقة تقديم أمام الأسطول تتولى:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>توجيه النماذج:</strong> أرسل الطلبات السهلة/الرخيصة (تصنيف، استخراج) لنموذج صغير، والصعبة للرائد. حتى موجّه بقواعد بسيطة يقلص التكلفة 30–70%.</li>
            <li><strong>موازنة حمل واعية بالـ KV:</strong> التوزيع الدائري خاطئ للنماذج — تريد الطلبات المتشاركة في بادئة (نفس أمر النظام للوكيل) أن تهبط على النسخة التي خزنتها بالفعل. لصق الجلسات أو التوجيه الواعي بالكاش يضاعف نسب إصابة تخزين البادئة.</li>
            <li><strong>البدائل وإعادة المحاولة:</strong> انقطاعات المزودين تحدث؛ ويجب ألا تعيد المهلة إرسال طلبات استدعاء الأدوات غير الآمنة تلقائيًا؛ والبث يحتاج معالجة فشل في منتصفه.</li>
            <li><strong>نشر تجريبي (<Eng>canary</Eng>) للنسخ الجديدة</strong> بمقاييس جودة (لا معدلات أخطاء فقط) قبل التعميم — قد يكون النموذج "يعمل" وأسوأ بصمت.</li>
          </ul>
          <p>إن أتقنت شيئًا واحدًا هنا فليكن <strong>المراقبة على مستوى الرموز</strong> لتغذية الموجّه: النموذج لكل طلب، الرموز داخلة/خارجة، التأخير، التكلفة، وإشارات جودة النتيجة. وحدة المراقبة تتعمق أكثر.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "A cold start delay is caused mainly by:", ar: "تأخير التشغيل البارد سببه أساسًا:" },
      options: { en: ["Loading weights into VRAM and node provisioning", "Network lag", "Tokenization", "Waiting for the user"], ar: ["تحميل الأوزان وتجهيز الخادم", "بطء الشبكة", "تقطيع النصوص", "انتظار المستخدم"] },
      correctIndex: 0
    },
    {
      question: { en: "The right autoscaling signal for LLM servers is:", ar: "إشارة التوسع الصحيحة لخوادم النماذج هي:" },
      options: {
        en: ["CPU utilization", "Queue depth / KV-cache utilization", "Disk usage", "Number of deployments"],
        ar: ["استغلال المعالج المركزي", "عمق الطابور / استغلال ذاكرة KV", "استخدام القرص", "عدد النشرات"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why is round-robin load balancing suboptimal for LLMs?", ar: "لماذا التوزيع الدائري غير مثالي للنماذج؟" },
      options: {
        en: ["It's too slow", "It ignores which replica already holds a matching prefix cache", "It needs more RAM", "It breaks HTTPS"],
        ar: ["بطيء جدًا", "يتجاهل أي نسخة تحمل بالفعل تخزين البادئة المطابق", "يحتاج ذاكرة أكبر", "يكسر HTTPS"]
      },
      correctIndex: 1
    }
  ]
};
