import { Icons } from "./Icons";
import AIChat from "../assets/AIChat.png";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase">
                AI-Powered Learning
              </span>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-[1.15]">
                Học tiếng Anh <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  thông minh với AI
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Luyện nói qua chat, đánh giá phát âm tự động, sửa lỗi ngữ pháp
                và gợi ý bài học cá nhân hóa dành riêng cho bạn.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/20 transition-transform hover:-translate-y-1">
                Bắt đầu học ngay
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-lg">
                Xem demo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Học viên
                </p>
                <p className="text-3xl font-bold text-blue-600">500+</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Bài luyện
                </p>
                <p className="text-3xl font-bold text-blue-600">10,000+</p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Hài lòng
                </p>
                <p className="text-3xl font-bold text-blue-600">95%</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <img
              src={AIChat}
              alt="AI Robot"
              className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500"
            />
            <div
              className="absolute top-10 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden md:block animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <Icons.Chat />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
