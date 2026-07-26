"""
predictor.py
=============
Core prediction logic for Sleep Disturbance Analyzer.
Accepts encoded features, runs a rule-based scoring engine,
and returns a rich result dictionary with disorder metadata.
"""

import logging

logger = logging.getLogger(__name__)

# ─── Disorder Metadata ────────────────────────────────────────────────────────
DISORDER_INFO = {
    "Insomnia": {
        "emoji": "🌙",
        "color": "#10b981",
        "tagline": "Restless nights, a mind that won't switch off.",
        "description": (
            "Your responses suggest patterns consistent with Insomnia — "
            "a condition characterised by persistent difficulty falling asleep, "
            "staying asleep, or waking too early. You may lie awake with racing "
            "thoughts, feel unrefreshed despite time in bed, and notice the impact "
            "on your daytime energy, mood, and concentration. Insomnia is highly "
            "manageable with the right behavioural and lifestyle strategies."
        ),
        "symptoms": [
            "Difficulty falling asleep at night",
            "Waking up frequently during the night",
            "Waking too early and unable to return to sleep",
            "Feeling tired or unrefreshed after sleep",
            "Daytime irritability, low mood, or anxiety",
            "Difficulty concentrating or remembering things",
            "Worrying about sleep itself (sleep anxiety)",
        ],
        "risk_factors": [
            "High stress or anxiety levels",
            "Irregular or inconsistent sleep schedule",
            "Excessive screen time before bed",
            "Caffeine or alcohol consumption in the evening",
            "Sedentary lifestyle with little physical activity",
            "Poor sleep environment (noise, light, temperature)",
        ],
        "lifestyle_tips": [
            "Maintain a consistent sleep and wake time daily",
            "Create a calming pre-sleep routine (reading, meditation)",
            "Avoid screens 60 minutes before bedtime",
            "Limit caffeine after 2 PM and avoid alcohol near bedtime",
            "Keep your bedroom cool, dark, and quiet",
            "Try Cognitive Behavioural Therapy for Insomnia (CBT-I)",
            "Practice deep breathing or progressive muscle relaxation",
        ],
        "when_to_see_doctor": [
            "Symptoms persist for more than 3 months",
            "Sleep problems are severely affecting work or relationships",
            "You rely on sleep aids or alcohol to fall asleep",
            "You experience anxiety or depression alongside poor sleep",
            "No improvement with lifestyle changes after 4–6 weeks",
        ],
        "quote": (
            "\"Sleep is the golden chain that ties health and our bodies together.\" "
            "— Thomas Dekker"
        ),
    },
    "Sleep Apnea": {
        "emoji": "😮‍💨",
        "color": "#f43f5e",
        "tagline": "Breathing interrupted — your body fighting for rest.",
        "description": (
            "Your responses suggest patterns consistent with Sleep Apnea — "
            "a serious sleep disorder where breathing repeatedly stops and starts "
            "during sleep. This can cause loud snoring, choking sensations, and "
            "repeated micro-arousals that leave you exhausted despite spending "
            "adequate time in bed. Sleep Apnea has significant cardiovascular "
            "and metabolic implications and should be evaluated by a specialist."
        ),
        "symptoms": [
            "Loud, frequent snoring reported by a partner",
            "Observed pauses in breathing during sleep",
            "Gasping, choking, or snorting during sleep",
            "Waking with a dry mouth or sore throat",
            "Severe daytime sleepiness (falling asleep unexpectedly)",
            "Morning headaches upon waking",
            "Difficulty concentrating and memory problems",
        ],
        "risk_factors": [
            "Excess weight or obesity (BMI > 25)",
            "Large neck circumference (> 40 cm)",
            "Narrow airway, enlarged tonsils or adenoids",
            "Family history of sleep apnea",
            "Smoking and alcohol use",
            "Sleeping on your back (supine position)",
            "Nasal congestion or anatomical obstruction",
        ],
        "lifestyle_tips": [
            "Lose weight if overweight — even 10% reduction helps significantly",
            "Sleep on your side instead of your back",
            "Avoid alcohol, sedatives, and smoking",
            "Treat nasal congestion and allergies proactively",
            "Elevate the head of your bed by 4–6 inches",
            "Use a CPAP machine if prescribed by your doctor",
            "Practice airway exercises (myofunctional therapy)",
        ],
        "when_to_see_doctor": [
            "A partner reports you stop breathing during sleep",
            "You feel extremely sleepy during the day despite a full night in bed",
            "You wake up gasping or choking",
            "You have high blood pressure alongside sleep problems",
            "Morning headaches occur regularly",
        ],
        "quote": (
            "\"Each night, when I go to sleep, I die. And the next morning, "
            "when I wake up, I am reborn.\" — Mahatma Gandhi"
        ),
    },
    "Hypersomnia": {
        "emoji": "☀️",
        "color": "#f59e0b",
        "tagline": "Always tired — no matter how much you sleep.",
        "description": (
            "Your responses suggest patterns consistent with Hypersomnia or "
            "Circadian Rhythm Disorder — conditions where you experience excessive "
            "daytime sleepiness, prolonged sleep episodes, or a misaligned internal "
            "body clock. You may sleep 9–12+ hours yet still feel unrefreshed, "
            "struggle to wake at conventional times, or feel most alert at night. "
            "These conditions are distinct from laziness and have clear neurological "
            "and circadian underpinnings that can be effectively managed."
        ),
        "symptoms": [
            "Sleeping more than 9–10 hours yet still feeling tired",
            "Extreme difficulty waking up in the morning",
            "Irresistible daytime sleepiness even after adequate sleep",
            "Taking long naps that provide little refreshment",
            "Feeling most alert and energetic late at night",
            "Cognitive fog, slow thinking, or 'sleep inertia'",
            "Social or occupational dysfunction due to sleep timing",
        ],
        "risk_factors": [
            "Irregular sleep schedule or shift work",
            "Delayed Sleep Phase Syndrome (night-owl chronotype)",
            "Neurological conditions (narcolepsy, idiopathic hypersomnia)",
            "Certain medications (antihistamines, antidepressants)",
            "Mental health conditions such as depression",
            "Genetic predisposition to circadian disruption",
            "Lack of natural light exposure during the day",
        ],
        "lifestyle_tips": [
            "Anchor your wake time — same time every day, including weekends",
            "Get bright natural light exposure within 30 min of waking",
            "Avoid napping after 3 PM to preserve nighttime sleep drive",
            "Keep bedroom for sleep only — no screens, work, or eating",
            "Gradually shift your sleep time earlier by 15 min every few days",
            "Consider melatonin (0.5–1 mg) taken 5–6 hours before desired sleep",
            "Exercise regularly — morning activity is especially beneficial",
        ],
        "when_to_see_doctor": [
            "You sleep more than 10 hours and still feel exhausted",
            "Excessive sleepiness is affecting your job or safety (e.g., driving)",
            "You suspect narcolepsy (sudden muscle weakness, sleep paralysis)",
            "Circadian misalignment persists despite lifestyle changes",
            "Symptoms began suddenly or after a viral illness",
        ],
        "quote": (
            "\"The best bridge between despair and hope is a good night's sleep.\" "
            "— E. Joseph Cossman"
        ),
    },
}


