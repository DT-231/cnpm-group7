import React from 'react';

const SidebarSection = ({ title, children, className="" }) => (
  <div className={`p-5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 ${className}`}>
    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
      {title}
    </h3>
    {children}
  </div>
);

const ChatSidebar = () => {
  return (
    <aside className="hidden lg:block w-[30%] space-y-6">
      
      {/* Today's Progress */}
      <SidebarSection title="Today's Progress">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-600 dark:text-slate-300">Conversations</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">3/5</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Average Score</p>
              <p className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center">
                7.8/10 <span className="material-symbols-outlined text-green-500 !text-xl ml-1">arrow_upward</span>
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Time Practiced</p>
              <p className="font-bold text-lg text-slate-800 dark:text-slate-100">25 min</p>
            </div>
          </div>
        </div>
      </SidebarSection>

      {/* Current Session Stats */}
      <SidebarSection title="Current Session">
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Messages Sent:</span><span className="font-semibold dark:text-white">12</span></li>
          <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Average Score:</span><span className="font-semibold dark:text-white">8.2/10</span></li>
          <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Grammar Accuracy:</span><span className="font-semibold text-green-600">85%</span></li>
          <li className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Vocabulary Used:</span><span className="font-semibold dark:text-white">45 words</span></li>
        </ul>
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Common Mistakes:</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Verb Tense (2x), Articles (1x)</p>
        </div>
      </SidebarSection>

      {/* AI Coach Tips */}
      <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
        <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-300">smart_toy</span>
          AI Coach Tips
        </h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
          <li>Use contractions (I'm, you're) for natural conversation.</li>
          <li>Try to respond with 2-3 sentences.</li>
          <li>Don't worry about mistakes - that's how you learn!</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <SidebarSection title="Quick Actions">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <ActionBtn icon="menu_book" text="Review" />
          <ActionBtn icon="change_circle" text="Change" />
          <ActionBtn icon="coffee" text="Take a break" />
          <ActionBtn icon="bar_chart" text="Report" />
        </div>
      </SidebarSection>
    </aside>
  );
};

const ActionBtn = ({ icon, text }) => (
  <a className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 transition-colors" href="#">
    <span className="material-symbols-outlined !text-base">{icon}</span> {text}
  </a>
);

export default ChatSidebar;