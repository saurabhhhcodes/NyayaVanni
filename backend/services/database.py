import logging
import sqlite3
import time

logger = logging.getLogger(__name__)

SQLITE_TIMEOUT_SECONDS = 30
MAX_RETRIES = 3
RETRY_BACKOFF = 0.5  # seconds, doubled each attempt


def connect_db(db_path: str) -> sqlite3.Connection:
    """Create a short-lived SQLite connection with retry logic."""
    last_exception = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            connection = sqlite3.connect(
                db_path,
                timeout=SQLITE_TIMEOUT_SECONDS,
                check_same_thread=False,
                uri=str(db_path).startswith("file:"),
            )
            connection.execute(f"PRAGMA busy_timeout = {SQLITE_TIMEOUT_SECONDS * 1000}")
            return connection
        except sqlite3.Error as e:
            last_exception = e
            if attempt < MAX_RETRIES:
                delay = RETRY_BACKOFF * (2 ** (attempt - 1))
                logger.warning(
                    "DB connection attempt %d/%d failed: %s. Retrying in %.1fs...",
                    attempt,
                    MAX_RETRIES,
                    e,
                    delay,
                )
                time.sleep(delay)
    logger.error("DB connection failed after %d attempts: %s", MAX_RETRIES, last_exception)
    raise last_exception
