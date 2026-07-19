/**
 * app.js
 * -------
 * Complete client-side logic for the Career Predictor.
 * Handles: question rendering, navigation, validation,
 * API submission, and PDF generation.
 */

/* ═══════════════════════════════════════════════════════════════
   QUESTION BANK  (option index 0=Science, 1=Commerce, 2=Humanities)
   ═══════════════════════════════════════════════════════════════ */
const QUESTIONS = [
  {
    id: 1,
    text: "Which school subject do you enjoy the most?",
    options: [
      "Science (Biology / Physics / Chemistry / Mathematics / ICT)",
      "Business Math / Accounting / Finance",
      "Bangla / Social Science / History / Civics / Geography"
    ]
  },
  {
    id: 2,
    text: "What type of content do you like most and usually watch or read in your free time?",
    options: [
      "Technology, science, health, mathematics",
      "Business, startups, investment",
      "Politics, society, psychology, literature"
    ]
  },
  {
    id: 3,
    text: "What kind of problems do you enjoy solving?",
    options: [
      "Logical / mathematical problems",
      "Business / financial problems",
      "Social / ethical problems"
    ]
  },
  {
    id: 4,
    text: "What would your dream job look like?",
    options: [
      "Engineer, doctor, scientist, or programmer",
      "Business owner, banker, or financial analyst",
      "Writer, lawyer, social worker, or journalist"
    ]
  },
  {
    id: 5,
    text: "Which activity do you enjoy most?",
    options: [
      "Conducting experiments or coding",
      "Managing budgets or analysing markets",
      "Writing stories, debating, or helping others"
    ]
  },
  {
    id: 6,
    text: "Which of these skills best describes you?",
    options: [
      "Analytical and logical thinker",
      "Strategic and financially minded",
      "Creative and empathetic communicator"
    ]
  },
  {
    id: 7,
    text: "What do you prefer to study in depth?",
    options: [
      "How things work (physics, chemistry, biology, computers)",
      "How money and business work (economics, accounting)",
      "How society and people work (history, psychology, civics)"
    ]
  },
  {
    id: 8,
    text: "If you had to write a school project, which topic would you choose?",
    options: [
      "Climate change, robotics, or human anatomy",
      "Stock markets, startup culture, or economic policy",
      "Human rights, cultural heritage, or social media impact"
    ]
  },
  {
    id: 9,
    text: "What type of books or articles do you read voluntarily?",
    options: [
      "Science fiction, popular science, technology blogs",
      "Business biographies, investment guides, finance news",
      "Literature, political commentary, psychology books"
    ]
  },
  {
    id: 10,
    text: "What motivates you most in your studies?",
    options: [
      "Discovering how the world works scientifically",
      "Understanding wealth creation and economic systems",
      "Understanding people, history, and social change"
    ]
  },
  {
    id: 11,
    text: "Which of these extracurricular activities appeals to you most?",
    options: [
      "Science Olympiad, Robotics Club, Math Competition",
      "Business Club, Entrepreneurship Fair, Investment Challenge",
      "Debate Team, Drama Club, Community Service"
    ]
  },
  {
    id: 12,
    text: "When you face a major decision, what guides you most?",
    options: [
      "Data, facts, and logical reasoning",
      "Cost-benefit analysis and strategic planning",
      "Values, ethics, and the impact on others"
    ]
  },
  {
    id: 13,
    text: "Which university faculty interests you most?",
    options: [
      "Faculty of Science / Engineering / Medicine / IT",
      "Faculty of Business / Economics / Finance / Commerce",
      "Faculty of Arts / Law / Social Science / Humanities"
    ]
  },
  {
    id: 14,
    text: "How would your classmates describe you?",
    options: [
      "The one who always understands maths and science",
      "The one who talks about business ideas and money",
      "The one who loves debating, writing, and storytelling"
    ]
  },
  {
    id: 15,
    text: "Which type of future project excites you the most?",
    options: [
      "Developing a vaccine, building a bridge, or creating an app",
      "Launching a startup, managing investments, or consulting",
      "Writing a novel, running an NGO, or working in politics"
    ]
  },
  {
    id: 16,
    text: "What is your strongest academic performance area?",
    options: [
      "Mathematics and the natural sciences",
      "Accounting, economics, and business studies",
      "Languages, social sciences, and the arts"
    ]
  },
  {
    id: 17,
    text: "Which of these would you rather do on a weekend?",
    options: [
      "Build something, code, or run a science experiment",
      "Analyse stocks, read about startups, or make a budget plan",
      "Read fiction, visit a museum, or volunteer for a cause"
    ]
  },
  {
    id: 18,
    text: "If you could win an award, which would mean most to you?",
    options: [
      "Best Young Scientist / Best Tech Innovator",
      "Best Young Entrepreneur / Best Financial Analyst",
      "Best Young Author / Best Social Activist"
    ]
  },
  {
    id: 19,
    text: "Which industry would you most like to work in long-term?",
    options: [
      "Healthcare, technology, engineering, or research",
      "Banking, finance, e-commerce, or consulting",
      "Media, education, law, or public policy"
    ]
  },
  {
    id: 20,
    text: "Finally, what kind of impact do you want to make in the world?",
    options: [
      "Solve scientific problems and advance technology",
      "Create wealth, build businesses, and drive economic growth",
      "Influence society, protect rights, and shape culture"
    ]
  }
];

