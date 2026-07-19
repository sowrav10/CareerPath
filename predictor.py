"""
predictor.py
=============
Core prediction logic. Accepts encoded features, runs the model,
and returns a rich result dictionary with career metadata.
"""

import numpy as np
import pandas as pd
import logging
from model_loader import get_model
from utils.encoder import encode_answers, decode_class, FEATURE_COLUMNS

logger = logging.getLogger(__name__)

# ─── Career Metadata ─────────────────────────────────────────────────────────
CAREER_INFO = {
    "Science": {
        "emoji": "🔬",
        "color": "#4f8ef7",
        "tagline": "Innovate. Discover. Engineer the Future.",
        "description": (
            "You have a natural affinity for logical thinking, analytical reasoning, "
            "and problem-solving. The Science stream is your gateway to understanding "
            "the universe — from microscopic organisms to the laws governing galaxies. "
            "You thrive on data, experiments, and evidence-based conclusions."
        ),
        "strengths": [
            "Analytical & critical thinking",
            "Logical problem-solving",
            "Research & experimentation mindset",
            "Mathematical aptitude",
            "Curiosity-driven learning",
        ],
        "skills": [
            "Mathematics & Statistics",
            "Programming (Python, R, MATLAB)",
            "Data Analysis",
            "Laboratory Techniques",
            "Scientific Writing",
        ],
        "subjects": [
            "Physics",
            "Chemistry",
            "Biology",
            "Mathematics",
            "Computer Science",
            "Environmental Science",
        ],
        "careers": [
            "Software Engineer",
            "Medical Doctor / Surgeon",
            "Data Scientist",
            "Research Scientist",
            "Aerospace Engineer",
            "Biotechnologist",
            "AI/ML Engineer",
            "Civil / Mechanical Engineer",
        ],
        "growth": [
            "Artificial Intelligence & Machine Learning",
            "Biotechnology & Genomics",
            "Renewable Energy & Climate Tech",
            "Space Exploration",
            "Quantum Computing",
        ],
        "quote": (
            "\"The science of today is the technology of tomorrow.\" "
            "— Edward Teller"
        ),
    },
    "Commerce": {
        "emoji": "📈",
        "color": "#f7c94f",
        "tagline": "Lead. Strategize. Build Empires.",
        "description": (
            "You possess a sharp business acumen and a flair for numbers, finance, "
            "and market dynamics. The Commerce stream sharpens your ability to think "
            "strategically, manage resources, and understand how economies and "
            "organizations function. You are built to lead and innovate in business."
        ),
        "strengths": [
            "Strategic thinking & planning",
            "Financial literacy",
            "Entrepreneurial mindset",
            "Communication & negotiation",
            "Market awareness",
        ],
        "skills": [
            "Accounting & Financial Reporting",
            "Business Analytics",
            "Marketing & Sales Strategy",
            "Investment & Portfolio Management",
            "Entrepreneurship",
        ],
        "subjects": [
            "Accounting",
            "Business Studies",
            "Economics",
            "Finance",
            "Statistics",
            "Management",
        ],
        "careers": [
            "Chartered Accountant (CA)",
            "Investment Banker",
            "Business Analyst",
            "Entrepreneur / Startup Founder",
            "Marketing Manager",
            "Financial Advisor",
            "Supply Chain Manager",
            "E-commerce Specialist",
        ],
        "growth": [
            "FinTech & Digital Banking",
            "E-commerce & Digital Marketing",
            "Sustainable Business & ESG",
            "Global Supply Chain Management",
            "Startup & Venture Capital Ecosystem",
        ],
        "quote": (
            "\"The secret of getting ahead is getting started.\" "
            "— Mark Twain"
        ),
    },
    "Humanities": {
        "emoji": "🎭",
        "color": "#a64ff7",
        "tagline": "Inspire. Create. Change Society.",
        "description": (
            "You are a deep thinker with empathy, creativity, and a passion for "
            "understanding people and societies. The Humanities stream nurtures your "
            "ability to communicate powerfully, analyze social issues, and shape "
            "culture. You are destined to lead change through words, art, and ideas."
        ),
        "strengths": [
            "Creative & lateral thinking",
            "Strong communication skills",
            "Empathy & social awareness",
            "Critical analysis of society",
            "Cultural intelligence",
        ],
        "skills": [
            "Creative Writing & Storytelling",
            "Public Speaking & Debate",
            "Research & Social Analysis",
            "Media & Journalism",
            "Psychology & Counselling",
        ],
        "subjects": [
            "Bangla / English Literature",
            "History & Political Science",
            "Sociology & Psychology",
            "Geography",
            "Philosophy",
            "Media & Communication",
        ],
        "careers": [
            "Journalist / Content Creator",
            "Lawyer / Human Rights Advocate",
            "Psychologist / Counsellor",
            "Diplomat / Civil Servant",
            "Author / Playwright",
            "Social Worker / NGO Leader",
            "Teacher / Professor",
            "UX Researcher",
        ],
        "growth": [
            "Digital Media & Podcasting",
            "Mental Health & Therapy Services",
            "Social Entrepreneurship",
            "Public Policy & Governance",
            "UX/UI Design & Human-Centered Design",
        ],
        "quote": (
            "\"The arts are not a way to make a living. They are a very human "
            "way of making life more bearable.\" — Kurt Vonnegut"
        ),
    },
}


def predict_career(raw_answers: dict) -> dict:
    """
    Run the full prediction pipeline.

    Args:
        raw_answers (dict): {Q1: int, Q2: int, ..., Q20: int}

    Returns:
        dict with keys:
            - career (str)
            - class_int (int)
            - confidence (float, 0-100)
            - probabilities (dict)
            - scores (dict)
            - info (dict) – career metadata
    """
    model = get_model()

    # Encode answers to 23-feature vector
    features = encode_answers(raw_answers)
    logger.debug(f"Encoded features: {features}")

    # Build DataFrame with correct column names
    df = pd.DataFrame([features], columns=FEATURE_COLUMNS)

    # Predict
    class_int = int(model.predict(df)[0])
    career = decode_class(class_int)

    # Confidence via predict_proba
    probabilities = {}
    confidence = None
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(df)[0]
        class_names = ["Science", "Commerce", "Humanities"]
        probabilities = {
            class_names[i]: round(float(proba[i]) * 100, 1)
            for i in range(len(proba))
        }
        confidence = probabilities[career]

    # Score breakdown
    score_science    = features[20]
    score_commerce   = features[21]
    score_humanities = features[22]

    logger.info(
        f"Prediction → {career} (confidence: {confidence}%)"
    )

    return {
        "career": career,
        "class_int": class_int,
        "confidence": confidence,
        "probabilities": probabilities,
        "scores": {
            "Science": score_science,
            "Commerce": score_commerce,
            "Humanities": score_humanities,
        },
        "info": CAREER_INFO[career],
    }
