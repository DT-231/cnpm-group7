import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import thêm useLocation

const PracticeHeader = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại để highlight menu
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/'; 
  };

  // Helper để check active menu
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-[#f6f6f8]/80 dark:bg-[#101622]/80 backdrop-blur-sm px-4 lg:px-10 py-3">
      {/* Logo Section */}
      <div className="flex items-center gap-4 text-slate-900 dark:text-slate-50">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-blue-600 text-2xl group-hover:scale-110 transition-transform">
            auto_awesome
          </span>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
            AI English
          </h2>
        </Link>
      </div>

      {/* Navigation Menu - CẬP NHẬT Ở ĐÂY */}
      <div className="hidden md:flex flex-1 justify-center gap-8">
        <div className="flex items-center gap-9">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
          >
            Trang chủ
          </Link>
          
          {/* Link Luyện nói -> trỏ về /chat */}
          <Link
            to="/chat"
            className={`text-sm font-medium transition-colors ${
              isActive('/chat') 
                ? 'text-blue-600' 
                : 'text-slate-700 dark:text-slate-300 hover:text-blue-600'
            }`}
          >
            Luyện nói
          </Link>

          {/* Link Luyện phát âm -> trỏ về /practice */}
          <Link
            to="/practice"
            className={`text-sm font-medium transition-colors ${
              isActive('/practice') 
                ? 'text-blue-600' 
                : 'text-slate-700 dark:text-slate-300 hover:text-blue-600'
            }`}
          >
            Luyện phát âm
          </Link>

          <a
            href="#"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
          >
            Thư viện
          </a>
        </div>
      </div>

      {/* User Section (Giữ nguyên code cũ đã sửa lỗi hover) */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined text-xl text-slate-600 dark:text-slate-300">
              notifications
            </span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined text-xl text-slate-600 dark:text-slate-300">
              settings
            </span>
          </button>
        </div>

        {user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-300 dark:border-slate-700">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden lg:block">
              {user.username}
            </span>

            <div className="relative group cursor-pointer h-10">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                alt="User"
                className="h-10 w-10 rounded-full border border-slate-300 dark:border-slate-600 object-cover"
              />

              <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                <div className="bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1 overflow-hidden">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 lg:hidden">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {user.username}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      logout
                    </span>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse"></div>
        )}
      </div>
    </header>
  );
};

export default PracticeHeader;