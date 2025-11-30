export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-900">Cách học với AI</h2>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-gray-200 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <Step number="1" title="Chọn chế độ luyện tập" desc="Chat với AI hoặc luyện phát âm qua micro" />
            <Step number="2" title="Thực hành với AI" desc="AI tương tác real-time, sửa lỗi ngay lập tức" />
            <Step number="3" title="Nhận phản hồi chi tiết" desc="Xem điểm số, lỗi sai và gợi ý cải thiện" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="text-center group">
      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">{number}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 px-4">{desc}</p>
    </div>
  );
}