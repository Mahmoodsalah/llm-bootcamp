import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import KVCache from '../../components/widgets/KVCache';
import SpeculativeDecoding from '../../components/widgets/SpeculativeDecoding';

export const kvCacheModule: ModuleDef = {
  id: "5",
  title: { en: "KV Caching & Fast Decoding", ar: "ذاكرة KV والتوليد السريع" },
  description: {
    en: "Why generation is O(n²) without a cache, and how speculative decoding beats the bandwidth wall.",
    ar: "لماذا التوليد تربيعي بدون ذاكرة مؤقتة، وكيف يكسر التوليد الاستباقي جدار عرض النطاق."
  },
  lessons: [
    {
      id: "kv",
      title: { en: "The KV Cache, Precisely", ar: "ذاكرة KV بدقة" },
      content: {
        en: <>
          <p>Generation is autoregressive: to produce token 501, the model attends over tokens 1–500. Naively you'd re-run the <em>entire</em> forward pass over all 500 tokens for every new token — total work grows <strong>quadratically</strong> and a 1000-token answer would take minutes.</p>
          <p>The fix exploits a structural fact: the <strong>Key and Value vectors of past tokens never change</strong> (thanks to the causal mask, token 17's K/V depends only on tokens 1–17). So we compute them once and store them — the <strong>KV cache</strong>. Each decode step then:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li>Runs the forward pass for <em>one</em> new token only.</li>
            <li>Computes its Q, K, V; appends K and V to the cache.</li>
            <li>Attends: new Q against <em>all cached</em> Ks and Vs.</li>
          </ol>
          <p>Per-step compute drops from O(n²·d) to O(n·d). The price is memory: the cache grows linearly with context <em>per user</em> and (Module 3) routinely outgrows the model itself under concurrency. Note what we do <em>not</em> cache: Queries (only the newest token queries) and FFN outputs (recomputed, they're cheap for one token).</p>
          <p>This is also why <strong>long contexts get slower and pricier</strong>: every new token's attention must scan the whole cache, and the cache eats the memory that batching needs. Context length is a resource, not a free setting.</p>
        </>,
        ar: <>
          <p>التوليد تلقائي التسلسل: لإنتاج الرمز 501 ينتبه النموذج للرموز 1–500. الحل الساذج يعيد تشغيل التمريرة <em>كاملة</em> على كل الرموز الـ 500 لكل رمز جديد — فينمو العمل الكلي <strong>تربيعيًا</strong> وتستغرق إجابة من 1000 رمز دقائق.</p>
          <p>الحل يستغل حقيقة بنيوية: <strong>متجهات K وV للرموز الماضية لا تتغير أبدًا</strong> (بفضل القناع السببي، K/V للرمز 17 تعتمد فقط على الرموز 1–17). فنحسبها مرة ونخزنها — هذه هي <strong><Eng>KV cache</Eng></strong>. كل خطوة توليد بعدها:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li>تشغّل التمريرة لرمز <em>واحد</em> جديد فقط.</li>
            <li>تحسب Q وK وV له؛ وتلحق K وV بالذاكرة.</li>
            <li>تنتبه: Q الجديد مقابل <em>كل</em> K وV المخزنة.</li>
          </ol>
          <p>حساب كل خطوة ينخفض من O(n²·d) إلى O(n·d). الثمن هو الذاكرة: تنمو خطيًا مع السياق <em>لكل مستخدم</em> وكثيرًا ما تتجاوز حجم النموذج نفسه مع التزامن. لاحظ ما <em>لا</em> نخزنه: الـ <Eng>Queries</Eng> (فقط أحدث رمز يسأل) وخرج الـ <Eng>FFN</Eng> (يعاد حسابه؛ رخيص لرمز واحد).</p>
          <p>وهذا أيضًا سبب أن <strong>السياقات الطويلة أبطأ وأغلى</strong>: انتباه كل رمز جديد يمسح كامل الذاكرة المؤقتة، وهي تلتهم الذاكرة التي يحتاجها التجميع. طول السياق مورد، وليس إعدادًا مجانيًا.</p>
        </>
      },
      math: {
        en: <p>Without cache, total FLOPs for generating n tokens ∝ Σₜ t·d ≈ n²d/2. With cache: ∝ n·d per step, n·d·n total for attention but n×(model FLOPs) overall — generation time scales linearly. Cache growth: bytes/token = 2 × layers × kv_heads × head_dim × precision (Llama-3-8B FP16: ~131KB per token).</p>,
        ar: <p>بدون ذاكرة، إجمالي العمليات لتوليد n رمز ∝ n²d/2. معها: ∝ n·d لكل خطوة — يصبح زمن التوليد خطيًا. نمو الذاكرة: بايت/رمز = 2 × الطبقات × رؤوس KV × بُعد الرأس × الدقة (Llama-3-8B بدقة FP16: ~131 كيلوبايت لكل رمز).</p>
      },
      widget: <KVCache />
    },
    {
      id: "spec_decode",
      title: { en: "Speculative Decoding", ar: "التوليد الاستباقي" },
      content: {
        en: <>
          <p>Decode is memory-bound: reading 140GB of weights to produce <em>one</em> token wastes the GPU's compute. <strong>Speculative decoding</strong> converts that idle compute into speed:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li>A small <strong>draft model</strong> (e.g. 1B params, ~10× faster) generates k candidate tokens (say 5) autoregressively.</li>
            <li>The big <strong>target model</strong> runs <em>one</em> forward pass over all 5 candidates in parallel — costing barely more than a single-token step, since the bandwidth (weight reading) is the bottleneck, not compute.</li>
            <li>Compare: accept the longest prefix of draft tokens where the target agrees (via rejection sampling), then take the target's own token for the first disagreement.</li>
          </ol>
          <p>The elegant part: the output distribution is <strong>mathematically identical</strong> to the target model sampling alone — it's a pure speedup, no quality tradeoff. Typical acceptance rates of 60–80% yield 2–3× faster decoding.</p>
          <p>Variants you'll meet in practice: <strong>self-speculation</strong> (Medusa/EAGLE add small prediction heads to the target model itself — no separate draft model to manage), and <strong>prompt lookup</strong> (draft by copying matching n-grams from the prompt — nearly free and very effective for summarization/code-editing where output overlaps input). Speculation shines at low batch sizes; at high batch the GPU is already busy, so gains shrink.</p>
        </>,
        ar: <>
          <p>التوليد مقيّد بالذاكرة: قراءة 140 جيجابايت من الأوزان لإنتاج رمز <em>واحد</em> تهدر قدرة الكارت الحسابية. <strong>التوليد الاستباقي</strong> يحوّل ذلك الحساب العاطل إلى سرعة:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>نموذج مسودة</strong> صغير (مثلاً 1B، أسرع ~10 مرات) يولّد k رمزًا مرشحًا (لنقل 5) تسلسليًا.</li>
            <li><strong>النموذج الهدف</strong> الكبير يشغّل تمريرة <em>واحدة</em> على المرشحين الخمسة بالتوازي — بتكلفة تزيد بالكاد عن خطوة رمز واحد، لأن عرض النطاق (قراءة الأوزان) هو العنق، لا الحساب.</li>
            <li>المقارنة: نقبل أطول بادئة من رموز المسودة يوافق عليها الهدف (عبر <Eng>rejection sampling</Eng>)، ثم نأخذ رمز الهدف نفسه عند أول اختلاف.</li>
          </ol>
          <p>الجزء الأنيق: توزيع الخرج <strong>مطابق رياضيًا</strong> لتوليد النموذج الهدف وحده — تسريع صافٍ بلا أي مقايضة جودة. معدلات قبول 60–80% تعطي توليدًا أسرع 2–3 مرات.</p>
          <p>أشكال ستقابلها عمليًا: <strong>الاستباق الذاتي</strong> (Medusa/EAGLE تضيف رؤوس تنبؤ صغيرة للنموذج الهدف نفسه — بلا نموذج مسودة منفصل)، و<strong><Eng>prompt lookup</Eng></strong> (المسودة بنسخ مقاطع مطابقة من الأمر — شبه مجاني وفعال جدًا للتلخيص وتحرير الكود حيث يتداخل الخرج مع الدخل). الاستباق يتألق عند دفعات صغيرة؛ عند دفعات كبيرة يكون الكارت مشغولاً أصلاً فتتقلص المكاسب.</p>
        </>
      },
      math: {
        en: <p>Accept draft token with probability min(1, p_target(x)/p_draft(x)); on rejection, sample from normalized max(0, p_target − p_draft). Expected tokens per target pass ≈ (1 − αᵏ⁺¹)/(1 − α) where α = acceptance rate. α = 0.7, k = 5 → ~2.8 tokens per big-model pass.</p>,
        ar: <p>نقبل رمز المسودة باحتمال min(1, p_الهدف(x)/p_المسودة(x))؛ وعند الرفض نسحب من التوزيع المعدَّل max(0, p_الهدف − p_المسودة). متوسط الرموز لكل تمريرة هدف ≈ (1 − αᵏ⁺¹)/(1 − α) حيث α معدل القبول. عند α = 0.7 وk = 5 ← ~2.8 رمز لكل تمريرة للنموذج الكبير.</p>
      },
      widget: <SpeculativeDecoding />
    }
  ],
  quiz: [
    {
      question: { en: "Without a KV Cache, generation time would:", ar: "بدون الذاكرة المؤقتة، وقت التوليد سيـ:" },
      options: { en: ["Scale linearly", "Scale quadratically", "Stay the same", "Be instant"], ar: ["يزيد خطياً", "يزيد تربيعياً", "يبقى كما هو", "يكون فورياً"] },
      correctIndex: 1
    },
    {
      question: { en: "What exactly is stored in the KV cache?", ar: "ما الذي يُخزَّن بالضبط في ذاكرة KV؟" },
      options: {
        en: ["Query vectors", "Key and Value vectors of past tokens per layer", "FFN outputs", "The tokenizer table"],
        ar: ["متجهات Query", "متجهات K وV للرموز السابقة في كل طبقة", "مخرجات FFN", "جدول المُقطِّع"]
      },
      correctIndex: 1
    },
    {
      question: { en: "In speculative decoding, output quality is:", ar: "في التوليد الاستباقي، جودة الخرج:" },
      options: {
        en: ["Slightly worse", "Mathematically identical to the target model", "Depends on the draft model's quality", "Better than the target"],
        ar: ["أسوأ قليلاً", "مطابقة رياضيًا للنموذج الهدف", "تعتمد على جودة نموذج المسودة", "أفضل من الهدف"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why can the target model verify 5 draft tokens almost for free?", ar: "لماذا يراجع النموذج الهدف 5 رموز مسودة بلا تكلفة تقريبًا؟" },
      options: {
        en: ["Drafts are cached on disk", "Decode is memory-bound, so extra parallel compute is nearly free", "The draft model pays for it", "Tokens are compressed"],
        ar: ["المسودات مخزنة على القرص", "التوليد مقيّد بالذاكرة فالحساب الموازي الإضافي شبه مجاني", "نموذج المسودة يدفع التكلفة", "الرموز مضغوطة"]
      },
      correctIndex: 1
    }
  ]
};
