import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import Quantization from '../../components/widgets/Quantization';

export const quantizationModule: ModuleDef = {
  id: "3",
  title: { en: "Quantization", ar: "ضغط الأوزان" },
  description: {
    en: "INT8, INT4, GPTQ, AWQ and the math of trading precision for memory and speed.",
    ar: "INT8 وINT4 وGPTQ وAWQ ورياضيات مقايضة الدقة بالذاكرة والسرعة."
  },
  lessons: [
    {
      id: "quant",
      title: { en: "How Quantization Actually Works", ar: "كيف يعمل ضغط الأوزان فعليًا" },
      content: {
        en: <>
          <p>Weights are stored as FP16/BF16 — 65,536 possible values per number. <strong>Quantization</strong> maps each weight to a small integer grid (INT8: 256 values, INT4: 16 values) plus a per-group <strong>scale factor</strong> to map back. Since decode speed = bandwidth / model bytes (Module 3), halving the bytes nearly <em>doubles</em> generation speed while halving VRAM: a double win.</p>
          <p>The mechanics: weights are split into groups (e.g. 128 values). For each group, store scale = max|w| / 7 (for INT4's −8…7 range) and quantize w → round(w / scale). The stored model is integers + scales; at compute time the kernel dequantizes on the fly.</p>
          <p>The catch is <strong>outliers</strong>: a few weights (and especially a few activation channels) are 100× larger than the rest. One outlier in a group blows up the scale, crushing all its neighbors' precision. The main methods differ in how they handle this:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Round-to-nearest (RTN):</strong> naive rounding. Fine at INT8, lossy at INT4.</li>
            <li><strong>GPTQ:</strong> quantize weights one column at a time, <em>updating the remaining columns to compensate</em> for the error just introduced (using second-order information from calibration data).</li>
            <li><strong>AWQ:</strong> observe which weight channels see the largest <em>activations</em> (they matter most), and rescale to protect them before quantizing.</li>
            <li><strong>llama.cpp K-quants (Q4_K_M etc.):</strong> mixed precision within the file — sensitive layers get more bits.</li>
          </ul>
          <p>Rules of thumb: <strong>INT8 ≈ lossless</strong>. <strong>4-bit costs ~1–3%</strong> on benchmarks — usually worth it. Below 3 bits quality falls off a cliff. Bigger models tolerate quantization better; and a quantized 70B almost always beats a full-precision 13B at the same VRAM.</p>
        </>,
        ar: <>
          <p>الأوزان مخزنة بـ FP16/BF16 — أي 65,536 قيمة ممكنة لكل رقم. <strong>الضغط (<Eng>Quantization</Eng>)</strong> يحوّل كل وزن إلى شبكة أعداد صحيحة صغيرة (INT8: ‏256 قيمة، INT4: ‏16 قيمة) + <strong>معامل قياس (<Eng>scale</Eng>)</strong> لكل مجموعة للعودة. وبما أن سرعة التوليد = عرض النطاق / حجم النموذج، فإن خفض البايتات للنصف <em>يضاعف</em> السرعة تقريبًا ويخفض الذاكرة للنصف: مكسب مزدوج.</p>
          <p>الآلية: تُقسم الأوزان لمجموعات (مثلاً 128 قيمة). لكل مجموعة نخزن <Eng>scale</Eng> = أكبر قيمة مطلقة / 7 (لمدى INT4 من −8 إلى 7) ونضغط w ← round(w / scale). النموذج المخزن = أعداد صحيحة + معاملات قياس؛ وعند الحساب تفك النواة الضغط لحظيًا.</p>
          <p>المشكلة هي <strong>القيم الشاذة (<Eng>outliers</Eng>)</strong>: قلة من الأوزان (وخاصة بعض قنوات التفعيلات) أكبر 100 مرة من البقية. قيمة شاذة واحدة في مجموعة تضخم الـ <Eng>scale</Eng> وتسحق دقة جيرانها. الطرق الرئيسية تختلف في معالجة ذلك:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>التقريب البسيط (<Eng>RTN</Eng>):</strong> جيد عند INT8، خسائر ملحوظة عند INT4.</li>
            <li><strong><Eng>GPTQ</Eng>:</strong> يضغط الأوزان عمودًا عمودًا، <em>مع تحديث الأعمدة الباقية لتعويض</em> الخطأ المُدخل للتو (باستخدام معلومات من بيانات معايرة).</li>
            <li><strong><Eng>AWQ</Eng>:</strong> يرصد أي قنوات أوزان تقابل أكبر <em>تفعيلات</em> (الأهم تأثيرًا) ويعيد قياسها لحمايتها قبل الضغط.</li>
            <li><strong><Eng>K-quants</Eng> في llama.cpp (مثل Q4_K_M):</strong> دقة مختلطة داخل الملف — الطبقات الحساسة تأخذ بتات أكثر.</li>
          </ul>
          <p>قواعد عملية: <strong>INT8 ≈ بلا خسارة</strong>. <strong>4-بت يكلف ~1–3%</strong> في الاختبارات — يستحق غالبًا. تحت 3 بت تنهار الجودة. النماذج الأكبر تتحمل الضغط أفضل؛ ونموذج 70B مضغوط يتفوق دائمًا تقريبًا على 13B كامل الدقة بنفس الذاكرة.</p>
        </>
      },
      math: {
        en: <>
          <p>Asymmetric INT quantization: q = clamp(round(w/s) + z, 0, 2ᵇ−1), dequant: ŵ = s·(q − z), where s = (max−min)/(2ᵇ−1).</p>
          <p>Size math for 7B: FP16 = 14GB; INT8 = 7GB; INT4 ≈ 3.5GB + ~0.15GB of scales (group size 128) → fits an 8GB consumer GPU. Expected rounding error per weight ≈ s/√12 (uniform quantization noise).</p>
        </>,
        ar: <>
          <p>الضغط غير المتماثل: q = clamp(round(w/s) + z, 0, 2ᵇ−1)، وفك الضغط: ŵ = s·(q − z)، حيث s = (الأقصى−الأدنى)/(2ᵇ−1).</p>
          <p>حساب الحجم لنموذج 7B: ‏FP16 = 14GB؛ INT8 = 7GB؛ INT4 ≈ 3.5GB + ~0.15GB لمعاملات القياس (مجموعات 128) ← يتسع في كارت استهلاكي 8GB. متوسط خطأ التقريب لكل وزن ≈ s/√12 (ضوضاء ضغط منتظمة).</p>
        </>
      },
      widget: <Quantization />
    },
    {
      id: "quant_practice",
      title: { en: "Choosing a Format in Practice", ar: "اختيار الصيغة عمليًا" },
      content: {
        en: <>
          <p>A practical decision tree for deployment:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Serving on datacenter GPUs (vLLM/TensorRT):</strong> FP8 on H100s (near-lossless, hardware-accelerated) or AWQ/GPTQ INT4 when VRAM-tight.</li>
            <li><strong>Local / consumer hardware (llama.cpp, Ollama):</strong> GGUF K-quants; Q4_K_M is the sweet spot, Q5/Q6 if RAM allows.</li>
            <li><strong>Fine-tuning on a budget:</strong> QLoRA — frozen NF4 base + BF16 LoRA adapters.</li>
            <li><strong>KV-cache quantization:</strong> the cache can be quantized to FP8/INT8 too, doubling how many concurrent users fit (K is more sensitive than V).</li>
          </ul>
          <p>Two warnings from production experience. First, <em>always evaluate on your own task</em> after quantizing — benchmark averages hide task-specific regressions (especially code generation and non-English text, whose rarer token patterns suffer first). Second, quantization <em>amplifies</em> existing weaknesses: if the FP16 model is borderline on your task, the INT4 version will fall off the edge.</p>
        </>,
        ar: <>
          <p>شجرة قرار عملية للنشر:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>خوادم مراكز البيانات (vLLM/TensorRT):</strong> ‏FP8 على H100 (شبه بلا خسارة ومسرَّع عتاديًا) أو AWQ/GPTQ INT4 عند ضيق الذاكرة.</li>
            <li><strong>التشغيل المحلي (llama.cpp، Ollama):</strong> صيغ <Eng>GGUF K-quants</Eng>؛ الخيار الذهبي Q4_K_M، وQ5/Q6 إن سمحت الذاكرة.</li>
            <li><strong>الضبط الدقيق بميزانية:</strong> ‏<Eng>QLoRA</Eng> — أساس مجمد NF4 + محولات LoRA بدقة BF16.</li>
            <li><strong>ضغط KV cache:</strong> يمكن ضغط الذاكرة المؤقتة أيضًا إلى FP8/INT8، فيتضاعف عدد المستخدمين المتزامنين (قيم K أكثر حساسية من V).</li>
          </ul>
          <p>تحذيران من خبرة الإنتاج. أولاً، <em>قيّم دائمًا على مهمتك أنت</em> بعد الضغط — متوسطات الاختبارات تخفي تراجعات خاصة بمهام معينة (خصوصًا توليد الكود والنصوص غير الإنجليزية التي تتأذى أنماطها النادرة أولاً). ثانيًا، الضغط <em>يضخّم</em> نقاط الضعف الموجودة: إذا كان نموذج FP16 على الحافة في مهمتك، فنسخة INT4 ستسقط من عليها.</p>
        </>
      }
    }
  ],
  quiz: [
    {
      question: { en: "What is the primary benefit of INT4?", ar: "ما هي الفائدة الأساسية من استخدام INT4؟" },
      options: {
        en: ["Better accuracy", "Lower VRAM usage and faster decoding", "Longer context", "Better grammar"],
        ar: ["دقة أفضل", "ذاكرة أقل وتوليد أسرع", "سياق أطول", "قواعد أفضل"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Why do outlier weights hurt quantization?", ar: "لماذا تضر القيم الشاذة بالضغط؟" },
      options: {
        en: ["They get deleted", "They inflate the group's scale, crushing neighbors' precision", "They slow the GPU", "They increase vocabulary size"],
        ar: ["تُحذف", "تضخم معامل القياس فتسحق دقة بقية المجموعة", "تبطئ المعالج", "تكبر القاموس"]
      },
      correctIndex: 1
    },
    {
      question: { en: "AWQ protects the weights that:", ar: "تحمي AWQ الأوزان التي:" },
      options: {
        en: ["Are largest", "Correspond to the largest activations", "Come first in each layer", "Are exactly zero"],
        ar: ["الأكبر قيمة", "تقابل أكبر التفعيلات", "تأتي أولاً في كل طبقة", "تساوي صفرًا"]
      },
      correctIndex: 1
    }
  ]
};
