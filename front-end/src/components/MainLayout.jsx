// src/components/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Header from "@/components/Header";
import Footer from '@/components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-white">
      <Header />
      
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;