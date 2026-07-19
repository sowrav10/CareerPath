"""
utils/validator.py
===================
Validates raw user input before passing to the model.
"""

import logging

logger = logging.getLogger(__name__)

VALID_OPTION_VALUES = {0, 1, 2}
TOTAL_QUESTIONS = 20


def validate_answers(data: dict) -> tuple[bool, str]:
    """
    Validate that the submitted answers are complete and valid.

    Args:
        data (dict): Raw POST data from the frontend.

    Returns:
        (True, "") if valid.
        (False, error_message) if invalid.
    """
    if not data:
        return False, "No data received."

    for i in range(1, TOTAL_QUESTIONS + 1):
        key = f"Q{i}"
        if key not in data:
            return False, f"Answer missing for Question {i}."
        try:
            val = int(data[key])
        except (TypeError, ValueError):
            return False, f"Invalid value for Question {i}: must be 0, 1, or 2."
        if val not in VALID_OPTION_VALUES:
            return False, f"Out-of-range value for Question {i}: {val}."

    return True, ""
