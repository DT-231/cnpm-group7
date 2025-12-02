import React from 'react';

const SessionHeader = () => {
  return (
    <div className="sticky top-[64px] z-10 bg-[#f6f6f8]/90 dark:bg-[#101622]/90 backdrop-blur-sm -mx-4 px-4 pb-3">
      <div className="border-b border-slate-200 dark:border-slate-800 pt-4">
        <h2 className="text-slate-900 dark:text-white tracking-light text-2xl font-bold leading-tight text-left">
          Conversation Practice - Unit 3: Introducing Yourself
        </h2>
        <div className="flex items-center justify-between gap-4 pt-3 pb-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4">
              <p className="text-blue-600 dark:text-blue-200 text-sm font-medium leading-normal">Intermediate</p>
            </div>
            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-100 dark:bg-slate-800 pl-4 pr-4">
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">Câu 5/15</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-md bg-slate-100 dark:bg-slate-800">
              <span className="material-symbols-outlined text-lg">timer</span>
              <span className="font-mono text-sm font-medium">15:30</span>
            </div>
            <button className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined">pause_circle</span>
            </button>
            <button className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined">replay</span>
            </button>
            <button className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHeader;