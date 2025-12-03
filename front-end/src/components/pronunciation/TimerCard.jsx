import React from 'react';

const TimerBlock = ({ value, label }) => (
  <div className="flex flex-col items-stretch gap-2 flex-1 min-w-[50px]">
    <div className="flex h-12 items-center justify-center rounded-lg px-3 bg-slate-100 dark:bg-slate-800">
      <p className="text-slate-800 dark:text-slate-200 text-lg font-bold">{value}</p>
    </div>
    <p className="text-center text-slate-500 dark:text-slate-400 text-xs">{label}</p>
  </div>
);

const TimerCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-slate-900 dark:text-white text-xl font-bold">Pronunciation Practice - Unit 3: Daily Conversations</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-lg">signal_cellular_alt</span>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Level: Intermediate</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '33.3%' }}></div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">5/15</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <TimerBlock value="00" label="Hours" />
          <TimerBlock value="18" label="Minutes" />
          <TimerBlock value="23" label="Seconds" />
        </div>
      </div>
    </div>
  );
};

export default TimerCard;