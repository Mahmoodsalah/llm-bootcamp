import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';

export const attentionModule: ModuleDef = {
  id: "attention",
  title: { en: "Modern Attention Variants", ar: "أنواع الـ Attention الحديثة" },
  description: {
    en: "From MHA to MLA, sparse attention, linear attention, and the full production decision guide. Every variant explained with equations.",
    ar: "من MHA إلى MLA والانتباه المتفرق والخطي ودليل القرار الإنتاجي. كل متغير مُشروح بالمعادلات."
  },
  lessons: [
    {
      id: "why_alternatives",
      title: { en: "Why We Need Alternatives: The Two Problems", ar: "لماذا نحتاج بدائل: المشكلتان" },
      content: {
        en: <>
          <p>The original attention formula from "Attention Is All You Need" (2017) is elegant but hides two engineering crises that only become visible at scale:</p>
          <h3 className="font-bold mt-4 mb-2">Problem 1: Quadratic Compute</h3>
          <p>Computing QKᵀ costs O(n² · d) operations. Double the context → 4× the compute. At 1 million tokens this is impractical. This is the <strong>compute wall</strong>.</p>
          <h3 className="font-bold mt-4 mb-2">Problem 2: KV Cache Memory</h3>
          <p>In autoregressive decoding, every new token must attend over every past token. To avoid recomputing K and V for past tokens, we cache them — the <strong>KV cache</strong>. This cache grows linearly with context length, per user. A model like Llama 3 70B with full MHA would need:</p>
          <p className="font-mono bg-muted rounded px-3 py-2 my-2 text-sm">2 × 80 layers × 64 heads × 128 dim × 2 bytes = 2.6 MB per token</p>
          <p>At 128K context: <strong>335 GB just for the cache</strong> of one sequence. Every solution below attacks one or both of these problems. Keep them in mind as you read.</p>
          <p className="mt-3 font-semibold">Three families of solutions emerged:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Family 1 — Reduce KV heads/size:</strong> keep full attention but shrink what you store (MQA → GQA → MLA)</li>
            <li><strong>Family 2 — Sparse attention:</strong> each token only attends to a chosen subset (SWA, NSA, MoBA, DSA, MSA)</li>
            <li><strong>Family 3 — Linear attention &amp; hybrids:</strong> replace softmax entirely, collapse KV cache into a fixed-size state</li>
          </ul>
        </>,
        ar: <>
          <p>معادلة الـ attention الأصلية من ورقة "Attention Is All You Need" (2017) أنيقة لكنها تخفي أزمتين هندسيتين لا تظهران إلا عند الحجم الكبير:</p>
          <h3 className="font-bold mt-4 mb-2">المشكلة الأولى: حساب تربيعي</h3>
          <p>حساب QKᵀ يكلف O(n² · d) عملية. ضاعف السياق ← 4 أضعاف الحساب. عند مليون رمز هذا غير عملي. هذا هو <strong>الجدار التربيعي</strong>.</p>
          <h3 className="font-bold mt-4 mb-2">المشكلة الثانية: ذاكرة KV Cache</h3>
          <p>في التوليد التلقائي، كل رمز جديد يجب أن ينتبه لكل الرموز السابقة. لتجنب إعادة حساب K وV للرموز الماضية، نخزّنها — هذه هي <strong><Eng>KV cache</Eng></strong>. تنمو خطيًا مع طول السياق، لكل مستخدم. نموذج مثل Llama 3 70B بـ full MHA سيحتاج:</p>
          <p className="font-mono bg-muted rounded px-3 py-2 my-2 text-sm">2 × 80 طبقة × 64 رأس × 128 بُعد × 2 بايت = 2.6 ميجابايت لكل رمز</p>
          <p>عند سياق 128K: <strong>335 جيجابايت للذاكرة وحدها</strong> لتسلسل واحد. كل حل أدناه يهاجم واحدة من هاتين المشكلتين أو كلتيهما. ابقِهما في ذهنك وأنت تقرأ.</p>
          <p className="mt-3 font-semibold">ظهرت ثلاث عائلات من الحلول:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>العائلة 1 — تقليل الرؤوس:</strong> الاحتفاظ بـ full attention لكن تصغير ما يُخزَّن (MQA → GQA → MLA)</li>
            <li><strong>العائلة 2 — Sparse attention:</strong> كل رمز ينتبه فقط لمجموعة مختارة (SWA, NSA, MoBA, DSA, MSA)</li>
            <li><strong>العائلة 3 — Linear attention وهجينة:</strong> استبدال softmax كليًا وتحويل KV cache إلى حالة ثابتة الحجم</li>
          </ul>
        </>
      },
      math: {
        en: <p>Attention(Q,K,V) = softmax(QKᵀ / √d_k) V — the full attention formula. Cost: O(n²·d) compute, O(n·L·n_kv·d_head·b) bytes of KV cache for n tokens across L layers, n_kv KV heads, d_head dimensions, and b bytes per value. Every variant below changes at least one of these terms.</p>,
        ar: <p>Attention(Q,K,V) = softmax(QKᵀ / √d_k) V — معادلة الـ full attention. التكلفة: O(n²·d) حساب، وO(n·L·n_kv·d_head·b) بايت من KV cache لـ n رمز عبر L طبقة، وn_kv رأس KV، وd_head بُعد، وb بايت لكل قيمة. كل متغير أدناه يغيّر على الأقل أحد هذه المتغيرات.</p>
      }
    },
    {
      id: "kv_reduction",
      title: { en: "Family 1: MHA → MQA → GQA → MLA", ar: "العائلة 1: تقليل الـ KV Cache" },
      content: {
        en: <>
          <p>These variants keep full O(n²) attention but reduce how much K and V you store. Think of them as a progression from "every head has its own KV" to "compress everything into a tiny latent vector".</p>

          <h3 className="font-bold mt-4 mb-2">MHA (Multi-Head Attention) — the baseline</h3>
          <p>h independent heads, each with their own Q, K, V projections. KV cache = h × (K + V) per token. Best quality, worst memory. Used in: GPT-2/3, Llama 1, BERT.</p>

          <h3 className="font-bold mt-4 mb-2">MQA (Multi-Query Attention) — Shazeer 2019</h3>
          <p>All h query heads share <strong>one single KV head</strong>. Cache shrinks h×. Quality drops noticeably — all heads forced into one K/V representation. Used in: PaLM, Falcon.</p>

          <h3 className="font-bold mt-4 mb-2">GQA (Grouped-Query Attention) — Ainslie 2023</h3>
          <p>Split h query heads into g groups; each group shares one KV head. Cache shrinks h/g×. With g=8 the quality loss vs MHA is nearly unmeasurable. <strong>This is the current industry default.</strong> Llama 3 70B uses 64Q / 8KV heads — 8× cache reduction, 42 GB instead of 335 GB at 128K. Used in: Llama 2/3, Qwen 2/3, Mistral, Gemma, MiniMax-M2.</p>

          <h3 className="font-bold mt-4 mb-2">MLA (Multi-head Latent Attention) — DeepSeek-V2 2024</h3>
          <p>Instead of reducing KV heads, compress <em>all</em> K and V into a single small latent vector c_t (512 dims vs the ~8K you'd store in GQA). At inference, K and V are reconstructed on the fly. The catch: standard RoPE (which depends on position) prevents the mathematical trick that absorbs the up-projection into the Q projection. Solution: <strong>decoupled RoPE</strong> — a small positional slice (64 dims) is cached separately, the rest goes through the latent.</p>
          <p>Result: <strong>93.3% KV cache reduction vs MHA</strong>. Surprising finding: MLA ablations showed <em>better quality than MHA</em>, while GQA was slightly worse. The compression appears to act as regularization. Cost: significantly more complex implementation.</p>
          <p>Used in: DeepSeek-V2/V3/R1/V3.2, Kimi K2.</p>

          <div className="mt-4 overflow-x-auto">
            <table className="text-sm border-collapse w-full">
              <thead><tr className="bg-muted">
                <th className="border p-2 text-start">Method</th>
                <th className="border p-2">Cache vs MHA</th>
                <th className="border p-2">Quality</th>
                <th className="border p-2">Complexity</th>
              </tr></thead>
              <tbody>
                <tr><td className="border p-2">MHA</td><td className="border p-2 text-center">1× (baseline)</td><td className="border p-2 text-center">baseline</td><td className="border p-2 text-center">simple</td></tr>
                <tr><td className="border p-2">MQA</td><td className="border p-2 text-center">÷h (e.g. ÷32)</td><td className="border p-2 text-center">noticeably worse</td><td className="border p-2 text-center">simple</td></tr>
                <tr><td className="border p-2">GQA</td><td className="border p-2 text-center">÷(h/g) e.g. ÷8</td><td className="border p-2 text-center">near-identical</td><td className="border p-2 text-center">simple</td></tr>
                <tr><td className="border p-2 font-semibold">MLA</td><td className="border p-2 text-center font-semibold">÷15 (93.3%↓)</td><td className="border p-2 text-center font-semibold">better than MHA</td><td className="border p-2 text-center">complex</td></tr>
              </tbody>
            </table>
          </div>
        </>,
        ar: <>
          <p>هذه المتغيرات تحتفظ بـ full O(n²) attention لكن تقلل ما تخزنه من K وV. فكّر فيها كتطور من "لكل رأس KV خاص به" إلى "اضغط كل شيء في متجه كامن صغير".</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>MHA</Eng> — القاعدة</h3>
          <p>h رأسًا مستقلاً، لكل منها إسقاطات Q وK وV خاصة به. KV cache = h × (K + V) لكل رمز. أفضل جودة، أسوأ ذاكرة. مستخدمة في: GPT-2/3، Llama 1.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>MQA</Eng> — Shazeer 2019</h3>
          <p>كل رؤوس الـ h query تشارك <strong>رأس KV واحدًا</strong>. الذاكرة تنخفض ÷h. الجودة تنخفض بشكل ملحوظ — كل الرؤوس مجبرة على نفس تمثيل K/V. مستخدمة في: PaLM، Falcon.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>GQA</Eng> — Ainslie 2023</h3>
          <p>نقسم h رأسًا إلى g مجموعات؛ كل مجموعة تشارك رأس KV واحدًا. الذاكرة تنخفض ÷(h/g). مع g=8 يكاد انخفاض الجودة مقارنة بـ MHA أن يُقاس. <strong>هذا هو المعيار الصناعي الحالي.</strong> Llama 3 70B يستخدم 64Q / 8KV رأس — خفض الذاكرة 8×، 42 جيجابايت بدلاً من 335 عند 128K. مستخدمة في: Llama 2/3، Qwen 2/3، Mistral، Gemma.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>MLA</Eng> — DeepSeek-V2 2024</h3>
          <p>بدلاً من تقليل رؤوس KV، يتم ضغط <em>جميع</em> K وV في متجه كامن صغير واحد c_t (512 بُعدًا مقابل ~8K في GQA). في وقت الاستدلال تُعاد K وV من المتجه الكامن. المشكلة: RoPE العادي (الذي يعتمد على الموقع) يمنع الحيلة الرياضية التي تدمج إسقاط الرفع في Q. الحل: <strong>decoupled RoPE</strong> — شريحة موقعية صغيرة (64 بُعدًا) تُخزَّن منفصلة، والباقي يمر عبر المتجه الكامن.</p>
          <p>النتيجة: <strong>تخفيض KV cache بنسبة 93.3% مقارنة بـ MHA</strong>. اكتشاف مفاجئ: أظهرت ablations الـ MLA <em>جودة أفضل من MHA</em>، بينما GQA كانت أسوأ قليلاً. يبدو أن الضغط يعمل كتنظيم. التكلفة: تطبيق أكثر تعقيدًا. مستخدمة في: DeepSeek-V2/V3/R1/V3.2، Kimi K2.</p>

          <div className="mt-4 overflow-x-auto">
            <table className="text-sm border-collapse w-full">
              <thead><tr className="bg-muted">
                <th className="border p-2 text-start">الطريقة</th>
                <th className="border p-2">الذاكرة مقابل MHA</th>
                <th className="border p-2">الجودة</th>
                <th className="border p-2">التعقيد</th>
              </tr></thead>
              <tbody>
                <tr><td className="border p-2">MHA</td><td className="border p-2 text-center">1× (القاعدة)</td><td className="border p-2 text-center">القاعدة</td><td className="border p-2 text-center">بسيط</td></tr>
                <tr><td className="border p-2">MQA</td><td className="border p-2 text-center">÷h (مثلاً ÷32)</td><td className="border p-2 text-center">أسوأ بشكل ملحوظ</td><td className="border p-2 text-center">بسيط</td></tr>
                <tr><td className="border p-2">GQA</td><td className="border p-2 text-center">÷(h/g) مثلاً ÷8</td><td className="border p-2 text-center">شبه متطابقة</td><td className="border p-2 text-center">بسيط</td></tr>
                <tr><td className="border p-2 font-semibold">MLA</td><td className="border p-2 text-center font-semibold">÷15 (93.3%↓)</td><td className="border p-2 text-center font-semibold">أفضل من MHA</td><td className="border p-2 text-center">معقد</td></tr>
              </tbody>
            </table>
          </div>
        </>
      },
      math: {
        en: <>
          <p><strong>MQA:</strong> head_i = Attention(XW_iᴼ, XWᴷ, XWᵛ) — single shared K, V weight.</p>
          <p><strong>GQA:</strong> head_i = Attention(XW_iᴼ, XW_(g(i))ᴷ, XW_(g(i))ᵛ) — g(i) = group index. When g=h → MHA; g=1 → MQA.</p>
          <p><strong>MLA compression:</strong> c_t^KV = W^DKV · h_t (dim d_c ≪ 2·n_h·d_h). Decompression at inference: k_t = W^UK · c_t^KV, v_t = W^UV · c_t^KV. What actually gets cached: the latent c_t (512 dims) + the RoPE slice (64 dims). Reduction: 2·n_h·d_h → d_c + d_R = ~15× less memory.</p>
        </>,
        ar: <>
          <p><strong>MQA:</strong> head_i = Attention(XW_iᴼ, XWᴷ, XWᵛ) — K وV مشتركان واحد.</p>
          <p><strong>GQA:</strong> head_i = Attention(XW_iᴼ, XW_(g(i))ᴷ, XW_(g(i))ᵛ) — g(i) = رقم المجموعة. عندما g=h ← MHA؛ g=1 ← MQA.</p>
          <p><strong>ضغط MLA:</strong> c_t^KV = W^DKV · h_t (البُعد d_c ≪ 2·n_h·d_h). فك الضغط وقت الاستدلال: k_t = W^UK · c_t^KV, v_t = W^UV · c_t^KV. ما يُخزَّن فعليًا: المتجه الكامن c_t (512 بُعدًا) + الشريحة الموضعية (64 بُعدًا). التخفيض: 2·n_h·d_h → d_c + d_R ≈ 15× أقل ذاكرة.</p>
        </>
      }
    },
    {
      id: "sparse_attention",
      title: { en: "Family 2: Sparse Attention (SWA → NSA → MoBA → DSA → MSA)", ar: "العائلة 2: Sparse Attention" },
      content: {
        en: <>
          <p>Instead of attending to every past token, each token attends to a <strong>chosen subset</strong>. Most attention mass concentrates on a small fraction of tokens anyway; sparse selection captures the important signal while cutting compute drastically.</p>
          <p>The key question: <strong>who chooses the subset, and how?</strong> Fixed window vs learned selection separates these approaches.</p>

          <h3 className="font-bold mt-4 mb-2">SWA — Sliding Window Attention (fixed)</h3>
          <p>Each token sees only the last w tokens. Compute drops to O(n·w). KV cache is fixed at w tokens regardless of context length. Long-range info travels indirectly: after L layers the receptive field is L×w. <strong>Always used as a hybrid</strong> interleaved with full-attention layers.</p>
          <ul className="list-disc ps-6 space-y-1 text-sm">
            <li>Mistral 7B: window 4096 in all layers (v1)</li>
            <li>Gemma 3: ratio 5 local (window 1024) : 1 global + attention sinks</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-1">Weakness: fixed, not content-adaptive. If the critical information is far away, there's no direct path to it.</p>

          <h3 className="font-bold mt-4 mb-2">NSA — Native Sparse Attention (DeepSeek, Feb 2025)</h3>
          <p>First serious claim that learned sparsity can be trained <em>natively from scratch</em>. Three parallel paths per query:</p>
          <ol className="list-decimal ps-6 space-y-1 text-sm">
            <li><strong>Compression path:</strong> tokens grouped into blocks, each block compressed by a learned MLP into one summary token → coarse global attention.</li>
            <li><strong>Selection path:</strong> compression scores pick top-n blocks → fine-grained attention on real tokens of selected blocks.</li>
            <li><strong>Sliding window:</strong> local path for nearby tokens.</li>
          </ol>
          <p>Output gated: o_t = Σ g_t^c · o_t^c per path. Key insight: sparsity must enter gradients from training start — pruning a dense model after the fact hurts retrieval heads.</p>

          <h3 className="font-bold mt-4 mb-2">MoBA — Mixture of Block Attention (Kimi / Moonshot, Feb 2025)</h3>
          <p>MoE idea applied to attention, with <strong>zero extra parameters</strong>. Context is split into blocks; each query picks the top-k blocks by affinity: s_i = ⟨q_t, mean(K_block_i)⟩. Current block always included (like the shared expert in MoE). Can switch between full and sparse during training. Elegant in its simplicity.</p>

          <h3 className="font-bold mt-4 mb-2">DSA — DeepSeek Sparse Attention (DeepSeek V3.2)</h3>
          <p>Token-level (not block-level) selection, built <em>on top of MLA</em>, not replacing it. A <strong>lightning indexer</strong> (few heads, FP8, ReLU instead of softmax) scores every past token s vs current token t. Top-k tokens (2048 in V3.2) are fed to the main MLA attention. The indexer is ~O(n²) but with such tiny constant (few heads + FP8 + ReLU) it's nearly free. The main expensive attention becomes O(n·k). Two training phases: dense (indexer learns to mimic full attention via KL loss), then sparse.</p>

          <h3 className="font-bold mt-4 mb-2">MSA — MiniMax Sparse Attention (MiniMax M3, June 2026)</h3>
          <p>Block-level selection (like MoBA) with a learned index (like DSA), built on <strong>standard GQA</strong>. Each GQA group independently selects its top-k blocks. Attention is exact (no compression) on real K/V of selected blocks. Training challenge: top-k is non-differentiable, so a <strong>KL alignment loss</strong> makes the index branch mimic actual attention patterns of the main branch. Results at 109B multimodal: 28.4× compute reduction at 1M context, 14.2× prefill speedup on H800, with GQA-equivalent quality. This is what powers MiniMax M3's 1M context window.</p>
        </>,
        ar: <>
          <p>بدلاً من الانتباه لكل رمز سابق، كل رمز ينتبه فقط لـ <strong>مجموعة مختارة</strong>. معظم كتلة الانتباه تتركز أصلاً في جزء صغير من الرموز؛ الاختيار المتفرق يلتقط الإشارة المهمة مع خفض الحساب بشكل كبير.</p>
          <p>السؤال المفتاحي: <strong>من يختار المجموعة، وكيف؟</strong> النافذة الثابتة مقابل الاختيار المُتعلَّم يفصل بين هذه الأساليب.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>SWA</Eng> — نافذة منزلقة ثابتة</h3>
          <p>كل رمز يرى فقط آخر w رمز. الحساب ينخفض إلى O(n·w). KV cache ثابت عند w رمز بغض النظر عن طول السياق. المعلومات البعيدة تنتقل بشكل غير مباشر: بعد L طبقة، الحقل الاستقبالي L×w. <strong>تُستخدم دائمًا كـ hybrid</strong> متداخلة مع طبقات full-attention.</p>
          <p className="text-sm text-muted-foreground">الضعف: ثابتة، غير متكيفة مع المحتوى. إذا كانت المعلومة الحرجة بعيدة، لا توجد مسار مباشر إليها.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>NSA</Eng> — DeepSeek، فبراير 2025</h3>
          <p>أول ادعاء جاد بأن التفرق المُتعلَّم يمكن تدريبه <em>أصليًا من الصفر</em>. ثلاثة مسارات متوازية لكل query: ضغط (كل block يُضغط بـ MLP إلى رمز ملخص ← انتباه coarse عالمي)، اختيار (درجات الضغط تختار أفضل n block ← انتباه دقيق على الرموز الحقيقية)، ونافذة محلية. المخرجات مبوّبة بـ gates متعلمة. الرؤية المهمة: التفرق يجب أن يدخل الاشتقاقات من بداية التدريب — قص نموذج كثيف بعد التدريب يضر رؤوس الاسترجاع.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>MoBA</Eng> — Kimi / Moonshot، فبراير 2025</h3>
          <p>فكرة MoE مطبقة على الانتباه بـ <strong>صفر معاملات إضافية</strong>. السياق يُقسَّم إلى blocks؛ كل query تختار أفضل k blocks بالتقارب: s_i = ⟨q_t, mean(K_block_i)⟩. الـ block الحالي دائمًا مضمّن (كالخبير المشترك في MoE). يمكن التبديل بين full وsparse أثناء التدريب. بسيط وأنيق.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>DSA</Eng> — DeepSeek V3.2</h3>
          <p>اختيار على مستوى الرمز (لا الـ block)، مبني <em>فوق MLA</em>. <strong>lightning indexer</strong> (رؤوس قليلة، FP8، ReLU بدل softmax) يعطي درجة لكل رمز سابق. أفضل k رمز (2048 في V3.2) تُغذَّى للـ MLA الرئيسية. الـ indexer شبه O(n²) لكن بثابت صغير جدًا فهو شبه مجاني. الانتباه الرئيسي الغالي يصبح O(n·k). مرحلتا تدريب: كثيفة (indexer يتعلم تقليد full attention بـ KL loss)، ثم متفرقة.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>MSA</Eng> — MiniMax M3، يونيو 2026</h3>
          <p>اختيار على مستوى الـ block (كـ MoBA) مع فهرس مُتعلَّم (كـ DSA)، مبني على <strong>GQA العادية</strong>. كل GQA group تختار بشكل مستقل أفضل k block. الانتباه دقيق (بلا ضغط) على K/V الحقيقية للـ blocks المختارة. تحدي التدريب: top-k غير قابلة للاشتقاق، لذا <strong>KL alignment loss</strong> يجعل فرع الفهرس يحاكي أنماط الانتباه الفعلية. النتائج على 109B: تخفيض الحساب 28.4× عند سياق 1M، تسريع prefill 14.2× على H800، بجودة مكافئة لـ GQA الكاملة.</p>
        </>
      },
      math: {
        en: <>
          <p><strong>SWA mask:</strong> mask(t, s) = 0 if t−w &lt; s ≤ t, else −∞. Receptive field after L layers ≈ L×w.</p>
          <p><strong>MoBA block affinity:</strong> s_i = ⟨q_t, k̄_i⟩ where k̄_i = (1/|B_i|) Σ_(s in B_i) k_s. Top-k blocks selected; current block always included.</p>
          <p><strong>NSA gating:</strong> o_t = Σ_(c in cmp,slc,win) g_t^c · o_t^c, g_t^c = σ(MLP_c(x_t)).</p>
          <p><strong>DSA indexer score:</strong> I_(t,s) = Σ_(j=1)^(H_I) w_(t,j) · ReLU(q_(t,j)^I · k_s^I). Top-k tokens selected for main MLA attention.</p>
        </>,
        ar: <>
          <p><strong>قناع SWA:</strong> mask(t, s) = 0 إذا t−w &lt; s ≤ t، وإلا −∞. الحقل الاستقبالي بعد L طبقة ≈ L×w.</p>
          <p><strong>تقارب MoBA:</strong> s_i = ⟨q_t, k̄_i⟩ حيث k̄_i = (1/|B_i|) Σ_(s∈B_i) k_s. يُختار أفضل k block؛ الـ block الحالي دائمًا مضمّن.</p>
          <p><strong>بوابة NSA:</strong> o_t = Σ_(c∈cmp,slc,win) g_t^c · o_t^c, g_t^c = σ(MLP_c(x_t)).</p>
          <p><strong>درجة indexer لـ DSA:</strong> I_(t,s) = Σ_(j=1)^(H_I) w_(t,j) · ReLU(q_(t,j)^I · k_s^I). يُختار أفضل k رمز للـ MLA الرئيسية.</p>
        </>
      }
    },
    {
      id: "linear_attention",
      title: { en: "Family 3: Linear Attention, Lightning, DeltaNet & Hybrids", ar: "العائلة 3: Linear Attention والهجينة" },
      content: {
        en: <>
          <p>The most radical departure: replace softmax entirely. Instead of O(n²) with an ever-growing KV cache, you get O(n) with a <strong>fixed-size state matrix</strong> that acts like a compressed memory.</p>

          <h3 className="font-bold mt-4 mb-2">The Core Mathematical Idea</h3>
          <p>Standard attention for token t: o_t = Σ_(s≤t) exp(q_t·k_s) v_s / Z. The exp binds every q to every k — no way to summarize the past. Linear attention replaces exp with a <strong>kernel φ that factors</strong>: exp(q·k) ≈ φ(q)·φ(k). Once factored, we accumulate the past into a fixed state:</p>
          <p className="font-mono bg-muted rounded px-3 py-2 my-2 text-sm">S_t = S_(t-1) + φ(k_t) vt^T    [state update, O(1) per token]<br/>o_t = φ(q_t)^T S_t / (φ(q_t)^T z_t)    [read from state]</p>
          <p>S_t is fixed size (d×d) no matter how long the context. <strong>The KV cache disappears.</strong> The transformer can now be written as an RNN — same family as RWKV and Mamba.</p>
          <p><strong>The fundamental cost:</strong> the fixed state is a <em>lossy</em> memory. Full attention can retrieve any past token exactly. Linear attention must compress all history into one matrix — visible in exact long-range retrieval tasks (needle-in-haystack).</p>

          <h3 className="font-bold mt-4 mb-2">Lightning Attention (MiniMax-01/M1)</h3>
          <p>Naive linear attention was slow in practice on GPUs due to cumulative operations. Lightning Attention solves this with <strong>tiling</strong>: within a block, compute exactly (parallel); between blocks, use the recurrent state. Result: linear attention at constant wall-clock speed regardless of context length. MiniMax-01 (Jan 2025) first proved this at massive scale: 456B parameters, ratio 7 lightning : 1 softmax layers.</p>

          <h3 className="font-bold mt-4 mb-2">Gated DeltaNet (NVIDIA 2024)</h3>
          <p>Instead of accumulating into state (S += k v^T), the <strong>delta rule</strong> treats the state as a correctable memory — read what the state remembers about the current key, correct it toward the new value. This is online gradient descent on a retrieval error. The gated version adds a forgetting gate α_t (like Mamba-2) for controlled decay. This is the architecture <strong>Qwen3-Next</strong> is built on, with ratio 3:1 (DeltaNet:attention).</p>

          <h3 className="font-bold mt-4 mb-2">KDA — Kimi Delta Attention (Kimi Linear)</h3>
          <p>Gated DeltaNet but with a <strong>per-channel gate</strong> (diagonal decay matrix instead of scalar): the model can remember in some dimensions while forgetting in others simultaneously. Kimi Linear hybrid: <strong>3 layers KDA : 1 layer MLA</strong>. Result: ~75% KV cache reduction, faster decoding on large contexts, with performance exceeding full attention in their experiments.</p>

          <h3 className="font-bold mt-4 mb-2">SSM Hybrids (Mamba, Jamba)</h3>
          <p>State Space Models (Mamba) are a mathematical cousin of linear attention with the same recurrent-state idea but different formulation (selective scan). Hybrids replace most attention layers with SSM layers: Jamba (AI21, ratio 1:7 attention:Mamba + MoE), IBM Granite 4.0, NVIDIA Nemotron-H. <strong>Why keep some full attention?</strong> One full-attention layer every 4–8 layers recovers the exact-retrieval capability lost by the compressed state, at limited extra cost. Stable ratios: 3:1 to 7:1.</p>
        </>,
        ar: <>
          <p>الأكثر جذرية: استبدال softmax كليًا. بدلاً من O(n²) مع KV cache ينمو باستمرار، تحصل على O(n) مع <strong>مصفوفة حالة ثابتة الحجم</strong> تعمل كذاكرة مضغوطة.</p>

          <h3 className="font-bold mt-4 mb-2">الفكرة الرياضية الجوهرية</h3>
          <p>الـ attention العادية للرمز t: o_t = Σ_(s≤t) exp(q_t·k_s) v_s / Z. الـ exp تربط كل q بكل k — لا طريقة لتلخيص الماضي. الـ linear attention تستبدل exp بـ <strong>kernel φ قابل للفصل</strong>: exp(q·k) ≈ φ(q)·φ(k). بمجرد الفصل، نجمع الماضي في حالة ثابتة:</p>
          <p className="font-mono bg-muted rounded px-3 py-2 my-2 text-sm">S_t = S_(t-1) + φ(k_t) vt^T    [تحديث الحالة، O(1) لكل رمز]<br/>o_t = φ(q_t)^T S_t / (φ(q_t)^T z_t)    [القراءة من الحالة]</p>
          <p>S_t حجم ثابت (d×d) بغض النظر عن طول السياق. <strong>اختفى الـ KV cache.</strong> يمكن الآن كتابة الـ transformer كـ RNN — نفس العائلة التي فيها RWKV وMamba.</p>
          <p><strong>التكلفة الجوهرية:</strong> الحالة الثابتة ذاكرة <em>مضغوطة بخسارة</em>. الـ full attention يمكنه استرجاع أي رمز سابق بدقة. الـ linear يجب أن يضغط كل التاريخ في مصفوفة واحدة — ظاهر في مهام الاسترجاع الدقيق بعيد المدى.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>Lightning Attention</Eng> — MiniMax-01/M1</h3>
          <p>الـ linear attention الساذجة كانت بطيئة على الـ GPUs بسبب العمليات التراكمية. تحل Lightning Attention ذلك بالـ <strong>tiling</strong>: داخل الـ block بالحساب الدقيق (موازٍ)؛ بين الـ blocks بالحالة التكرارية. النتيجة: linear attention بسرعة ثابتة مع طول السياق. MiniMax-01 (يناير 2025) أثبتت ذلك على نطاق ضخم: 456B معامل، نسبة 7 lightning : 1 softmax.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>Gated DeltaNet</Eng> — NVIDIA 2024</h3>
          <p>بدلاً من التراكم في الحالة (S += k v^T)، تعامل <strong>delta rule</strong> الحالةَ كذاكرة قابلة للتصحيح — اقرأ ما تتذكره الحالة عن الـ key الحالي، وصحّحه نحو الـ value الجديد. هذا نزول تدريجي عبر الإنترنت على خطأ الاسترجاع. النسخة المبوّبة تضيف gate نسيان α_t (كـ Mamba-2). هذه البنية التي يُبنى عليها <strong>Qwen3-Next</strong> بنسبة 3:1.</p>

          <h3 className="font-bold mt-4 mb-2"><Eng>KDA</Eng> — Kimi Delta Attention</h3>
          <p>Gated DeltaNet لكن بـ <strong>gate لكل channel</strong> (مصفوفة تناقص قطرية بدلاً من scalar): يمكن للنموذج التذكر في بعض الأبعاد والنسيان في أبعاد أخرى في نفس الوقت. هجين Kimi Linear: <strong>3 طبقات KDA : 1 طبقة MLA</strong>. النتيجة: تخفيض KV cache ~75%، فك تشفير أسرع على السياقات الكبيرة، بأداء يتفوق على full attention في تجاربهم.</p>

          <h3 className="font-bold mt-4 mb-2">هجينة SSM (Mamba، Jamba)</h3>
          <p>نماذج فضاء الحالة (Mamba) قريب رياضي لـ linear attention بنفس فكرة الحالة التكرارية بصياغة مختلفة. الهجينة تستبدل معظم طبقات الانتباه بطبقات SSM: Jamba (AI21، نسبة 1:7 attention:Mamba + MoE)، IBM Granite 4.0، NVIDIA Nemotron-H. <strong>لماذا تحتفظ ببعض full attention؟</strong> طبقة full attention كل 4–8 طبقات تستعيد قدرة الاسترجاع الدقيق المفقودة بتكلفة إضافية محدودة. النسب المستقرة: 3:1 إلى 7:1.</p>
        </>
      },
      math: {
        en: <>
          <p><strong>Linear attention state:</strong> S_t = S_(t-1) + φ(k_t) v_t^T (size d×d, constant). Reading: o_t = φ(q_t)^T S_t / (φ(q_t)^T z_t).</p>
          <p><strong>Gated DeltaNet:</strong> S_t = α_t · S_(t-1)(I − β_t k_t k_t^T) + β_t k_t v_t^T. α_t ∈ (0,1) = forget gate; β_t ∈ (0,1) = write strength. The delta term (I − β_t k_t k_t^T) erases old value at k_t before writing the new v_t.</p>
          <p><strong>KDA per-channel decay:</strong> Same as DeltaNet but α_t is a diagonal matrix Λ_t (learned per channel), giving finer memory control.</p>
        </>,
        ar: <>
          <p><strong>حالة linear attention:</strong> S_t = S_(t-1) + φ(k_t) v_t^T (حجم d×d، ثابت). القراءة: o_t = φ(q_t)^T S_t / (φ(q_t)^T z_t).</p>
          <p><strong>Gated DeltaNet:</strong> S_t = α_t · S_(t-1)(I − β_t k_t k_t^T) + β_t k_t v_t^T. α_t ∈ (0,1) = gate النسيان؛ β_t ∈ (0,1) = قوة الكتابة. مصطلح delta (I − β_t k_t k_t^T) يمحو القيمة القديمة عند k_t قبل كتابة v_t الجديدة.</p>
          <p><strong>تناقص KDA لكل channel:</strong> نفس DeltaNet لكن α_t مصفوفة قطرية Λ_t (مُتعلَّمة لكل channel)، مما يمنح تحكمًا أدق في الذاكرة.</p>
        </>
      }
    },
    {
      id: "minimax_case_study",
      title: { en: "Case Study: MiniMax's Three-Generation Journey", ar: "دراسة حالة: رحلة MiniMax عبر ثلاثة أجيال" },
      content: {
        en: <>
          <p>The clearest proof that attention choice is an <em>engineering decision</em>, not a theoretical one. The same company, three generations, three families — including one deliberate reversal:</p>

          <div className="mt-3 overflow-x-auto">
            <table className="text-sm border-collapse w-full">
              <thead><tr className="bg-muted">
                <th className="border p-2 text-start">Generation</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Attention</th>
                <th className="border p-2 text-start">Why</th>
              </tr></thead>
              <tbody>
                <tr><td className="border p-2 font-semibold">MiniMax-01 / M1</td><td className="border p-2 text-center">Jan–Jun 2025</td><td className="border p-2 text-center">Lightning hybrid 7:1</td><td className="border p-2">Early bet on linear attention to reach 1M context</td></tr>
                <tr className="bg-amber-50 dark:bg-amber-950/20"><td className="border p-2 font-semibold">MiniMax-M2</td><td className="border p-2 text-center">Oct 2025</td><td className="border p-2 text-center font-bold">Full attention (GQA)</td><td className="border p-2">Voluntarily stepped back</td></tr>
                <tr><td className="border p-2 font-semibold">MiniMax-M3</td><td className="border p-2 text-center">Jun 2026</td><td className="border p-2 text-center">MSA (block sparse on GQA)</td><td className="border p-2">1M context once tooling was ready</td></tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4"><strong>The M2 reversal is the lesson.</strong> After investing in Lightning, they published "Why Did M2 End Up as a Full Attention Model" explaining their retreat to full attention:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>Precision issues in the efficient attention implementation</li>
            <li>Inference stacks and infrastructure not ready to serve it reliably</li>
            <li>Prefix caching complications with dynamic selection</li>
          </ul>
          <p>Six months later, M3 launched with MSA — once those problems were solved.</p>
          <p className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20"><strong>The lesson:</strong> A paper tells you a mechanism works in the lab. Production asks a completely different question: <em>is the entire ecosystem ready to run it?</em> — inference kernels, serving frameworks, prefix caching, numerical stability under all edge cases. "Research-ready" ≠ "production-ready". The delta can be 6–18 months.</p>
        </>,
        ar: <>
          <p>أوضح دليل على أن اختيار الـ attention قرار <em>هندسي</em> لا نظري. نفس الشركة، ثلاثة أجيال، ثلاث عائلات — بما فيها تراجع متعمد واحد:</p>

          <div className="mt-3 overflow-x-auto">
            <table className="text-sm border-collapse w-full">
              <thead><tr className="bg-muted">
                <th className="border p-2 text-start">الجيل</th>
                <th className="border p-2">التاريخ</th>
                <th className="border p-2">الـ Attention</th>
                <th className="border p-2 text-start">لماذا؟</th>
              </tr></thead>
              <tbody>
                <tr><td className="border p-2 font-semibold">MiniMax-01 / M1</td><td className="border p-2 text-center">يناير–يونيو 2025</td><td className="border p-2 text-center">Lightning hybrid 7:1</td><td className="border p-2">رهان مبكر على linear للوصول لـ 1M context</td></tr>
                <tr className="bg-amber-50 dark:bg-amber-950/20"><td className="border p-2 font-semibold">MiniMax-M2</td><td className="border p-2 text-center">أكتوبر 2025</td><td className="border p-2 text-center font-bold">Full attention (GQA)</td><td className="border p-2">تراجع إرادي</td></tr>
                <tr><td className="border p-2 font-semibold">MiniMax-M3</td><td className="border p-2 text-center">يونيو 2026</td><td className="border p-2 text-center">MSA (block sparse على GQA)</td><td className="border p-2">1M context بعد جاهزية الـ tooling</td></tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4"><strong>تراجع M2 هو الدرس.</strong> بعد الاستثمار في Lightning، نشروا "Why Did M2 End Up as a Full Attention Model" يشرحون تراجعهم لـ full attention:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>مشاكل دقة في تطبيق الـ efficient attention</li>
            <li>Inference stacks والـ infrastructure غير جاهزة لخدمته بشكل موثوق</li>
            <li>تعقيدات في الـ prefix caching مع الاختيار الديناميكي</li>
          </ul>
          <p>بعد ستة أشهر، نزل M3 بـ MSA — بعد حل تلك المشاكل.</p>
          <p className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20"><strong>الدرس:</strong> الورقة تخبرك أن الميكانيزم يعمل في المختبر. الـ production يسأل سؤالاً مختلفًا تمامًا: <em>هل النظام البيئي كله جاهز لتشغيله؟</em> — kernels الاستدلال، أطر الخدمة، prefix caching، الاستقرار العددي في كل الحالات الحدية. "جاهز للبحث" ≠ "جاهز للإنتاج". الفجوة يمكن أن تكون 6–18 شهرًا.</p>
        </>
      },
      math: {
        en: <p>MiniMax-M2 GQA config: 48 query heads / 8 KV heads (6:1 ratio), 62 layers. KV cache reduction vs MHA: 6× at 128K context. MiniMax-01: 456B total params, 7:1 Lightning:softmax ratio. MiniMax-M3 MSA: 28.4× attention compute reduction at 1M context, 14.2× wall-clock prefill speedup on H800 GPUs (MSA kernels vs full GQA).</p>,
        ar: <p>إعداد GQA لـ MiniMax-M2: 48 رأس query / 8 رأس KV (نسبة 6:1)، 62 طبقة. تخفيض KV cache مقابل MHA: 6× عند سياق 128K. MiniMax-01: 456B معامل إجمالي، نسبة 7:1 Lightning:softmax. MSA لـ MiniMax-M3: تخفيض حساب الانتباه 28.4× عند سياق 1M، تسريع prefill 14.2× على H800 (kernels MSA مقابل GQA كاملة).</p>
      }
    },
    {
      id: "production_guide",
      title: { en: "Production Decision Guide: Which Attention to Choose", ar: "دليل القرار الإنتاجي: أي attention تختار؟" },
      content: {
        en: <>
          <p>Benchmark scores alone won't guide you here. Ask these five questions:</p>

          <h3 className="font-bold mt-4 mb-2">1. What's your actual context length?</h3>
          <p>Under 32K (standard chat, short RAG): any GQA model works. You won't feel the differences. Differences start hurting above 128K: long-history agents, codebase analysis, large documents. The mechanism choice only matters when the context makes it matter.</p>

          <h3 className="font-bold mt-4 mb-2">2. What controls your serving cost?</h3>
          <p>KV cache determines the maximum batch size on a GPU, which determines throughput and cost per million tokens. An MLA or hybrid linear model can give you several times more concurrent users on the same hardware — at the cost of implementation complexity. Do the math for your actual load.</p>

          <h3 className="font-bold mt-4 mb-2">3. What does your inference stack support?</h3>
          <p>GQA works everywhere (vLLM, SGLang, TensorRT-LLM) and is maximally optimized. MLA support is now mature. New sparse and linear variants often need custom kernels or very recent framework versions. Test on your stack before committing. This was exactly MiniMax's M2 lesson.</p>

          <h3 className="font-bold mt-4 mb-2">4. Do you rely on prefix caching?</h3>
          <p>If you have agents or long repeated system prompts, prefix caching saves a lot. Some dynamic-selection mechanisms conflict with it or complicate it (this was one of MiniMax's M2 issues with efficient attention). Ask this question specifically before choosing a sparse model.</p>

          <h3 className="font-bold mt-4 mb-2">5. Does your workload need exact long-range retrieval?</h3>
          <p>If the model must recall a buried detail from early in context precisely (legal contracts, medical records, needle-in-haystack in production), full and sparse are safer than pure linear. Hybrids (3:1) address this substantially — but test on your workload, not on benchmarks.</p>

          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="font-semibold">Practical summary (no theory):</p>
            <ul className="list-disc ps-6 space-y-1 mt-2">
              <li><strong>GQA:</strong> safe default for everything</li>
              <li><strong>MLA:</strong> when serving cost at scale is painful</li>
              <li><strong>DSA/MSA:</strong> when long context is the core of your work</li>
              <li><strong>Hybrid linear (3:1):</strong> when throughput on huge contexts matters more than last 0.5% of retrieval accuracy</li>
            </ul>
          </div>
        </>,
        ar: <>
          <p>درجات الـ benchmark وحدها لن ترشدك هنا. اسأل هذه الأسئلة الخمسة:</p>

          <h3 className="font-bold mt-4 mb-2">1. ما هو طول السياق الفعلي؟</h3>
          <p>أقل من 32K (محادثة عادية، RAG قصير): أي نموذج GQA يكفي. لن تشعر بالفروق. الفروق تبدأ تؤلم فوق 128K: agents بتاريخ طويل، تحليل قواعد الكود، مستندات ضخمة. اختيار الميكانيزم يهم فقط عندما يجعله السياق يهم.</p>

          <h3 className="font-bold mt-4 mb-2">2. ما الذي يتحكم في تكلفة الخدمة؟</h3>
          <p>KV cache يحدد أقصى batch size على الـ GPU، الذي يحدد الإنتاجية والتكلفة لكل مليون token. نموذج MLA أو hybrid linear يمنحك عدة أضعاف من المستخدمين المتزامنين على نفس الـ hardware — بتكلفة تعقيد التطبيق. احسب الأرقام لحملك الفعلي.</p>

          <h3 className="font-bold mt-4 mb-2">3. ماذا يدعم stack الاستدلال؟</h3>
          <p>GQA تعمل في كل مكان (vLLM، SGLang، TensorRT-LLM) وهي محسّنة إلى أقصى حد. دعم MLA بات ناضجًا الآن. المتغيرات الجديدة (sparse وlinear) غالبًا تحتاج kernels مخصصة أو نسخ حديثة جدًا من الأطر. اختبر على stack خاصك قبل الالتزام. هذا بالضبط كان درس M2 لـ MiniMax.</p>

          <h3 className="font-bold mt-4 mb-2">4. هل تعتمد على prefix caching؟</h3>
          <p>إذا كان لديك agents أو system prompts طويلة متكررة، فالـ prefix caching يوفر كثيرًا. بعض آليات الاختيار الديناميكي تتعارض معه أو تعقده (كانت هذه إحدى مشاكل MiniMax مع M2). اسأل هذا السؤال تحديدًا قبل اختيار نموذج sparse.</p>

          <h3 className="font-bold mt-4 mb-2">5. هل يحتاج عملك استرجاعًا دقيقًا بعيد المدى؟</h3>
          <p>إذا كان النموذج يجب أن يستذكر بدقة تفصيلة مدفونة في بداية السياق (عقود قانونية، سجلات طبية، needle-in-haystack في الإنتاج)، فالـ full والـ sparse أأمن من pure linear. الهجينة (3:1) تعالج هذا بشكل كبير — لكن اختبر على عملك أنت لا على الـ benchmarks.</p>

          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="font-semibold">الخلاصة العملية (بلا نظرية):</p>
            <ul className="list-disc ps-6 space-y-1 mt-2">
              <li><strong>GQA:</strong> الافتراض الآمن لكل شيء</li>
              <li><strong>MLA:</strong> عندما تكون تكلفة الخدمة على نطاق واسع مؤلمة</li>
              <li><strong>DSA/MSA:</strong> عندما يكون السياق الطويل صلب عملك</li>
              <li><strong>Hybrid linear (3:1):</strong> عندما يكون الإنتاجية على السياقات الضخمة أهم من آخر 0.5% في دقة الاسترجاع</li>
            </ul>
          </div>
        </>
      },
      math: {
        en: <p>Comparison table — Mechanism | Compute | KV Cache | Examples: MHA O(n²) full; MQA O(n²) ÷h; GQA O(n²) ÷(h/g); MLA O(n²) ~÷15; SWA O(n·w) fixed-w; NSA sub-quadratic full; MoBA sub-quadratic full; DSA O(n·k)+indexer ~MLA-size; MSA O(n·k) block-level GQA-size; Lightning/KDA O(n) fixed-state; SSM-hybrid O(n) fixed+small-cache.</p>,
        ar: <p>جدول المقارنة — الميكانيزم | الحساب | الذاكرة | أمثلة: MHA O(n²) كاملة؛ MQA O(n²) ÷h؛ GQA O(n²) ÷(h/g)؛ MLA O(n²) ~÷15؛ SWA O(n·w) ثابت-w؛ NSA أقل من تربيعي كاملة؛ MoBA أقل من تربيعي كاملة؛ DSA O(n·k)+indexer ~حجم MLA؛ MSA O(n·k) block-level حجم GQA؛ Lightning/KDA O(n) حالة ثابتة؛ SSM-hybrid O(n) ثابت+ذاكرة صغيرة.</p>
      }
    },
    {
      id: "beyond_attention",
      title: { en: "Beyond Attention: Everything Else That Changed", ar: "خارج الـ Attention: كل ما تغيّر أيضًا" },
      content: {
        en: <>
          <p>Attention got the spotlight, but the biggest shifts in modern LLMs happened in other places: FFN, optimizer, precision, and the training pipeline itself.</p>

          <h3 className="font-bold mt-4 mb-2">MoE is Now the Default at Scale</h3>
          <p>DeepSeekMoE introduced <strong>fine-grained experts</strong> (many small experts instead of few large ones) + <strong>shared experts</strong> (always-active experts for common knowledge, routed experts for specialization). Router learning is now loss-free: instead of an auxiliary load-balancing loss that fights the main objective, a bias term on the router scores is adjusted dynamically to keep expert utilization balanced — no extra hyperparameter to tune.</p>

          <h3 className="font-bold mt-4 mb-2">Muon is Taking Over from AdamW</h3>
          <p>Muon replaces AdamW for matrix parameters. The update is orthogonalized via Newton-Schulz iterations: the gradient is treated as a direction in weight space, and the update is forced to cover all directions of the matrix equally rather than being dominated by one. Practical result: faster convergence for the same compute. Kimi K2 (1T parameters) trained with MuonClip proved it scales, and the trend is spreading.</p>

          <h3 className="font-bold mt-4 mb-2">Precision is Dropping: FP8 → FP4</h3>
          <p>DeepSeek-V3 was the first frontier model to train natively in FP8 at full scale. GPT-oss released MoE expert weights in MXFP4. Current wave: FP4 quantization-aware training of expert weights. Each precision step ≈ same model at half the memory and lower training cost — the challenge is numerical stability, which is where most innovation is going.</p>

          <h3 className="font-bold mt-4 mb-2">Multi-Token Prediction (MTP)</h3>
          <p>Instead of predicting only the next token, the model is trained to predict k tokens ahead with extra heads. Two benefits: richer representations during training (the model is forced to plan ahead), and the MTP head doubles as a free speculative decoder at inference — no separate draft model needed.</p>

          <h3 className="font-bold mt-4 mb-2">QK-Norm, NoPE Layers, YaRN</h3>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>QK-Norm:</strong> RMSNorm on Q and K before computing attention scores. Solved attention logit explosion and removed the need for softcapping. Now in Gemma 3, Qwen3, OLMo 2.</li>
            <li><strong>NoPE layers:</strong> entire layers with no positional encoding (e.g. iRoPE in Llama 4 global layers). Counterintuitively improves length generalization.</li>
            <li><strong>YaRN:</strong> the standard recipe for extending context after training by scaling RoPE rotation frequencies — no full retraining needed.</li>
            <li><strong>Hyper-Connections:</strong> redesign the residual stream itself into multiple parallel streams with learned routing weights. Appears as a training stability recipe at trillion-parameter scale.</li>
          </ul>

          <h3 className="font-bold mt-4 mb-2">RLVR: The New Training Stage That Makes the Difference</h3>
          <p>Reinforcement Learning with Verifiable Rewards (GRPO and variants DAPO, GSPO) is now the stage that separates models. Instead of human preference ratings, rewards come from verifiable outcomes (math correct/wrong, code runs/crashes). Compute budget for this stage is growing rapidly. DAPO improves on GRPO with clip-higher and dynamic sampling to stabilize training.</p>

          <h3 className="font-bold mt-4 mb-2">Diffusion LMs: The Rising Challenger</h3>
          <p>Generate text by denoising rather than autoregressive token-by-token generation: the model starts from masked/noisy tokens and improves them all in parallel over steps (LLaDA). The promise: much faster generation since there's no waiting for one token at a time. Still proving itself on long-form tasks, but now a serious research direction.</p>

          <p className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20"><strong>The common thread:</strong> every change here serves the same goal — more intelligence per compute dollar. MoE reduces FLOPs per token. Lower precision reduces the cost of each FLOP. MTP and Muon reduce required training steps. RLVR converts relatively cheap compute into new capabilities. The winner isn't who has the biggest model — it's who extracts the most intelligence from the same budget.</p>
        </>,
        ar: <>
          <p>الـ attention أخذت الأضواء، لكن أكبر التحولات في الـ LLMs الحديثة حدثت في أماكن أخرى: الـ FFN، والـ optimizer، والدقة، وخط التدريب نفسه.</p>

          <h3 className="font-bold mt-4 mb-2">MoE أصبح الافتراضي على النطاق الكبير</h3>
          <p>DeepSeekMoE قدم <strong>خبراء دقيقين</strong> (خبراء صغار كثيرون بدلاً من خبراء كبار قليلين) + <strong>خبراء مشتركون</strong> (دائماً نشطون للمعرفة العامة، خبراء الـ routing للتخصص). تعلم الـ router الآن بلا خسارة مساعدة: بدلاً من خسارة موازنة تكافح الهدف الرئيسي، يُضبط معامل انحياز على درجات الـ router ديناميكيًا للحفاظ على توازن استخدام الخبراء.</p>

          <h3 className="font-bold mt-4 mb-2">Muon يحل محل AdamW</h3>
          <p>Muon يستبدل AdamW لمعاملات المصفوفات. التحديث يُقوَّم تعامدًا عبر تكرارات Newton-Schulz: التدرج يُعامل كاتجاه في فضاء الأوزان، والتحديث مجبور على تغطية جميع اتجاهات المصفوفة بالتساوي بدلاً من أن يسيطر عليه اتجاه واحد. النتيجة العملية: تقارب أسرع لنفس الحساب. Kimi K2 (تريليون معامل) أثبت أنه يتوسع، والاتجاه ينتشر.</p>

          <h3 className="font-bold mt-4 mb-2">الدقة تنزل: FP8 ← FP4</h3>
          <p>DeepSeek-V3 كان أول نموذج رائد يتدرب أصليًا بـ FP8 على النطاق الكامل. GPT-oss نشرت أوزان خبراء MoE بصيغة MXFP4. الموجة الحالية: تدريب FP4 مع وعي بالتكميم لأوزان الخبراء. كل خطوة دقة ≈ نفس النموذج بنصف الذاكرة وتكلفة تدريب أقل.</p>

          <h3 className="font-bold mt-4 mb-2">التنبؤ بعدة رموز (MTP)</h3>
          <p>بدلاً من التنبؤ بالرمز التالي فقط، يُدرَّب النموذج على التنبؤ بـ k رمز للأمام برؤوس إضافية. فائدتان: تمثيلات أغنى أثناء التدريب (النموذج مجبر على التخطيط للأمام)، ورأس MTP يضاعف كـ مُوليد تخميني مجاني وقت الاستدلال — بلا نموذج مسودة منفصل.</p>

          <h3 className="font-bold mt-4 mb-2">QK-Norm وطبقات NoPE وYaRN</h3>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>QK-Norm:</strong> RMSNorm على Q وK قبل حساب درجات الانتباه. حل مشكلة انفجار logits وأزال الحاجة لـ softcapping. الآن في Gemma 3 وQwen3 وOLMo 2.</li>
            <li><strong>طبقات NoPE:</strong> طبقات كاملة بلا ترميز موضعي (مثلاً iRoPE في طبقات Llama 4 العالمية). يحسّن التعميم على الطول بشكل مناقض للحدس.</li>
            <li><strong>YaRN:</strong> الوصفة القياسية لمد السياق بعد التدريب بتعديل ترددات RoPE — بلا إعادة تدريب كاملة.</li>
            <li><strong>Hyper-Connections:</strong> إعادة تصميم الـ residual stream نفسه لمسارات متوازية متعددة بأوزان routing متعلمة.</li>
          </ul>

          <h3 className="font-bold mt-4 mb-2">RLVR: مرحلة التدريب الجديدة التي تصنع الفرق</h3>
          <p>التعلم المعزز بمكافآت قابلة للتحقق (GRPO وأشقاؤه DAPO وGSPO) هو الآن المرحلة التي تفصل بين النماذج. بدلاً من تقييمات التفضيل البشري، المكافآت تأتي من نتائج قابلة للتحقق (رياضيات صح/خطأ، كود يعمل/يتعطل). ميزانية الحساب لهذه المرحلة تنمو بسرعة. DAPO تحسّن على GRPO بـ clip-higher وعينات ديناميكية لتثبيت التدريب.</p>

          <h3 className="font-bold mt-4 mb-2">Diffusion LMs: المنافس الصاعد</h3>
          <p>توليد النص بالإزالة التدريجية بدلاً من التوليد الأحادي للرمز: النموذج يبدأ من رموز مقنّعة/مشوشة ويحسّنها جميعًا بالتوازي عبر خطوات (LLaDA). الوعد: توليد أسرع بكثير لأنه لا انتظار لرمز واحد في كل مرة. لا تزال تثبت نفسها في المهام الطويلة، لكنها أصبحت خطًا بحثيًا جادًا.</p>

          <p className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20"><strong>الخيط الرابط:</strong> كل تغيير هنا يخدم هدفًا واحدًا — ذكاء أكثر لكل دولار حساب. MoE تقلل FLOPs لكل رمز. الدقة الأقل تقلل تكلفة كل FLOP. MTP وMuon يقللان خطوات التدريب المطلوبة. RLVR تحول حسابًا رخيصًا نسبيًا إلى قدرات جديدة. الفائز ليس من يملك أكبر نموذج — بل من يستخرج أكثر ذكاء من نفس الميزانية.</p>
        </>
      },
      math: {
        en: <>
          <p><strong>Muon update:</strong> M_t = μ M_(t-1) + ∇_W L; W ← W − η · NewtonSchulz(M_t). Newton-Schulz orthogonalizes the momentum matrix so all singular directions get equal update magnitude.</p>
          <p><strong>MTP loss:</strong> L = L_next + λ Σ_(k=2)^(K) L_(t+k). The k-ahead heads predict tokens t+2, …, t+K simultaneously from the same hidden state.</p>
          <p><strong>QK-Norm:</strong> softmax(Norm(Q) Norm(K)^T / √d) V. Normalizing Q and K to unit length caps the dot product at √d, eliminating logit explosion without softcapping.</p>
          <p><strong>GRPO objective:</strong> E[Σ_(t) log π_θ(a_t|s_t) · (r − baseline)] — like PPO but group-based baseline (mean reward of k samples from the same prompt) rather than a learned value function.</p>
        </>,
        ar: <>
          <p><strong>تحديث Muon:</strong> M_t = μ M_(t-1) + ∇_W L; W ← W − η · NewtonSchulz(M_t). Newton-Schulz يقوّم مصفوفة الزخم تعامدًا بحيث تحصل جميع الاتجاهات المفردة على نفس مقدار التحديث.</p>
          <p><strong>خسارة MTP:</strong> L = L_next + λ Σ_(k=2)^(K) L_(t+k). رؤوس k-ahead تتنبأ بالرموز t+2, …, t+K في نفس الوقت من نفس الحالة الداخلية.</p>
          <p><strong>QK-Norm:</strong> softmax(Norm(Q) Norm(K)^T / √d) V. تطبيع Q وK لطول الوحدة يحد حاصل الضرب النقطي عند √d مما يلغي انفجار الـ logits بدون softcapping.</p>
          <p><strong>هدف GRPO:</strong> E[Σ_(t) log π_θ(a_t|s_t) · (r − baseline)] — مثل PPO لكن baseline يعتمد على المجموعة (متوسط مكافأة k عينات من نفس الأمر) بدلاً من دالة قيمة مُتعلَّمة.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: {
        en: "Llama 3 70B uses 64 query heads / 8 KV heads (GQA). What is the KV cache reduction vs full MHA?",
        ar: "Llama 3 70B يستخدم 64 رأس query / 8 رأس KV (GQA). ما هو تخفيض KV cache مقارنة بـ MHA الكاملة؟"
      },
      options: {
        en: ["2×", "4×", "8×", "64×"],
        ar: ["2×", "4×", "8×", "64×"]
      },
      correctIndex: 2
    },
    {
      question: {
        en: "MLA (Multi-head Latent Attention) achieves better quality than MHA in ablations. What is the likely reason?",
        ar: "MLA تحقق جودة أفضل من MHA في الـ ablations. ما السبب المرجح؟"
      },
      options: {
        en: [
          "It uses more parameters",
          "The latent compression acts as implicit regularization",
          "It avoids positional encoding entirely",
          "It uses FP8 precision"
        ],
        ar: [
          "تستخدم معاملات أكثر",
          "الضغط الكامن يعمل كتنظيم ضمني",
          "تتجنب ترميز المواقع كليًا",
          "تستخدم دقة FP8"
        ]
      },
      correctIndex: 1
    },
    {
      question: {
        en: "In linear attention, why is the fixed-size state a potential weakness?",
        ar: "في linear attention، لماذا الحالة الثابتة الحجم نقطة ضعف محتملة؟"
      },
      options: {
        en: [
          "It uses more GPU memory than the KV cache",
          "It compresses all history lossily, hurting exact long-range retrieval",
          "It cannot handle Arabic text",
          "It requires re-training the entire model"
        ],
        ar: [
          "تستهلك ذاكرة GPU أكثر من KV cache",
          "تضغط كل التاريخ بخسارة مما يضر الاسترجاع الدقيق بعيد المدى",
          "لا تستطيع التعامل مع النص العربي",
          "تتطلب إعادة تدريب كامل للنموذج"
        ]
      },
      correctIndex: 1
    },
    {
      question: {
        en: "MiniMax-M2 returned to full GQA after using Lightning Attention. What was the stated reason?",
        ar: "MiniMax-M2 عادت لـ full GQA بعد استخدام Lightning Attention. ما كان السبب المُعلَن؟"
      },
      options: {
        en: [
          "Linear attention was too slow to train",
          "Precision issues, immature inference stacks, and prefix caching complications",
          "GQA is cheaper to compute",
          "Customers preferred full attention"
        ],
        ar: [
          "linear attention كانت بطيئة جدًا في التدريب",
          "مشاكل دقة وstacks استدلال غير ناضجة وتعقيدات prefix caching",
          "GQA أرخص حسابيًا",
          "العملاء فضّلوا full attention"
        ]
      },
      correctIndex: 1
    },
    {
      question: {
        en: "What is the 'lightning indexer' in DeepSeek Sparse Attention (DSA)?",
        ar: "ما هو الـ 'lightning indexer' في DeepSeek Sparse Attention (DSA)؟"
      },
      options: {
        en: [
          "A large classifier that ranks all past tokens",
          "A tiny FP8 + ReLU network that scores each past token cheaply for top-k selection",
          "A sliding window of the last 2048 tokens",
          "The full MLA attention applied twice"
        ],
        ar: [
          "مصنِّف كبير يرتب كل الرموز الماضية",
          "شبكة صغيرة بـ FP8 + ReLU تعطي درجة لكل رمز ماضٍ بتكلفة منخفضة لاختيار أفضل k",
          "نافذة منزلقة لآخر 2048 رمز",
          "full MLA attention مطبقة مرتين"
        ]
      },
      correctIndex: 1
    },
    {
      question: {
        en: "RLVR (e.g. GRPO) differs from RLHF in that its rewards come from:",
        ar: "يختلف RLVR (مثلاً GRPO) عن RLHF في أن مكافآته تأتي من:"
      },
      options: {
        en: [
          "Human preference ratings",
          "A separate reward model trained on preferences",
          "Verifiable outcomes like math correctness or code execution",
          "The model's own confidence scores"
        ],
        ar: [
          "تقييمات التفضيل البشري",
          "نموذج مكافأة منفصل مدرَّب على التفضيلات",
          "نتائج قابلة للتحقق كصحة الرياضيات أو تنفيذ الكود",
          "درجات ثقة النموذج بنفسه"
        ]
      },
      correctIndex: 2
    }
  ]
};
