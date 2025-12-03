"""PracticeSentence model mapped to the ``practice_sentences`` table."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:  # pragma: no cover
    from app.db.models_practice_attempt import PracticeAttempt


class PracticeSentence(Base):
    """Practice sentence model (``practice_sentences`` table)."""

    __tablename__ = "practice_sentences"

    sentence_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sentence_text: Mapped[str] = mapped_column(Text, nullable=False)
    phonetic_transcription: Mapped[Optional[str]] = mapped_column(Text)
    vietnamese_translation: Mapped[Optional[str]] = mapped_column(Text)
    audio_url: Mapped[Optional[str]] = mapped_column(String(255))
    difficulty: Mapped[str] = mapped_column(
        Enum("beginner", "intermediate", "advanced", name="difficulty_enum"),
        default="beginner",
    )
    topic: Mapped[Optional[str]] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    attempts: Mapped[List["PracticeAttempt"]] = relationship(
        back_populates="sentence", cascade="all, delete-orphan"
    )


__all__ = ["PracticeSentence"]
