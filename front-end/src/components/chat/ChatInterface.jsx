import React, { useState, useRef, useEffect } from 'react';

// --- Sub-components (Giữ nguyên) ---

const AiMessage = ({ text, time }) => (
  <div className="flex items-end gap-3 max-w-lg">
    <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-slate-500 text-sm">smart_toy</span>
    </div>
    <div>
      <div className="relative group">
        <div className="px-4 py-3 rounded-xl rounded-bl-none bg-slate-100 dark:bg-slate-800">
          <p className="text-slate-800 dark:text-slate-200 text-base leading-relaxed">{text}</p>
        </div>
        <button className="absolute -right-10 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100">
          <span className="material-symbols-outlined text-base">volume_up</span>
        </button>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 ml-2">{time}</p>
    </div>
  </div>
);

const UserMessage = ({ text, time, feedback }) => (
  <div className="flex flex-col items-end ml-auto max-w-lg">
    <div className="flex items-end gap-3 justify-end">
      <div>
        <div className="px-4 py-3 rounded-xl rounded-br-none bg-blue-600 text-white shadow-md">
          <p className="text-base leading-relaxed">{text}</p>
        </div>
        <div className="flex items-center justify-end gap-1 mt-1.5 mr-2">
          <p className="text-xs text-slate-400 dark:text-slate-500">{time}</p>
          <span className="material-symbols-outlined text-green-500 !text-base">done_all</span>
        </div>
      </div>
    </div>
    
    {feedback && (
      <div className="mt-2 w-[95%] bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 p-3 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Feedback</span>
            <div className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 text-xs font-bold">
              {feedback.score}/10
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
            <span className="material-symbols-outlined !text-base mt-0.5">info</span>
            <p><span className="font-semibold">Suggestion: </span> "I <s className="opacity-70 mx-1">am work</s> <span className="text-green-600 dark:text-green-400 font-semibold">work</span> as..."</p>
          </div>
          <div className="flex items-start gap-2 text-sky-600 dark:text-sky-400">
            <span className="material-symbols-outlined !text-base mt-0.5">lightbulb</span>
            <p><span className="font-semibold">Alternative:</span> "I'm a software engineer." is more natural.</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md py-1.5 px-3 transition-colors text-slate-700 dark:text-slate-300">Viết lại</button>
          <button className="text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-200 rounded-md py-1.5 px-3 transition-colors">Tiếp tục</button>
        </div>
      </div>
    )}
  </div>
);

// --- Main Component ---

const ChatInterface = () => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hi there! My name's Alex. It's great to meet you. What do you do for work?",
      time: "10:31 AM"
    },
    {
      id: 2,
      sender: 'user',
      text: "Hello Alex. Nice to meet you too. I am work as a software engineer.",
      time: "10:32 AM",
      feedback: { score: 8.5 }
    }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        feedback: null
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // 1. Cố định chiều cao (h-[600px]) và flex-col để không bị kéo dài khung chat
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm mt-4 overflow-hidden border border-slate-200 dark:border-slate-800 h-[800px]">
      
      {/* Scenario Box (Cố định ở trên) */}
      <div className="shrink-0 p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-1">emoji_objects</span>
          <div className="flex flex-col">
            <p className="text-slate-900 dark:text-white text-base font-bold">You are at a networking event. Practice introducing yourself to new people.</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Trả lời câu hỏi của AI. Viết câu hoàn chỉnh như khi nói.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 scroll-smooth">
        {messages.map((msg) => (
          msg.sender === 'ai' ? (
            <AiMessage key={msg.id} text={msg.text} time={msg.time} />
          ) : (
            <UserMessage key={msg.id} text={msg.text} time={msg.time} feedback={msg.feedback} />
          )
        ))}

        {/* AI Typing Indicator */}
        <div className="flex items-end gap-3 max-w-lg">
          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-slate-500 text-sm">smart_toy</span>
          </div>
          <div className="px-4 py-3 rounded-xl rounded-bl-none bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5">
            <span className="size-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="size-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="size-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
          </div>
        </div>
        
        <div ref={chatEndRef} />
      </div>

      <div className="shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="relative">
          
          {/* Icons bên trái: Căn giữa dọc (top-1/2 -translate-y-1/2) */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-2 z-10">
            <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">sentiment_satisfied</span>
            </button>
            <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">mic</span>
            </button>
          </div>
          <textarea 
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl py-3 pl-24 pr-14 text-base resize-none focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white transition-all border-none"
            placeholder="Nhập câu trả lời của bạn..." 
            rows="1"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: '50px', maxHeight: '120px' }} 
          ></textarea>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            <button 
              onClick={handleSend}
              className={`size-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                inputText.trim() 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700'
              }`}
              disabled={!inputText.trim()}
            >
              <span className="material-symbols-outlined !text-xl">arrow_upward</span>
            </button>
          </div>

        </div>
        
        <div className="flex justify-between items-center mt-2 px-1">
          <p className="text-xs text-slate-400 dark:text-slate-500">Enter để gửi</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{inputText.length}/500</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;