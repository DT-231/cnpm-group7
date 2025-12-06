import React, { useRef, useState } from 'react';

const SentenceCard = ({ sentence, onRecordingComplete }) => {
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  if (!sentence) {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">Đang tải câu...</p>
        </div>
      </div>
    );
  }

  // Audio playback handler
  const handlePlayAudio = () => {
    if (!audioRef.current) {
      console.error('Audio ref not available');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      console.log('🎵 Attempting to play audio from:', audioRef.current.src);
      
      audioRef.current.play()
        .then(() => {
          console.log('✅ Audio playing successfully');
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('❌ Error playing audio:', error);
          console.error('Audio URL:', audioRef.current.src);
          // Chỉ hiển thị alert khi người dùng chủ động click play
          alert(`Không thể phát audio. Vui lòng thử lại sau.`);
        });
    }
  };

  // Recording handlers
  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processRecording(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Auto stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 30000);

      // Timer
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            clearInterval(timer);
            return 30;
          }
          return prev + 1;
        });
      }, 1000);

      // Store timer ID for cleanup
      mediaRecorder.timerId = timer;

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      clearInterval(mediaRecorderRef.current.timerId);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob) => {
    setIsProcessing(true);
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1]; // Remove data:audio/webm;base64, prefix
        
        // Call callback with recording data
        if (onRecordingComplete) {
          await onRecordingComplete({
            sentence_id: sentence.sentence_id,
            audio_data: base64Audio
          });
        }
        
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Error processing recording:', error);
      alert('Lỗi khi xử lý ghi âm. Vui lòng thử lại!');
      setIsProcessing(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-600/10 text-green-600',
      intermediate: 'bg-blue-600/10 text-blue-600',
      advanced: 'bg-red-600/10 text-red-600',
    };
    return colors[difficulty] || colors.intermediate;
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      beginner: 'Cơ bản',
      intermediate: 'Trung bình',
      advanced: 'Nâng cao',
    };
    return labels[difficulty] || 'Trung bình';
  };

  // Extract file_id from Google Drive URL or use file ID directly
  const getAudioUrl = () => {
    if (!sentence.audio_url) return null;
    
    const audioUrl = sentence.audio_url.trim();
    
    // Case 1: Already a full URL (starts with http/https or /)
    if (audioUrl.startsWith('http') || audioUrl.startsWith('/')) {
      return audioUrl;
    }
    
    // Case 2: Google Drive URL - extract file ID
    if (audioUrl.includes('drive.google.com') || audioUrl.includes('docs.google.com')) {
      const patterns = [
        /\/d\/([-\w]{25,})/,           // /d/FILE_ID
        /id=([-\w]{25,})/,              // id=FILE_ID
      ];
      
      for (const pattern of patterns) {
        const match = audioUrl.match(pattern);
        if (match && match[1]) {
          return `http://localhost:8000/api/v1/practice/audio/${match[1]}`;
        }
      }
    }
    
    // Case 3: Just the file ID (25+ characters, alphanumeric + underscore/hyphen)
    // Example: 1Yz_oTlQoYfO4jhDP3iPHyIb545XJpAMu
    if (/^[-\w]{25,}$/.test(audioUrl)) {
      console.log('✅ Detected raw file ID, creating proxy URL');
      return `http://localhost:8000/api/v1/practice/audio/${audioUrl}`;
    }
    
    console.warn('⚠️ Could not parse audio URL:', audioUrl);
    return null;
  };

  const audioUrl = getAudioUrl();

  // Fetch audio with authentication and create blob URL
  React.useEffect(() => {
    const fetchAudio = async () => {
      if (!audioUrl) {
        console.log('⚠️ No audio URL available');
        return;
      }

      setAudioLoading(true);
      console.log('🎵 Fetching audio from:', audioUrl);

      try {
        const token = localStorage.getItem('token');
        let authHeader = '';
        
        if (token) {
          try {
            const parsed = token.startsWith('{') ? JSON.parse(token) : token;
            const actualToken = typeof parsed === 'object' ? parsed.access_token : parsed;
            authHeader = `Bearer ${actualToken}`;
          } catch (e) {
            authHeader = `Bearer ${token}`;
          }
        }

        const response = await fetch(audioUrl, {
          headers: {
            'Authorization': authHeader
          }
        });

        console.log('📡 Response:', {
          status: response.status,
          contentType: response.headers.get('Content-Type'),
          contentLength: response.headers.get('Content-Length')
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        console.log('✅ Audio loaded successfully, blob URL created');
        setAudioBlobUrl(blobUrl);

      } catch (error) {
        console.error('❌ Error fetching audio:', error);
        setAudioBlobUrl(null);
      } finally {
        setAudioLoading(false);
      }
    };

    fetchAudio();

    // Cleanup
    return () => {
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }
    };
  }, [audioUrl]);

  // Debug: Log audio URL info
  React.useEffect(() => {
    console.log('=== Audio Debug ===');
    console.log('sentence.audio_url:', sentence.audio_url);
    console.log('processed audioUrl:', audioUrl);
    console.log('audioBlobUrl:', audioBlobUrl);
  }, [sentence.audio_url, audioUrl, audioBlobUrl]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Instruction Box */}
      <div className="flex items-center gap-4 bg-blue-100 dark:bg-blue-900/40 p-4 rounded-xl">
        <span className="material-symbols-outlined text-blue-600 text-2xl">mic</span>
        <div className="flex flex-col">
          <p className="text-blue-800 dark:text-blue-100 text-base font-semibold">Practice speaking clearly and naturally</p>
          <p className="text-blue-700 dark:text-blue-300 text-sm">Đọc to câu mẫu bên dưới. AI sẽ đánh giá phát âm của bạn.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-8 text-center flex flex-col gap-6">
        <div className="flex justify-between items-center text-sm">
          <p className="font-semibold text-slate-500">Câu #{sentence.sentence_id}</p>
          <span className={`${getDifficultyColor(sentence.difficulty)} px-3 py-1 rounded-full text-xs font-bold`}>
            {getDifficultyLabel(sentence.difficulty)}
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          {sentence.sentence_text}
        </h2>
        
        {sentence.phonetic_transcription && (
          <p className="text-lg text-purple-600 dark:text-purple-400 font-mono">
            {sentence.phonetic_transcription}
          </p>
        )}
        
        {sentence.vietnamese_translation && (
          <p className="text-base text-slate-500">{sentence.vietnamese_translation}</p>
        )}
        
        {/* Audio Section - Always show, but disabled if no audio */}
        <div className="flex flex-col items-center gap-2">
          {(audioBlobUrl || audioUrl) && (
            <audio
              ref={audioRef}
              src={audioBlobUrl || audioUrl}
              preload="metadata"
              onLoadStart={() => console.log('🎵 Audio loading started...')}
              onLoadedMetadata={() => console.log('✅ Audio metadata loaded')}
              onCanPlay={() => console.log('✅ Audio can play')}
              onEnded={() => {
                console.log('🎵 Audio ended');
                setIsPlaying(false);
              }}
              onError={(e) => {
                const error = e.target.error;
                const errorMessages = {
                  1: 'Tải audio bị hủy',
                  2: 'Lỗi mạng khi tải audio',
                  3: 'Lỗi decode audio',
                  4: 'Định dạng audio không được hỗ trợ'
                };
                
                console.error('❌ Audio error:', {
                  code: error?.code,
                  message: error?.message || errorMessages[error?.code] || 'Lỗi không xác định',
                  url: audioUrl
                });
                
                setIsPlaying(false);
                // Không hiển thị alert để không làm phiền người dùng khi load trang
              }}
            />
          )}
          <button 
            onClick={handlePlayAudio}
            disabled={!audioUrl || audioLoading}
            className={`flex items-center justify-center gap-2 self-center font-semibold py-2 px-6 rounded-lg transition-colors ${
              audioUrl && !audioLoading
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
            }`}
          >
            <span className="material-symbols-outlined">
              {audioLoading ? 'progress_activity' : (isPlaying ? 'pause' : 'volume_up')}
            </span>
            {audioLoading
              ? 'Đang tải...'
              : (audioUrl 
                  ? (isPlaying ? 'Dừng' : 'Nghe mẫu')
                  : 'Không có audio mẫu')
            }
          </button>
        </div>

        {sentence.topic && (
          <div className="flex justify-center gap-2">
            <span className="text-xs text-gray-500">Chủ đề:</span>
            <span className="text-xs font-semibold text-blue-600">{sentence.topic}</span>
          </div>
        )}
      </div>

      {/* Recording Section */}
      <div className="flex flex-col items-center gap-4 py-6">
        {/* Big Mic Button */}
        <button 
          onClick={handleMicClick}
          disabled={isProcessing}
          className={`relative flex flex-col items-center justify-center w-32 h-32 rounded-full text-white transition-all shadow-xl hover:scale-105 active:scale-95 group ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30 animate-pulse' 
              : isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <span className="text-xs font-bold mt-2">Đang xử lý...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-5xl mb-2 group-hover:animate-pulse">
                {isRecording ? 'stop' : 'mic'}
              </span>
              <span className="text-sm font-bold">
                {isRecording ? 'Dừng lại' : 'Nhấn để nói'}
              </span>
            </>
          )}
        </button>

        {/* Recording Timer */}
        {isRecording && (
          <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-full">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
            <span className="text-red-600 dark:text-red-400 font-mono font-bold">
              {formatTime(recordingTime)}
            </span>
          </div>
        )}

        {/* Instructions */}
        {!isRecording && !isProcessing && (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
            Nhấn vào micro, đọc to câu bên trên, sau đó nhấn dừng để nhận kết quả
          </p>
        )}
      </div>
    </div>
  );
};

export default SentenceCard;