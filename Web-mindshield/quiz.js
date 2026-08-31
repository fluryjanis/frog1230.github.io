const QUIZ_QUESTIONS = [
  {
    title: "Scenario 1: You get a confusing or critical comment on your post/project. What is your first instinct?",
    options: [
      { text: "Copy-paste it into AI and ask: 'What should I respond with?'", points: 3 },
      { text: "Formulate my own draft response, then ask AI to critique its tone.", points: 0 },
      { text: "Ask AI to explain the technical concepts mentioned in the comment.", points: 0 }
    ]
  },
  {
    title: "Scenario 2: You encounter a critical bug in your code or database.",
    options: [
      { text: "Paste the error and demand: 'Tell me exactly what to do to fix this.'", points: 3 },
      { text: "Inspect the stack trace, hypothesize the cause, and ask: 'Why does this error occur?'", points: 0 },
      { text: "Paste the entire file and say: 'Solve this bug for me.'", points: 3 }
    ]
  },
  {
    title: "Scenario 3: You are choosing between two job offers, laptops, or approaches.",
    options: [
      { text: "Ask AI: 'Which one should I choose?' and follow its judgment.", points: 2 },
      { text: "List my criteria and ask for objective comparison benchmarks.", points: 0 },
      { text: "Ask AI: 'What would you do if you were in my position?'", points: 2 }
    ]
  },
  {
    title: "Scenario 4: You encounter a tricky brain teaser or logic riddle.",
    options: [
      { text: "Immediately ask AI: 'Solve this riddle for me.'", points: 3 },
      { text: "Attempt to solve it myself first, then verify if my answer is correct.", points: 0 },
      { text: "Ask AI for a gentle hint without giving away the solution.", points: 1 }
    ]
  }
];

let currentQuestion = 0;
let totalPoints = 0;

// DOM Elements
const startTestBtn = document.getElementById('start-test-btn');
const quizSection = document.getElementById('quiz-section');
const quizContent = document.getElementById('quiz-content');
const quizProgress = document.getElementById('quiz-progress');
const resultsSection = document.getElementById('results-section');
const scoreNumber = document.getElementById('score-number');
const scoreTitle = document.getElementById('score-title');
const scoreDesc = document.getElementById('score-desc');
const scoreCircle = document.getElementById('score-circle');
const retakeBtn = document.getElementById('retake-btn');

function renderQuestion() {
  const q = QUIZ_QUESTIONS[currentQuestion];
  
  // Update progress bar width
  quizProgress.style.width = `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`;

  // Render question markup
  quizContent.innerHTML = `
    <h3 class="question-title">${q.title}</h3>
    <div class="quiz-options">
      ${q.options.map(opt => `
        <button class="quiz-opt-btn" data-points="${opt.points}">${opt.text}</button>
      `).join('')}
    </div>
  `;

  // Add click listeners to newly rendered option buttons
  document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      totalPoints += parseInt(e.currentTarget.dataset.points, 10);
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
  quizSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');

  const dependencyPercent = Math.round((totalPoints / 11) * 100);
  scoreNumber.textContent = `${dependencyPercent}%`;

  if (dependencyPercent >= 60) {
    scoreCircle.style.borderColor = 'var(--flag)';
    scoreTitle.textContent = "High Cognitive Dependency Risk";
    scoreDesc.textContent = "You frequently outsource personal decisions, troubleshooting, and social replies to AI before attempting them yourself. MindShield was built to help you reclaim your critical thinking.";
  } else if (dependencyPercent >= 25) {
    scoreCircle.style.borderColor = 'var(--warn)';
    scoreTitle.textContent = "Moderate AI Reliance";
    scoreDesc.textContent = "You use AI productively for synthesis, but occasionally offload subjective choices or quick answers when under friction.";
  } else {
    scoreCircle.style.borderColor = 'var(--pass)';
    scoreTitle.textContent = "Strong Critical Thinker";
    scoreDesc.textContent = "You use AI as an analytical sparring partner rather than a replacement brain. You formulate hypotheses before seeking answers.";
  }

  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Event Listeners
startTestBtn.addEventListener('click', () => {
  currentQuestion = 0;
  totalPoints = 0;
  quizSection.classList.remove('hidden');
  resultsSection.classList.add('hidden');
  renderQuestion();
  quizSection.scrollIntoView({ behavior: 'smooth' });
});

retakeBtn.addEventListener('click', () => {
  currentQuestion = 0;
  totalPoints = 0;
  resultsSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  renderQuestion();
  quizSection.scrollIntoView({ behavior: 'smooth' });
});
