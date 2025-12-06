import React from 'react';

const FeedbackSection = ({ result }) => {
  // Nếu chưa có kết quả, không hiển thị gì
  if (!result) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-orange-500';
    return 'text-red-600';
  };

  const getScoreStroke = (score) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-blue-500';
    if (score >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  const score = result.overall_score || 0;
  const strokeDasharray = `${score * 10}, 100`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 flex flex-col gap-6 animate-fadeIn">
      {/* Header & Score Circle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Kết quả của bạn</h3>
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            <path className={getScoreStroke(score)} strokeDasharray={strokeDasharray} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold ${getScoreColor(score)}`}>{score.toFixed(1)}</span>
            <span className="text-xs text-slate-500">/10</span>
          </div>
        </div>
      </div>

      {/* Score Label */}
      {result.score_label && (
        <div className="text-center">
          <span className={`inline-block px-4 py-2 rounded-full font-semibold ${getScoreColor(score)} bg-opacity-10`}>
            {result.score_label}
          </span>
        </div>
      )}

      {/* Transcript */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
        <p className="text-sm text-slate-500 mb-2">AI đã nghe bạn nói:</p>
        <p className="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
          {result.transcription || 'Không có bản ghi âm'}
        </p>
      </div>

      {/* Word Comparison */}
      {result.transcription_comparison && result.transcription_comparison.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
          <p className="text-sm text-slate-500 mb-2">So sánh từng từ:</p>
          <div className="flex flex-wrap gap-2">
            {result.transcription_comparison.map((word, idx) => {
              const colorClass = 
                word.status === 'correct' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' :
                word.status === 'partially_correct' ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                word.status === 'incorrect' ? 'text-red-600 bg-red-50 dark:bg-red-900/20 line-through' :
                'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
              
              return (
                <span key={idx} className={`px-2 py-1 rounded ${colorClass} text-sm font-medium`}>
                  {word.word}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Breakdown */}
      {result.breakdown && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Chi tiết điểm số:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            <div className="text-center">
              <p className="text-slate-500 text-xs mb-1">Phoneme</p>
              <p className="font-bold text-slate-800 dark:text-white">{result.breakdown.phoneme_accuracy?.toFixed(1)}/10</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-xs mb-1">Stress</p>
              <p className="font-bold text-slate-800 dark:text-white">{result.breakdown.word_stress?.toFixed(1)}/10</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-xs mb-1">Intonation</p>
              <p className="font-bold text-slate-800 dark:text-white">{result.breakdown.intonation?.toFixed(1)}/10</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-xs mb-1">Fluency</p>
              <p className="font-bold text-slate-800 dark:text-white">{result.breakdown.fluency?.toFixed(1)}/10</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-xs mb-1">Clarity</p>
              <p className="font-bold text-slate-800 dark:text-white">{result.breakdown.clarity?.toFixed(1)}/10</p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {result.strengths && result.strengths.length > 0 && (
          <div className="space-y-2">
            <p className="font-bold flex items-center gap-2 text-green-600">
              <span className="material-symbols-outlined text-lg">thumb_up</span>
              Điểm mạnh
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 pl-1">
              {result.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
        
        {result.improvements && result.improvements.length > 0 && (
          <div className="space-y-2">
            <p className="font-bold flex items-center gap-2 text-orange-500">
              <span className="material-symbols-outlined text-lg">lightbulb</span>
              Cần cải thiện
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 pl-1">
              {result.improvements.map((improvement, idx) => (
                <li key={idx}>
                  <strong>{improvement.issue}</strong>: {improvement.tip}
                  {improvement.example && ` (VD: ${improvement.example})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">replay</span>
          Thử lại
        </button>
        <button 
          onClick={() => window.location.href = '/practice-select'}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
        >
          Câu tiếp theo 
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default FeedbackSection;