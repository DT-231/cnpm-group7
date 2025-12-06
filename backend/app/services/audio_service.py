"""Service for audio processing and speech recognition."""

import base64
import io
import logging
import os
import sys
import tempfile
from pathlib import Path
from typing import Optional, Tuple

# Check Python version and handle compatibility
PYTHON_VERSION = sys.version_info
if PYTHON_VERSION >= (3, 13):
    # Python 3.13+ removed aifc module
    # We'll use a workaround or alternative approach
    logger = logging.getLogger(__name__)
    logger.warning(
        "Python 3.13+ detected. Some audio features may have limited compatibility. "
        "Consider using Python 3.11 or 3.12 for full audio support."
    )

try:
    import speech_recognition as sr
    SPEECH_RECOGNITION_AVAILABLE = True
except ImportError as e:
    SPEECH_RECOGNITION_AVAILABLE = False
    logger = logging.getLogger(__name__)
    logger.error(f"speech_recognition not available: {e}")

try:
    from pydub import AudioSegment
    PYDUB_AVAILABLE = True
except ImportError:
    PYDUB_AVAILABLE = False
    logger = logging.getLogger(__name__)
    logger.error("pydub not available")

logger = logging.getLogger(__name__)


class AudioService:
    """Service for handling audio files and speech-to-text conversion."""

    def __init__(self):
        """Initialize audio service with speech recognizer."""
        if not SPEECH_RECOGNITION_AVAILABLE:
            logger.warning("Speech recognition not available. Using fallback mode.")
            self.recognizer = None
        else:
            self.recognizer = sr.Recognizer()
            # Adjust for ambient noise
            self.recognizer.energy_threshold = 4000
            self.recognizer.dynamic_energy_threshold = True

    def save_audio_file(self, audio_data: str, user_id: int, sentence_id: int) -> Tuple[str, float]:
        """Save base64 audio data to file.
        
        Args:
            audio_data: Base64-encoded audio data (with or without data URL prefix)
            user_id: ID of the user
            sentence_id: ID of the sentence being practiced
            
        Returns:
            Tuple of (file_path, duration_in_seconds)
            
        Raises:
            Exception: If audio processing fails
        """
        try:
            # Remove data URL prefix if present
            original_length = len(audio_data)
            if ',' in audio_data and audio_data.startswith('data:'):
                audio_data = audio_data.split(',', 1)[1]
                logger.info(f"Removed data URL prefix, length: {original_length} -> {len(audio_data)}")
            
            # Clean up base64 string - remove whitespace and fix padding
            audio_data = audio_data.strip().replace('\n', '').replace('\r', '').replace(' ', '')
            
            # Fix padding if needed
            padding = len(audio_data) % 4
            if padding:
                audio_data += '=' * (4 - padding)
                logger.info(f"Added padding: {4 - padding} characters")
            
            logger.info(f"Base64 string length: {len(audio_data)} characters")
            
            # Decode base64
            audio_bytes = base64.b64decode(audio_data)
            logger.info(f"Decoded audio size: {len(audio_bytes)} bytes ({len(audio_bytes) / 1024:.2f} KB)")
            
            # Create uploads directory if not exists
            upload_dir = Path("backend/audio")
            upload_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate filename
            import time
            filename = f"user_{user_id}_sentence_{sentence_id}_{int(time.time() * 1000)}.wav"
            file_path = upload_dir / filename
            
            if PYDUB_AVAILABLE:
                # Load audio using pydub to get duration and convert if needed
                audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
                duration = len(audio) / 1000.0  # Convert to seconds
                
                # Export as WAV for better compatibility
                audio.export(str(file_path), format="wav")
            else:
                # Fallback: save directly
                with open(file_path, 'wb') as f:
                    f.write(audio_bytes)
                duration = 0.0  # Unknown duration
            
            logger.info(f"Saved audio file: {file_path} (duration: {duration}s)")
            return str(file_path), duration
            
        except base64.binascii.Error as e:
            logger.error(f"Base64 decode error: {e}")
            logger.error(f"Audio data preview: {audio_data[:100]}...")
            raise Exception(
                f"Lỗi decode audio data. Đảm bảo frontend gửi đúng định dạng base64. "
                f"Chi tiết: {e}"
            )
        except Exception as e:
            logger.error(f"Error saving audio file: {e}")
            logger.error(f"Error type: {type(e).__name__}")
            raise Exception(f"Failed to save audio: {e}")

    def transcribe_audio(self, audio_file_path: str) -> str:
        """Convert speech to text using Google Speech Recognition.
        
        Args:
            audio_file_path: Path to the audio file
            
        Returns:
            Transcribed text
            
        Raises:
            Exception: If transcription fails
        """
        if not SPEECH_RECOGNITION_AVAILABLE or not self.recognizer:
            raise Exception(
                "Speech recognition không khả dụng. "
                "Vui lòng sử dụng Python 3.11 hoặc 3.12 để có đầy đủ tính năng audio. "
                "Hoặc cài đặt lại: pip install SpeechRecognition"
            )
        
        try:
            with sr.AudioFile(audio_file_path) as source:
                # Record the audio data
                audio_data = self.recognizer.record(source)
                
                # Use Google Speech Recognition
                text = self.recognizer.recognize_google(audio_data, language='en-US')
                
                logger.info(f"Transcribed audio: {text}")
                return text
                
        except sr.UnknownValueError:
            logger.warning("Could not understand audio")
            raise Exception("Không thể nhận diện được giọng nói. Vui lòng nói rõ hơn.")
        except sr.RequestError as e:
            logger.error(f"Speech recognition service error: {e}")
            raise Exception("Lỗi dịch vụ nhận diện giọng nói. Vui lòng thử lại.")
        except Exception as e:
            logger.error(f"Error transcribing audio: {e}")
            raise Exception(f"Lỗi khi chuyển đổi giọng nói sang văn bản: {e}")

    def get_audio_metadata(self, audio_file_path: str) -> dict:
        """Extract metadata from audio file.
        
        Args:
            audio_file_path: Path to the audio file
            
        Returns:
            Dictionary containing audio metadata
        """
        if not PYDUB_AVAILABLE:
            # Return basic metadata without pydub
            try:
                file_size = os.path.getsize(audio_file_path)
                return {
                    "duration": 0,  # Unknown without pydub
                    "file_size": file_size,
                    "clarity": "normal",
                    "noise": "low"
                }
            except Exception:
                return {
                    "duration": 0,
                    "clarity": "unknown",
                    "noise": "unknown"
                }
        
        try:
            audio = AudioSegment.from_file(audio_file_path)
            
            return {
                "duration": len(audio) / 1000.0,  # seconds
                "channels": audio.channels,
                "sample_width": audio.sample_width,
                "frame_rate": audio.frame_rate,
                "clarity": "normal",  # Simplified - could add analysis
                "noise": "low"  # Simplified - could add noise detection
            }
        except Exception as e:
            logger.error(f"Error getting audio metadata: {e}")
            return {
                "duration": 0,
                "clarity": "unknown",
                "noise": "unknown"
            }

    def cleanup_audio_file(self, file_path: str) -> None:
        """Delete audio file after processing if needed.
        
        Args:
            file_path: Path to the audio file to delete
        """
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted audio file: {file_path}")
        except Exception as e:
            logger.warning(f"Could not delete audio file {file_path}: {e}")


__all__ = ["AudioService"]
