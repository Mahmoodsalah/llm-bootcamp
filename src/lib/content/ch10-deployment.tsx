import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import DeployStrategy from '../../components/widgets/DeployStrategy';
import Autoscaling from '../../components/widgets/Autoscaling';

export const deploymentModule: ModuleDef = {
  id: "10",
  title: { en: "Inference Pipeline Deployment", ar: "نشر خط الاستدلال" },
  description: {
    en: "Design a production-grade serving architecture: choose between real-time, async, and batch strategies; decide monolith vs. microservices; deploy fine-tuned models to managed endpoints; and build autoscaling systems that handle traffic spikes.",
    ar: "صمم بنية خدمة إنتاجية متكاملة: اختر بين الاستراتيجيات الفورية وغير المتزامنة والدُفعية، وقرر بين الأحادي والخدمات المصغرة، وانشر نماذج مضبوطة على نقاط نهاية مُدارة، وابنِ أنظمة توسع تلقائي تتحمل ذرى حركة المرور."
  },
  lessons: [
    {
      id: "deploy-types",
      title: { en: "Three Deployment Strategies", ar: "ثلاث استراتيجيات نشر" },
      content: {
        en: <>
          <p>Before writing a line of deployment code, you need to answer four questions about your application: <strong>latency</strong> (how fast must a single response arrive?), <strong>throughput</strong> (how many requests per second?), <strong>data characteristics</strong> (small JSON vs. multi-megabyte inputs?), and <strong>infrastructure budget</strong> (GPU cost vs. CPU cost). The answers determine which of three fundamental strategies fits best.</p>
          <p><strong>Online real-time inference</strong> gives the client a synchronous request-response cycle over HTTP or gRPC. The model server must be always running, load-balanced, and capable of responding within milliseconds to a few seconds. This is the right choice for chatbots, live recommendation APIs, and any product where users stare at a spinner. The cost is that you pay for GPU capacity even during quiet nights.</p>
          <p><strong>Asynchronous inference (queue-based)</strong> decouples the client from the model worker. The client submits a job to a message queue (e.g. SQS, RabbitMQ) and immediately gets a job ID back; the model worker picks tasks from the queue at its own pace. This design absorbs massive traffic spikes at minimal cost — if a promotion causes 10× the usual traffic, the queue depth grows instead of your bill. The trade-off is higher end-to-end latency; responses arrive minutes later, not milliseconds.</p>
          <p><strong>Offline batch transform</strong> runs as a scheduled job over large datasets already sitting in object storage. There is no client waiting — the results are written back to storage, and downstream consumers read them on their own schedule. This approach maximises GPU utilisation and minimises per-prediction cost, but it introduces an unavoidable staleness: predictions made at midnight may be hours old by the time they are read. Batch is perfect for pre-computing recommendation scores, generating document summaries overnight, or running analytics at scale.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Choosing real-time</strong> when: user is actively waiting, latency &lt; 5 s required, traffic is roughly steady.</li>
            <li><strong>Choosing async</strong> when: latency tolerance is minutes, traffic is bursty or unpredictable, cost is a primary constraint.</li>
            <li><strong>Choosing batch</strong> when: fresh predictions are not required, you process millions of records, scheduled reporting is the use case.</li>
          </ul>
        </>,
        ar: <>
          <p>قبل كتابة سطر كود نشر واحد، عليك الإجابة على أربعة أسئلة: <strong>الكمون</strong> (كم الوقت المسموح به للرد؟)، <strong>الإنتاجية</strong> (كم طلبًا في الثانية؟)، <strong>خصائص البيانات</strong> (JSON صغير أم مدخلات بمئات الميغابايت؟)، <strong>ميزانية البنية التحتية</strong> (GPU مقابل CPU؟). الإجابات تحدد أيًا من ثلاث استراتيجيات أساسية يناسبك.</p>
          <p><strong>الاستدلال الفوري المباشر</strong> يمنح العميل دورة طلب-استجابة متزامنة عبر <Eng>HTTP</Eng> أو <Eng>gRPC</Eng>. يجب أن يعمل خادم النموذج دائمًا، مع موازنة تحميل، والرد في غضون ميلي ثوان إلى ثوان. هذا هو الخيار الأمثل لروبوتات المحادثة وواجهات التوصية المباشرة وكل منتج يحدق فيه المستخدم في محمل الانتظار. التكلفة أنك تدفع لـ GPU حتى في الليالي الهادئة.</p>
          <p><strong>الاستدلال غير المتزامن (على أساس طابور)</strong> يفصل العميل عن عامل النموذج. يرسل العميل مهمة إلى طابور رسائل ويحصل فورًا على معرّف المهمة؛ عامل النموذج يلتقط المهام من الطابور بوتيرته الخاصة. هذا التصميم يمتص ذرى حركة المرور الضخمة بتكلفة ضئيلة — إذا تسبب عرض ترويجي في مضاعفة الحركة 10 أضعاف، يكبر عمق الطابور بدلًا من الفاتورة. المقايضة هي زمن كمون أعلى؛ تصل الاستجابات بعد دقائق لا ميلي ثوان.</p>
          <p><strong>التحويل الدُفعي غير المتصل</strong> يعمل كمهمة مجدولة على مجموعات بيانات ضخمة موجودة في مخزن الكائنات. لا عميل ينتظر — النتائج تُكتب في التخزين، والمستهلكون يقرؤونها حسب جدولهم. هذا النهج يُعظّم استخدام GPU ويُقلل تكلفة التنبؤ، لكنه يُدخل قِدَمًا لا مفر منه في التنبؤات.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>اختر الفوري</strong> عندما: المستخدم ينتظر فعليًا، الكمون المطلوب أقل من 5 ثوان، الحركة مستقرة نسبيًا.</li>
            <li><strong>اختر غير المتزامن</strong> عندما: تحمّل الكمون بالدقائق مقبول، الحركة متذبذبة وغير منتظمة، التكلفة قيد رئيسي.</li>
            <li><strong>اختر الدُفعي</strong> عندما: التنبؤات الطازجة غير ضرورية، تعالج ملايين السجلات، حالة الاستخدام هي تقارير مجدولة.</li>
          </ul>
        </>
      },
      widget: <DeployStrategy />
    },
    {
      id: "monolith-vs-micro",
      title: { en: "Monolith vs. Microservices for Model Serving", ar: "الأحادي مقابل الخدمات المصغرة لخدمة النماذج" },
      content: {
        en: <>
          <p>Once you have chosen an inference strategy, you face a second architectural decision: should the LLM and all surrounding business logic live in one process, or be split into independent services? This choice determines how you scale, how teams collaborate, and ultimately what your infrastructure bill looks like.</p>
          <p>A <strong>monolithic serving architecture</strong> bundles the model, preprocessing, prompt assembly, and post-processing into a single deployable unit. The advantage is simplicity — one codebase, one container, one deployment command. For small teams or proof-of-concept projects this is often the right call. The problem is that an LLM is GPU-hungry while preprocessing is purely CPU/IO-bound. A monolith forces you to provision GPU capacity for the entire process, even the parts that never touch the GPU, which wastes money and complicates scaling.</p>
          <p>A <strong>microservices architecture</strong> splits the inference pipeline into at minimum two services: an <em>LLM service</em> that only accepts a prompt and returns tokens, and a <em>business logic service</em> that handles everything else — retrieval, reranking, prompt template rendering, response formatting, and calling the monitoring pipeline. These two services communicate over HTTP or gRPC. The benefit is independent scaling: when load increases, you scale only the GPU-backed LLM service; the business service runs on cheap CPU instances and scales separately. You can also use different technology stacks — the LLM service might be optimised C++ or Rust; the business layer might be Python FastAPI.</p>
          <p>The practical guidance: start monolithic and modularise your code internally so the two concerns never bleed into each other. When the GPU cost or team size justifies it, the internal modules become separate network services with minimal rewriting effort.</p>
        </>,
        ar: <>
          <p>بمجرد اختيار استراتيجية الاستدلال، تواجه قرارًا معماريًا ثانيًا: هل يجب أن يعيش LLM ومنطق الأعمال المحيط في عملية واحدة، أم يُقسَّمان إلى خدمات مستقلة؟ هذا القرار يحدد كيف تُوسّع، وكيف تتعاون الفرق، وفي النهاية كيف تبدو فاتورة البنية التحتية.</p>
          <p><strong>البنية الأحادية</strong> تجمع النموذج والمعالجة المسبقة وتجميع الأوامر والمعالجة اللاحقة في وحدة نشر واحدة. الميزة هي البساطة — قاعدة كود واحدة، حاوية واحدة، أمر نشر واحد. للفرق الصغيرة أو مشاريع التحقق من المفهوم هذا غالبًا الخيار الصحيح. المشكلة أن LLM جائع للـ GPU بينما المعالجة المسبقة تعتمد على CPU/IO فقط. البنية الأحادية تجبرك على توفير GPU لكل العملية حتى الأجزاء التي لا تلمس GPU، مما يهدر المال ويعقّد التوسع.</p>
          <p><strong>بنية الخدمات المصغرة</strong> تُقسّم خط الاستدلال إلى خدمتين على الأقل: <em>خدمة LLM</em> تقبل فقط أمرًا وتعيد رموزًا، و<em>خدمة منطق الأعمال</em> التي تتعامل مع كل شيء آخر — الاسترجاع وإعادة الترتيب وعرض قالب الأمر وتنسيق الاستجابة واستدعاء خط المراقبة. تتواصل الخدمتان عبر <Eng>HTTP</Eng> أو <Eng>gRPC</Eng>. الفائدة هي التوسع المستقل: عند زيادة الحمل، تُوسّع خدمة LLM المدعومة بـ GPU فقط؛ خدمة الأعمال تعمل على نماذج CPU رخيصة وتتوسع بشكل منفصل.</p>
          <p>التوجيه العملي: ابدأ بالأحادي ونظّم كودك داخليًا بحيث لا يتداخل اهتمامان. عندما تبرر تكلفة GPU أو حجم الفريق ذلك، تصبح الوحدات الداخلية خدمات شبكية منفصلة مع الحد الأدنى من جهد إعادة الكتابة.</p>
        </>
      }
    },
    {
      id: "managed-endpoint",
      title: { en: "Deploying a Fine-Tuned Model to a Managed Endpoint", ar: "نشر نموذج مضبوط إلى نقطة نهاية مُدارة" },
      content: {
        en: <>
          <p>A <strong>managed endpoint</strong> (like AWS SageMaker, Google Vertex AI, or Azure ML endpoints) abstracts the infrastructure so you don't configure bare virtual machines yourself. The typical deployment flow follows three steps: <strong>model registry → endpoint configuration → live endpoint</strong>.</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>Model registry:</strong> After training, push the model artefacts (weights + tokeniser + config) to a versioned model registry (HuggingFace Hub, MLflow, or the cloud provider's own registry). The registry assigns a unique version identifier and makes the model accessible to any downstream pipeline.</li>
            <li><strong>Endpoint configuration:</strong> Define which model version to serve, what instance type to use (e.g. ml.g5.xlarge with an A10G GPU for a 7B model, ml.p4d.24xlarge with 8× A100s for 70B), and any inference optimisations (quantisation, tensor parallelism). You also specify the serving container — a pre-built image with the inference server (vLLM, TGI, TensorRT-LLM) already installed.</li>
            <li><strong>Deploy:</strong> The platform provisions the instance, downloads the model weights, loads them into GPU memory, and starts the inference server. The endpoint exposes an HTTPS URL you can call immediately. Health checks ensure the endpoint is replaced if the container crashes.</li>
          </ol>
          <p>Practical notes: always quantise (4-bit or 8-bit) before deployment to cut GPU memory requirements roughly in half without meaningful quality loss. For a RAG chatbot, a fine-tuned 7–8B model on a single A10G GPU is usually the cost-sweet-spot — stronger than a generic model, cheaper than a 70B. Store the model in the registry rather than baking it into the container image; this lets you swap model versions without rebuilding the container.</p>
          <p>The business microservice (FastAPI) sits in front of the LLM endpoint. It fetches context from the vector database, assembles the prompt, calls the SageMaker endpoint via its HTTPS API, and streams or returns the response to the end user.</p>
        </>,
        ar: <>
          <p><strong>نقطة النهاية المُدارة</strong> (مثل <Eng>AWS SageMaker</Eng> أو <Eng>Google Vertex AI</Eng> أو <Eng>Azure ML endpoints</Eng>) تُجرّد البنية التحتية حتى لا تهيئ أجهزة افتراضية مجردة بنفسك. يتبع تدفق النشر النموذجي ثلاث خطوات: <strong>سجل النماذج → تهيئة نقطة النهاية → نقطة النهاية المباشرة</strong>.</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>سجل النماذج:</strong> بعد التدريب، ادفع مخرجات النموذج (الأوزان + المرمّز + الإعداد) إلى سجل نماذج مُصدَّر (<Eng>HuggingFace Hub</Eng> أو <Eng>MLflow</Eng> أو سجل مزود السحابة). يُعيّن السجل معرّف إصدار فريدًا ويجعل النموذج متاحًا لأي خط لاحق.</li>
            <li><strong>تهيئة نقطة النهاية:</strong> حدّد إصدار النموذج، ونوع النموذج الذي تستخدمه (مثلاً ml.g5.xlarge مع GPU نوع A10G لنموذج 7B، أو ml.p4d.24xlarge مع 8 × A100 لنموذج 70B)، وأي تحسينات استدلال (تكميم، تعدد موترات). تحدد أيضًا حاوية الخدمة.</li>
            <li><strong>النشر:</strong> المنصة توفّر النموذج، تنزّل أوزان النموذج، تحمّلها في ذاكرة GPU، وتشغّل خادم الاستدلال. تكشف نقطة النهاية عن عنوان HTTPS يمكنك استدعاؤه فورًا.</li>
          </ol>
          <p>ملاحظات عملية: قم دائمًا بالتكميم (4-بت أو 8-بت) قبل النشر لتقليل متطلبات ذاكرة GPU إلى النصف تقريبًا دون فقدان جودة ملحوظ. لروبوت محادثة RAG، نموذج مضبوط دقيق 7–8 مليار معامل على GPU واحد A10G هو عادةً النقطة المثلى من حيث التكلفة. خزّن النموذج في السجل بدلًا من دمجه في صورة الحاوية؛ هذا يتيح لك تبديل إصدارات النموذج دون إعادة بناء الحاوية.</p>
        </>
      },
      math: {
        en: <p dir="ltr">GPU memory needed ≈ (params × dtype_bytes) + KV cache. A 7B model in fp16 ≈ 14 GB; with 4-bit quant ≈ 4–5 GB leaving room for KV cache on a 24 GB A10G. Throughput ≈ (batch_size × seq_len) / latency_s tokens/s.</p>,
        ar: <p>ذاكرة GPU المطلوبة ≈ (المعاملات × بايتات نوع البيانات) + ذاكرة KV. نموذج 7 مليار في fp16 ≈ 14 GB؛ مع تكميم 4-بت ≈ 5-4 GB مما يترك مساحة لذاكرة KV على A10G ذي 24 GB.</p>
      }
    },
    {
      id: "autoscaling-deploy",
      title: { en: "Autoscaling & Cold Starts", ar: "التوسع التلقائي والتشغيل البارد" },
      content: {
        en: <>
          <p>Autoscaling adjusts the number of running instances in response to traffic, balancing cost during quiet periods with capacity during peaks. For LLM endpoints, the most meaningful scaling signal is usually <em>concurrency</em> (active in-flight requests) or <em>queue depth</em>. CPU utilisation is a poor proxy because the GPU does the heavy lifting and the CPU idles while inference runs.</p>
          <p>Two autoscaling flavours matter in practice. <strong>Horizontal scaling (scale-out)</strong> adds more identical model server replicas. This is straightforward but each new GPU instance typically takes <strong>3–10 minutes to cold-start</strong>: the instance must boot, pull the container image (gigabytes), and load model weights into GPU memory. During that cold-start window, new traffic has nowhere to go — hence keeping a minimum of 1–2 warm instances at all times is critical for latency-sensitive workloads. A <strong>scale-in cooldown period</strong> (e.g. 10 minutes) prevents oscillation — without it, the system could spin up and down replicas repeatedly during moderate-traffic fluctuations, increasing cost and instability.</p>
          <p><strong>Scale-to-zero</strong> reduces costs to near-zero during idle periods but introduces painful cold starts. It is viable for development endpoints or batch-oriented workloads but almost never appropriate for production chatbots. For such deployments, a "warm reserve" strategy — keeping 1 replica running and pre-warming a second when concurrency hits a threshold — gives the best cost/latency trade-off.</p>
          <p>The widget below lets you experiment with how incoming traffic maps to replica counts and cold-start behaviour.</p>
        </>,
        ar: <>
          <p>التوسع التلقائي يضبط عدد النماذج الجارية استجابةً لحركة المرور، موازنًا التكلفة في الأوقات الهادئة مع الطاقة في أوقات الذروة. لنقاط نهاية LLM، أهم إشارة توسع عادةً هي <em>التزامن</em> (الطلبات النشطة في الرحلة) أو <em>عمق الطابور</em>.</p>
          <p>نوعان من التوسع التلقائي مهمان عمليًا. <strong>التوسع الأفقي (scale-out)</strong> يضيف نسخًا متطابقة من خادم النموذج. هذا بسيط لكن كل نموذج GPU جديد يستغرق عادةً <strong>3–10 دقائق للتشغيل البارد</strong>: يجب تشغيل النموذج، سحب صورة الحاوية (بالجيجابايت)، وتحميل أوزان النموذج في ذاكرة GPU. خلال هذه الفترة، لا يوجد مكان للحركة الجديدة — لذا فإن الاحتفاظ بـ 1–2 نموذج دافئ على الأقل في جميع الأوقات أمر بالغ الأهمية.</p>
          <p><strong>التوسع إلى الصفر</strong> يُقلل التكاليف إلى شبه الصفر خلال فترات الخمول لكنه يُدخل بدايات باردة مؤلمة. وهو مناسب لنقاط نهاية التطوير أو أعباء العمل الدُفعية ولكن نادرًا ما يكون ملائمًا لروبوتات المحادثة الإنتاجية.</p>
        </>
      },
      widget: <Autoscaling />
    }
  ],
  quiz: [
    {
      question: { en: "Which deployment type is best when users expect an immediate response?", ar: "أي نوع نشر هو الأفضل عندما يتوقع المستخدمون استجابة فورية؟" },
      options: { en: ["Offline batch", "Asynchronous queue", "Online real-time", "Cold-start only"], ar: ["دُفعي غير متصل", "طابور غير متزامن", "مباشر فوري", "تشغيل بارد فقط"] },
      correctIndex: 2
    },
    {
      question: { en: "The main advantage of asynchronous (queue-based) inference over real-time is:", ar: "الميزة الرئيسية للاستدلال غير المتزامن (الطابور) على الفوري هي:" },
      options: {
        en: ["Lower latency", "Handling traffic spikes without proportional cost increase", "Better accuracy", "Smaller model size"],
        ar: ["كمون أقل", "استيعاب ذرى الحركة دون زيادة تكلفة متناسبة", "دقة أفضل", "حجم نموذج أصغر"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why is a microservices architecture preferred for LLM serving vs. a monolith?", ar: "لماذا تُفضَّل بنية الخدمات المصغرة لخدمة LLM على الأحادي؟" },
      options: {
        en: ["Easier to debug", "Allows GPU-heavy LLM and CPU-only business logic to scale independently", "Fewer network calls", "Less code to write"],
        ar: ["أسهل في تصحيح الأخطاء", "تتيح للـ LLM الجائع لـ GPU ومنطق الأعمال CPU-فقط التوسع باستقلالية", "استدعاءات شبكة أقل", "كود أقل للكتابة"]
      },
      correctIndex: 1
    },
    {
      question: { en: "In a managed endpoint workflow, which step comes first?", ar: "في سير عمل نقطة النهاية المُدارة، أي خطوة تأتي أولاً؟" },
      options: {
        en: ["Deploy live endpoint", "Endpoint configuration", "Push model to registry", "Write inference code"],
        ar: ["نشر نقطة النهاية المباشرة", "تهيئة نقطة النهاية", "رفع النموذج إلى السجل", "كتابة كود الاستدلال"]
      },
      correctIndex: 2
    },
    {
      question: { en: "Cold-start delay for a new GPU replica is mainly caused by:", ar: "تأخير التشغيل البارد لنسخة GPU جديدة يُسبَّب أساسًا بسبب:" },
      options: {
        en: ["Running too many tests", "Booting instance + pulling container + loading weights into GPU memory", "Network firewall rules", "Python import time"],
        ar: ["تشغيل اختبارات كثيرة جدًا", "تشغيل النموذج + سحب الحاوية + تحميل الأوزان في ذاكرة GPU", "قواعد جدار حماية الشبكة", "وقت استيراد Python"]
      },
      correctIndex: 1
    }
  ]
};
