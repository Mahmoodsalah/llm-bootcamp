import React from 'react';
import { Eng } from '../store';
import type { ModuleDef } from '../moduleTypes';
import VRAMCalc from '../../components/widgets/VRAMCalc';

export const gpuModule: ModuleDef = {
  id: "2",
  title: { en: "GPU & VRAM", ar: "معالجات الرسوميات والذاكرة" },
  description: {
    en: "Why LLMs need GPUs, where every gigabyte goes, and the memory-bandwidth wall.",
    ar: "لماذا تحتاج النماذج معالجات رسوميات، أين يذهب كل جيجابايت، وجدار عرض نطاق الذاكرة."
  },
  lessons: [
    {
      id: "why_gpu",
      title: { en: "Why GPUs? Compute vs Bandwidth", ar: "لماذا الـ GPU؟ الحساب مقابل عرض النطاق" },
      content: {
        en: <>
          <p>An LLM forward pass is almost entirely <strong>matrix multiplication</strong> — millions of independent multiply-adds. CPUs have ~16–64 powerful cores; a GPU has ~17,000 simple cores plus <strong>Tensor Cores</strong> specialized for matrix math. An H100 delivers ~1000 TFLOPS in BF16 vs ~1 TFLOP for a good CPU.</p>
          <p>But raw compute is only half the story. The numbers that actually govern LLM serving:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>VRAM capacity</strong> (H100: 80GB, A100: 40/80GB, RTX 4090: 24GB): determines what fits.</li>
            <li><strong>Memory bandwidth</strong> (H100: 3.35 TB/s): determines how fast weights can be streamed from VRAM to the compute units.</li>
            <li><strong>Interconnect</strong> (NVLink: 900 GB/s between GPUs vs PCIe: 64 GB/s): determines multi-GPU efficiency.</li>
          </ul>
          <p>Key insight — <strong>token generation is memory-bound, not compute-bound</strong>: to produce ONE token, every weight must travel from VRAM to the cores once. A 70B FP16 model = 140GB of reads per token. At 3.35 TB/s that caps single-stream speed at ~24 tokens/s <em>even if compute were free</em>. This single fact explains quantization, batching, and speculative decoding — the next three modules.</p>
        </>,
        ar: <>
          <p>التمريرة الأمامية للنموذج هي تقريبًا كلها <strong>ضرب مصفوفات</strong> — ملايين عمليات الضرب والجمع المستقلة. المعالج المركزي فيه ~16–64 نواة قوية؛ الـ GPU فيه ~17 ألف نواة بسيطة + <Eng>Tensor Cores</Eng> متخصصة في المصفوفات. كارت H100 يعطي ~1000 تيرافلوب بدقة BF16 مقابل ~1 تيرافلوب لمعالج مركزي جيد.</p>
          <p>لكن الحساب الخام نصف القصة فقط. الأرقام التي تحكم فعلاً تشغيل النماذج:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>سعة <Eng>VRAM</Eng></strong> (H100: 80GB، A100: 40/80GB، RTX 4090: 24GB): تحدد ما يتسع.</li>
            <li><strong>عرض نطاق الذاكرة</strong> (H100: 3.35 تيرابايت/ثانية): يحدد سرعة تدفق الأوزان من الذاكرة لوحدات الحساب.</li>
            <li><strong>الربط البيني</strong> (<Eng>NVLink</Eng>: 900 جيجابايت/ثانية بين الكروت مقابل <Eng>PCIe</Eng>: 64): يحدد كفاءة تعدد الكروت.</li>
          </ul>
          <p>البصيرة الأهم — <strong>توليد الرموز مقيّد بالذاكرة لا بالحساب</strong>: لإنتاج رمز واحد يجب أن ينتقل كل وزن من الـ VRAM إلى الأنوية مرة. نموذج 70B بدقة FP16 = قراءة 140 جيجابايت لكل رمز. بسرعة 3.35 تيرابايت/ثانية يكون السقف ~24 رمزًا/ثانية للمستخدم الواحد <em>حتى لو كان الحساب مجانيًا</em>. هذه الحقيقة الواحدة تفسر ضغط الأوزان والتجميع والتوليد الاستباقي — الوحدات الثلاث القادمة.</p>
        </>
      },
      math: {
        en: <p>Max decode speed ≈ Bandwidth / Model bytes. H100 + 70B FP16: 3350 / 140 ≈ 24 tok/s. Arithmetic intensity = FLOPs/byte moved; decode at batch 1 has intensity ≈ 2 (terrible — Tensor Cores idle), prefill has intensity ≈ 2×batch×seq_len (compute-bound). This asymmetry drives all serving design.</p>,
        ar: <p>أقصى سرعة توليد ≈ عرض النطاق / حجم النموذج بالبايت. H100 + نموذج 70B FP16: ‏3350 / 140 ≈ 24 رمزًا/ثانية. الكثافة الحسابية = عمليات/بايت منقول؛ التوليد بدفعة 1 كثافته ≈ 2 (سيئة — الأنوية عاطلة)، والـ <Eng>prefill</Eng> كثافته ≈ 2×الدفعة×طول السياق (مقيّد بالحساب). هذا التفاوت يقود كل تصميم للتشغيل.</p>
      }
    },
    {
      id: "vram",
      title: { en: "The VRAM Budget, Line by Line", ar: "ميزانية الذاكرة بندًا بندًا" },
      content: {
        en: <>
          <p>"Does my model fit?" needs a full budget, not just weight size. For <strong>inference</strong>:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>Weights:</strong> params × bytes/param. 7B FP16 = 14GB; 70B FP16 = 140GB (already &gt; one H100 → multi-GPU or quantize).</li>
            <li><strong>KV cache:</strong> grows with every active token of every user. Llama-2-7B at 4k context: ~2GB <em>per sequence</em>. With 20 concurrent users that's 40GB — often bigger than the model! (GQA cuts this 4–8×.)</li>
            <li><strong>Activations & buffers:</strong> a few GB for intermediate tensors, CUDA graphs, and the framework.</li>
          </ul>
          <p>For <strong>training</strong>, multiply the pain — per parameter you hold: weights (2B in BF16) + gradients (2B) + AdamW states (8B in FP32) + FP32 master copy (4B) ≈ <strong>16 bytes/param</strong>. A 7B model needs ~112GB before a single activation — impossible on one GPU, hence ZeRO/FSDP sharding (Module 8). Activation memory scales with batch × sequence length and is tamed by <strong>activation checkpointing</strong>: don't store intermediate results, recompute them during the backward pass (~30% extra compute for a huge memory saving).</p>
        </>,
        ar: <>
          <p>سؤال "هل يتسع نموذجي؟" يحتاج ميزانية كاملة لا حجم الأوزان فقط. في <strong>التشغيل</strong>:</p>
          <ul className="list-disc ps-6 space-y-1">
            <li><strong>الأوزان:</strong> المعاملات × بايت/معامل. 7B بدقة FP16 = 14GB؛ و70B = 140GB (أكبر من H100 واحد ← تعدد كروت أو ضغط).</li>
            <li><strong><Eng>KV cache</Eng>:</strong> تنمو مع كل رمز نشط لكل مستخدم. Llama-2-7B بسياق 4k: ~2GB <em>لكل جلسة</em>. مع 20 مستخدمًا متزامنًا = 40GB — غالبًا أكبر من النموذج نفسه! (تقنية <Eng>GQA</Eng> تقلصها 4–8 مرات.)</li>
            <li><strong>التفعيلات والمخازن:</strong> بضعة جيجابايتات للنتائج الوسيطة والإطار البرمجي.</li>
          </ul>
          <p>في <strong>التدريب</strong> يتضاعف الألم — لكل معامل تحمل: الأوزان (2 بايت BF16) + الاشتقاقات (2) + حالات <Eng>AdamW</Eng> (8 بدقة FP32) + نسخة رئيسية FP32 (4) ≈ <strong>16 بايت/معامل</strong>. نموذج 7B يحتاج ~112GB قبل أي تفعيل — مستحيل على كارت واحد، ومن هنا تجزئة <Eng>ZeRO/FSDP</Eng> (وحدة التوزيع). ذاكرة التفعيلات تنمو مع الدفعة × طول التسلسل وتُروَّض بـ <strong><Eng>activation checkpointing</Eng></strong>: لا تخزن النتائج الوسيطة بل أعد حسابها في التمريرة العكسية (~30% حساب إضافي مقابل توفير ذاكرة ضخم).</p>
        </>
      },
      math: {
        en: <>
          <p>KV cache bytes = 2 (K and V) × layers × kv_heads × head_dim × seq_len × bytes × batch.</p>
          <p>Llama-2-7B (32 layers, 32 heads, dim 128, FP16), 4096 tokens: 2 × 32 × 32 × 128 × 4096 × 2 ≈ 2.1GB/sequence. Llama-3-8B with GQA (8 kv heads): ~0.5GB — the GQA payoff, visible in one formula.</p>
        </>,
        ar: <>
          <p>بايتات <Eng>KV cache</Eng> = 2 (K وV) × الطبقات × رؤوس KV × بُعد الرأس × طول التسلسل × البايتات × الدفعة.</p>
          <p>Llama-2-7B (‏32 طبقة، 32 رأسًا، بُعد 128، FP16) بسياق 4096: ‏2 × 32 × 32 × 128 × 4096 × 2 ≈ 2.1GB لكل جلسة. أما Llama-3-8B مع <Eng>GQA</Eng> (8 رؤوس KV): ~0.5GB — مكسب <Eng>GQA</Eng> ظاهر في معادلة واحدة.</p>
        </>
      },
      widget: <VRAMCalc />
    }
  ],
  quiz: [
    {
      question: { en: "How many bytes does FP16 use per parameter?", ar: "كم بايت يستخدم المعامل الواحد في FP16؟" },
      options: { en: ["1", "2", "4", "8"], ar: ["1", "2", "4", "8"] },
      correctIndex: 1
    },
    {
      question: { en: "Single-user token generation speed is limited mainly by:", ar: "سرعة التوليد لمستخدم واحد يحدها أساسًا:" },
      options: {
        en: ["GPU compute (TFLOPS)", "Memory bandwidth", "Internet speed", "CPU clock"],
        ar: ["قوة الحساب (TFLOPS)", "عرض نطاق الذاكرة", "سرعة الإنترنت", "تردد المعالج المركزي"]
      },
      correctIndex: 1
    },
    {
      question: { en: "Training memory per parameter with AdamW (mixed precision) is roughly:", ar: "ذاكرة التدريب لكل معامل مع AdamW (دقة مختلطة) تقريبًا:" },
      options: { en: ["2 bytes", "4 bytes", "16 bytes", "64 bytes"], ar: ["2 بايت", "4 بايت", "16 بايت", "64 بايت"] },
      correctIndex: 2
    },
    {
      question: { en: "What often outgrows the model weights in a busy serving GPU?", ar: "ما الذي كثيرًا ما يتجاوز حجم أوزان النموذج في خادم مزدحم؟" },
      options: {
        en: ["The tokenizer", "The KV cache of concurrent users", "Log files", "The optimizer"],
        ar: ["المُقطِّع", "ذاكرة KV للمستخدمين المتزامنين", "ملفات السجلات", "المُحسِّن"]
      },
      correctIndex: 1
    }
  ]
};
