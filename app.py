"""
app.py
=======
Flask application entry point.
Registers all routes and initialises the model on startup.
"""

import logging
import traceback
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session
from config import DEBUG, SECRET_KEY, APP_NAME, APP_VERSION
from model_loader import load_model
from predictor import predict_career
from utils.validator import validate_answers

# ─── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG if DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s – %(message)s",
)
logger = logging.getLogger(__name__)

# ─── Flask App ────────────────────────────────────────────────────────────────
app = Flask(__name__)
app.secret_key = SECRET_KEY

# Pre-load model at startup
try:
    load_model()
    logger.info("✅ Model pre-loaded successfully.")
except Exception as e:
    logger.error(f"❌ Failed to pre-load model: {e}")


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Landing page with the question form."""
    return render_template("index.html", app_name=APP_NAME)


@app.route("/predict", methods=["POST"])
def predict():
    """
    POST endpoint that receives JSON answers and returns prediction JSON.

    Request body (JSON):
        { "Q1": 0, "Q2": 1, ..., "Q20": 2 }

    Response (JSON):
        {
            "success": true,
            "career": "Science",
            "confidence": 87.5,
            "probabilities": {"Science": 87.5, "Commerce": 8.3, "Humanities": 4.2},
            "scores": {"Science": 14, "Commerce": 4, "Humanities": 2},
            "info": { ... career metadata ... }
        }
    """
    try:
        data = request.get_json(force=True)

        # Validate
        valid, error_msg = validate_answers(data)
        if not valid:
            return jsonify({"success": False, "error": error_msg}), 400

        # Predict
        result = predict_career(data)

        # Store in session for result page
        session["result"] = result
        session["answers"] = data
        session["timestamp"] = datetime.now().strftime("%d %B %Y, %I:%M %p")

        return jsonify({"success": True, **result}), 200

    except ValueError as ve:
        logger.warning(f"Validation error: {ve}")
        return jsonify({"success": False, "error": str(ve)}), 400

    except FileNotFoundError as fe:
        logger.error(f"Model not found: {fe}")
        return jsonify({"success": False, "error": "Model file not found on server."}), 500

    except Exception as e:
        logger.error(f"Prediction error: {traceback.format_exc()}")
        return jsonify({"success": False, "error": "An internal error occurred. Please try again."}), 500


@app.route("/result")
def result():
    """Result page – reads prediction from session."""
    result_data = session.get("result")
    answers     = session.get("answers", {})
    timestamp   = session.get("timestamp", "")

    if not result_data:
        return render_template("index.html", app_name=APP_NAME, error="No prediction found. Please complete the questionnaire first.")

    return render_template(
        "result.html",
        app_name=APP_NAME,
        result=result_data,
        answers=answers,
        timestamp=timestamp,
    )


# ─── Error Handlers ───────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Endpoint not found."}), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"success": False, "error": "Method not allowed."}), 405


@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": "Internal server error."}), 500


# ─── Entry Point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=DEBUG, host="0.0.0.0", port=5000)
