"""Practice endpoints for pronunciation practice feature."""

import logging
from typing import Optional
import requests
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.schemas.common import ResponseModel
from app.schemas.practice import (
    EvaluationRequest,
    EvaluationResponse,
    SentenceResponse,
    SentenceSimpleResponse,
    ScoreBreakdown,
    WordComparison,
    ImprovementSuggestion,
    FocusPhoneme,
    TopicResponse,
)
from app.services.practice_service import PracticeService
from app.services.audio_service import AudioService
from app.services.gemini_service import GeminiService
from app.db.models_user import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/practice")


@router.get("/sentences/{sentence_id}", response_model=ResponseModel[SentenceResponse])
async def get_sentence_by_id(
    sentence_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lấy câu luyện tập theo ID.
    
    Args:
        sentence_id: ID của câu cần lấy
        
    Returns:
        ResponseModel chứa thông tin câu luyện tập
    """
    service = PracticeService(db)
    sentence = service.get_sentence_by_id(sentence_id)
    
    if not sentence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy câu với ID {sentence_id}",
        )
    
    return ResponseModel(
        success=True,
        message="Lấy câu luyện tập thành công",
        data=SentenceResponse.model_validate(sentence),
    )


@router.get("/sentences/random/any", response_model=ResponseModel[SentenceResponse])
async def get_random_sentence(
    difficulty: Optional[str] = Query(
        None, 
        description="Độ khó: beginner, intermediate, advanced"
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lấy câu ngẫu nhiên, có thể lọc theo độ khó.
    
    Args:
        difficulty: Độ khó (optional) - beginner, intermediate, advanced
        
    Returns:
        ResponseModel chứa câu ngẫu nhiên
    """
    service = PracticeService(db)
    sentence = service.get_random_sentence(difficulty)
    
    if not sentence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy câu phù hợp",
        )
    
    return ResponseModel(
        success=True,
        message="Lấy câu ngẫu nhiên thành công",
        data=SentenceResponse.model_validate(sentence),
    )


