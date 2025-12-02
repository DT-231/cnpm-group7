import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-2xl p-12 text-center text-white space-y-6 shadow-2xl shadow-blue-600/40 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight relative z-10">Sẵn sàng cải thiện tiếng Anh?</h2>
          <p className="text-lg text-blue-100 relative z-10">Bắt đầu luyện tập miễn phí ngay hôm nay</p>
          
          <Link to="/signup" className="inline-flex items-center justify-center min-w-[84px] h-14 px-8 rounded-lg bg-white text-blue-600 text-lg font-bold hover:bg-blue-50 transition-all transform hover:scale-105 duration-300 shadow-lg relative z-10 cursor-pointer">
             Tạo tài khoản miễn phí
          </Link>
          
          <p className="text-sm text-blue-200 relative z-10">Không cần thẻ tín dụng</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;