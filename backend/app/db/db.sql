-- =====================================================
-- DATABASE: ai_english_learning_simple
-- Chức năng: Đăng nhập + FR-03
-- =====================================================

-- Bảng 1: Users - Quản lý người dùng
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 2: Practice Sentences - Câu luyện tập
CREATE TABLE practice_sentences (
    sentence_id INT PRIMARY KEY AUTO_INCREMENT,
    sentence_text TEXT NOT NULL,
    phonetic_transcription TEXT, -- Phiên âm IPA
    vietnamese_translation TEXT,
    audio_url VARCHAR(255), -- URL audio mẫu
    difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    topic VARCHAR(100), -- Chủ đề: "Greetings", "Daily Life", etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_difficulty (difficulty),
    INDEX idx_topic (topic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 3: Practice Attempts - Lịch sử luyện tập
CREATE TABLE practice_attempts (
    attempt_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    sentence_id INT NOT NULL,
    
    -- Audio & Transcription
    audio_file_path VARCHAR(255), -- Đường dẫn file audio đã ghi
    audio_duration DECIMAL(5, 2), -- Thời lượng (giây)
    target_sentence TEXT NOT NULL, -- Câu mẫu
    transcription TEXT, -- Câu học viên nói (từ speech-to-text)
    
    -- Scores
    overall_score DECIMAL(3, 1) NOT NULL, -- Điểm tổng (0-10)
    phoneme_accuracy DECIMAL(3, 1), -- Độ chính xác phát âm
    word_stress DECIMAL(3, 1), -- Trọng âm từ
    intonation DECIMAL(3, 1), -- Ngữ điệu
    fluency DECIMAL(3, 1), -- Độ trôi chảy
    clarity DECIMAL(3, 1), -- Độ rõ ràng
    
    -- AI Feedback (JSON format)
    ai_feedback JSON, -- Toàn bộ feedback từ Gemini
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (sentence_id) REFERENCES practice_sentences(sentence_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_sentence_id (sentence_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;