import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Thay đổi import Header
import PracticeHeader from '../components/PracticeHeader';
import SessionHeader from '../components/chat/SessionHeader';
import ChatInterface from '../components/chat/ChatInterface';
import ChatSidebar from '../components/chat/ChatSidebar';

const ChatPage = () => {
  const navigate = useNavigate();

  // Auth Guard
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const user = localStorage.getItem('user');
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-display flex flex-col">
      <PracticeHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex w-full gap-8 h-full">
          <div className="w-full lg:w-[70%] flex flex-col">
            <SessionHeader />
            <ChatInterface />
          </div>
          <ChatSidebar />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;