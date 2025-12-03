import React from 'react';

const SidebarCard = ({ title, children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-5 space-y-4 ${className}`}>
    <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">{title}</h4>
    {children}
  </div>
);

const StatRow = ({ label, value, valueClass = "text-slate-800 dark:text-slate-200" }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-600 dark:text-slate-400">{label}</span>
    <span className={`font-semibold ${valueClass}`}>{value}</span>
  </div>
);

const QuickAction = ({ icon, text }) => (
  <a href="#" className="flex items-center gap-3 text-sm text-blue-600 hover:underline p-1">
    <span className="material-symbols-outlined text-xl">{icon}</span>
    {text}
  </a>
);

const PracticeSidebar = () => {
  return (
    <aside className="w-full lg:w-[30%] space-y-6">
      {/* Today's Progress */}
      <SidebarCard title="Today's Progress">
        <div className="space-y-3">
          <StatRow label="Sentences completed" value="12/15" />
          <StatRow label="Average score" value="8.3 / 10" valueClass="text-green-600" />
          <StatRow label="Time practiced" value="18 min" />
        </div>
      </SidebarCard>

      {/* Session Stats */}
      <SidebarCard title="Current Session Stats">
        <div className="space-y-3">
          <StatRow label="Recordings:" value="12" />
          <StatRow label="Average score:" value="8.3/10" />
          <StatRow label="Accuracy:" value="85%" />
          <StatRow label="Common errors:" value="/θ/ sound (3x)" valueClass="text-orange-500" />
        </div>
      </SidebarCard>

      {/* AI Coach Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 space-y-3">
        <h4 className="font-bold text-blue-800 dark:text-blue-100 flex items-center gap-2">
          <span className="material-symbols-outlined">smart_toy</span>AI Coach Tips
        </h4>
        <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-2">
          <li>Exaggerate sounds you find difficult.</li>
          <li>Record in a quiet place for best results.</li>
          <li>Don't rush, focus on each word.</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <SidebarCard title="Quick Actions">
        <div className="flex flex-col items-start">
          <QuickAction icon="menu_book" text="Review phonetics" />
          <QuickAction icon="tune" text="Change difficulty" />
          <QuickAction icon="pause_circle" text="Take a break" />
          <QuickAction icon="bar_chart" text="View report" />
        </div>
      </SidebarCard>
    </aside>
  );
};

export default PracticeSidebar;