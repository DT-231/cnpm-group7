"""Backward-compatibility shims for legacy imports.

Prefer using `app.db.session` and `app.db.base` in new code.
"""

from collections.abc import Generator

from sqlalchemy.orm import Session

from app.db.base import Base
from app.db.session import SessionLocal, engine

__all__ = ["Base", "SessionLocal", "engine", "get_db"]


def get_db() -> Generator[Session, None, None]:
    """Yield a database session and ensure it is closed afterwards.

    This mirrors the previous `get_db` dependency but delegates to the new
    `SessionLocal` from `app.db.session`.
    """

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
