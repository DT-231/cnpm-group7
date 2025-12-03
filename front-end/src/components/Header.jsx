import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi component được load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f6f6f8]/80 dark:bg-[#101622]/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105">
              EN
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900">
              AI English Learning
            </span>
          </Link>

          {/* Menu giữa */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-9">
            <a
              className="text-sm font-medium hover:text-blue-600 transition-colors"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-sm font-medium hover:text-blue-600 transition-colors"
              href="#"
            >
              Pricing
            </a>
            <a
              className="text-sm font-medium hover:text-blue-600 transition-colors"
              href="#"
            >
              Blog
            </a>
          </div>

          {/* LOGIC ĐĂNG NHẬP / ĐĂNG KÝ Ở ĐÂY */}
          <div className="hidden md:flex gap-2 items-center">
            {user ? (
              // --- NẾU ĐÃ ĐĂNG NHẬP: HIỆN AVATAR ---
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Hi, {user.username}
                </span>
                <div className="relative group cursor-pointer">
                  <img
                    src={user.avatar || "https://ui-avatars.com/api/?name=User"}
                    alt="User"
                    className="h-10 w-10 rounded-full border border-slate-300"
                  />
                  {/* Dropdown logout đơn giản */}
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
              // --- NẾU CHƯA ĐĂNG NHẬP: HIỆN NÚT LOGIN ---
              <>
                <Link
                  to="/login"
                  className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm font-bold hover:bg-slate-300 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold hover:bg-blue-600/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
