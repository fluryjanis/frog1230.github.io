const QUIZ_QUESTIONS = [
  {
    title: "You get a confusing or critical comment on something you posted. What's your first move?",
    options: [
      { text: "Paste the comment in and ask AI to write a solid reply back.", points: 3 },
      { text: "Write out what I want to say first, then ask AI to polish the tone.", points: 0 },
      { text: "Ask AI to clarify what the commenter means so I can understand their point.", points: 0 }
    ]
  },
  {
    title: "You run into a frustrating bug or technical error that halts your work. What do you do?",
    options: [
      { text: "Paste the error code and prompt AI to give me the direct fix.", points: 3 },
      { text: "Form a quick hypothesis first, then ask AI why that error might occur.", points: 0 },
      { text: "Drop in the entire file or context and let AI find and solve the issue.", points: 3 }
    ]
  },
  {
    title: "You're deciding between two good options, like job offers or new laptops. What's your approach?",
    options: [
      { text: "Share both options with AI and ask it to make the recommendation for me.", points: 2 },
      { text: "List the specific criteria I care about and ask AI for an objective comparison.", points: 0 },
      { text: "Ask AI: 'What would you do if you were in my shoes?' to see how it weighs them.", points: 2 }
    ]
  },
  {
    title: "A friend shares a tricky brain teaser or logic riddle with you. What do you do?",
    options: [
      { text: "Ask AI for the solution right away so I don't get stuck spinning my wheels.", points: 3 },
      { text: "Spend a couple of minutes trying to solve it myself before checking if I'm right.", points: 0 },
      { text: "Ask AI to give me a gentle hint without spoiling the final answer.", points: 1 }
    ]
  }
];

let currentQuestion = 0;
let totalPoints = 0;

const introView = document.getElementById('intro-view');
const quizView = document.getElementById('quiz-view');
const resultsView = document.getElementById('results-view');

const startBtn = document.getElementById('start-btn');
const retakeBtn = document.getElementById('retake-btn');

const quizContent = document.getElementById('quiz-content');
const quizProgress = document.getElementById('quiz-progress');
const stepLabel = document.getElementById('step-label');

const scoreBox = document.getElementById('score-box');
const scoreNumber = document.getElementById('score-number');
const scoreTierLabel = document.getElementById('score-tier-label');
const scoreDesc = document.getElementById('score-desc');

function renderQuestion() {
  const q = QUIZ_QUESTIONS[currentQuestion];
  
  stepLabel.textContent = `${currentQuestion + 1} of ${QUIZ_QUESTIONS.length}`;
  quizProgress.style.width = `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`;

  quizContent.className = '';
  void quizContent.offsetWidth; // Trigger reflow for smooth animation
  quizContent.className = 'fade-in';

  quizContent.innerHTML = `
    <h2 class="question-title">${q.title}</h2>
    <div class="quiz-options">
      ${q.options.map(opt => `
        <button class="quiz-opt-btn" data-points="${opt.points}">
          <span>${opt.text}</span>
          <span class="opt-arrow">→</span>
        </button>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const points = parseInt(e.currentTarget.dataset.points, 10);
      totalPoints += points;
      currentQuestion++;

      if (currentQuestion < QUIZ_QUESTIONS.length) {
        renderQuestion();
      } else {
        showResults();
      }
    });
  });
}

function showResults() {
  quizView.classList.add('hidden');
  resultsView.classList.remove('hidden');

  const score = Math.round((totalPoints / 11) * 100);
  scoreNumber.textContent = `${score}%`;

  if (score >= 60) {
    scoreTierLabel.textContent = "Higher reliance";
    scoreDesc.textContent = "You tend to reach for AI when you're stuck, making a decision, or facing a difficult problem. That can be useful — the interesting question is whether AI is helping you think or doing the thinking for you.";
    setTierStyle('var(--tier-high-bg)', 'var(--tier-high-text)', 'var(--tier-high-border)');
  } else if (score >= 25) {
    scoreTierLabel.textContent = "Moderate reliance";
    scoreDesc.textContent = "You generally use AI as a tool, but sometimes hand over the harder parts when there's friction.";
    setTierStyle('var(--tier-mod-bg)', 'var(--tier-mod-text)', 'var(--tier-mod-border)');
  } else {
    scoreTierLabel.textContent = "Low reliance";
    scoreDesc.textContent = "You tend to use AI as a thinking partner — getting explanations, comparisons, and feedback without immediately handing over the whole problem.";
    setTierStyle('var(--tier-low-bg)', 'var(--tier-low-text)', 'var(--tier-low-border)');
  }
}

function setTierStyle(bg, text, border) {
  scoreBox.style.backgroundColor = bg;
  scoreBox.style.borderColor = border;
  scoreBox.style.color = text;
}

startBtn.addEventListener('click', () => {
  currentQuestion = 0;
  totalPoints = 0;
  introView.classList.add('hidden');
  quizView.classList.remove('hidden');
  renderQuestion();
});

retakeBtn.addEventListener('click', () => {
  currentQuestion = 0;
  totalPoints = 0;
  resultsView.classList.add('hidden');
  quizView.classList.remove('hidden');
  renderQuestion();
});
