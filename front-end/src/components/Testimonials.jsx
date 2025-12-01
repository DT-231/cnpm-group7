import { Icons } from './Icons';

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Học viên nói gì về chúng tôi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ReviewCard 
            text="Mình đã tự tin giao tiếp hơn sau 1 tháng luyện nói với AI. App sửa lỗi phát âm rất chi tiết, cực kì hữu ích!"
            name="Nguyễn An" role="Sinh viên" img="32"
          />
          <ReviewCard 
            text="Tính năng sửa grammar như có một giáo viên bản xứ bên cạnh 24/7. Mình không còn sợ viết sai ngữ pháp nữa."
            name="Trần Bích" role="Nhân viên văn phòng" img="5"
          />
          <ReviewCard 
            text="Lộ trình học cá nhân hóa giúp mình tập trung vào điểm yếu. Tiến bộ rất nhanh, cảm ơn platform rất nhiều!"
            name="Lê Minh" role="Designer" img="12"
          />
        </div>
       </div>
    </section>
  );
}

function ReviewCard({ text, name, role, img }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex gap-1 mb-4">
        {[1,2,3,4,5].map(i => <Icons.Star key={i} />)}
      </div>
      <p className="text-gray-600 italic mb-6">"{text}"</p>
      <div className="flex items-center gap-4">
        <img src={`https://i.pravatar.cc/150?img=${img}`} alt="Avatar" className="w-10 h-10 rounded-full"/>
        <div>
          <p className="font-bold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}