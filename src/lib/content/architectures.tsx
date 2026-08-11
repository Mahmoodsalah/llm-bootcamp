import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import Tokenization from '../../components/widgets/Tokenization';
import AttentionHeatmap from '../../components/widgets/AttentionHeatmap';
import TransformerWalkthrough from '../../components/widgets/TransformerWalkthrough';
import ArchCompare from '../../components/widgets/ArchCompare';

export const architecturesModule: ModuleDef = {
  id: "1",
  title: { en: "LLM Architectures", ar: "هندسة النماذج اللغوية" },
  description: {
    en: "Tokens, embeddings, attention, and the full anatomy of a transformer.",
    ar: "الرموز والتضمين والانتباه والتشريح الكامل للمحول."
  },
  lessons: [
    {
      id: "tokens",
      title: { en: "Tokenization: BPE from the Ground Up", ar: "تقطيع النصوص: خوارزمية BPE من الصفر" },
      content: {
        en: <>
          <p>Models don't read words or letters — they read <strong>tokens</strong>: integer IDs from a fixed vocabulary (typically 32k–128k entries). The dominant algorithm is <strong>Byte-Pair Encoding (BPE)</strong>, and it's trained <em>before</em> the model ever sees data:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Step 1:</strong> Start with a base vocabulary of all 256 bytes, so <em>any</em> text (Arabic, emoji, code) is representable — this is "byte fallback".</li>
            <li><strong>Step 2:</strong> Scan a huge corpus and count every adjacent pair of tokens.</li>
            <li><strong>Step 3:</strong> Merge the most frequent pair into a new token (e.g. <code>t</code>+<code>h</code> → <code>th</code>). Add it to the vocabulary.</li>
            <li><strong>Step 4:</strong> Repeat ~50,000–100,000 times. Frequent words become single tokens; rare words split into pieces.</li>
          </ul>
          <p>Why does this matter for building an LLM? Three engineering consequences:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Cost & context:</strong> everything is billed and limited in tokens. English averages ~4 characters/token; Arabic often costs 2–3× more tokens per word if the tokenizer was trained mostly on English data.</li>
            <li><strong>The embedding matrix size:</strong> vocabulary × hidden dimension. Llama 3's 128k vocab × 8192 dims ≈ 1B parameters just for the token table.</li>
            <li><strong>Weird failures:</strong> "how many r's in strawberry" fails because the model sees token IDs, not letters. Numbers split inconsistently ("2023" may be one token, "2024" two), which hurts arithmetic.</li>
          </ul>
        </>,
        ar: <>
          <p>النماذج لا تقرأ كلمات ولا حروفًا — بل تقرأ <strong>رموزًا (<Eng>tokens</Eng>)</strong>: أرقام صحيحة من قاموس ثابت (عادة من 32 ألف إلى 128 ألف مدخل). الخوارزمية السائدة هي <Eng>Byte-Pair Encoding (BPE)</Eng>، ويتم تدريبها <em>قبل</em> أن يرى النموذج أي بيانات:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الخطوة 1:</strong> نبدأ بقاموس أساسي من كل الـ 256 بايت، بحيث يمكن تمثيل <em>أي</em> نص (عربي، إيموجي، كود) — وهذا يسمى <Eng>byte fallback</Eng>.</li>
            <li><strong>الخطوة 2:</strong> نمسح مجموعة نصوص ضخمة ونعدّ كل زوج متجاور من الرموز.</li>
            <li><strong>الخطوة 3:</strong> ندمج الزوج الأكثر تكرارًا في رمز جديد (مثلاً <code>t</code>+<code>h</code> ← <code>th</code>) ونضيفه للقاموس.</li>
            <li><strong>الخطوة 4:</strong> نكرر العملية 50–100 ألف مرة. الكلمات الشائعة تصبح رمزًا واحدًا، والنادرة تنقسم لأجزاء.</li>
          </ul>
          <p>لماذا يهم هذا عند بناء نموذج؟ ثلاث نتائج هندسية:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>التكلفة والسياق:</strong> كل شيء يُحاسب ويُحدّ بالرموز. الإنجليزية ≈ 4 حروف/رمز، بينما العربية غالبًا تكلف 2–3 أضعاف الرموز لكل كلمة إذا تدرب المُقطِّع على بيانات إنجليزية في الأغلب.</li>
            <li><strong>حجم مصفوفة التضمين:</strong> القاموس × البُعد الداخلي. في Llama 3: قاموس 128 ألف × بُعد 8192 ≈ مليار معامل لجدول الرموز فقط.</li>
            <li><strong>أخطاء غريبة:</strong> سؤال "كم حرف r في strawberry" يفشل لأن النموذج يرى أرقام رموز لا حروفًا. والأرقام تنقسم بشكل غير متسق مما يضر العمليات الحسابية.</li>
          </ul>
        </>
      },
      math: {
        en: <p>BPE objective: greedily maximize compression. At each merge step choose the pair (a, b) with max count(a, b) in the corpus. Fertility = tokens/word measures tokenizer quality per language — a fertility of 1.3 for English vs 3.0 for Arabic means Arabic text uses ~2.3× the context window for the same content.</p>,
        ar: <p>هدف <Eng>BPE</Eng>: أقصى ضغط ممكن بطريقة جشعة. في كل خطوة دمج نختار الزوج (a, b) صاحب أعلى تكرار. مقياس <Eng>Fertility</Eng> = عدد الرموز/كلمة يقيس جودة المُقطِّع لكل لغة — قيمة 1.3 للإنجليزية مقابل 3.0 للعربية تعني أن النص العربي يستهلك ~2.3 ضعف نافذة السياق لنفس المحتوى.</p>
      },
      widget: <Tokenization />
    },
    {
      id: "embeddings_positions",
      title: { en: "Embeddings & Positional Encoding", ar: "التضمين وترميز المواقع" },
      content: {
        en: <>
          <p>A token ID like <code>4172</code> is meaningless to matrix math. The <strong>embedding layer</strong> is a lookup table: row 4172 of a big matrix gives a dense vector (e.g. 4096 floats) representing that token. These vectors are <em>learned during training</em> — initially random, they gradually organize so that related tokens point in similar directions.</p>
          <p>But attention by itself is <strong>order-blind</strong>: "the dog bit the man" and "the man bit the dog" would look identical. We must inject <strong>position information</strong>. The modern standard is <strong>RoPE (Rotary Position Embedding)</strong>:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>Each pair of dimensions in the Query/Key vectors is treated as 2D coordinates and <em>rotated</em> by an angle proportional to the token's position.</li>
            <li>The dot product between two rotated vectors then depends only on their <em>relative distance</em> — exactly what language needs ("the adjective before this noun").</li>
            <li>Because it's a rotation (not an added vector), it can be <em>extrapolated</em>: tricks like YaRN and NTK-scaling stretch the rotation frequencies to extend a 8k-trained model to 128k context.</li>
          </ul>
          <p>Engineering note: the embedding matrix is often <strong>tied</strong> with the final output layer (same weights used to convert the last hidden state back into vocabulary scores), saving hundreds of millions of parameters.</p>
        </>,
        ar: <>
          <p>رقم رمز مثل <code>4172</code> لا معنى له في الرياضيات المصفوفية. طبقة <Eng>Embedding</Eng> هي جدول بحث: الصف 4172 من مصفوفة كبيرة يعطي متجهًا كثيفًا (مثلاً 4096 رقمًا عشريًا) يمثل هذا الرمز. هذه المتجهات <em>تُتعلَّم أثناء التدريب</em> — تبدأ عشوائية ثم تتنظم تدريجيًا بحيث تشير الرموز المترابطة لاتجاهات متشابهة.</p>
          <p>لكن الانتباه بذاته <strong>أعمى عن الترتيب</strong>: "الكلب عضّ الرجل" و"الرجل عضّ الكلب" ستبدوان متطابقتين! لذلك يجب حقن <strong>معلومات الموقع</strong>. المعيار الحديث هو <Eng>RoPE (Rotary Position Embedding)</Eng>:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li>كل زوج من أبعاد متجهات <Eng>Query/Key</Eng> يُعامل كإحداثيات ثنائية ويُدار (<Eng>rotate</Eng>) بزاوية تتناسب مع موقع الرمز في الجملة.</li>
            <li>حاصل الضرب بين متجهين مُدارَين يعتمد فقط على <em>المسافة النسبية</em> بينهما — وهذا بالضبط ما تحتاجه اللغة ("الصفة التي قبل هذا الاسم").</li>
            <li>لأنه دوران (وليس متجهًا مضافًا)، يمكن <em>مدّه</em>: حيل مثل <Eng>YaRN</Eng> و<Eng>NTK-scaling</Eng> تمدد ترددات الدوران لتوسيع نموذج مدرَّب على 8k إلى سياق 128k.</li>
          </ul>
          <p>ملاحظة هندسية: مصفوفة التضمين غالبًا <strong>مشتركة</strong> (<Eng>tied</Eng>) مع طبقة الخرج الأخيرة (نفس الأوزان تحوّل الحالة الأخيرة إلى درجات القاموس)، مما يوفر مئات ملايين المعاملات.</p>
        </>
      },
      math: {
        en: <p>RoPE rotates dimension pair (x₁, x₂) at position m by angle mθᵢ where θᵢ = 10000^(−2i/d). After rotation, q·k depends only on (m − n): ⟨R(m)q, R(n)k⟩ = ⟨q, R(n−m)k⟩. Low dimensions rotate fast (capture nearby order), high dimensions rotate slowly (capture long-range structure).</p>,
        ar: <p><Eng>RoPE</Eng> يدير زوج الأبعاد (x₁, x₂) عند الموقع m بزاوية mθᵢ حيث θᵢ = 10000^(−2i/d). بعد الدوران، q·k يعتمد فقط على (m − n): أي على المسافة النسبية. الأبعاد المنخفضة تدور بسرعة (تلتقط الترتيب القريب) والعالية تدور ببطء (تلتقط البنية بعيدة المدى).</p>
      }
    },
    {
      id: "attention",
      title: { en: "Self-Attention: Q, K, V in Detail", ar: "الانتباه الذاتي: Q وK وV بالتفصيل" },
      content: {
        en: <>
          <p><strong>Self-Attention</strong> is how tokens exchange information. Each token's vector is projected by three learned matrices into three roles:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Query (Q):</strong> "what am I looking for?" — e.g. the token "it" asks: what noun do I refer to?</li>
            <li><strong>Key (K):</strong> "what do I offer?" — e.g. "cat" advertises: I'm a singular animal noun.</li>
            <li><strong>Value (V):</strong> "what do I actually pass along if selected?" — the content payload.</li>
          </ul>
          <p>Every Query is dot-producted against every Key → a score matrix. Softmax turns each row into a probability distribution ("where should I look?"), and the output for each token is the weighted average of all Values. In a decoder LLM a <strong>causal mask</strong> sets all scores to future tokens to −∞, so a token can only attend backwards — this is what makes next-token prediction honest.</p>
          <p>Three crucial refinements used in every production model:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Multi-Head Attention:</strong> instead of one attention over 4096 dims, run 32 parallel "heads" of 128 dims each. Different heads learn different relations: one tracks syntax, another coreference, another positional patterns.</li>
            <li><strong>GQA (Grouped-Query Attention):</strong> let 4–8 Query heads <em>share</em> one K/V head. Quality is nearly identical but the KV cache (Module 6) shrinks 4–8× — this is why Llama 3 70B is servable at all.</li>
            <li><strong>The O(n²) problem:</strong> the score matrix is n×n. Doubling context quadruples attention compute. FlashAttention reorganizes the computation into GPU-cache-sized tiles so the n×n matrix is never materialized in slow memory — same math, 2–4× faster, and memory O(n) instead of O(n²).</li>
          </ul>
        </>,
        ar: <>
          <p><Eng>Self-Attention</Eng> هو آلية تبادل المعلومات بين الرموز. متجه كل رمز يُسقَط عبر ثلاث مصفوفات مُتعلَّمة إلى ثلاثة أدوار:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong><Eng>Query (Q)</Eng>:</strong> "عمّ أبحث؟" — مثلاً كلمة "هي" تسأل: أي اسم أعود عليه؟</li>
            <li><strong><Eng>Key (K)</Eng>:</strong> "ماذا أعرض؟" — مثلاً "القطة" تعلن: أنا اسم مفرد لحيوان.</li>
            <li><strong><Eng>Value (V)</Eng>:</strong> "ما المحتوى الذي أمرره فعلاً إذا تم اختياري؟"</li>
          </ul>
          <p>كل <Eng>Query</Eng> يُضرب نقطيًا في كل <Eng>Key</Eng> ← مصفوفة درجات. دالة <Eng>softmax</Eng> تحول كل صف إلى توزيع احتمالي ("أين أنظر؟")، وخرج كل رمز هو المتوسط المرجّح لكل الـ <Eng>Values</Eng>. في نماذج التوليد يوجد <strong>قناع سببي (<Eng>causal mask</Eng>)</strong> يجعل درجات الرموز المستقبلية −∞، فلا يستطيع الرمز النظر إلا للخلف — وهذا ما يجعل التنبؤ بالرمز التالي صادقًا.</p>
          <p>ثلاث تحسينات جوهرية تُستخدم في كل نموذج إنتاجي:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong><Eng>Multi-Head Attention</Eng>:</strong> بدل انتباه واحد على 4096 بُعدًا، نشغّل 32 "رأسًا" متوازيًا بـ 128 بُعدًا لكل رأس. الرؤوس تتعلم علاقات مختلفة: رأس يتتبع القواعد، وآخر الضمائر، وآخر أنماط المواقع.</li>
            <li><strong><Eng>GQA (Grouped-Query Attention)</Eng>:</strong> نجعل 4–8 رؤوس <Eng>Query</Eng> <em>تتشارك</em> رأس <Eng>K/V</Eng> واحدًا. الجودة شبه متطابقة لكن ذاكرة <Eng>KV cache</Eng> تنكمش 4–8 مرات — وهذا سبب إمكانية تشغيل Llama 3 70B أصلاً.</li>
            <li><strong>مشكلة O(n²):</strong> مصفوفة الدرجات حجمها n×n. مضاعفة السياق تضاعف حساب الانتباه 4 مرات. تقنية <Eng>FlashAttention</Eng> تعيد تنظيم الحساب في بلاطات بحجم ذاكرة الكاش السريعة داخل الـ GPU بحيث لا تُبنى مصفوفة n×n في الذاكرة البطيئة أبدًا — نفس الرياضيات، أسرع 2–4 مرات، وذاكرة O(n) بدل O(n²).</li>
          </ul>
        </>
      },
      math: {
        en: <>
          <p>Attention(Q, K, V) = softmax(QKᵀ / √d<sub>k</sub>) V</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Why divide by √d<sub>k</sub>?</strong> Dot products of random d-dim vectors have variance ∝ d. With d = 128, raw scores would be huge, softmax would saturate to one-hot, and gradients would vanish. Dividing by √d keeps variance ≈ 1.</li>
            <li><strong>Cost:</strong> scores are n×n×h — for 32 heads and 8k context that's 2B score entries per layer, recomputed every forward pass. This is the quadratic wall.</li>
          </ul>
        </>,
        ar: <>
          <p>الانتباه(Q, K, V) = softmax(QKᵀ / √d<sub>k</sub>) V</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>لماذا القسمة على √d<sub>k</sub>؟</strong> حاصل الضرب النقطي لمتجهات عشوائية ببُعد d له تباين ∝ d. مع d = 128 ستكون الدرجات الخام ضخمة، وتتشبع <Eng>softmax</Eng> إلى قيمة واحدة، وتتلاشى الاشتقاقات (<Eng>gradients</Eng>). القسمة على √d تحافظ على التباين ≈ 1.</li>
            <li><strong>التكلفة:</strong> الدرجات n×n×h — لـ 32 رأسًا وسياق 8k هذا 2 مليار درجة لكل طبقة، تُعاد في كل تمريرة. هذا هو الجدار التربيعي.</li>
          </ul>
        </>
      },
      widget: <AttentionHeatmap />
    },
    {
      id: "transformer",
      title: { en: "Anatomy of a Transformer Block", ar: "تشريح وحدة المحول" },
      content: {
        en: <>
          <p>A transformer layer is not just attention. The full block, repeated N times (32 layers in Llama-8B, 126 in GPT-scale models), is:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong>RMSNorm:</strong> rescale the input vector to unit magnitude. Without normalization, activations explode or vanish across 100+ layers and training diverges.</li>
            <li><strong>Attention</strong> (previous lesson) — tokens exchange information.</li>
            <li><strong>Residual connection:</strong> add the attention output <em>to the original input</em> (x = x + Attn(Norm(x))). This "highway" means each layer only learns a small <em>correction</em>, and gradients flow straight back through 100 layers.</li>
            <li><strong>Feed-Forward Network (FFN):</strong> where ~⅔ of all parameters live. Each token is processed <em>independently</em>: expand to 4× width, apply a gated nonlinearity (SwiGLU in modern models), project back. Research suggests FFN layers act as key-value memories storing world knowledge — attention <em>moves</em> information, FFN <em>transforms and recalls</em> it.</li>
            <li><strong>Second residual:</strong> x = x + FFN(Norm(x)).</li>
          </ol>
          <p>After the last layer: one final norm, then the <strong>LM head</strong> (a vocab-sized matrix) turns the last token's vector into ~128k <strong>logits</strong> — raw scores for every possible next token. Softmax converts them into a probability distribution. That distribution <em>is</em> the model's entire output; everything else (chat, reasoning, code) is sampling from it repeatedly.</p>
          <p>Where the parameters go in a 7B model: ~65% FFN, ~25% attention projections, ~10% embeddings. Depth (layers) vs width (hidden size) is roughly balanced by the rule d<sub>model</sub> ≈ 128 × n<sub>layers</sub>.</p>
        </>,
        ar: <>
          <p>طبقة المحول ليست الانتباه فقط. الوحدة الكاملة، المكررة N مرة (32 طبقة في Llama-8B و126 في نماذج بحجم GPT)، هي:</p>
          <ol className="list-decimal ps-6 space-y-1">
            <li><strong><Eng>RMSNorm</Eng>:</strong> إعادة قياس متجه الدخل لمقدار موحد. بدون تطبيع، تنفجر القيم أو تتلاشى عبر أكثر من 100 طبقة وينهار التدريب.</li>
            <li><strong>الانتباه</strong> (الدرس السابق) — الرموز تتبادل المعلومات.</li>
            <li><strong>الوصلة المتبقية (<Eng>Residual</Eng>):</strong> نضيف خرج الانتباه <em>إلى الدخل الأصلي</em> (x = x + Attn(Norm(x))). هذا "الطريق السريع" يعني أن كل طبقة تتعلم فقط <em>تصحيحًا</em> صغيرًا، وتتدفق الاشتقاقات مباشرة عبر 100 طبقة.</li>
            <li><strong>الشبكة الأمامية (<Eng>FFN</Eng>):</strong> حيث يعيش ~ثلثا كل المعاملات. كل رمز يُعالج <em>مستقلاً</em>: توسيع لعرض 4×، تفعيل غير خطي مبوّب (<Eng>SwiGLU</Eng> في النماذج الحديثة)، ثم إسقاط عائد. تشير الأبحاث إلى أن طبقات <Eng>FFN</Eng> تعمل كذاكرة مفتاح-قيمة تخزن معرفة العالم — الانتباه <em>ينقل</em> المعلومات، و<Eng>FFN</Eng> <em>تحوّلها وتستدعيها</em>.</li>
            <li><strong>وصلة متبقية ثانية:</strong> x = x + FFN(Norm(x)).</li>
          </ol>
          <p>بعد آخر طبقة: تطبيع أخير، ثم <strong>رأس النموذج اللغوي (<Eng>LM head</Eng>)</strong> — مصفوفة بحجم القاموس — يحوّل متجه آخر رمز إلى ~128 ألف <strong><Eng>logit</Eng></strong>: درجة خام لكل رمز تالٍ محتمل. تحوّلها <Eng>softmax</Eng> إلى توزيع احتمالي. هذا التوزيع <em>هو</em> كامل خرج النموذج؛ كل ما عداه (المحادثة، التفكير، الكود) هو أخذ عينات منه بشكل متكرر.</p>
          <p>أين تذهب المعاملات في نموذج 7B: ~65% للـ <Eng>FFN</Eng>، ~25% لإسقاطات الانتباه، ~10% للتضمين. التوازن بين العمق (الطبقات) والعرض (البُعد الداخلي) يتبع تقريبًا القاعدة d<sub>model</sub> ≈ 128 × عدد الطبقات.</p>
        </>
      },
      math: {
        en: <p>FFN(x) = W₂ · (SiLU(W₁x) ⊙ W₃x). With d = 4096 and expansion 4×: W₁, W₃ are 4096×14336 and W₂ is 14336×4096 ≈ 176M params per layer × 32 layers ≈ 5.6B of a "7B" model. RMSNorm(x) = x / √(mean(x²) + ε) · g — cheaper than LayerNorm because it skips mean-centering.</p>,
        ar: <p>FFN(x) = W₂ · (SiLU(W₁x) ⊙ W₃x). مع d = 4096 وتوسيع 4×: المصفوفتان W₁, W₃ حجمهما 4096×14336 وW₂ حجمها 14336×4096 ≈ 176 مليون معامل لكل طبقة × 32 طبقة ≈ 5.6 مليار من نموذج "7B". أما <Eng>RMSNorm</Eng>(x) = x / √(mean(x²) + ε) · g — أرخص من <Eng>LayerNorm</Eng> لأنها تتخطى طرح المتوسط.</p>
      },
      widget: <TransformerWalkthrough />
    },
    {
      id: "arch",
      title: { en: "Dense vs MoE vs State-Space Models", ar: "النماذج الكثيفة مقابل MoE ونماذج الحالة" },
      content: {
        en: <>
          <p>Once you understand the transformer block, the major architecture families are variations on one question: <em>which parameters activate for each token?</em></p>
          <ul className="list-disc ps-6 space-y-2">
            <li><strong>Dense (GPT, Llama):</strong> every parameter processes every token. Simple, predictable, but compute grows linearly with size — a 70B dense model does 70B params worth of math per token.</li>
            <li><strong>Mixture of Experts (Mixtral, DeepSeek, GPT-4-class):</strong> replace each FFN with e.g. 8 parallel "expert" FFNs plus a tiny <strong>router</strong> network that picks the top-2 experts per token. Mixtral 8x7B stores 47B params but activates only ~13B per token — big-model knowledge at small-model speed. The costs: all experts must sit in VRAM, and training needs a <em>load-balancing loss</em> to stop the router from collapsing onto favorite experts.</li>
            <li><strong>State-Space Models (Mamba):</strong> replace attention entirely with a recurrent state that is updated token-by-token. Compute is O(n) instead of O(n²) and there is no KV cache — but the fixed-size state <em>compresses</em> history, so exact long-range recall ("quote line 3 of the document") is weaker. Hybrids (Jamba: some attention layers + some Mamba layers) try to get both.</li>
          </ul>
          <p>Practical guidance: dense for simplicity and fine-tunability; MoE when you can afford the VRAM and need throughput; SSM/hybrids for extremely long sequences on a budget.</p>
        </>,
        ar: <>
          <p>بعد فهم وحدة المحول، العائلات المعمارية الكبرى هي إجابات مختلفة على سؤال واحد: <em>أي المعاملات تنشط لكل رمز؟</em></p>
          <ul className="list-disc ps-6 space-y-2">
            <li><strong>الكثيفة <Eng>Dense</Eng> (GPT, Llama):</strong> كل معامل يعالج كل رمز. بسيطة ومتوقعة، لكن الحساب ينمو خطيًا مع الحجم — نموذج كثيف 70B ينفذ حسابات 70 مليار معامل لكل رمز.</li>
            <li><strong>خليط الخبراء <Eng>MoE</Eng> (Mixtral, DeepSeek):</strong> نستبدل كل <Eng>FFN</Eng> بـ 8 شبكات "خبراء" متوازية مثلاً + شبكة <strong>موجّه (<Eng>Router</Eng>)</strong> صغيرة تختار أفضل خبيرين لكل رمز. Mixtral 8x7B يخزن 47 مليار معامل لكنه ينشّط ~13 مليارًا فقط لكل رمز — معرفة نموذج كبير بسرعة نموذج صغير. الثمن: كل الخبراء يجب أن يسكنوا الـ <Eng>VRAM</Eng>، والتدريب يحتاج <em>خسارة موازنة تحميل</em> لمنع الموجّه من الانهيار على خبراء مفضلين.</li>
            <li><strong>نماذج فضاء الحالة <Eng>SSM</Eng> (Mamba):</strong> تستبدل الانتباه كليًا بحالة متكررة تُحدَّث رمزًا برمز. الحساب O(n) بدل O(n²) ولا توجد <Eng>KV cache</Eng> — لكن الحالة ثابتة الحجم <em>تضغط</em> التاريخ، فالاسترجاع الدقيق بعيد المدى ("اقتبس السطر 3 من المستند") أضعف. النماذج الهجينة (Jamba: بعض طبقات انتباه + بعض طبقات Mamba) تحاول الجمع بين الميزتين.</li>
          </ul>
          <p>إرشاد عملي: الكثيفة للبساطة وسهولة الضبط؛ <Eng>MoE</Eng> عندما تتوفر الذاكرة وتحتاج إنتاجية عالية؛ <Eng>SSM</Eng> والهجينة للتسلسلات الطويلة جدًا بميزانية محدودة.</p>
        </>
      },
      math: {
        en: <p>MoE router: g = softmax(top-k(W_r · x)). Output = Σ gᵢ · Expertᵢ(x) over the k selected experts. Load-balancing auxiliary loss ≈ α · Σ fᵢ · Pᵢ (fraction of tokens routed to expert i × mean router probability) pushes toward uniform expert usage.</p>,
        ar: <p>موجّه <Eng>MoE</Eng>: g = softmax(top-k(W_r · x)). الخرج = Σ gᵢ · Expertᵢ(x) على الخبراء k المختارين. خسارة الموازنة المساعدة ≈ α · Σ fᵢ · Pᵢ (نسبة الرموز الموجهة للخبير i × متوسط احتمال الموجّه) تدفع نحو استخدام متساوٍ للخبراء.</p>
      },
      widget: <ArchCompare />
    },
    {
      id: "sampling",
      title: { en: "Decoding: Temperature, Top-k, Top-p", ar: "التوليد: الحرارة وأخذ العينات" },
      content: {
        en: <>
          <p>The model outputs a probability distribution over ~128k tokens. <strong>How you pick from it defines the model's personality:</strong></p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Greedy (argmax):</strong> always take the most likely token. Deterministic but repetitive — the model loops ("the the the") because locally-best ≠ globally-best.</li>
            <li><strong>Temperature T:</strong> divide logits by T before softmax. T &lt; 1 sharpens the distribution (safer, more predictable); T &gt; 1 flattens it (more creative, more errors). T → 0 approaches greedy.</li>
            <li><strong>Top-k:</strong> keep only the k most likely tokens, renormalize, sample. Fixes the "long tail" problem where thousands of near-zero-probability garbage tokens can occasionally win.</li>
            <li><strong>Top-p (nucleus):</strong> keep the smallest set of tokens whose cumulative probability ≥ p (e.g. 0.9). Adaptive: when the model is confident the set is tiny; when uncertain it's wide. Usually better than fixed top-k.</li>
            <li><strong>Repetition / frequency penalties:</strong> multiply (or subtract from) logits of already-generated tokens to break loops.</li>
          </ul>
          <p>Production defaults: chat T ≈ 0.7 with top-p 0.9; code and math T ≈ 0–0.3; brainstorming T ≈ 1.0+. Understanding this also explains why LLM output is <em>not reproducible</em> by default and why "the model lied" is often just an unlucky sample from a wide distribution.</p>
        </>,
        ar: <>
          <p>النموذج يخرج توزيعًا احتماليًا على ~128 ألف رمز. <strong>طريقة الاختيار منه تحدد شخصية النموذج:</strong></p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الجشع <Eng>Greedy</Eng>:</strong> اختر دائمًا الرمز الأعلى احتمالاً. حتمي لكنه مكرر — النموذج يدور في حلقات لأن الأفضل محليًا ≠ الأفضل كليًا.</li>
            <li><strong>الحرارة <Eng>Temperature</Eng>:</strong> نقسم الـ <Eng>logits</Eng> على T قبل <Eng>softmax</Eng>. T &lt; 1 يشحذ التوزيع (أكثر أمانًا وتوقعًا)؛ T &gt; 1 يبسطه (أكثر إبداعًا وأخطاء). T ← 0 يقترب من الجشع.</li>
            <li><strong><Eng>Top-k</Eng>:</strong> نبقي فقط أعلى k رمزًا احتمالاً، نعيد التطبيع، ثم نسحب عينة. يحل مشكلة "الذيل الطويل" حيث آلاف الرموز شبه الصفرية قد تفوز أحيانًا.</li>
            <li><strong><Eng>Top-p (nucleus)</Eng>:</strong> نبقي أصغر مجموعة رموز مجموع احتمالها ≥ p (مثلاً 0.9). تكيفية: عندما يكون النموذج واثقًا تكون المجموعة صغيرة؛ وعند الحيرة تتسع. غالبًا أفضل من <Eng>top-k</Eng> الثابتة.</li>
            <li><strong>عقوبات التكرار:</strong> نخفض <Eng>logits</Eng> الرموز المولدة سابقًا لكسر الحلقات.</li>
          </ul>
          <p>الإعدادات الإنتاجية المعتادة: المحادثة T ≈ 0.7 مع <Eng>top-p</Eng> 0.9؛ الكود والرياضيات T ≈ 0–0.3؛ العصف الذهني T ≈ 1.0+. فهم هذا يفسر أيضًا لماذا خرج النموذج <em>غير قابل للتكرار</em> افتراضيًا، ولماذا "كذب النموذج" غالبًا مجرد عينة سيئة الحظ من توزيع واسع.</p>
        </>
      },
      math: {
        en: <p>p(tokenᵢ) = exp(zᵢ / T) / Σⱼ exp(zⱼ / T). As T → 0 the max logit dominates (greedy); as T → ∞ the distribution becomes uniform. Top-p: sort descending, keep the prefix where Σp ≥ p, set the rest to 0, renormalize.</p>,
        ar: <p>p(الرمزᵢ) = exp(zᵢ / T) / Σⱼ exp(zⱼ / T). عندما T ← 0 يهيمن أعلى <Eng>logit</Eng> (جشع)؛ وعندما T ← ∞ يصبح التوزيع منتظمًا. <Eng>Top-p</Eng>: رتّب تنازليًا، أبقِ المقدمة حيث Σp ≥ p، صفّر الباقي، أعد التطبيع.</p>
      }
    }
  ],
  quiz: [
    {
      question: { en: "In BPE training, which pair gets merged at each step?", ar: "في تدريب BPE، أي زوج يُدمج في كل خطوة؟" },
      options: {
        en: ["A random pair", "The most frequent adjacent pair", "The longest pair", "The rarest pair"],
        ar: ["زوج عشوائي", "الزوج المتجاور الأكثر تكرارًا", "الزوج الأطول", "الزوج الأندر"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why divide attention scores by √d?", ar: "لماذا نقسم درجات الانتباه على √d؟" },
      options: {
        en: ["To save memory", "To prevent softmax saturation and vanishing gradients", "To speed up matrix multiply", "To normalize token counts"],
        ar: ["لتوفير الذاكرة", "لمنع تشبع softmax وتلاشي الاشتقاقات", "لتسريع ضرب المصفوفات", "لتطبيع عدد الرموز"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Where do most parameters of a dense LLM live?", ar: "أين تعيش معظم معاملات النموذج الكثيف؟" },
      options: {
        en: ["Attention projections", "Feed-Forward (FFN) layers", "Embeddings", "LayerNorms"],
        ar: ["إسقاطات الانتباه", "طبقات FFN", "التضمين", "طبقات التطبيع"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Which architecture uses an expert router?", ar: "أي هندسة تستخدم مُوجّه الخبراء (Router)؟" },
      options: {
        en: ["GPT-3", "Mamba", "Mixtral MoE", "Vanilla Llama"],
        ar: ["GPT-3", "Mamba", "Mixtral MoE", "Llama العادي"]
      },
      correctIndex: 2
    },
    {
      question: { en: "Raising temperature above 1 makes output:", ar: "رفع الحرارة فوق 1 يجعل الخرج:" },
      options: {
        en: ["More deterministic", "More random and creative", "Faster", "Shorter"],
        ar: ["أكثر حتمية", "أكثر عشوائية وإبداعًا", "أسرع", "أقصر"]
      },
      correctIndex: 1
    }
  ]
};
