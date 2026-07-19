"""
utils/encoder.py
=================
Encodes raw user answers (option index 0/1/2) into the exact
integer format the Random Forest model was trained on.

Training encoding (discovered by inspecting the dataset):
  - Each question has 3 options:
      0 → Science-aligned answer
      1 → Commerce-aligned answer
      2 → Humanities-aligned answer
  - Score_Science  = count of Q answers == 0  (range 0–20)
  - Score_Commerce = count of Q answers == 1  (range 0–20)
  - Score_Humanities = count of Q answers == 2  (range 0–20)
  - Feature order (23 features):
      Q1..Q20, Score_Science, Score_Commerce, Score_Humanities
"""

import logging

logger = logging.getLogger(__name__)

# Feature columns in exact training order
FEATURE_COLUMNS = [
    "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10",
    "Q11", "Q12", "Q13", "Q14", "Q15", "Q16", "Q17", "Q18", "Q19", "Q20",
    "Score_Science", "Score_Commerce", "Score_Humanities"
]

# Class label mapping
CLASS_LABELS = {
    0: "Science",
    1: "Commerce",
    2: "Humanities"
}


def encode_answers(raw_answers: dict) -> list:
    """
    Convert a dict of {Q1: int, Q2: int, ..., Q20: int} into
    the 23-feature list expected by the model.

    Args:
        raw_answers (dict): Keys 'Q1'..'Q20', values 0/1/2.

    Returns:
        list: 23 numeric values in feature order.

    Raises:
        ValueError: If any answer is missing or out of range.
    """
    # Validate all 20 questions are present
    q_keys = [f"Q{i}" for i in range(1, 21)]
    for key in q_keys:
        if key not in raw_answers:
            raise ValueError(f"Missing answer for {key}")
        val = int(raw_answers[key])
        if val not in (0, 1, 2):
            raise ValueError(f"Invalid value for {key}: {val}. Must be 0, 1, or 2.")

    # Build Q values
    q_values = [int(raw_answers[f"Q{i}"]) for i in range(1, 21)]

    # Compute scores
    score_science    = q_values.count(0)
    score_commerce   = q_values.count(1)
    score_humanities = q_values.count(2)

    logger.debug(
        f"Scores → Science: {score_science}, "
        f"Commerce: {score_commerce}, "
        f"Humanities: {score_humanities}"
    )

    return q_values + [score_science, score_commerce, score_humanities]


def decode_class(class_int: int) -> str:
    """
    Convert integer class (0/1/2) to human-readable label.

    Args:
        class_int (int): Model output class index.

    Returns:
        str: 'Science', 'Commerce', or 'Humanities'.
    """
    return CLASS_LABELS.get(int(class_int), "Unknown")
