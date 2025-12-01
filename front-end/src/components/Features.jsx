import { Icons } from './Icons';

export default function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
          <p className="text-gray-600">Công nghệ AI tiên tiến giúp bạn học nhanh hơn, hiệu quả hơn và thú vị hơn bao giờ hết.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard 
            icon={<Icons.Chat />} 
            bg="bg-blue-50"
            title="Luyện Speaking qua Chat với AI" 
            desc="Trò chuyện với AI như một người bạn thực sự. AI sẽ sửa lỗi, gợi ý cách nói tự nhiên hơn và giúp bạn tự tin hơn."
            link="Thử ngay"
          />
          <FeatureCard 
            icon={<Icons.Mic />} 
            bg="bg-green-50"
            title="Luyện phát âm với AI" 
            desc="Nói vào micro, AI chấm điểm ngay lập tức. Phân tích chi tiết giúp bạn cải thiện từng âm tiết."
            link="Luyện tập"
          />
          <FeatureCard 
            icon={<Icons.Edit />} 
            bg="bg-purple-50"
            title="AI sửa lỗi Grammar" 
            desc="Viết câu tiếng Anh, AI sẽ sửa lỗi và đề xuất cách viết tự nhiên hơn. Học ngữ pháp qua thực hành."
            link="Khám phá"
          />
          <FeatureCard 
            icon={<Icons.Target />} 
            bg="bg-orange-50"
            title="Lộ trình học riêng cho bạn" 
            desc="AI phân tích trình độ và gợi ý bài học phù hợp với trình độ. Học đúng cái bạn cần."
            link="Xem lộ trình"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, link, bg }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{desc}</p>
      <a href="#" className="inline-flex items-center text-blue-600 font-semibold hover:gap-2 transition-all">
        {link} <span className="ml-1"><Icons.ArrowRight /></span>
      </a>
    </div>
  );
}