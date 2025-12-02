import React from 'react';

const SentenceCard = () => {
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
          <p className="font-semibold text-slate-500">Câu 5/15</p>
          <span className="bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">Intermediate</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Hello, my name is John. <br/> Nice to meet you.
        </h2>
        
        <p className="text-lg text-purple-600 dark:text-purple-400 font-mono">
          /həˈloʊ, maɪ neɪm ɪz dʒɑn. naɪs tu mit ju/
        </p>
        
        <p className="text-base text-slate-500">Xin chào, tên tôi là John. Rất vui được gặp bạn.</p>
        
        <button className="flex items-center justify-center gap-2 self-center bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold py-2 px-6 rounded-lg transition-colors">
          <span className="material-symbols-outlined">volume_up</span>
          Nghe mẫu
        </button>
      </div>

      {/* Big Mic Button */}
      <div className="flex justify-center py-6">
        <button className="relative flex flex-col items-center justify-center w-32 h-32 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-all shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 group">
          <span className="material-symbols-outlined text-5xl mb-2 group-hover:animate-pulse">mic</span>
          <span className="text-sm font-bold">Nhấn để nói</span>
        </button>
      </div>
    </div>
  );
};

export default SentenceCard;