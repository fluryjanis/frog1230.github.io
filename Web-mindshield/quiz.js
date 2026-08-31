<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Dependency Assessment</title>
  
  <!-- Modern Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-gradient: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 100%);
      --card-bg: rgba(30, 41, 59, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      
      /* Status indicator colors */
      --flag: #ef4444; /* High dependency / Red */
      --warn: #f59e0b; /* Moderate / Amber */
      --pass: #10b981; /* Critical thinker / Emerald */
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      background: var(--bg-gradient);
      background-attachment: fixed;
      color: var(--text-main);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }

    /* Container Card */
    .quiz-container {
      width: 100%;
      max-width: 580px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    /* Intro Section */
    .intro-section {
      text-align: center;
    }

    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 999px;
      margin-bottom: 16px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    h1 {
      font-size: 1.85rem;
      font-weight: 700;
      line-height: 1.25;
      margin-bottom: 12px;
    }

    .intro-desc {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    /* Progress Bar */
    .progress-track {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      margin-bottom: 28px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      width: 0%;
      background: var(--primary);
      border-radius: 999px;
      transition: width 0.35s ease;
    }

    /* Question & Options */
    .question-title {
      font-size: 1.15rem;
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: 24px;
      color: #ffffff;
    }

    .quiz-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .quiz-opt-btn {
      width: 100%;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      color: #e2e8f0;
      font-family: inherit;
      font-size: 0.92rem;
      text-align: left;
      line-height: 1.5;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .quiz-opt-btn:hover {
      background: rgba(99, 102, 241, 0.12);
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-2px);
    }

    .quiz-opt-btn:active {
      transform: scale(0.99);
    }

    /* Results */
    .results-section {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .score-circle {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 6px solid var(--pass);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px 0 24px;
      background: rgba(0, 0, 0, 0.2);
      transition: border-color 0.4s ease;
    }

    .score-number {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .score-title {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .score-desc {
      color: var(--text-muted);
      font-size: 0.92rem;
      line-height: 1.6;
      margin-bottom: 28px;
    }

    /* Action Buttons */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 14px 28px;
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
      transform: translateY(-1px);
    }

    /* Utility */
    .hidden {
      display: none !important;
    }

    @media (max-width: 480px) {
      .quiz-container {
        padding: 24px 20px;
      }
      h1 {
        font-size: 1.5rem;
      }
    }
  </style>
</head>
<body>

  <main class="quiz-container">
    
    <!-- Intro View -->
    <section id="intro-section" class="intro-section">
      <span class="badge">Cognitive Assessment</span>
      <h1>AI Dependency Index</h1>
      <p class="intro-desc">
        Are you using AI as a cognitive amplifier or offloading your critical reasoning? Find out with this quick 4-question assessment.
      </p>
      <button id="start-test-btn" class="btn-primary">Start Assessment</button>
    </section>

    <!-- Quiz View -->
    <section id="quiz-section" class="hidden">
      <div class="progress-track">
        <div id="quiz-progress" class="progress-fill"></div>
      </div>
      <div id="quiz-content"></div>
    </section>

    <!-- Results View -->
    <section id="results-section" class="results-section hidden">
      <div id="score-circle" class="score-circle">
        <span id="score-number" class="score-number">0%</span>
      </div>
      <h2 id="score-title" class="score-title">Assessment Complete</h2>
      <p id="score-desc" class="score-desc"></p>
      <button id="retake-btn" class="btn-primary">Retake Assessment</button>
    </section>

  </main>

  <script>
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

    const introSection = document.getElementById('intro-section');
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
      quizProgress.style.width = `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`;

      quizContent.innerHTML = `
        <h3 class="question-title">${q.title}</h3>
        <div class="quiz-options">
          ${q.options.map(opt => `
            <button class="quiz-opt-btn" data-points="${opt.points}">${opt.text}</button>
          `).join('')}
        </div>
      `;

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
    }

    startTestBtn.addEventListener('click', () => {
      currentQuestion = 0;
      totalPoints = 0;
      introSection.classList.add('hidden');
      quizSection.classList.remove('hidden');
      resultsSection.classList.add('hidden');
      renderQuestion();
    });

    retakeBtn.addEventListener('click', () => {
      currentQuestion = 0;
      totalPoints = 0;
      resultsSection.classList.add('hidden');
      quizSection.classList.remove('hidden');
      renderQuestion();
    });
  </script>
</body>
</html>
