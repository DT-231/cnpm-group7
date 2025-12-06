import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, Shuffle, Tag } from 'lucide-react';
import { getAllSentences, getRandomSentence, getRandomSentenceByTopic, getAllTopics } from '../service/service';

const SelectSentencePage = () => {
  const navigate = useNavigate();
  const alertShown = useRef(false);
  const [selectedMode, setSelectedMode] = useState(null); // 'list', 'random', 'topic'
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [selectedTopic, setSelectedTopic] = useState('Daily Life');
  const [topics, setTopics] = useState([]);
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !alertShown.current) {
      alertShown.current = true;
      alert("Bạn cần đăng nhập để sử dụng tính năng này!");
      navigate('/login');
    }
  }, [navigate]);

  // Load topics when component mounts
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await getAllTopics();
        if (response.success) {
          setTopics(response.data);
          if (response.data.length > 0) {
            setSelectedTopic(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Error loading topics:', error);
      }
    };
    loadTopics();
  }, []);

  // Load all sentences when selecting list mode
  useEffect(() => {
    if (selectedMode === 'list') {
      loadAllSentences();
    }
  }, [selectedMode]);

  const loadAllSentences = async () => {
    setLoading(true);
    try {
      const response = await getAllSentences();
      if (response.success) {
        setSentences(response.data);
      }
    } catch (error) {
      console.error('Error loading sentences:', error);
      alert('Không thể tải danh sách câu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleRandomPractice = async () => {
    setLoading(true);
    try {
      const response = await getRandomSentence(selectedDifficulty);
      if (response.success) {
        const sentence = response.data;
        navigate('/practice', { state: { sentence } });
      }
    } catch (error) {
      console.error('Error getting random sentence:', error);
      alert('Không thể lấy câu ngẫu nhiên. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicPractice = async () => {
    setLoading(true);
    try {
      const response = await getRandomSentenceByTopic(selectedTopic, selectedDifficulty);
      if (response.success) {
        const sentence = response.data;
        navigate('/practice', { state: { sentence } });
      }
    } catch (error) {
      console.error('Error getting sentence by topic:', error);
      alert('Không thể lấy câu theo chủ đề. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSentence = (sentence) => {
    navigate('/practice', { state: { sentenceId: sentence.sentence_id } });
  };

  const user = localStorage.getItem('token');
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Quay lại trang chủ</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎯 AI English Learning
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/practice-select" className="text-blue-600 hover:underline dark:text-blue-400">Practice</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-300">Select Sentence</span>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-4 shadow-lg">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-25"></div>
              <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Chọn câu để luyện phát âm
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Hãy chọn một trong ba cách để bắt đầu luyện tập
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            3 cách chọn câu
          </div>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Chọn từ danh sách */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 cursor-pointer ${
              selectedMode === 'list' ? 'border-blue-500 ring-4 ring-blue-200 dark:ring-blue-800' : 'border-transparent'
            }`}
            onClick={() => setSelectedMode('list')}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                  Phổ biến nhất
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Chọn từ danh sách
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Xem tất cả các câu mẫu và tự chọn câu bạn muốn luyện.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Xem đầy đủ câu tiếng Anh
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Có phiên âm và nghĩa
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Lọc theo cấp độ và chủ đề
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Phù hợp để học có kế hoạch
                </li>
              </ul>

              {selectedMode === 'list' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Scroll to list section
                    document.getElementById('sentence-list')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Xem danh sách
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Random bất kỳ */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 cursor-pointer ${
              selectedMode === 'random' ? 'border-purple-500 ring-4 ring-purple-200 dark:ring-purple-800' : 'border-transparent'
            }`}
            onClick={() => setSelectedMode('random')}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md">
                  <Shuffle className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                  Thử thách
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Random bất kỳ
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Để AI chọn ngẫu nhiên một câu bất kỳ cho bạn.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Bất ngờ và thú vị
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Không biết trước câu nào
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Luyện khả năng phản xạ
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Đa dạng chủ đề
                </li>
              </ul>

              {selectedMode === 'random' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chọn cấp độ
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['beginner', 'intermediate', 'advanced'].map((level) => (
                        <button
                          key={level}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDifficulty(level);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedDifficulty === level
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {level === 'beginner' ? 'Cơ bản' : level === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRandomPractice();
                    }}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang tải...' : 'Bắt đầu ngay'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Random theo chủ đề */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 cursor-pointer ${
              selectedMode === 'topic' ? 'border-green-500 ring-4 ring-green-200 dark:ring-green-800' : 'border-transparent'
            }`}
            onClick={() => setSelectedMode('topic')}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-md">
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                  Tập trung
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Random theo chủ đề
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Chọn chủ đề bạn muốn luyện, AI sẽ random câu trong chủ đề đó.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Tập trung vào chủ đề cụ thể
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Phù hợp với mục tiêu học
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Random trong phạm vi chủ đề
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Hiệu quả hơn
                </li>
              </ul>

              {selectedMode === 'topic' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chọn chủ đề
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedTopic(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {topics.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lọc theo cấp độ
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['beginner', 'intermediate', 'advanced'].map((level) => (
                        <button
                          key={level}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDifficulty(level);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedDifficulty === level
                              ? 'bg-green-600 text-white shadow-md'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {level === 'beginner' ? 'Cơ bản' : level === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTopicPractice();
                    }}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang tải...' : 'Chọn câu'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sentence List Section */}
        {selectedMode === 'list' && (
          <div id="sentence-list" className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-blue-600" />
              Danh sách câu luyện tập
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : sentences.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Không có câu nào trong danh sách
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sentences.map((sentence, index) => (
                  <div
                    key={sentence.sentence_id}
                    onClick={() => handleSelectSentence(sentence)}
                    className="group p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-400"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                        #{sentence.sentence_id}
                      </span>
                      <svg className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium mb-2 line-clamp-2">
                      {sentence.sentence_text}
                    </p>
                    {sentence.vietnamese_translation && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-2">
                        {sentence.vietnamese_translation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SelectSentencePage;
