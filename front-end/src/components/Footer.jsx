import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink = ({ text, href }) => (
  <li>
    <a className="text-base text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors" href={href}>
      {text}
    </a>
  </li>
);

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-slate-50 mb-4">
              <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">EN</div>
              <span className="font-bold text-gray-900">AI English Learning</span>
            </div>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Nền tảng học tiếng Anh thông minh, giúp bạn tự tin giao tiếp thế giới.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Sản phẩm</h3>
            <ul className="mt-4 space-y-4">
              <FooterLink text="Features" href="#" />
              <FooterLink text="Pricing" href="#" />
              <FooterLink text="Demo" href="#" />
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Công ty</h3>
            <ul className="mt-4 space-y-4">
              <FooterLink text="About Us" href="#" />
              <FooterLink text="Blog" href="#" />
              <FooterLink text="Careers" href="#" />
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Pháp lý</h3>
            <ul className="mt-4 space-y-4">
              <FooterLink text="Terms of Service" href="#" />
              <FooterLink text="Privacy Policy" href="#" />
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
          <p className="text-base text-slate-500 dark:text-slate-400">© 2024 AI English Learning. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;