/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
let currentIndex = 0;            // 0-based index into QUESTIONS
const answers   = {};            // { Q1: 0|1|2, Q2: ..., ... }

/* ═══════════════════════════════════════════════════════════════
   INIT (particles)
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  buildProgressDots();
});

/* ═══════════════════════════════════════════════════════════════
   HERO → START
   ═══════════════════════════════════════════════════════════════ */
function startPrediction() {
  const hero = document.getElementById("hero");
  const quiz = document.getElementById("quizSection");
  if (!hero || !quiz) return;

  hero.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  hero.style.opacity = "0";
  hero.style.transform = "translateY(-20px)";

  setTimeout(() => {
    hero.classList.add("hidden");
    quiz.classList.remove("hidden");
    renderQuestion(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 400);
}

/* ═══════════════════════════════════════════════════════════════
   PROGRESS DOTS
   ═══════════════════════════════════════════════════════════════ */
function buildProgressDots() {
  const container = document.getElementById("progressDots");
  if (!container) return;
  container.innerHTML = "";
  QUESTIONS.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "p-dot";
    dot.id = `dot-${i}`;
    container.appendChild(dot);
  });
}

function updateProgressDots(activeIndex) {
  QUESTIONS.forEach((_, i) => {
    const dot = document.getElementById(`dot-${i}`);
    if (!dot) return;
    dot.className = "p-dot";
    const qKey = `Q${i + 1}`;
    if (i === activeIndex)          dot.classList.add("current");
    else if (answers[qKey] !== undefined) dot.classList.add("answered");
  });
}

/* ═══════════════════════════════════════════════════════════════
   RENDER QUESTION
   ═══════════════════════════════════════════════════════════════ */
function renderQuestion(index) {
  const q = QUESTIONS[index];
  const pct = Math.round(((index + 1) / QUESTIONS.length) * 100);

  // Update counters
  document.getElementById("currentQ").textContent  = index + 1;
  document.getElementById("progressPct").textContent = `${pct}%`;
  document.getElementById("progressBar").style.width  = `${pct}%`;
  document.getElementById("qNumber").textContent     = `Q${index + 1}`;
  document.getElementById("questionText").textContent = q.text;

  // Animate card
  const card = document.getElementById("questionCard");
  card.style.opacity = "0";
  card.style.transform = "translateY(16px)";
  setTimeout(() => {
    card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  }, 50);

  // Render options
  const optList = document.getElementById("optionsList");
  optList.innerHTML = "";
  const selectedVal = answers[`Q${index + 1}`];

  q.options.forEach((optText, optIdx) => {
    const item = document.createElement("div");
    item.className = "option-item" + (selectedVal === optIdx ? " selected" : "");
    item.setAttribute("role", "radio");
    item.setAttribute("aria-checked", selectedVal === optIdx ? "true" : "false");
    item.setAttribute("tabindex", "0");
    item.innerHTML = `
      <div class="option-radio"></div>
      <div class="option-text">${optText}</div>
    `;
    item.addEventListener("click", () => selectOption(index, optIdx));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectOption(index, optIdx);
      }
    });
    optList.appendChild(item);
  });

  // Nav buttons
  document.getElementById("prevBtn").disabled = (index === 0);
  const nextBtn = document.getElementById("nextBtn");
  nextBtn.textContent = (index === QUESTIONS.length - 1) ? "🚀 Submit" : "Next →";

  // Hide validation
  document.getElementById("validationMsg").classList.add("hidden");

  // Progress dots
  updateProgressDots(index);
}

/* ═══════════════════════════════════════════════════════════════
   SELECT OPTION
   ═══════════════════════════════════════════════════════════════ */
