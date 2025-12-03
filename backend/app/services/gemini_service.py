"""Service for Gemini AI pronunciation evaluation."""

import json
import logging
from pathlib import Path
from typing import Optional, Dict, Any
import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Service for evaluating pronunciation using Google Gemini AI."""

    def __init__(self):
        """Initialize Gemini service with API key from settings."""
        if not settings.GEMINI_API_KEY:
            raise ValueError(
                "GEMINI_API_KEY is not configured. "
                "Please add it to your .env file. "
                "Get your API key from: https://aistudio.google.com/app/apikey"
            )
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Use Gemini 2.5 Flash - fastest and most capable for audio
        self.model = genai.GenerativeModel('models/gemini-2.5-flash')

    def get_phonetic_transcription(self, text: str) -> str:
        """Get phonetic transcription for a sentence.
        
        Args:
            text: English sentence to get phonetic transcription for
            
        Returns:
            IPA phonetic transcription
        """
        # Simplified - in production you might want to use a dedicated library
        # or API for accurate IPA transcription
        prompt = f"Provide the IPA (International Phonetic Alphabet) transcription for: \"{text}\""
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error getting phonetic transcription: {e}")
            return "[IPA not available]"

    def create_pronunciation_prompt(
        self, 
        target_sentence: str, 
        transcription: str,
        audio_metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Create a detailed prompt for pronunciation evaluation.
        
        Args:
            target_sentence: The correct sentence to compare against
            transcription: What the student actually said (from speech recognition)
            audio_metadata: Optional metadata about the audio (duration, clarity, etc.)
            
        Returns:
            Formatted prompt string for Gemini
        """
        if audio_metadata is None:
            audio_metadata = {}

        phonetic = self.get_phonetic_transcription(target_sentence)
        
        prompt = f"""Evaluate this English pronunciation attempt by a Vietnamese student.

TARGET SENTENCE (what they should say):
"{target_sentence}"

PHONETIC TRANSCRIPTION OF TARGET:
{phonetic}

STUDENT'S ACTUAL PRONUNCIATION (from speech recognition):
"{transcription}"

AUDIO METADATA:
- Duration: {audio_metadata.get('duration', 'unknown')} seconds
- Clarity: {audio_metadata.get('clarity', 'normal')}
- Background noise: {audio_metadata.get('noise', 'low')}

TASK:
1. Compare the student's pronunciation with the target sentence
2. Identify mispronounced words and phonemes
3. Calculate an overall pronunciation score (0-10)
4. Provide detailed feedback in Vietnamese
5. Suggest specific improvement areas

RESPONSE FORMAT (JSON):
{{
  "overall_score": <number 0-10, one decimal place>,
  "score_label": "<string: 'Xuất sắc' | 'Tốt' | 'Khá' | 'Cần cải thiện'>",
  "breakdown": {{
    "phoneme_accuracy": <number 0-10>,
    "word_stress": <number 0-10>,
    "intonation": <number 0-10>,
    "fluency": <number 0-10>,
    "clarity": <number 0-10>
  }},
  "transcription_comparison": [
    {{
      "word": "<target word>",
      "student_said": "<what student said>",
      "status": "correct" | "partially_correct" | "incorrect" | "missing",
      "phonetic_issue": "<specific phoneme problem, if any>"
    }}
  ],
  "strengths": [
    "<positive feedback point 1 in Vietnamese>",
    "<positive feedback point 2 in Vietnamese>",
    "<positive feedback point 3 in Vietnamese>"
  ],
  "improvements": [
    {{
      "issue": "<problem description in Vietnamese>",
      "example": "<specific word or sound>",
      "phonetic": "<IPA notation if applicable>",
      "tip": "<practical advice in Vietnamese>"
    }}
  ],
  "suggestions": [
    "<general improvement suggestion 1 in Vietnamese>",
    "<general improvement suggestion 2 in Vietnamese>",
    "<general improvement suggestion 3 in Vietnamese>"
  ],
  "focus_phonemes": [
    {{
      "phoneme": "<IPA symbol>",
      "description": "<Vietnamese description>",
      "practice_words": ["<word1>", "<word2>", "<word3>"]
    }}
  ],
  "encouragement": "<motivational message in Vietnamese>"
}}

Important:
- Be specific about which sounds were mispronounced
- All Vietnamese text should be natural and encouraging
- Score should reflect actual performance but be slightly generous to maintain motivation
- Identify 1-3 key areas to focus on (don't overwhelm the student)
- Provide actionable tips, not just identification of problems
- Response MUST be valid JSON only, no additional text"""

        return prompt

    def evaluate_pronunciation_with_audio(
        self,
        target_sentence: str,
        audio_file_path: str
    ) -> Dict[str, Any]:
        """Evaluate pronunciation directly from audio file using Gemini.
        
        Args:
            target_sentence: The correct sentence to compare against
            audio_file_path: Path to the audio file
            
        Returns:
            Dictionary containing scores and feedback
            
        Raises:
            Exception: If evaluation fails
        """
        system_prompt = """You are an expert English pronunciation teacher and speech evaluator with 20 years of experience teaching Vietnamese students.

Your role:
- Listen to the audio and evaluate English pronunciation accuracy
- Compare student's pronunciation with the target sentence
- Provide constructive, encouraging feedback in Vietnamese
- Score pronunciation on a scale of 0-10
- Identify specific phonemes and words that need improvement
- Suggest practical tips for improvement

Evaluation criteria:
1. Phoneme accuracy (40%): How accurately individual sounds are pronounced
2. Word stress (20%): Correct emphasis on syllables
3. Intonation (20%): Natural rise and fall of voice
4. Fluency (10%): Smooth delivery without excessive pauses
5. Clarity (10%): Overall understandability

Be encouraging but honest. Vietnamese learners commonly struggle with:
- /θ/ and /ð/ sounds (th)
- /r/ and /l/ distinction
- Final consonants (t, d, k, g, p, b)
- Word stress patterns
- Consonant clusters

Always respond in JSON format as specified."""

        evaluation_prompt = f"""Listen to the audio recording and evaluate this English pronunciation attempt by a Vietnamese student.

TARGET SENTENCE (what they should say):
"{target_sentence}"

TASK:
1. Listen to the audio and transcribe what the student actually said
2. Compare the student's pronunciation with the target sentence
3. Identify mispronounced words and phonemes
4. Calculate an overall pronunciation score (0-10)
5. Provide detailed feedback in Vietnamese
6. Suggest specific improvement areas

RESPONSE FORMAT (JSON):
{{
  "overall_score": <number 0-10, one decimal place>,
  "score_label": "<string: 'Xuất sắc' | 'Tốt' | 'Khá' | 'Cần cải thiện'>",
  "transcription": "<what the student actually said>",
  "breakdown": {{
    "phoneme_accuracy": <number 0-10>,
    "word_stress": <number 0-10>,
    "intonation": <number 0-10>,
    "fluency": <number 0-10>,
    "clarity": <number 0-10>
  }},
  "transcription_comparison": [
    {{
      "word": "<target word>",
      "student_said": "<what student said>",
      "status": "correct" | "partially_correct" | "incorrect" | "missing",
      "phonetic_issue": "<specific phoneme problem, if any>"
    }}
  ],
  "strengths": [
    "<positive feedback point 1 in Vietnamese>",
    "<positive feedback point 2 in Vietnamese>",
    "<positive feedback point 3 in Vietnamese>"
  ],
  "improvements": [
    {{
      "issue": "<problem description in Vietnamese>",
      "example": "<specific word or sound>",
      "phonetic": "<IPA notation if applicable>",
      "tip": "<practical advice in Vietnamese>"
    }}
  ],
  "suggestions": [
    "<general improvement suggestion 1 in Vietnamese>",
    "<general improvement suggestion 2 in Vietnamese>",
    "<general improvement suggestion 3 in Vietnamese>"
  ],
  "focus_phonemes": [
    {{
      "phoneme": "<IPA symbol>",
      "description": "<Vietnamese description>",
      "practice_words": ["<word1>", "<word2>", "<word3>"]
    }}
  ],
  "encouragement": "<motivational message in Vietnamese>"
}}

Important:
- Listen carefully to the pronunciation in the audio
- Be specific about which sounds were mispronounced
- All Vietnamese text should be natural and encouraging
- Score should reflect actual performance but be slightly generous to maintain motivation
- Identify 1-3 key areas to focus on (don't overwhelm the student)
- Provide actionable tips, not just identification of problems
- Response MUST be valid JSON only, no additional text"""

        try:
            # Upload audio file to Gemini
            audio_file = genai.upload_file(path=audio_file_path)
            logger.info(f"Uploaded audio file: {audio_file.uri}")
            
            # Generate content with audio and prompt
            response = self.model.generate_content([
                system_prompt,
                evaluation_prompt,
                audio_file
            ])
            
            response_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            # Parse JSON response
            evaluation_result = json.loads(response_text)
            
            # Clean up uploaded file
            try:
                genai.delete_file(audio_file.name)
                logger.info(f"Deleted uploaded audio file from Gemini")
            except Exception as e:
                logger.warning(f"Could not delete uploaded file: {e}")
            
            logger.info(f"Successfully evaluated pronunciation for: {target_sentence}")
            return evaluation_result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini response as JSON: {e}")
            logger.error(f"Response text: {response_text}")
            raise Exception(f"Invalid JSON response from AI: {e}")
        except Exception as e:
            logger.error(f"Error evaluating pronunciation: {e}")
            raise Exception(f"Pronunciation evaluation failed: {e}")


__all__ = ["GeminiService"]
