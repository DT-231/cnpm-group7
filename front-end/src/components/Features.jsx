import React from "react";
import { Link } from "react-router-dom";

const FeatureCard = ({
  icon,
  colorClass,
  title,
  desc,
  link,
  linkText,
  badge,
  badgeColor,
}) => (
  <div className="relative flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
    {badge && (
      <div
        className={`absolute top-4 right-4 ${badgeColor} text-xs font-bold px-2 py-1 rounded-full`}
      >
        {badge}
      </div>
    )}
    <div
      className={`${colorClass} text-5xl group-hover:scale-110 transition-transform duration-300 origin-left`}
    >
      <span className="material-symbols-outlined !text-5xl">{icon}</span>
    </div>
    <div className="flex flex-col gap-2">
      <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
        {desc}
      </p>
    </div>
    <Link
      className="mt-auto flex items-center gap-2 text-blue-600 font-bold group/link"to={link}>
      <span className="group-hover/link:underline">{linkText}</span>
      <span className="material-symbols-outlined">arrow_forward</span>
    </Link>
  </div>
);

const Features = () => {
  return (
    <section
      className="py-20 sm:py-28 bg-[#f6f6f8] dark:bg-[#101622]"
      id="features"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            Tính năng nổi bật
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            icon="chat"
            colorClass="text-blue-500"
            title="Luyện Speaking qua Chat với AI"
            desc="Trò chuyện với AI như một người bạn thực sự. AI sẽ sửa lỗi, gợi ý cách nói tự nhiên hơn và giúp bạn tự tin hơn."
            link="/chat"
            linkText="Thử ngay"
            badge="PHỔ BIẾN"
            badgeColor="bg-blue-600/10 text-blue-600"
          />
          <FeatureCard
            icon="mic"
            colorClass="text-green-500"
            title="Luyện phát âm với AI"
            desc="Nói vào micro, AI chấm điểm ngay lập tức. Phản hồi chi tiết giúp bạn cải thiện từng âm tiết."
            link="/practice-select"
            linkText="Luyện tập"
            badge="MỚI"
            badgeColor="bg-green-500/10 text-green-500"
          />
          <FeatureCard
            icon="edit_note"
            colorClass="text-purple-500"
            title="AI sửa lỗi Grammar"
            desc="Viết câu tiếng Anh, AI sẽ sửa lỗi và đề xuất cách viết tự nhiên hơn. Học ngữ pháp qua thực hành."
            link="#"
            linkText="Khám phá"
          />
          <FeatureCard
            icon="track_changes"
            colorClass="text-orange-500"
            title="Lộ trình học riêng cho bạn"
            desc="AI phân tích tiến độ và gợi ý bài học phù hợp với trình độ. Học đúng cái bạn cần."
            link="#"
            linkText="Xem lộ trình"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
