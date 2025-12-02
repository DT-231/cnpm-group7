import React from 'react';

const Step = ({ number, icon, title, desc }) => (
  <div className="relative flex flex-col items-center text-center group">
    <div className="mb-4 z-10 flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white text-3xl font-bold border-4 border-slate-50 dark:border-slate-900 shadow-lg group-hover:scale-110 transition-transform">
      {number}
    </div>
    <div className="text-slate-800 dark:text-slate-200 text-3xl mb-3">
      <span className="material-symbols-outlined !text-4xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400">{desc}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight">Cách học với AI</h2>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="absolute top-12 left-0 right-0 h-0.5 border-t-2 border-dashed border-blue-600/50 hidden md:block"></div>
          
          <Step number="1" icon="edit" title="Chọn chế độ luyện tập" desc="Chat với AI hoặc luyện phát âm qua micro" />
          <Step number="2" icon="forum" title="Thực hành với AI" desc="AI tương tác real-time, sửa lỗi ngay lập tức" />
          <Step number="3" icon="monitoring" title="Nhận phản hồi chi tiết" desc="Xem điểm số, lỗi sai và gợi ý cải thiện" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;