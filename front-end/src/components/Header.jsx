export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className="font-bold text-xl tracking-tight">
              AI English Learning
            </span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Blog
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              className="text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-xl border border-gray-200 transition-all shadow-sm hidden sm:block">
              Log In
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-600/20">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