def predict_disorder(raw_answers: dict) -> dict:
    """
    Run the full rule-based prediction pipeline for sleep disorders.

    Scoring logic:
      - Each question has 3 options:
          0 → Insomnia-aligned answer
          1 → Sleep Apnea-aligned answer
          2 → Hypersomnia/Circadian-aligned answer
      - Score_Insomnia   = count of answers == 0  (range 0–20)
      - Score_Apnea      = count of answers == 1  (range 0–20)
      - Score_Hypersomnia= count of answers == 2  (range 0–20)
      - Predicted disorder = highest scoring class
      - Probabilities computed as percentage of each score vs total

    Args:
        raw_answers (dict): {Q1: int, Q2: int, ..., Q20: int}

    Returns:
        dict with keys:
            - disorder (str)
            - class_int (int)
            - confidence (float, 0-100)
            - probabilities (dict)
            - scores (dict)
            - info (dict) – disorder metadata
    """
    from utils.encoder import encode_answers, decode_class

    # Encode and compute scores
    features = encode_answers(raw_answers)

    score_insomnia    = features[20]
    score_apnea       = features[21]
    score_hypersomnia = features[22]

    total = score_insomnia + score_apnea + score_hypersomnia
    if total == 0:
        total = 1  # avoid division by zero

    scores = {
        "Insomnia": score_insomnia,
        "Sleep Apnea": score_apnea,
        "Hypersomnia": score_hypersomnia,
    }

    # Determine predicted class
    class_names = ["Insomnia", "Sleep Apnea", "Hypersomnia"]
    score_list = [score_insomnia, score_apnea, score_hypersomnia]
    max_score = max(score_list)
    class_int = score_list.index(max_score)
    disorder = class_names[class_int]

    # Compute probabilities
    probabilities = {
        "Insomnia":    round(score_insomnia    / total * 100, 1),
        "Sleep Apnea": round(score_apnea       / total * 100, 1),
        "Hypersomnia": round(score_hypersomnia / total * 100, 1),
    }
    confidence = probabilities[disorder]

    logger.info(f"Prediction → {disorder} (confidence: {confidence}%)")
    logger.debug(f"Scores → {scores}")

    return {
        "disorder": disorder,
        "career": disorder,          # kept as alias for template compatibility
        "class_int": class_int,
        "confidence": confidence,
        "probabilities": probabilities,
        "scores": scores,
        "info": DISORDER_INFO[disorder],
    }
