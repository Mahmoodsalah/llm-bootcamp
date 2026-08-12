import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import CICDCT from '../../components/widgets/CICDCT';
import Observability from '../../components/widgets/Observability';

export const mlopsLlmopsModule: ModuleDef = {
  id: "11",
  title: { en: "MLOps & LLMOps", ar: "MLOps وLLMOps" },
  description: {
    en: "Trace the lineage from DevOps to MLOps to LLMOps; containerise and orchestrate ML pipelines; implement CI/CD and continuous training; monitor prompt traces, costs, and drift; and build human feedback loops.",
    ar: "تتبع النسب من DevOps إلى MLOps إلى LLMOps؛ احتوِ وأدِر خطوط ML؛ نفّذ CI/CD والتدريب المستمر؛ راقب أثر الأوامر والتكاليف والانجراف؛ وابنِ حلقات التغذية الراجعة البشرية."
  },
  lessons: [
    {
      id: "lineage",
      title: { en: "From DevOps to MLOps to LLMOps", ar: "من DevOps إلى MLOps إلى LLMOps" },
      content: {
        en: <>
          <p>Software operations evolved in layers. <strong>DevOps</strong> emerged to end the friction between "dev" (who writes code) and "ops" (who runs it). Its core insight: treat infrastructure as code, automate builds and tests, and continuously deliver software so that deployment is a boring, routine event rather than a stressful launch. Key DevOps practices are version control, CI/CD pipelines, and monitoring.</p>
          <p><strong>MLOps</strong> applies the same philosophy to machine learning, but ML systems have extra moving parts: not just code, but also <em>data</em> and <em>model weights</em>. Any of these three can change independently and break the system. A model's accuracy can degrade not because code changed but because production data drifted. MLOps therefore adds three first-class concerns absent from DevOps: <em>data versioning</em>, <em>model versioning + registries</em>, and <em>continuous training (CT)</em> — the automated pipeline that retrains models when new data or a drift trigger arrives.</p>
          <p><strong>LLMOps</strong> is MLOps specialised for large language models. The differences are partly scale (training a foundation model costs ~$100M and needs thousands of GPUs) and partly qualitative. LLMs introduce new artefacts that need operational treatment: prompts are first-class versioned entities; outputs are non-deterministic and require guardrails; cost is measured in tokens rather than CPU seconds; and evaluating quality requires LLM-as-judge or human review rather than simple accuracy metrics.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>LLMOps-specific additions to MLOps:</strong> prompt versioning, prompt monitoring with full trace logging, input/output guardrails, cost-per-token tracking, feedback loops (thumbs up/down → RLHF or DPO data), and managing non-deterministic outputs.</li>
            <li>Most companies adopting LLMs won't train from scratch — they fine-tune foundation models, making prompt engineering and RAG the core operational problems.</li>
          </ul>
        </>,
        ar: <>
          <p>تطورت عمليات البرمجيات في طبقات. ظهر <Eng>DevOps</Eng> لإنهاء الاحتكاك بين "المطور" (كاتب الكود) و"المشغّل" (من يُدير النظام). رؤيته الجوهرية: عامل البنية التحتية ككود، أتمت البناء والاختبارات، وسلّم البرمجيات باستمرار بحيث يصبح النشر حدثًا روتينيًا مملًا لا إطلاقًا مجهِدًا.</p>
          <p><strong>MLOps</strong> يُطبّق نفس الفلسفة على التعلم الآلي، لكن أنظمة ML تحتوي على أجزاء متحركة إضافية: ليس فقط الكود، بل أيضًا <em>البيانات</em> و<em>أوزان النموذج</em>. أي من هذه الثلاثة يمكن أن يتغير باستقلالية ويكسر النظام. دقة النموذج يمكن أن تتراجع ليس لأن الكود تغيّر بل لأن بيانات الإنتاج انجرفت. لذا يُضيف MLOps ثلاثة مخاوف أساسية غائبة من DevOps: <em>إصدار البيانات</em>، <em>إصدار النموذج + السجلات</em>، و<em>التدريب المستمر (CT)</em>.</p>
          <p><strong>LLMOps</strong> هو MLOps متخصص في نماذج اللغة الكبيرة. الفوارق تشمل النطاق (تدريب نموذج أساسي يكلف ~100 مليون دولار ويحتاج آلاف GPU) والاختلاف النوعي. تُدخل LLMs مخرجات جديدة تحتاج معاملة تشغيلية: الأوامر كيانات مُصدَّرة من الدرجة الأولى؛ والمخرجات غير حتمية وتتطلب حواجز حماية؛ والتكلفة تُقاس بالرموز لا بثواني CPU.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>إضافات LLMOps على MLOps:</strong> إصدار الأوامر، مراقبة الأوامر مع تسجيل الأثر الكامل، حواجز حماية المدخلات/المخرجات، تتبع التكلفة لكل رمز، حلقات التغذية الراجعة (إعجاب/عدم إعجاب ← بيانات RLHF أو DPO).</li>
            <li>معظم الشركات التي تتبنى LLMs لن تُدرّب من الصفر — ستضبط نماذج أساسية دقيقًا، مما يجعل هندسة الأوامر و RAG مشكلتي التشغيل الأساسيتين.</li>
          </ul>
        </>
      }
    },
    {
      id: "cicd-ct",
      title: { en: "CI / CD / CT — Automating the ML Lifecycle", ar: "CI / CD / CT — أتمتة دورة حياة ML" },
      content: {
        en: <>
          <p>Think of CI/CD/CT as three complementary automation loops operating at different timescales and triggered by different events.</p>
          <p><strong>Continuous Integration (CI)</strong> triggers on every code commit. It builds the project, runs linters and unit tests on the data processing code and model training code, and runs fast integration tests against a small data sample. The goal is to catch bugs within minutes of introduction, before they reach production. A CI pipeline for ML might also run a "smoke test" — train for one epoch on a tiny dataset and assert the loss decreases — to catch shape mismatches or broken data loaders early.</p>
          <p><strong>Continuous Delivery (CD)</strong> triggers when CI passes on the main branch. It packages the code into a container image, runs the full feature and training pipelines in a staging environment, registers the resulting model in the model registry, and deploys the new inference endpoint. For ML, CD often includes an <em>evaluation gate</em>: only promote the new model to production if it beats the current champion on a held-out test set.</p>
          <p><strong>Continuous Training (CT)</strong> triggers not on code changes but on <em>data events</em>: a new batch of data arrives, the monitoring system detects a drop in production metrics, or a scheduled daily cron fires. CT re-runs the training pipeline with fresh data, registers the new model version, and optionally promotes it through the same CD evaluation gate. This is what keeps a production model from slowly growing stale as the world changes.</p>
          <p>Containerising your ML pipelines (Docker) is the prerequisite for all of this. A container captures the exact Python environment, CUDA version, and library versions so the pipeline that works on your laptop works identically in CI, staging, and production.</p>
        </>,
        ar: <>
          <p>فكّر في CI/CD/CT كثلاث حلقات أتمتة تكميلية تعمل على مقاييس زمنية مختلفة ويُشغّلها أحداث مختلفة.</p>
          <p><strong>التكامل المستمر (CI)</strong> يُشغَّل عند كل رفع كود. يبني المشروع، يُشغّل أدوات الفحص واختبارات الوحدة على كود معالجة البيانات وتدريب النموذج، ويُشغّل اختبارات تكامل سريعة على عيّنة بيانات صغيرة. الهدف هو اكتشاف الأخطاء في غضون دقائق من إدخالها قبل وصولها للإنتاج.</p>
          <p><strong>التسليم المستمر (CD)</strong> يُشغَّل عندما يمر CI على الفرع الرئيسي. يُعبّئ الكود في صورة حاوية، يُشغّل خطوط الميزات والتدريب الكاملة في بيئة مرحلية، يُسجّل النموذج الناتج في سجل النموذج، وينشر نقطة النهاية الجديدة. لـ ML، غالبًا يتضمن CD <em>بوابة تقييم</em>: فقط رقّ النموذج الجديد للإنتاج إذا تفوّق على البطل الحالي.</p>
          <p><strong>التدريب المستمر (CT)</strong> لا يُشغَّل بتغييرات الكود بل بـ <em>أحداث البيانات</em>: وصول دفعة جديدة من البيانات، اكتشاف نظام المراقبة لانخفاض في مقاييس الإنتاج، أو تشغيل cron يومي مجدول. يُعيد CT تشغيل خط التدريب بالبيانات الطازجة، يُسجّل إصدار النموذج الجديد، وينقله اختياريًا عبر نفس بوابة تقييم CD.</p>
          <p>احتواء خطوط ML الخاصة بك (<Eng>Docker</Eng>) هو المتطلب الأساسي لكل هذا. الحاوية تلتقط بيئة Python الدقيقة وإصدار CUDA وإصدارات المكتبات بحيث يعمل الخط الذي يعمل على جهازك المحمول بشكل متطابق في CI والمرحلي والإنتاج.</p>
        </>
      },
      widget: <CICDCT />
    },
    {
      id: "prompt-monitoring",
      title: { en: "Prompt Monitoring, Tracing & Cost Tracking", ar: "مراقبة الأوامر وتتبع الأثر ومتابعة التكاليف" },
      content: {
        en: <>
          <p>In a traditional ML system you monitor the model's predictions. In an LLM system, you also monitor the <em>prompt</em> — the intermediate artefact that was never present in classical ML. Prompt monitoring answers questions like: which prompt templates produce the most helpful answers? Which user queries lead to hallucinations? Where do latency and token costs accumulate in a multi-step RAG pipeline?</p>
          <p><strong>What to log per request:</strong> the raw user input, any rewritten/expanded versions of the query, every retrieved document chunk and its relevance score, the final assembled prompt, the generated output, token counts for each step, latency at each step (time-to-first-token, tokens-per-second), and any guardrail signals (was a toxicity check triggered?).</p>
          <p><strong>Trace logging</strong> connects all these events into a causal chain: one trace per user turn, with nested spans for each sub-step. When something goes wrong — a wrong answer, a timeout, an unexpected refusal — the trace tells you exactly which step failed and what the intermediate values looked like at that point. Tools like Langfuse, Opik (Comet ML), and W&B Traces all follow this model.</p>
          <p><strong>Cost tracking</strong> is unique to LLMs. Every input token and output token has a price (for hosted APIs) or a GPU-second equivalent (for self-hosted models). Monitoring cost per query, cost per user session, and cost per feature lets you identify expensive outliers — a user who asks 40-message conversations, a prompt template that generates 2× more tokens than necessary — and optimise them before they blow the budget.</p>
          <p><strong>Human feedback loops</strong> close the cycle: a thumbs-up/down button in the UI writes a preference label to a dataset. Over time this dataset becomes material for preference alignment fine-tuning (RLHF / DPO) or at minimum a ground-truth validation set for automated evaluators.</p>
        </>,
        ar: <>
          <p>في نظام ML التقليدي تُراقب تنبؤات النموذج. في نظام LLM تُراقب أيضًا <em>الأمر</em> — المخرج الوسيط الذي لم يكن موجودًا في ML الكلاسيكي. مراقبة الأوامر تجيب على أسئلة مثل: أي قوالب أوامر تنتج إجابات أكثر فائدة؟ أي استعلامات المستخدمين تؤدي إلى الهلوسة؟ أين تتراكم الكمون وتكاليف الرموز في خط RAG متعدد الخطوات؟</p>
          <p><strong>ما يُسجَّل لكل طلب:</strong> المدخل الخام للمستخدم، أي إصدارات معاد صياغتها للاستعلام، كل جزء مستند مسترجع ودرجة صلته، الأمر النهائي المُجمَّع، المخرج المُولَّد، عدد الرموز لكل خطوة، الكمون في كل خطوة، وأي إشارات حواجز حماية.</p>
          <p><strong>تسجيل الأثر</strong> يربط هذه الأحداث في سلسلة سببية: أثر واحد لكل دور مستخدم، مع نطاقات متداخلة لكل خطوة فرعية. عندما يسوء شيء — إجابة خاطئة، انتهاء مهلة، رفض غير متوقع — يُخبرك الأثر بالضبط أي خطوة فشلت وكيف بدت القيم الوسيطة في تلك اللحظة.</p>
          <p><strong>تتبع التكاليف</strong> فريد لـ LLMs. كل رمز إدخال وإخراج له سعر (للـ APIs المستضافة) أو معادل GPU-ثانية (للنماذج المستضافة ذاتيًا). مراقبة التكلفة لكل استعلام ولكل جلسة مستخدم ولكل ميزة تُتيح لك تحديد الحالات الشاذة المكلفة وتحسينها قبل أن تُفجّر الميزانية.</p>
          <p><strong>حلقات التغذية الراجعة البشرية</strong> تُغلق الدورة: زر إعجاب/عدم إعجاب في واجهة المستخدم يكتب تسمية تفضيل في مجموعة بيانات. مع الوقت تصبح هذه المجموعة مادة لضبط توافق التفضيل الدقيق (<Eng>RLHF</Eng> / <Eng>DPO</Eng>) أو على الأقل مجموعة تحقق حقيقية للمُقيِّمين الآليين.</p>
        </>
      },
      widget: <Observability />
    },
    {
      id: "guardrails",
      title: { en: "Guardrails & Safety in LLM Systems", ar: "حواجز الحماية والسلامة في أنظمة LLM" },
      content: {
        en: <>
          <p>An LLM in production will receive harmful inputs and occasionally produce harmful outputs — this is not hypothetical. Guardrails are programmatic checks that intercept requests and responses before they cause damage.</p>
          <p><strong>Input guardrails</strong> screen every incoming user message for three categories of risk. First, <em>data leakage</em>: if your application calls an external LLM API (OpenAI, Anthropic), user messages should be stripped of credentials, API keys, and any PII before they leave your infrastructure. Second, <em>prompt injection</em>: a user might embed SQL, shell commands, or instructions that hijack your system prompt ("ignore your previous instructions and…"). Simple heuristics catch obvious cases; more robust detection uses a small classifier trained on injection examples. Third, <em>policy violations</em>: refuse queries that clearly ask for harmful content based on your application's community guidelines.</p>
          <p><strong>Output guardrails</strong> check the model's response before it is returned to the user. Common checks: does the output contain PII that might have leaked from the model's training data or the RAG context? Is the response toxic or harmful? Does it follow the expected format (JSON schema, specific field names)? If the output fails a check, you can retry generation (increasing latency) or return a safe fallback message.</p>
          <p>The latency cost of guardrails is real — adding an input and output safety model can add 100–300 ms per round trip. A common optimisation is to run input and output checks in parallel with generation (on the same streamed tokens), or to run only lightweight regex/rule-based checks in the critical path and offload heavier model-based checks to an async audit log.</p>
        </>,
        ar: <>
          <p>LLM في الإنتاج سيتلقى مدخلات ضارة وسيُنتج أحيانًا مخرجات ضارة — هذا ليس افتراضيًا. حواجز الحماية هي فحوصات برمجية تعترض الطلبات والاستجابات قبل أن تتسبب في ضرر.</p>
          <p><strong>حواجز المدخلات</strong> تفحص كل رسالة مستخدم واردة لثلاث فئات من المخاطر. أولًا، <em>تسرب البيانات</em>: إذا كان تطبيقك يستدعي API خارجي لـ LLM، يجب تجريد رسائل المستخدم من بيانات الاعتماد والمفاتيح وأي معلومات تعريف شخصية قبل مغادرتها بنيتك التحتية. ثانيًا، <em>حقن الأمر</em>: قد يُدرج المستخدم SQL أو أوامر shell أو تعليمات تُخطف أمر نظامك. ثالثًا، <em>انتهاكات السياسة</em>: رفض الاستعلامات التي تطلب بوضوح محتوى ضارًا.</p>
          <p><strong>حواجز المخرجات</strong> تفحص استجابة النموذج قبل إعادتها للمستخدم. الفحوصات الشائعة: هل تحتوي المخرجات على معلومات شخصية مسرَّبة؟ هل الاستجابة سامة أو ضارة؟ هل تتبع التنسيق المتوقع؟ إذا فشلت المخرجات في فحص، يمكنك إعادة محاولة التوليد أو إعادة رسالة احتياطية آمنة.</p>
          <p>تكلفة الكمون لحواجز الحماية حقيقية — إضافة نموذج سلامة للمدخلات والمخرجات يمكن أن يُضيف 100–300 ميلي ثانية لكل رحلة ذهاب وإياب. تحسين شائع هو تشغيل فحوصات المدخلات والمخرجات بالتوازي مع التوليد، أو تشغيل فحوصات خفيفة قائمة على القواعد فقط في المسار الحرج.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "What does LLMOps add on top of MLOps that is specific to language models?", ar: "ماذا يُضيف LLMOps على MLOps وهو خاص بنماذج اللغة؟" },
      options: {
        en: ["Faster CPU training", "Prompt versioning, guardrails, cost-per-token tracking, and feedback loops", "Better image recognition", "Simpler deployment"],
        ar: ["تدريب CPU أسرع", "إصدار الأوامر وحواجز الحماية وتتبع التكلفة لكل رمز وحلقات التغذية الراجعة", "تعرف أفضل على الصور", "نشر أبسط"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Continuous Training (CT) is triggered by:", ar: "التدريب المستمر (CT) يُشغَّل بسبب:" },
      options: {
        en: ["Every code commit", "Data events or drift detection, not code changes", "User clicks", "Model registry updates only"],
        ar: ["كل رفع كود", "أحداث البيانات أو كشف الانجراف، ليس تغييرات الكود", "نقرات المستخدم", "تحديثات سجل النموذج فقط"]
      },
      correctIndex: 1
    },
    {
      question: { en: "What is a key purpose of 'trace logging' in LLM monitoring?", ar: "ما الغرض الرئيسي من 'تسجيل الأثر' في مراقبة LLM؟" },
      options: {
        en: ["Speed up inference", "Connect all sub-steps into a causal chain to diagnose failures", "Compress model weights", "Train faster"],
        ar: ["تسريع الاستدلال", "ربط كل الخطوات الفرعية في سلسلة سببية لتشخيص الإخفاقات", "ضغط أوزان النموذج", "تدريب أسرع"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why is cost-per-token tracking important in LLMOps but not classical MLOps?", ar: "لماذا تتبع التكلفة لكل رمز مهم في LLMOps وليس في MLOps الكلاسيكي؟" },
      options: {
        en: ["LLMs are open-source so cost is zero", "Every token processed has a direct pricing unit, making per-request cost visible and optimisable", "Classical models are free", "GPUs have no cost"],
        ar: ["LLMs مفتوحة المصدر لذا التكلفة صفر", "كل رمز معالَج له وحدة تسعير مباشرة مما يجعل تكلفة كل طلب مرئية وقابلة للتحسين", "النماذج الكلاسيكية مجانية", "GPU ليس له تكلفة"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Output guardrails run AFTER generation. A common way to avoid doubling latency on a failed check is to:", ar: "حواجز المخرجات تعمل بعد التوليد. طريقة شائعة لتجنب مضاعفة الكمون عند فشل فحص هي:" },
      options: {
        en: ["Disable guardrails", "Run multiple candidate generations in parallel and pick the passing one", "Use a larger model", "Add more RAM"],
        ar: ["تعطيل حواجز الحماية", "تشغيل مرشحين متعددين بالتوازي واختيار الناجح", "استخدام نموذج أكبر", "إضافة المزيد من RAM"]
      },
      correctIndex: 1
    }
  ]
};
