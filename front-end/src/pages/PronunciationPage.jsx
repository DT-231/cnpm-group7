import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { getSentenceById, evaluatePronunciation } from '../service/service';

// Import các components con
import PracticeHeader from '../components/PracticeHeader';
import TimerCard from '../components/pronunciation/TimerCard';
import SentenceCard from '../components/pronunciation/SentenceCard';
import FeedbackSection from '../components/pronunciation/FeedbackSection';
import PracticeSidebar from '../components/pronunciation/PracticeSidebar';

const PronunciationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const alertShown = useRef(false);
  const [sentence, setSentence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // --- LOGIC BẢO VỆ TRANG (AUTH GUARD) ---
  useEffect(() => {
    const user = localStorage.getItem('token');
    
    // Chỉ chạy nếu chưa có user VÀ chưa hiện alert lần nào
    if (!user && !alertShown.current) {
        alertShown.current = true; // Đánh dấu là đã hiện
        alert("Bạn cần đăng nhập để sử dụng tính năng này!");
        navigate('/login');
    }
  }, [navigate]);

  // Load sentence from location state or fetch by ID
  useEffect(() => {
    const loadSentence = async () => {
      try {
        // Nếu có sentence trong state (từ random), dùng luôn
        if (location.state?.sentence) {
          console.log('✅ Sử dụng câu từ state');
          setSentence(location.state.sentence);
          setLoading(false);
        } 
        // Nếu có sentenceId, fetch từ API
        else if (location.state?.sentenceId) {
          console.log('⏳ Đang tải câu ID:', location.state.sentenceId);
          const response = await getSentenceById(location.state.sentenceId);
          
          // response đã được interceptor return response.data
          // nên response = { success: true, data: {...}, message: "..." }
          if (response && response.success) {
            console.log('✅ Đã tải câu thành công:', response.data.sentence_text);
            setSentence(response.data);
            setLoading(false);
          } else {
            console.error('❌ API trả về lỗi:', response);
            alert('Không thể tải câu. Vui lòng thử lại!');
            setLoading(false);
            navigate('/practice-select');
          }
        } 
        // Nếu không có gì, chuyển về trang chọn câu
        else {
          console.log('⚠️ Không có câu hoặc ID trong state');
          alert('Vui lòng chọn câu để luyện tập!');
          navigate('/practice-select');
        }
      } catch (error) {
        console.error('❌ Lỗi khi tải câu:', error);
        alert('Không thể tải câu. Vui lòng thử lại!');
        setLoading(false);
        navigate('/practice-select');
      }
    };

    loadSentence();
  }, [location.state, navigate]);

  // Handle recording complete - call API to evaluate
  const handleRecordingComplete = async (recordingData) => {
    setIsEvaluating(true);
    
    try {
      console.log('🎤 Đang gửi bản ghi âm để đánh giá...');
      const response = await evaluatePronunciation(recordingData);
      
      if (response && response.success) {
        console.log('✅ Đánh giá thành công:', response.data);
        setEvaluationResult(response.data);
        
        // Scroll to feedback section
        setTimeout(() => {
          document.querySelector('#feedback-section')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 300);
      } else {
        console.error('❌ Đánh giá thất bại:', response);
        alert('Không thể đánh giá phát âm. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('❌ Lỗi khi đánh giá:', error);
      alert('Có lỗi xảy ra khi đánh giá phát âm. Vui lòng thử lại!');
    } finally {
      setIsEvaluating(false);
    }
  };

  const user = localStorage.getItem('token');
  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-display">
      <PracticeHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN - Main Practice Area */}
          <div className="w-full lg:w-[70%] flex flex-col gap-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm px-1">
              <Link to="/" className="text-blue-600 hover:underline">Trang chủ</Link>
              <span className="text-slate-400">/</span>
              <Link to="/practice-select" className="text-blue-600 hover:underline">Chọn câu</Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600 dark:text-slate-300">Luyện phát âm với AI</span>
            </div>

            {/* Sticky Timer */}
            <div className="sticky top-[70px] z-40 bg-[#f6f6f8] dark:bg-[#101622] pt-2 pb-2">
              <TimerCard />
            </div>

            {/* Practice Components */}
            <SentenceCard 
              sentence={sentence} 
              onRecordingComplete={handleRecordingComplete}
            />
            
            {/* Loading overlay khi đang đánh giá */}
            {isEvaluating && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  AI đang phân tích phát âm của bạn...
                </p>
              </div>
            )}
            
            {/* Feedback Section - chỉ hiện khi có kết quả */}
            <div id="feedback-section">
              <FeedbackSection result={evaluationResult} />
            </div>
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <PracticeSidebar />
          
        </div>
      </main>
    </div>
  );
};

export default PronunciationPage;