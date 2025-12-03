"""Schemas for practice/pronunciation feature."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class SentenceSimpleResponse(BaseModel):
    """Simple response schema for listing sentences - chỉ trả về id, câu và nghĩa."""

    sentence_id: int = Field(..., description="Unique identifier for the sentence")
    sentence_text: str = Field(..., description="The English sentence to practice")
    vietnamese_translation: Optional[str] = Field(
        None, description="Vietnamese translation"
    )

    model_config = {"from_attributes": True}


class SentenceResponse(BaseModel):
    """Response schema for a practice sentence."""

    sentence_id: int = Field(..., description="Unique identifier for the sentence")
    sentence_text: str = Field(..., description="The English sentence to practice")
    phonetic_transcription: Optional[str] = Field(
        None, description="IPA phonetic transcription"
    )
    vietnamese_translation: Optional[str] = Field(
        None, description="Vietnamese translation"
    )
    audio_url: Optional[str] = Field(None, description="URL to audio pronunciation")
    difficulty: str = Field(..., description="Difficulty level: beginner, intermediate, advanced")
    topic: Optional[str] = Field(None, description="Topic category")
    created_at: datetime = Field(..., description="Timestamp when sentence was created")

    model_config = {"from_attributes": True}


class EvaluationRequest(BaseModel):
    """Request schema for pronunciation evaluation."""

    sentence_id: int = Field(..., description="ID of the sentence being practiced")
    audio_data: str = Field(
        ..., description="Base64-encoded audio data (with or without data URL prefix)"
    )


class ScoreBreakdown(BaseModel):
    """Detailed score breakdown."""

    phoneme_accuracy: float = Field(..., ge=0, le=10, description="Phoneme accuracy score (0-10)")
    word_stress: float = Field(..., ge=0, le=10, description="Word stress score (0-10)")
    intonation: float = Field(..., ge=0, le=10, description="Intonation score (0-10)")
    fluency: float = Field(..., ge=0, le=10, description="Fluency score (0-10)")
    clarity: float = Field(..., ge=0, le=10, description="Clarity score (0-10)")


class WordComparison(BaseModel):
    """Comparison of target word vs student pronunciation."""

    word: str = Field(..., description="Target word")
    student_said: str = Field(..., description="What student actually said")
    status: str = Field(..., description="correct | partially_correct | incorrect | missing")
    phonetic_issue: Optional[str] = Field(None, description="Specific phoneme problem")


class ImprovementSuggestion(BaseModel):
    """Specific improvement suggestion."""

    issue: str = Field(..., description="Problem description in Vietnamese")
    example: str = Field(..., description="Specific word or sound")
    phonetic: Optional[str] = Field(None, description="IPA notation")
    tip: str = Field(..., description="Practical advice in Vietnamese")


class FocusPhoneme(BaseModel):
    """Phoneme to focus on practicing."""

    phoneme: str = Field(..., description="IPA symbol")
    description: str = Field(..., description="Vietnamese description")
    practice_words: list[str] = Field(..., description="Words to practice this phoneme")


class EvaluationResponse(BaseModel):
    """Response schema for pronunciation evaluation result."""

    attempt_id: int = Field(..., description="ID of this practice attempt")
    sentence_id: int = Field(..., description="ID of the practiced sentence")
    target_sentence: str = Field(..., description="The original sentence")
    transcription: str = Field(..., description="What the student said")
    
    overall_score: float = Field(..., ge=0, le=10, description="Overall score (0-10)")
    score_label: str = Field(..., description="Score label in Vietnamese")
    
    breakdown: ScoreBreakdown = Field(..., description="Detailed score breakdown")
    transcription_comparison: list[WordComparison] = Field(..., description="Word-by-word comparison")
    
    strengths: list[str] = Field(..., description="Positive feedback points in Vietnamese")
    improvements: list[ImprovementSuggestion] = Field(..., description="Areas to improve")
    suggestions: list[str] = Field(..., description="General improvement suggestions")
    focus_phonemes: list[FocusPhoneme] = Field(..., description="Phonemes to focus on")
    encouragement: str = Field(..., description="Motivational message in Vietnamese")
    
    practiced_at: datetime = Field(..., description="Timestamp of this attempt")


class PronunciationScore(BaseModel):
    """Detailed pronunciation scores (legacy - for backward compatibility)."""

    accuracy_score: float = Field(..., ge=0, le=100, description="Overall accuracy score")
    fluency_score: float = Field(..., ge=0, le=100, description="Fluency score")
    completeness_score: float = Field(..., ge=0, le=100, description="Completeness score")
    prosody_score: Optional[float] = Field(None, ge=0, le=100, description="Prosody score")


class AttemptHistoryResponse(BaseModel):
    """Response schema for a single practice attempt in history."""

    attempt_id: int = Field(..., description="Unique attempt identifier")
    sentence_id: int = Field(..., description="ID of practiced sentence")
    sentence_text: str = Field(..., description="The sentence that was practiced")
    overall_score: float = Field(..., ge=0, le=100, description="Overall score achieved")
    accuracy_score: float = Field(..., ge=0, le=100, description="Accuracy score")
    fluency_score: float = Field(..., ge=0, le=100, description="Fluency score")
    completeness_score: float = Field(..., ge=0, le=100, description="Completeness score")
    feedback: str = Field(..., description="Feedback provided")
    practiced_at: datetime = Field(..., description="When this attempt was made")

    model_config = {"from_attributes": True}


class TopicResponse(BaseModel):
    """Response schema for available topics."""

    topics: list[str] = Field(..., description="List of available practice topics")


__all__ = [
    "SentenceResponse",
    "SentenceSimpleResponse",
    "EvaluationRequest",
    "EvaluationResponse",
    "AttemptHistoryResponse",
    "PronunciationScore",
    "TopicResponse",
    "ScoreBreakdown",
    "WordComparison",
    "ImprovementSuggestion",
    "FocusPhoneme",
]
