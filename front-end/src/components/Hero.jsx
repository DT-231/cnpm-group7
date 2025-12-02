import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-[#dbeafe] to-[#f6f6f8] dark:from-[#1e293b] dark:to-[#101622] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-5 gap-16 items-center">
        <div className="md:col-span-3 space-y-8">
          <div className="space-y-4">
            <h1 className="text-slate-900 dark:text-white text-4xl md:text-6xl font-black leading-tight tracking-tighter">
              Học tiếng Anh thông minh với AI
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-normal leading-normal">
              Luyện nói qua chat, đánh giá phát âm tự động, sửa lỗi ngữ pháp, gợi ý bài học cá nhân hóa.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/practice" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-600/90 transition-all">
              Bắt đầu học ngay
            </Link>
            <a href="#features" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Xem demo
            </a>
          </div>

          <div className="flex flex-wrap gap-4 pt-6">
            {[
              { label: 'Học viên', val: '500+' },
              { label: 'Bài luyện', val: '10,000+' },
              { label: 'Hài lòng', val: '95%' }
            ].map((stat, idx) => (
              <div key={idx} className="flex min-w-[158px] flex-1 flex-col gap-1 rounded-lg p-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <p className="text-slate-900 dark:text-white text-base font-medium">{stat.label}</p>
                <p className="text-blue-600 tracking-light text-3xl font-bold">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 relative flex items-center justify-center">
          <img 
            className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-square" 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
            alt="AI Learning" 
          />
          {/* Floating Icons */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-4xl animate-bounce">💬</div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-4xl text-green-500 ">🎤</div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-10 w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-4xl text-purple-500">✍️</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;