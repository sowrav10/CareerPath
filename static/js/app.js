/**
 * app.js
 * -------
 * Complete client-side logic for the Sleep Disturbance Analyzer.
 * Handles: Patient Registration step, 20-question navigation,
 * validation, API submission, and Official Certificate PDF Generation.
 */

/* ═══════════════════════════════════════════════════════════════
   QUESTION BANK
   (option index: 0 = Insomnia-aligned,
                  1 = Sleep Apnea-aligned,
                  2 = Hypersomnia/Circadian-aligned)
   ═══════════════════════════════════════════════════════════════ */
const QUESTIONS = [
  {
    id: 1,
    text: "How long does it typically take you to fall asleep after getting into bed?",
    options: [
      "More than 30–60 minutes — my mind keeps racing",
      "I fall asleep quickly but wake up gasping or snoring",
      "I fall asleep almost instantly, often unintentionally"
    ]
  },
  {
    id: 2,
    text: "How would you describe your sleep duration on a typical night?",
    options: [
      "Less than 6 hours — I just can't stay asleep long enough",
      "6–8 hours, but I feel completely unrefreshed in the morning",
      "9 hours or more, yet I still feel exhausted all day"
    ]
  },
  {
    id: 3,
    text: "Do you or a bed partner notice any of the following during your sleep?",
    options: [
      "Frequent tossing and turning, restlessness, or talking in sleep",
      "Loud snoring, choking sounds, or visibly pausing breathing",
      "Very deep, motionless sleep that's impossible to wake from"
    ]
  },
  {
    id: 4,
    text: "How do you feel when you first wake up in the morning?",
    options: [
      "Alert but frustrated — I've been awake for hours already",
      "Extremely groggy, with a dry mouth or headache",
      "Like I could sleep another 4–5 hours no matter what time it is"
    ]
  },
  {
    id: 5,
    text: "How often do you experience uncontrollable daytime sleepiness?",
    options: [
      "Rarely — I'm tired but can usually stay awake during the day",
      "Occasionally — especially after meals or in warm environments",
      "Very often — I fall asleep during meetings, reading, or driving"
    ]
  },
  {
    id: 6,
    text: "What is your typical sleep schedule?",
    options: [
      "I go to bed at a regular time but can't sleep for hours",
      "I try to sleep early but wake up frequently during the night",
      "I naturally stay up past 2–3 AM and wake up in the afternoon"
    ]
  },
  {
    id: 7,
    text: "What kinds of thoughts or sensations occur as you try to fall asleep?",
    options: [
      "Racing thoughts, worry, anxiety, or an inability to 'switch off'",
      "I feel discomfort or tingling in my legs (restless legs)",
      "I feel completely sleepy but also feel disoriented about time"
    ]
  },
  {
    id: 8,
    text: "How does your sleep problem affect your energy and mood during the day?",
    options: [
      "I'm irritable, anxious, and have difficulty concentrating",
      "I feel physically fatigued and have recurring morning headaches",
      "I feel mentally foggy and sluggish, like I'm in a fog all day"
    ]
  },
  {
    id: 9,
    text: "Do you rely on any of the following to manage your sleep?",
    options: [
      "Sleep medication, herbal supplements, or alcohol to fall asleep",
      "Positional aids (anti-snore pillow, CPAP), or sleeping propped up",
      "Multiple alarms, blackout curtains, or napping several times a day"
    ]
  },
  {
    id: 10,
    text: "How often do you wake up during the night?",
    options: [
      "2–4+ times per night, and I struggle to fall back asleep",
      "I often wake up suddenly, gasping or heart racing",
      "Rarely — once I'm asleep, almost nothing can wake me up"
    ]
  },
  {
    id: 11,
    text: "Do you feel anxious or worried about sleep itself?",
    options: [
      "Yes — I dread bedtime because I know I won't be able to sleep",
      "Sometimes — I'm more worried about waking up exhausted",
      "No — I actually look forward to sleep and could sleep anywhere"
    ]
  },
  {
    id: 12,
    text: "What is your body weight and physical profile like?",
    options: [
      "Average or lean build with no significant weight concerns",
      "Overweight or have a large neck — others say I snore loudly",
      "Any build, but I feel physically lethargic most of the day"
    ]
  },
  {
    id: 13,
    text: "When are you most mentally alert and productive?",
    options: [
      "In the morning — though I'm exhausted from poor night sleep",
      "Midday — mornings are rough due to fatigue",
      "Late at night — I feel most awake after midnight"
    ]
  },
  {
    id: 14,
    text: "How does your sleep problem affect your social and work life?",
    options: [
      "I avoid social events because of fatigue and irritability",
      "I've had workplace incidents due to extreme drowsiness",
      "I miss morning commitments regularly due to being unable to wake"
    ]
  },
  {
    id: 15,
    text: "How long have you been experiencing significant sleep problems?",
    options: [
      "Several months to years — it's been ongoing and persistent",
      "On and off, often worse when I gain weight or am congested",
      "Most of my life — I've always been a 'night owl' or heavy sleeper"
    ]
  },
  {
    id: 16,
    text: "Which physical symptom have you experienced most often?",
    options: [
      "Headaches from lack of sleep, eye fatigue, muscle tension",
      "Waking with a sore throat, dry mouth, or morning headaches",
      "Heavy, leaden feeling in limbs, cognitive slowness all day"
    ]
  },
  {
    id: 17,
    text: "What typically happens when you try to take a daytime nap?",
    options: [
      "I can't nap even when tired — my mind stays active",
      "I nap occasionally but still feel unrested afterwards",
      "I nap for 2–3 hours easily and feel I could sleep even more"
    ]
  },
  {
    id: 18,
    text: "How does caffeine (coffee, tea, energy drinks) affect you?",
    options: [
      "I drink it to cope with tiredness but it makes night sleep worse",
      "I need it to function but it doesn't fully solve my fatigue",
      "Even heavy caffeine use barely keeps me awake during the day"
    ]
  },
  {
    id: 19,
    text: "Have you been told by a doctor or partner to seek help for sleep?",
    options: [
      "Yes — they say I look tired all the time and am irritable",
      "Yes — they're worried about my snoring or breathing at night",
      "Yes — they're concerned about how much I sleep or daytime napping"
    ]
  },
  {
    id: 20,
    text: "Which statement best describes your overall relationship with sleep?",
    options: [
      "I desperately want to sleep but my body and mind won't let me",
      "I sleep but wake feeling like I barely rested at all",
      "I could sleep at any time, in any place — sleep is never enough"
    ]
  }
];

