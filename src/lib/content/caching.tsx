import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import PrefixCache from '../../components/widgets/PrefixCache';
import CostCalc from '../../components/widgets/CostCalc';

export const cachingModule: ModuleDef = {
  id: "10",
  title: { en: "Prompt Caching & Cost Engineering", ar: "تخزين الأوامر وهندسة التكلفة" },
  description: {
    en: "Prefix caching mechanics, prompt design for cache hits, and the levers that cut your bill.",
    ar: "آلية تخزين البادئة وتصميم الأوامر للإصابات وروافع خفض الفاتورة."
  },
  lessons: [
    {
      id: "prefix_cache",
      title: { en: "Prefix Caching Mechanics", ar: "آلية تخزين البادئة" },
      content: {
        en: <>
          <p>The KV cache of a prompt depends only on the tokens <em>before</em> each position (causal mask). Consequence: if two requests share an identical <strong>prefix</strong> — same system prompt, same tool definitions, same document — the KV blocks for that prefix are <em>bit-for-bit identical</em> and can be computed once and reused.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>Engines hash each KV block by its token content (radix trees in SGLang, block hashes in vLLM) and keep popular blocks in VRAM/RAM with LRU eviction.</li>
            <li>A cache hit skips prefill for the shared part: a 10k-token agent system prompt that took 1s to prefill becomes ~0ms. TTFT collapses and prefill compute is freed for others.</li>
            <li>API providers expose the same idea as "prompt caching" with <strong>cached-input discounts of 50–90%</strong>.</li>
          </ul>
          <p><strong>This changes how you should write prompts.</strong> Caching matches <em>exact token prefixes</em>, so: put static content first (system prompt, tools, few-shot examples), dynamic content last (user question, timestamp, retrieved chunks). One variable at the <em>top</em> of the prompt — "Today is 09:41:07" — invalidates the entire cache for every request. Agents are the killer use case: each of an agent's 20 tool-calling steps resends the whole growing conversation; with prefix caching each step only pays for its new tokens.</p>
        </>,
        ar: <>
          <p>ذاكرة KV لأي أمر تعتمد فقط على الرموز <em>قبل</em> كل موقع (القناع السببي). النتيجة: إذا تشارك طلبان <strong>بادئة</strong> متطابقة — نفس أمر النظام، نفس تعريفات الأدوات، نفس المستند — فكتل KV لتلك البادئة <em>متطابقة بتًا ببت</em> ويمكن حسابها مرة وإعادة استخدامها.</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>المحركات تُجزّئ كل كتلة KV حسب محتواها الرمزي (أشجار <Eng>radix</Eng> في SGLang وتجزئة الكتل في vLLM) وتبقي الكتل الشائعة في الذاكرة مع إخلاء LRU.</li>
            <li>الإصابة تتخطى الـ <Eng>prefill</Eng> للجزء المشترك: أمر نظام لوكيل من 10 آلاف رمز كان يستغرق ثانية يصبح ~صفر. ينهار <Eng>TTFT</Eng> ويتحرر حساب الـ prefill للآخرين.</li>
            <li>مزودو الواجهات يقدمون نفس الفكرة باسم "تخزين الأوامر" مع <strong>خصومات 50–90% على المدخلات المخزنة</strong>.</li>
          </ul>
          <p><strong>هذا يغيّر طريقة كتابتك للأوامر.</strong> التخزين يطابق <em>بادئات رموز حرفية</em>، لذا: ضع الثابت أولاً (أمر النظام، الأدوات، الأمثلة)، والمتغير أخيرًا (سؤال المستخدم، الوقت، الأجزاء المسترجعة). متغير واحد في <em>أعلى</em> الأمر — "الساعة الآن 09:41:07" — يبطل كامل التخزين لكل طلب. والوكلاء هم حالة الاستخدام القاتلة: كل خطوة من خطوات الوكيل العشرين تعيد إرسال المحادثة المتنامية كاملة؛ مع تخزين البادئة تدفع كل خطوة ثمن رموزها الجديدة فقط.</p>
        </>
      },
      widget: <PrefixCache />
    },
    {
      id: "cost",
      title: { en: "The Cost Model & Optimization Levers", ar: "نموذج التكلفة وروافع التحسين" },
      content: {
        en: <>
          <p>LLM cost = input tokens × input price + output tokens × output price, with output typically <strong>3–5× more expensive</strong> (decode is memory-bound and slow; prefill is parallel and cheap). Your optimization levers, in rough order of impact:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>Route to smaller models:</strong> most requests don't need the flagship. A 10–30× price gap between tiers dwarfs every other lever.</li>
            <li><strong>Cache-friendly prompt structure</strong> (previous lesson): 50–90% off the input side of repetitive workloads.</li>
            <li><strong>Control output length:</strong> ask for terse answers, use structured output, set max_tokens. Output tokens are the expensive ones — "be concise" is a cost optimization.</li>
            <li><strong>Trim the context you send:</strong> summarize old conversation turns, deduplicate retrieved chunks, don't resend entire files when a diff will do.</li>
            <li><strong>Batch APIs</strong> for non-interactive work (evals, backfills): ~50% discount for 24h latency tolerance.</li>
            <li><strong>Self-host only past the breakeven:</strong> a dedicated GPU is a fixed cost; APIs are per-token. Self-hosting wins with sustained high utilization, strict data requirements, or heavily fine-tuned models — not for spiky low traffic.</li>
          </ol>
          <p>Instrument cost <em>per feature and per user</em> from day one. Every mature LLM product team eventually discovers one endpoint quietly burning 80% of the bill.</p>
        </>,
        ar: <>
          <p>تكلفة النموذج = رموز الدخل × سعرها + رموز الخرج × سعرها، والخرج عادة <strong>أغلى 3–5 مرات</strong> (التوليد مقيّد بالذاكرة وبطيء؛ الـ prefill متوازٍ ورخيص). روافع التحسين بترتيب الأثر تقريبًا:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>وجّه لنماذج أصغر:</strong> معظم الطلبات لا تحتاج الرائد. فجوة سعر 10–30× بين الفئات تتضاءل أمامها كل رافعة أخرى.</li>
            <li><strong>بنية أوامر صديقة للتخزين</strong> (الدرس السابق): خصم 50–90% على جانب الدخل للأعمال المتكررة.</li>
            <li><strong>تحكم في طول الخرج:</strong> اطلب إجابات مقتضبة، استخدم خرجًا مهيكلاً، واضبط max_tokens. رموز الخرج هي الغالية — "كن موجزًا" تحسين تكلفة.</li>
            <li><strong>قلّم السياق المرسل:</strong> لخّص الأدوار القديمة، أزل تكرار الأجزاء المسترجعة، ولا ترسل ملفات كاملة حين يكفي الفرق.</li>
            <li><strong>واجهات الدفعات (<Eng>Batch APIs</Eng>)</strong> للأعمال غير التفاعلية: خصم ~50% مقابل تحمل تأخير 24 ساعة.</li>
            <li><strong>استضف ذاتيًا بعد نقطة التعادل فقط:</strong> الكارت المخصص تكلفة ثابتة؛ والواجهات بالرمز. الاستضافة تربح مع استغلال مرتفع مستمر أو متطلبات بيانات صارمة أو نماذج مضبوطة بكثافة — لا مع حركة متقطعة منخفضة.</li>
          </ol>
          <p>قِس التكلفة <em>لكل ميزة ولكل مستخدم</em> من اليوم الأول. كل فريق منتج ناضج يكتشف في النهاية نقطة نهاية واحدة تحرق 80% من الفاتورة بصمت.</p>
        </>
      },
      widget: <CostCalc />
    }
  ],
  quiz: [
    {
      question: { en: "Prefix caching saves compute when:", ar: "تخزين البادئة يوفر الحسابات عندما:" },
      options: { en: ["Outputs match", "Starting prompts match exactly", "Users have fast internet", "Batch size is 1"], ar: ["تتطابق المخرجات", "تتطابق بدايات الأوامر حرفيًا", "إنترنت سريع", "الدفعة 1"] },
      correctIndex: 1
    },
    {
      question: { en: "Putting a timestamp at the TOP of your system prompt:", ar: "وضع الوقت الحالي في أعلى أمر النظام:" },
      options: {
        en: ["Improves accuracy", "Invalidates the prefix cache for every request", "Saves tokens", "Is required by APIs"],
        ar: ["يحسن الدقة", "يبطل تخزين البادئة لكل طلب", "يوفر رموزًا", "تشترطه الواجهات"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why are output tokens priced higher than input tokens?", ar: "لماذا رموز الخرج أغلى من رموز الدخل؟" },
      options: {
        en: ["They're longer", "Decode is slow and memory-bound while prefill is parallel", "Marketing", "They use more VRAM per token"],
        ar: ["أطول", "التوليد بطيء ومقيّد بالذاكرة بينما prefill متوازٍ", "تسويق", "تستهلك ذاكرة أكبر لكل رمز"]
      },
      correctIndex: 1
    }
  ]
};
