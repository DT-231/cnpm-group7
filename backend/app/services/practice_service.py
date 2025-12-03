"""Service layer for practice/pronunciation feature."""

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.db.models_practice_sentence import PracticeSentence
from app.db.models_practice_attempt import PracticeAttempt


class PracticeService:
    """Service for managing practice sentences and attempts."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def get_sentence_by_id(self, sentence_id: int) -> Optional[PracticeSentence]:
        """Lấy câu luyện tập theo ID.
        
        Args:
            sentence_id: ID của câu cần lấy
            
        Returns:
            PracticeSentence object hoặc None nếu không tìm thấy
        """
        sentence = (
            self.db.query(PracticeSentence)
            .filter(PracticeSentence.sentence_id == sentence_id)
            .first()
        )
        return sentence

    def get_random_sentence(self, difficulty: Optional[str] = None) -> Optional[PracticeSentence]:
        """Lấy câu ngẫu nhiên, có thể lọc theo độ khó.
        
        Args:
            difficulty: Độ khó (beginner, intermediate, advanced) - optional
            
        Returns:
            PracticeSentence object ngẫu nhiên
        """
        query = self.db.query(PracticeSentence)
        
        if difficulty:
            query = query.filter(PracticeSentence.difficulty == difficulty)
        
        # Random order và lấy 1 câu
        sentence = query.order_by(func.random()).first()
        return sentence

    def get_random_sentence_by_topic(
        self, topic: str, difficulty: Optional[str] = None
    ) -> Optional[PracticeSentence]:
        """Lấy câu ngẫu nhiên theo chủ đề và độ khó.
        
        Args:
            topic: Chủ đề cần lọc
            difficulty: Độ khó (optional)
            
        Returns:
            PracticeSentence object ngẫu nhiên theo topic
        """
        query = self.db.query(PracticeSentence).filter(PracticeSentence.topic == topic)
        
        if difficulty:
            query = query.filter(PracticeSentence.difficulty == difficulty)
        
        sentence = query.order_by(func.random()).first()
        return sentence

    def get_all_topics(self) -> list[str]:
        """Lấy danh sách tất cả các topics có trong database.
        
        Returns:
            List các topic strings (loại bỏ duplicates và None)
        """
        topics = (
            self.db.query(PracticeSentence.topic)
            .filter(PracticeSentence.topic.isnot(None))
            .distinct()
            .all()
        )
        # Convert từ list of tuples sang list of strings
        return [topic[0] for topic in topics if topic[0]]

    def save_attempt(
        self,
        user_id: int,
        sentence_id: int,
        target_sentence: str,
        overall_score: float,
        phoneme_accuracy: Optional[float] = None,
        word_stress: Optional[float] = None,
        intonation: Optional[float] = None,
        fluency: Optional[float] = None,
        clarity: Optional[float] = None,
        audio_file_path: Optional[str] = None,
        audio_duration: Optional[float] = None,
        transcription: Optional[str] = None,
        ai_feedback: Optional[dict] = None,
    ) -> PracticeAttempt:
        """Lưu kết quả luyện tập của user.
        
        Args:
            user_id: ID của user
            sentence_id: ID của câu đã luyện
            target_sentence: Câu mục tiêu
            overall_score: Điểm tổng
            phoneme_accuracy: Độ chính xác phát âm
            word_stress: Điểm nhấn từ
            intonation: Ngữ điệu
            fluency: Độ trôi chảy
            clarity: Độ rõ ràng
            audio_file_path: Đường dẫn file audio
            audio_duration: Thời lượng audio
            transcription: Phiên âm
            ai_feedback: Feedback từ AI (JSON)
            
        Returns:
            PracticeAttempt object đã được lưu
        """
        attempt = PracticeAttempt(
            user_id=user_id,
            sentence_id=sentence_id,
            target_sentence=target_sentence,
            overall_score=overall_score,
            phoneme_accuracy=phoneme_accuracy,
            word_stress=word_stress,
            intonation=intonation,
            fluency=fluency,
            clarity=clarity,
            audio_file_path=audio_file_path,
            audio_duration=audio_duration,
            transcription=transcription,
            ai_feedback=ai_feedback,
        )
        
        self.db.add(attempt)
        self.db.commit()
        self.db.refresh(attempt)
        
        return attempt

    def get_user_history(self, user_id: int, limit: int = 10) -> list[PracticeAttempt]:
        """Lấy lịch sử luyện tập của user.
        
        Args:
            user_id: ID của user
            limit: Số lượng attempts tối đa (mặc định 10)
            
        Returns:
            List các PracticeAttempt, sắp xếp theo thời gian mới nhất
        """
        attempts = (
            self.db.query(PracticeAttempt)
            .filter(PracticeAttempt.user_id == user_id)
            .order_by(PracticeAttempt.created_at.desc())
            .limit(limit)
            .all()
        )
        return attempts

    def get_all_sentences(self) -> list[PracticeSentence]:
        """Lấy tất cả các câu luyện tập.
        
        Returns:
            List tất cả PracticeSentence
        """
        sentences = self.db.query(PracticeSentence).all()
        return sentences