/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
let currentIndex = 0;            // 0-based index into QUESTIONS
const answers   = {};            // { Q1: 0|1|2, Q2: ..., ... }
let patientProfile = {
  userName: "",
  age: "",
  gender: ""
};

/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  buildProgressDots();
});

/* ═══════════════════════════════════════════════════════════════
   HERO → USER INFO STEP
   ═══════════════════════════════════════════════════════════════ */
function showUserInfoStep() {
  const hero = document.getElementById("hero");
  const infoSec = document.getElementById("userInfoSection");
  if (!hero || !infoSec) return;

  hero.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  hero.style.opacity = "0";
  hero.style.transform = "translateY(-20px)";

  setTimeout(() => {
    hero.classList.add("hidden");
    infoSec.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 400);
}

function backToHero() {
  const hero = document.getElementById("hero");
  const infoSec = document.getElementById("userInfoSection");
  if (!hero || !infoSec) return;

  infoSec.classList.add("hidden");
  hero.classList.remove("hidden");
  hero.style.opacity = "1";
  hero.style.transform = "translateY(0)";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ═══════════════════════════════════════════════════════════════
   SUBMIT PATIENT INFO → START QUIZ
   ═══════════════════════════════════════════════════════════════ */
function submitPatientInfo(event) {
  event.preventDefault();

  const nameVal = document.getElementById("userName").value.trim();
  const ageVal = document.getElementById("userAge").value.trim();
  const genderVal = document.getElementById("userGender").value;

  if (!nameVal || !ageVal || !genderVal) {
    alert("Please fill in your name, age, and gender to proceed.");
    return;
  }

  patientProfile.userName = nameVal;
  patientProfile.age = ageVal;
  patientProfile.gender = genderVal;

  const infoSec = document.getElementById("userInfoSection");
  const quizSec = document.getElementById("quizSection");

  infoSec.classList.add("hidden");
  quizSec.classList.remove("hidden");

  renderQuestion(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (i === activeIndex)               dot.classList.add("current");
    else if (answers[qKey] !== undefined) dot.classList.add("answered");
  });
}

/* ═══════════════════════════════════════════════════════════════
   RENDER QUESTION
   ═══════════════════════════════════════════════════════════════ */
function renderQuestion(index) {
  const q = QUESTIONS[index];
  const pct = Math.round(((index + 1) / QUESTIONS.length) * 100);

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
  nextBtn.textContent = (index === QUESTIONS.length - 1) ? "🔍 Submit & Generate Certificate" : "Next →";

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

  const items = document.querySelectorAll(".option-item");
  items.forEach((item, i) => {
    item.classList.toggle("selected", i === optionIndex);
    item.setAttribute("aria-checked", i === optionIndex ? "true" : "false");
  });

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
   SUBMIT ANSWERS & USER DEMOGRAPHICS TO BACKEND
   ═══════════════════════════════════════════════════════════════ */
async function submitAnswers() {
  for (let i = 1; i <= QUESTIONS.length; i++) {
    if (answers[`Q${i}`] === undefined) {
      alert(`Please answer Question ${i} before submitting.`);
      currentIndex = i - 1;
      renderQuestion(currentIndex);
      return;
    }
  }

  showLoading(true);

  const payload = {
    user_name: patientProfile.userName,
    age: parseInt(patientProfile.age, 10),
    gender: patientProfile.gender,
    ...answers
  };

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Analysis failed. Please try again.");
    }

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

/* Helper to convert HTML image element to Data URL */
function getBase64Image(imgEl) {
  if (!imgEl) return null;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = imgEl.naturalWidth || imgEl.width || 300;
    canvas.height = imgEl.naturalHeight || imgEl.height || 300;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgEl, 0, 0);
    return canvas.toDataURL("image/png");
  } catch (e) {
    console.error("Error converting image to data URL:", e);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════
   CARD SHAKE ANIMATION
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
   HIGH-QUALITY OFFICIAL CERTIFICATE PDF GENERATION
   (Embeds SleepAI LOGO.png & Seal Logo.png)
   ═══════════════════════════════════════════════════════════════ */
function downloadCertificatePDF() {
  if (typeof RESULT_DATA === "undefined" || typeof USER_INFO === "undefined") return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const W = 297;
  const H = 210;

  // ─ Background & Gold Frame Borders ─
  doc.setFillColor(8, 12, 18); // Deep Charcoal Obsidian
  doc.rect(0, 0, W, H, "F");

  // Outer Gold Decorative Border Frame
  doc.setLineWidth(1.8);
  doc.setDrawColor(245, 158, 11); // Sunset Gold
  doc.rect(10, 10, W - 20, H - 20);

  // Inner Fine Emerald Accent Frame
  doc.setLineWidth(0.6);
  doc.setDrawColor(16, 185, 129); // Emerald Green
  doc.rect(14, 14, W - 28, H - 28);

  // Corner Accent Circles
  function corner(x, y) {
    doc.setFillColor(245, 158, 11);
    doc.circle(x, y, 2.5, "F");
  }
  corner(14, 14);
  corner(W - 14, 14);
  corner(14, H - 14);
  corner(W - 14, H - 14);

  // ─ Header SleepAI Text ─
  let y = 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(52, 211, 153); // Emerald Mint
  doc.text("SleepAI", W / 2, y, { align: "center" });

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  doc.text("DIGITAL HEALTH SCREENING SYSTEM", W / 2, y, { align: "center" });

  y += 12;
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.setTextColor(251, 191, 36); // Sunset Gold Title
  doc.text("CERTIFICATE OF SLEEP HEALTH ASSESSMENT", W / 2, y, { align: "center" });

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Certificate Registration ID: ${USER_INFO.certId}`, W / 2, y, { align: "center" });

  // Divider Line
  y += 6;
  doc.setLineWidth(0.5);
  doc.setDrawColor(251, 191, 36);
  doc.line(W / 2 - 60, y, W / 2 + 60, y);

  // ─ Candidate Certification Statement ─
  y += 12;
  doc.setFont("times", "italic");
  doc.setFontSize(11.5);
  doc.setTextColor(203, 213, 225);
  doc.text("This official certificate hereby verifies that", W / 2, y, { align: "center" });

  y += 11;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(255, 255, 255);
  doc.text(USER_INFO.name.toUpperCase(), W / 2, y, { align: "center" });

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Age: ${USER_INFO.age}  |  Gender: ${USER_INFO.gender}  |  Assessment Date: ${USER_INFO.timestamp}`, W / 2, y, { align: "center" });

  y += 11;
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  doc.text("has successfully completed the 20-Factor Clinical Sleep Disturbance Assessment.", W / 2, y, { align: "center" });

  // ─ Primary Result Box ─
  y += 9;
  doc.setFillColor(16, 26, 36);
  doc.roundedRect(W / 2 - 85, y, 170, 24, 4, 4, "F");
  doc.setLineWidth(0.8);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(W / 2 - 85, y, 170, 24, 4, 4, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`Primary Sleep Pattern: ${RESULT_DATA.disorder.toUpperCase()}`, W / 2, y + 10, { align: "center" });

  doc.setFontSize(9.5);
  doc.setTextColor(52, 211, 153);
  doc.text(`Clinical Pattern Match Confidence: ${RESULT_DATA.confidence}%`, W / 2, y + 18, { align: "center" });

  y += 30;

  // ─ Score Summary Pills ─
  const sc = RESULT_DATA.scores;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Insomnia Score: ${sc.Insomnia}/20   |   Sleep Apnea Score: ${sc["Sleep Apnea"]}/20   |   Hypersomnia Score: ${sc.Hypersomnia}/20`,
    W / 2, y, { align: "center" }
  );

  // ─ Text-based Gold Emblem Seal Portion ─
  y += 14;
  doc.setFillColor(245, 158, 11);
  doc.circle(W / 2, y, 11, "F");
  
  doc.setLineWidth(0.6);
  doc.setDrawColor(255, 255, 255);
  doc.circle(W / 2, y, 9.5, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(10, 15, 22);
  doc.text("SLEEPAI", W / 2, y - 1, { align: "center" });
  doc.text("VERIFIED", W / 2, y + 3, { align: "center" });

  // Bottom Disclaimer note
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("SleepAI Digital Health Screening System • Non-Diagnostic Educational Assessment", W / 2, H - 15, { align: "center" });

  // Save PDF Certificate
  doc.save(`SleepAI_Official_Certificate_${USER_INFO.name.replace(/\s+/g, '_')}_${USER_INFO.certId}.pdf`);
}
