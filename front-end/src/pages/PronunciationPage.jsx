import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

// Import các components con
import PracticeHeader from '../components/PracticeHeader';
import TimerCard from '../components/pronunciation/TimerCard';
import SentenceCard from '../components/pronunciation/SentenceCard';
import FeedbackSection from '../components/pronunciation/FeedbackSection';
import PracticeSidebar from '../components/pronunciation/PracticeSidebar';

const PronunciationPage = () => {
  const navigate = useNavigate();
  const alertShown = useRef(false); // 2. Tạo biến ref để kiểm soát

  // --- LOGIC BẢO VỆ TRANG (AUTH GUARD) ---
  useEffect(() => {
    const user = localStorage.getItem('user');
    
    // Chỉ chạy nếu chưa có user VÀ chưa hiện alert lần nào
    if (!user && !alertShown.current) {
        alertShown.current = true; // Đánh dấu là đã hiện
        alert("Bạn cần đăng nhập để sử dụng tính năng này!");
        navigate('/login');
    }
  }, [navigate]);

  const user = localStorage.getItem('user');
  if (!user) return null;

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
              <span className="text-slate-600 dark:text-slate-300">Luyện phát âm với AI</span>
            </div>

            {/* Sticky Timer */}
            <div className="sticky top-[70px] z-40 bg-[#f6f6f8] dark:bg-[#101622] pt-2 pb-2">
              <TimerCard />
            </div>

            {/* Practice Components */}
            <SentenceCard />
            
            <FeedbackSection />
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <PracticeSidebar />
          
        </div>
      </main>
    </div>
  );
};

export default PronunciationPage;