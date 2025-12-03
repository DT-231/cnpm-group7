"""Custom exception classes used across the application."""


class AuthenticationError(Exception):
    """Raised when authentication fails."""


class GeminiAPIError(Exception):
    """Raised when the Gemini AI service returns an error or is unavailable."""


class SpeechRecognitionError(Exception):
    """Raised when speech recognition fails for the provided audio input."""
