"""PracticeAttempt model mapped to the ``practice_attempts`` table."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import JSON, DECIMAL, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base


class PracticeAttempt(Base):
    """Practice attempt history model (``practice_attempts`` table)."""

    __tablename__ = "practice_attempts"

    attempt_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False
    )
    sentence_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("practice_sentences.sentence_id", ondelete="CASCADE"),
        nullable=False,
    )

    # Audio & Transcription
    audio_file_path: Mapped[Optional[str]] = mapped_column(String(255))
    audio_duration: Mapped[Optional[float]] = mapped_column(DECIMAL(5, 2))
    target_sentence: Mapped[str] = mapped_column(Text, nullable=False)
    transcription: Mapped[Optional[str]] = mapped_column(Text)

    # Scores
    overall_score: Mapped[float] = mapped_column(DECIMAL(3, 1), nullable=False)
    phoneme_accuracy: Mapped[Optional[float]] = mapped_column(DECIMAL(3, 1))
    word_stress: Mapped[Optional[float]] = mapped_column(DECIMAL(3, 1))
    intonation: Mapped[Optional[float]] = mapped_column(DECIMAL(3, 1))
    fluency: Mapped[Optional[float]] = mapped_column(DECIMAL(3, 1))
    clarity: Mapped[Optional[float]] = mapped_column(DECIMAL(3, 1))

    # AI Feedback (JSON format)
    ai_feedback: Mapped[Optional[dict]] = mapped_column(JSON)

    # Metadata
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )

    # Relationships
    user = relationship("User", back_populates="attempts")
    sentence = relationship("PracticeSentence", back_populates="attempts")


__all__ = ["PracticeAttempt"]
