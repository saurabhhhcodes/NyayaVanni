import re
from email_validator import validate_email, EmailNotValidError

def is_valid_email(email):
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        return False


def is_strong_password(password):

    if len(password) < 8:
        return False

    if not re.search(r"[A-Z]", password):
        return False

    if not re.search(r"[a-z]", password):
        return False

    if not re.search(r"\d", password):
        return False

    return True