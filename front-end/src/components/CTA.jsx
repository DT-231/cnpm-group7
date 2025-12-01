export default function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto bg-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Sẵn sàng cải thiện tiếng Anh?</h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">Bắt đầu luyện tập miễn phí ngay hôm nay.</p>
        <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-colors relative z-10">
          Tạo tài khoản miễn phí
        </button>
        <p className="mt-4 text-sm text-blue-200 relative z-10">Không cần thẻ tín dụng</p>
      </div>
    </section>
  );
}