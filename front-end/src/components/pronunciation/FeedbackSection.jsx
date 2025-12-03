import React from 'react';

const FeedbackSection = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 flex flex-col gap-6">
      {/* Header & Score Circle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Kết quả của bạn</h3>
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            <path className="text-green-500" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-green-600">8.5</span>
            <span className="text-xs text-slate-500">/10</span>
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
        <p className="text-sm text-slate-500 mb-2">AI đã nghe bạn nói:</p>
        <p className="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
          <span className="text-green-600">Hello, </span>
          <span className="text-green-600">my </span>
          <span className="text-orange-500">name is </span>
          <span className="text-green-600">John. </span>
          <span className="text-red-500 border-b-2 border-red-500/30">Nise </span>
          <span className="text-green-600">to </span>
          <span className="text-green-600">meet </span>
          <span className="text-green-600">you.</span>
        </p>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="space-y-2">
          <p className="font-bold flex items-center gap-2 text-green-600"><span className="material-symbols-outlined text-lg">thumb_up</span>Điểm mạnh</p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 pl-1">
            <li>"Hello" sound clear.</li>
            <li>Good sentence rhythm.</li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-bold flex items-center gap-2 text-orange-500"><span className="material-symbols-outlined text-lg">lightbulb</span>Cần cải thiện</p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 pl-1">
            <li>"name is" linked weakly.</li>
            <li>"Nice" pronounced as "Nise".</li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-bold flex items-center gap-2 text-blue-600"><span className="material-symbols-outlined text-lg">tips_and_updates</span>Gợi ý</p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 pl-1">
            <li>Practice /s/ sound at end.</li>
            <li>Listen to sample again.</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-6 rounded-lg transition-colors">
          <span className="material-symbols-outlined">replay</span>Thử lại
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-blue-600/20">
          Câu tiếp theo <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <button className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-6 rounded-lg transition-colors">
          <span className="material-symbols-outlined">save</span>Lưu
        </button>
      </div>
    </div>
  );
};

export default FeedbackSection;