"""
Career Predictor – Configuration File
======================================
This is the ONLY file you need to edit before running the app.

Optional: Add an API key below if you want to extend the app
with AI-powered career advice (e.g. Gemini, OpenAI, etc.).
Leave empty to use the built-in static career descriptions.
"""

# ─── Optional AI Enhancement ────────────────────────────────────────────────
# Leave empty ("") to disable. The app works fully without this.
API_KEY = ""          # e.g. your Gemini or OpenAI key

# ─── Flask Settings ──────────────────────────────────────────────────────────
DEBUG = False          # Set True during local development
SECRET_KEY = "career-predictor-secret-2025"   # Change in production

# ─── Model Path ──────────────────────────────────────────────────────────────
MODEL_PATH = "models/final_random_forest_model.joblib"

# ─── App Meta ────────────────────────────────────────────────────────────────
APP_NAME = "AI Career Prediction System"
APP_VERSION = "1.0.0"