@router.get("/sentences/random/topic", response_model=ResponseModel[SentenceResponse])
async def get_random_sentence_by_topic(
    topic: str = Query(..., description="Chủ đề cần lọc"),
    difficulty: Optional[str] = Query(
        None,
        description="Độ khó: beginner, intermediate, advanced"
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lấy câu ngẫu nhiên theo chủ đề và độ khó.
    
    Args:
        topic: Chủ đề (required)
        difficulty: Độ khó (optional)
        
    Returns:
        ResponseModel chứa câu ngẫu nhiên theo topic
    """
    service = PracticeService(db)
    sentence = service.get_random_sentence_by_topic(topic, difficulty)
    
    if not sentence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy câu với topic '{topic}'",
        )
    
    return ResponseModel(
        success=True,
        message=f"Lấy câu ngẫu nhiên theo topic '{topic}' thành công",
        data=SentenceResponse.model_validate(sentence),
    )


@router.get("/topics", response_model=ResponseModel[list[str]])
async def get_all_topics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lấy danh sách tất cả các topics có sẵn.
    
    Returns:
        ResponseModel chứa list các topics
    """
    service = PracticeService(db)
    topics = service.get_all_topics()
    
    return ResponseModel(
        success=True,
        message="Lấy danh sách topics thành công",
        data=topics,
    )


@router.get("", response_model=ResponseModel[list[SentenceSimpleResponse]])
async def list_all_sentences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lấy danh sách tất cả các câu luyện tập.
    Chỉ trả về: sentence_id, sentence_text, vietnamese_translation
    
    Returns:
        ResponseModel chứa list tất cả các câu (dạng rút gọn)
    """
    service = PracticeService(db)
    sentences = service.get_all_sentences()
    
    sentence_responses = [
        SentenceSimpleResponse.model_validate(sentence) for sentence in sentences
    ]
    
    return ResponseModel(
        success=True,
        message=f"Lấy danh sách {len(sentences)} câu luyện tập thành công",
        data=sentence_responses,
    )


@router.get("/audio/{file_id}")
async def proxy_drive_audio(
    file_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
):
    """Proxy audio từ Google Drive để hỗ trợ streaming và seeking.
    
    Frontend gửi file_id từ trường audio_url về, 
    backend sẽ stream audio từ Google Drive về client.
    
    Args:
        file_id: Google Drive file ID từ audio_url
        
    Returns:
        StreamingResponse với audio data
    """
    DRIVE_BASE = "https://docs.google.com/uc?export=download"
    drive_url = f"{DRIVE_BASE}&id={file_id}"
    
    # Forward Range header if client sent it (supports seeking)
    headers = {}
    range_hdr = request.headers.get("range")
    if range_hdr:
        headers["Range"] = range_hdr
    
    try:
        # Follow redirects (Google trả redirect → drive.usercontent...) and stream
        resp = requests.get(
            drive_url, 
            headers=headers, 
            stream=True, 
            allow_redirects=True, 
            timeout=30
        )
        
        if resp.status_code not in (200, 206):
            raise HTTPException(
                status_code=resp.status_code,
                detail=f"Không thể tải audio từ Google Drive (status {resp.status_code})"
            )
        
        def iter_stream():
            """Generator để stream audio chunks."""
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    yield chunk
        
        # Copy response headers từ Google Drive
        response_headers = {}
        for h in ("Content-Type", "Content-Length", "Content-Range", "Accept-Ranges"):
            v = resp.headers.get(h)
            if v:
                response_headers[h] = v
        
        return StreamingResponse(
            iter_stream(),
            status_code=resp.status_code,
            headers=response_headers,
            media_type=resp.headers.get("Content-Type", "audio/mpeg")
        )
    
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Lỗi khi tải audio: {str(e)}"
        )


@router.post("/evaluate", response_model=ResponseModel[EvaluationResponse])
async def evaluate_pronunciation(
    request: EvaluationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Chấm điểm phát âm của học sinh.
    
    Flow:
    1. Nhận audio (base64) và sentence_id từ frontend
    2. Lưu audio file và lấy thông tin audio
    3. Chuyển audio thành text (speech-to-text)
    4. Gửi cho Gemini AI để đánh giá và chấm điểm
    5. Lưu kết quả vào database
    6. Trả về feedback chi tiết
    
    Args:
        request: EvaluationRequest chứa sentence_id và audio_data (base64)
        
    Returns:
        ResponseModel chứa kết quả đánh giá chi tiết
    """
    try:
        # 1. Get the target sentence from database
        practice_service = PracticeService(db)
        sentence = practice_service.get_sentence_by_id(request.sentence_id)
        
        if not sentence:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy câu với ID {request.sentence_id}"
            )
        
        target_sentence = sentence.sentence_text
        
        # 2. Save audio file
        audio_service = AudioService()
        try:
            audio_file_path, audio_duration = audio_service.save_audio_file(
                request.audio_data,
                current_user.user_id,
                request.sentence_id
            )
        except Exception as e:
            logger.error(f"Error saving audio: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lỗi khi lưu file âm thanh: {str(e)}"
            )
        
        # 3. Get audio metadata
        audio_metadata = audio_service.get_audio_metadata(audio_file_path)
        
        # 4. Evaluate pronunciation using Gemini AI (directly with audio file)
        gemini_service = GeminiService()
        try:
            evaluation_result = gemini_service.evaluate_pronunciation_with_audio(
                target_sentence=target_sentence,
                audio_file_path=audio_file_path
            )
        except Exception as e:
            logger.error(f"Error evaluating pronunciation: {e}")
            audio_service.cleanup_audio_file(audio_file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Lỗi khi đánh giá phát âm: {str(e)}"
            )
        
        # 5. Save attempt to database
        try:
            # Get transcription from evaluation result
            transcription = evaluation_result.get("transcription", "")
            
            attempt = practice_service.save_attempt(
                user_id=current_user.user_id,
                sentence_id=request.sentence_id,
                target_sentence=target_sentence,
                overall_score=evaluation_result.get("overall_score", 0),
                phoneme_accuracy=evaluation_result.get("breakdown", {}).get("phoneme_accuracy"),
                word_stress=evaluation_result.get("breakdown", {}).get("word_stress"),
                intonation=evaluation_result.get("breakdown", {}).get("intonation"),
                fluency=evaluation_result.get("breakdown", {}).get("fluency"),
                clarity=evaluation_result.get("breakdown", {}).get("clarity"),
                audio_file_path=audio_file_path,
                audio_duration=audio_duration,
                transcription=transcription,
                ai_feedback=evaluation_result
            )
        except Exception as e:
            logger.error(f"Error saving attempt: {e}")
            audio_service.cleanup_audio_file(audio_file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Lỗi khi lưu kết quả: {str(e)}"
            )
        
        # 6. Prepare response
        response_data = EvaluationResponse(
            attempt_id=attempt.attempt_id,
            sentence_id=request.sentence_id,
            target_sentence=target_sentence,
            transcription=evaluation_result.get("transcription", ""),
            overall_score=evaluation_result.get("overall_score", 0),
            score_label=evaluation_result.get("score_label", ""),
            breakdown=ScoreBreakdown(**evaluation_result.get("breakdown", {})),
            transcription_comparison=[
                WordComparison(**comp) 
                for comp in evaluation_result.get("transcription_comparison", [])
            ],
            strengths=evaluation_result.get("strengths", []),
            improvements=[
                ImprovementSuggestion(**imp) 
                for imp in evaluation_result.get("improvements", [])
            ],
            suggestions=evaluation_result.get("suggestions", []),
            focus_phonemes=[
                FocusPhoneme(**phoneme) 
                for phoneme in evaluation_result.get("focus_phonemes", [])
            ],
            encouragement=evaluation_result.get("encouragement", ""),
            practiced_at=attempt.created_at
        )
        
        return ResponseModel(
            success=True,
            message="Đánh giá phát âm thành công",
            data=response_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in evaluate_pronunciation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi không xác định: {str(e)}"
        )
