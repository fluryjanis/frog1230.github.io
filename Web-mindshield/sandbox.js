import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

env.allowLocalModels = false;
env.allowRemoteModels = true;

let classifier = null;
const statusEl = document.getElementById('model-status');
const evaluateBtn = document.getElementById('evaluate-btn');
const sandboxInput = document.getElementById('sandbox-input');
const sandboxResult = document.getElementById('sandbox-result');
const tierBadge = document.getElementById('tier-badge');
const latencyText = document.getElementById('latency-text');
const tierExplanation = document.getElementById('tier-explanation');
const aiBreakdown = document.getElementById('ai-breakdown');
const probabilitiesEl = document.getElementById('probabilities');

async function initModel() {
  try {
    statusEl.textContent = '🧠 Loading on-device AI (28MB in RAM)...';
    classifier = await pipeline('zero-shot-classification', 'Xenova/distilbert-base-uncased-mnli');
    statusEl.textContent = '✅ Local AI Ready (100% Offline)';
  } catch (err) {
    statusEl.textContent = '❌ Model load error';
    console.error(err);
  }
}
initModel();

function evaluatePromptIntent(text) {
  const cleaned = text.trim();
  if (!cleaned) return { tier: 'PASS', reason: 'Empty prompt' };

  if (cleaned.length > 400) {
    return { tier: 'PASS', reason: 'Length Guard: Prompts > 400 chars bypass AI to protect context dumps/code.' };
  }

  const isRawArithmetic = /^[\d\s+\-*/()=%$.,]+$/.test(cleaned) && /[+\-*/%=]/.test(cleaned) && !/[a-zA-Z]/.test(cleaned);
  const mathWords = /\b(calculate|what is \d+[\s\S]*%|convert \d+[\s\S]*(to|in))\b/i;
  if (isRawArithmetic || mathWords.test(cleaned)) {
    return { tier: 'WARNING', reason: 'Mental Math: Simple calculation offloaded.' };
  }

  const directSolvePatterns = [
    /\b(solve this (riddle|puzzle|problem|equation|homework))\b/i,
    /\b(find the solution to this (riddle|puzzle))\b/i,
    /\b(give me the answer to this (problem|riddle))\b/i
  ];
  for (const p of directSolvePatterns) {
    if (p.test(cleaned)) return { tier: 'FLAGGED', reason: 'Direct Problem Surrender: Asking AI to solve a riddle or puzzle.' };
  }

  const reviewPatterns = /\b(can you review|please review|review my|critique my|second opinion|is my (argument|logic) (sound|valid))\b/i;
  if (reviewPatterns.test(cleaned)) {
    return { tier: 'PASS', reason: 'Collaborative Review: User is actively reflecting and seeking validation.' };
  }

  const analyticalPatterns = /\b(why (does|do|is|did)|explain (how|why)|what are the (advantages|pros and cons)|difference between)\b/i;
  if (analyticalPatterns.test(cleaned)) {
    return { tier: 'PASS', reason: 'Analytical Inquiry: User is seeking conceptual understanding.' };
  }

  const factualPatterns = /\b(what is the capital of|where is|when was|who wrote|definition of|syntax for|atomic number of)\b/i;
  if (factualPatterns.test(cleaned)) {
    return { tier: 'PASS', reason: 'Factual Reference: Pure encyclopedia/dictionary lookup.' };
  }

  const socialPatterns = /\b(what should i (respond|reply|say|text)|how should i (respond|reply|text)|good comeback for)\b/i;
  if (socialPatterns.test(cleaned)) {
    return { tier: 'WARNING', reason: 'Social Offloading: Delegating interpersonal communication.' };
  }

  const decisionPatterns = /\b(should i (choose|pick|buy|take|quit|stay)|what would you do|help me decide|which (one )?should i)\b/i;
  if (decisionPatterns.test(cleaned)) {
    return { tier: 'WARNING', reason: 'Decision Offloading: Outsourcing subjective choices or judgment.' };
  }

  const prescriptionPatterns = /\b(tell me (exactly )?what to do|tell me my next steps|figure (this|it|out) for me)\b/i;
  if (prescriptionPatterns.test(cleaned)) {
    return { tier: 'WARNING', reason: 'Action Prescription: Seeking blind step-by-step commands instead of diagnosing.' };
  }

  const generalQuestions = /\b(what|why|how|when|where|who|which|can|could|would|should|is|are|does|do)\b/i;
  if (cleaned.includes('?') || generalQuestions.test(cleaned)) {
    return { tier: 'SCRUTINIZE', reason: 'Ambiguous Question: Routing to local on-device neural network...' };
  }

  return { tier: 'PASS', reason: 'General conversation or creative statement.' };
}

async function handleEvaluation() {
  const text = sandboxInput.value.trim();
  if (!text) return;

  const startTime = performance.now();
  const triage = evaluatePromptIntent(text);

  sandboxResult.classList.remove('hidden');
  aiBreakdown.classList.add('hidden');

  if (triage.tier !== 'SCRUTINIZE') {
    displayResult(triage.tier, `${(performance.now() - startTime).toFixed(1)}ms (Client Heuristic)`, triage.reason);
    return;
  }

  if (!classifier) {
    displayResult('PASS', 'AI Loading', 'On-device model is still loading in RAM. Please wait.');
    return;
  }

  displayResult('EVALUATING', 'Analyzing...', 'Running zero-shot classification on-device via WebAssembly...');

  const candidateLabels = [
    "solving a logic puzzle, riddle, math problem, or test question",
    "asking for personal advice, social reply drafting, subjective decision, or action steps",
    "asking for a factual explanation, concept breakdown, critique, or learning inquiry"
  ];

  const results = await classifier(text, candidateLabels, {
    hypothesis_template: "The user is asking for {}."
  });

  const duration = (performance.now() - startTime).toFixed(1);
  const topLabel = results.labels[0];
  const topScore = results.scores[0];

  let finalTier = 'PASS';
  let reason = 'AI classified query as factual learning or collaborative inquiry.';

  if (topLabel === candidateLabels[0] && topScore > 0.40) {
    finalTier = 'FLAGGED';
    reason = 'AI detected direct problem-solving or puzzle outsourcing.';
  } else if (topLabel === candidateLabels[1] && topScore > 0.38) {
    finalTier = 'WARNING';
    reason = 'AI detected subjective decision-making or advice seeking.';
  }

  displayResult(finalTier, `${duration}ms (Local ONNX WASM)`, reason);

  aiBreakdown.classList.remove('hidden');
  probabilitiesEl.innerHTML = results.labels.map((l, i) => `
    <div class="prob-row">
      <span>${l}</span>
      <strong>${(results.scores[i] * 100).toFixed(1)}%</strong>
    </div>
  `).join('');
}

function displayResult(tier, latency, reason) {
  tierBadge.textContent = tier;
  tierBadge.className = `badge badge-${tier.toLowerCase()}`;
  latencyText.textContent = latency;
  tierExplanation.textContent = reason;
}

evaluateBtn.addEventListener('click', handleEvaluation);
sandboxInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleEvaluation();
  }
});

document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => {
    sandboxInput.value = btn.dataset.prompt;
    handleEvaluation();
  });
});