function selectOption(questionIndex, optionIndex) {
  answers[`Q${questionIndex + 1}`] = optionIndex;

  // Update UI
  const items = document.querySelectorAll(".option-item");
  items.forEach((item, i) => {
    item.classList.toggle("selected", i === optionIndex);
    item.setAttribute("aria-checked", i === optionIndex ? "true" : "false");
  });

  // Hide validation message
  document.getElementById("validationMsg").classList.add("hidden");
  updateProgressDots(questionIndex);
}

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════════ */
function nextQuestion() {
  const qKey = `Q${currentIndex + 1}`;
  if (answers[qKey] === undefined) {
    document.getElementById("validationMsg").classList.remove("hidden");
    document.getElementById("questionCard").style.animation = "none";
    setTimeout(() => {
      document.getElementById("questionCard").style.animation = "cardShake 0.4s ease";
    }, 10);
    return;
  }

  if (currentIndex < QUESTIONS.length - 1) {
    currentIndex++;
    renderQuestion(currentIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    submitAnswers();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion(currentIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* ═══════════════════════════════════════════════════════════════
   SUBMIT
   ═══════════════════════════════════════════════════════════════ */
async function submitAnswers() {
  // Final validation: all 20 must be answered
  for (let i = 1; i <= QUESTIONS.length; i++) {
    if (answers[`Q${i}`] === undefined) {
      alert(`Please answer Question ${i} before submitting.`);
      currentIndex = i - 1;
      renderQuestion(currentIndex);
      return;
    }
  }

  showLoading(true);

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Prediction failed. Please try again.");
    }

    // Redirect to result page
    window.location.href = "/result";

  } catch (err) {
    showLoading(false);
    showError(err.message || "An unexpected error occurred. Please try again.");
  }
}

/* ═══════════════════════════════════════════════════════════════
   UI HELPERS
   ═══════════════════════════════════════════════════════════════ */
function showLoading(show) {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.classList.toggle("hidden", !show);
}

function showError(msg) {
  const existing = document.getElementById("runtimeError");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "runtimeError";
  div.className = "flash-error";
  div.innerHTML = `
    ⚠️ ${msg}
    <button onclick="document.getElementById('runtimeError').remove()">✕</button>
  `;
  document.body.appendChild(div);

  setTimeout(() => {
    if (div.parentNode) div.remove();
  }, 6000);
}

/* ═══════════════════════════════════════════════════════════════
   CARD SHAKE ANIMATION (CSS injection for missing keyframe)
   ═══════════════════════════════════════════════════════════════ */
(function injectShake() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes cardShake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ═══════════════════════════════════════════════════════════════
   PDF GENERATION  (result page only)
   ═══════════════════════════════════════════════════════════════ */
function downloadPDF() {
  if (typeof RESULT_DATA === "undefined") return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;
  let y = 20;

  // ─ Header ─
  doc.setFillColor(10, 22, 40);
  doc.rect(0, 0, W, 40, "F");
  doc.setFontSize(20);
  doc.setTextColor(79, 142, 247);
  doc.setFont("helvetica", "bold");
  doc.text("AI Career Prediction System", W / 2, 18, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.text("Powered by Random Forest Machine Learning", W / 2, 28, { align: "center" });
  doc.text(`Generated: ${RESULT_DATA.timestamp}`, W / 2, 36, { align: "center" });

  y = 52;

  // ─ Result Highlight ─
  doc.setFillColor(15, 30, 60);
  doc.roundedRect(14, y, W - 28, 28, 4, 4, "F");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(`Predicted Career Stream: ${RESULT_DATA.career}`, W / 2, y + 10, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(79, 142, 247);
  doc.text(`AI Confidence: ${RESULT_DATA.confidence}%`, W / 2, y + 21, { align: "center" });
  y += 36;

  // ─ Tagline ─
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "italic");
  const taglines = doc.splitTextToSize(RESULT_DATA.tagline, W - 28);
  doc.text(taglines, W / 2, y, { align: "center" });
  y += taglines.length * 6 + 8;

  // ─ Scores ─
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 80, 200);
  doc.text("Score Breakdown", 14, y); y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const sc = RESULT_DATA.scores;
  doc.text(`  Science: ${sc.Science}/20   Commerce: ${sc.Commerce}/20   Humanities: ${sc.Humanities}/20`, 14, y);
  y += 12;

  // ─ Helper: Section ─
  function section(title, items) {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 80, 200);
    doc.text(title, 14, y); y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    items.forEach(item => {
      if (y > 270) { doc.addPage(); y = 20; }
      const lines = doc.splitTextToSize(`  • ${item}`, W - 30);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 1;
    });
    y += 5;
  }

  section("Your Strengths",       RESULT_DATA.strengths);
  section("Recommended Skills",   RESULT_DATA.skills);
  section("University Subjects",  RESULT_DATA.subjects);
  section("Job Opportunities",    RESULT_DATA.careers);
  section("Future Growth Areas",  RESULT_DATA.growth);

  // ─ Quote ─
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const qLines = doc.splitTextToSize(RESULT_DATA.quote, W - 28);
  doc.text(qLines, W / 2, y, { align: "center" });
  y += qLines.length * 5 + 12;

  // ─ Your Answers ─
  doc.addPage(); y = 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 80, 200);
  doc.text("Your Answers", 14, y); y += 10;

  const OPTS = [
    ["Science (Biology / Physics / Chemistry / Mathematics / ICT)", "Business Math / Accounting / Finance", "Bangla / Social Science / History / Civics / Geography"],
    ["Technology, science, health, mathematics", "Business, startups, investment", "Politics, society, psychology, literature"],
    ["Logical / mathematical problems", "Business / financial problems", "Social / ethical problems"],
    ["Engineer, doctor, scientist, or programmer", "Business owner, banker, or financial analyst", "Writer, lawyer, social worker, or journalist"],
    ["Conducting experiments or coding", "Managing budgets or analysing markets", "Writing stories, debating, or helping others"],
    ["Analytical and logical thinker", "Strategic and financially minded", "Creative and empathetic communicator"],
    ["How things work (physics, chemistry, biology, computers)", "How money and business work (economics, accounting)", "How society and people work (history, psychology, civics)"],
    ["Climate change, robotics, or human anatomy", "Stock markets, startup culture, or economic policy", "Human rights, cultural heritage, or social media impact"],
    ["Science fiction, popular science, technology blogs", "Business biographies, investment guides, finance news", "Literature, political commentary, psychology books"],
    ["Discovering how the world works scientifically", "Understanding wealth creation and economic systems", "Understanding people, history, and social change"],
    ["Science Olympiad, Robotics Club, Math Competition", "Business Club, Entrepreneurship Fair, Investment Challenge", "Debate Team, Drama Club, Community Service"],
    ["Data, facts, and logical reasoning", "Cost-benefit analysis and strategic planning", "Values, ethics, and the impact on others"],
    ["Faculty of Science / Engineering / Medicine / IT", "Faculty of Business / Economics / Finance / Commerce", "Faculty of Arts / Law / Social Science / Humanities"],
    ["The one who always understands maths and science", "The one who talks about business ideas and money", "The one who loves debating, writing, and storytelling"],
    ["Developing a vaccine, building a bridge, or creating an app", "Launching a startup, managing investments, or consulting", "Writing a novel, running an NGO, or working in politics"],
    ["Mathematics and the natural sciences", "Accounting, economics, and business studies", "Languages, social sciences, and the arts"],
    ["Build something, code, or run a science experiment", "Analyse stocks, read about startups, or make a budget plan", "Read fiction, visit a museum, or volunteer for a cause"],
    ["Best Young Scientist / Best Tech Innovator", "Best Young Entrepreneur / Best Financial Analyst", "Best Young Author / Best Social Activist"],
    ["Healthcare, technology, engineering, or research", "Banking, finance, e-commerce, or consulting", "Media, education, law, or public policy"],
    ["Solve scientific problems and advance technology", "Create wealth, build businesses, and drive economic growth", "Influence society, protect rights, and shape culture"]
  ];

  for (let i = 1; i <= 20; i++) {
    if (y > 265) { doc.addPage(); y = 20; }
    const ansIdx = RESULT_DATA.answers[`Q${i}`];
    const ansText = (OPTS[i-1] && ansIdx !== undefined) ? OPTS[i-1][ansIdx] : "—";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 80);
    doc.text(`Q${i}:`, 14, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const aLines = doc.splitTextToSize(ansText, W - 38);
    doc.text(aLines, 26, y);
    y += aLines.length * 5 + 3;
  }

  // ─ Footer ─
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Career Predictor AI  •  Page ${p} of ${pageCount}`, W / 2, 290, { align: "center" });
  }

  doc.save(`Career_Prediction_${RESULT_DATA.career}_${Date.now()}.pdf`);
}
