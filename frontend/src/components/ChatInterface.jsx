import React, { useState, useEffect, useRef } from 'react';
import VoiceInput from './VoiceInput';
import { API_ENDPOINTS } from '../config';

const ChatInterface = ({ language, onLanguageChange }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  //server connection
  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.health);
      if (!response.ok) throw new Error('Server not responding');
      setIsConnected(true);
      setError(null);
    } catch (e) {
      setIsConnected(false);
      setError('Cannot connect to server. Please check your connection.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatNewsResults = (data) => {
    // Handle institutional queries (about AMC, mission, vision, etc.)
    if (data.is_institutional) {
      return data.message;
    }

    if (!data.context || data.context.length === 0) {
      return language === 'am' 
        ? 'ይቅርታ, ምንም አግባብነት ያለው ዜና አልተገኘም።' 
        : 'Sorry, No relevant news found.';
    }

    // Group articles by language
    const amharicNews = data.context.filter(article => article.language === 'am');
    const englishNews = data.context.filter(article => article.language === 'en');

    let newsItems = [];

    // Add Amharic news
    if (amharicNews.length > 0) {
      newsItems.push(language === 'am' ? ' የአማርኛ ዜናዎች:' : ' Amharic News:');
      amharicNews.forEach(article => {
        const title = article.title || 'Untitled';
        const url = article.url || '#';
        const date = article.date ? new Date(article.date).toLocaleDateString() : '';
        const category = article.category ? `[${article.category}]` : '';
        
        newsItems.push(`🔹 [${title}](${url})`);
        if (date || category) {
          newsItems.push(`   ${date} ${category}`.trim());
        }
        newsItems.push('');  // Add empty line for spacing
      });
    }

    // Add English news
    if (englishNews.length > 0) {
      newsItems.push(language === 'am' ? ' የእንግሊዘኛ ዜናዎች:' : ' English News:');
      englishNews.forEach(article => {
        const title = article.title || 'Untitled';
        const url = article.url || '#';
        const date = article.date ? new Date(article.date).toLocaleDateString() : '';
        const category = article.category ? `[${article.category}]` : '';
        
        newsItems.push(`🔹 [${title}](${url})`);
        if (date || category) {
          newsItems.push(`   ${date} ${category}`.trim());
        }
        newsItems.push('');  // Add empty line for spacing
      });
    }

    // Add total count
    const totalMessage = language === 'am'
      ? `ጠቅላላ ${data.total_results} ዜናዎች ተገኝተዋል።`
      : `Found ${data.total_results} news items.`;
    
    newsItems.push(totalMessage);

    return newsItems.join('\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!isConnected) {
      setError('Cannot send message. Server is not connected.');
      return;
    }
    
    setLoading(true);
    setError(null);
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch(API_ENDPOINTS.ask, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: input, language })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Unknown error occurred');
      }
      
      setMessages(prev => [...prev, { 
        text: formatNewsResults(data),
        sender: 'bot',
        isNews: true
      }]);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setMessages(prev => [...prev, { 
        text: language === 'am' 
          ? 'ስህተት ተከስቷል። እባክዎ ቆይተው ይሞክሩ።' 
          : `An error occurred: ${error.message}`, 
        sender: 'bot' 
      }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  const handleVoiceResult = (result) => {
    setInput(result);
  };

  const renderMessage = (msg) => {
    if (msg.isNews) {
      return msg.text.split('\n').map((line, i) => {
        if (line.startsWith('🔹 [') && line.includes('](')) {
          const titleMatch = line.match(/\[(.*?)\]/);
          const urlMatch = line.match(/\((.*?)\)/);
          if (titleMatch && urlMatch) {
            return (
              <div key={i} className="mb-1">
                <span className="mr-1">🔹</span>
                <a 
                  href={urlMatch[1]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {titleMatch[1]}
                </a>
              </div>
            );
          }
        } else if (line.startsWith('📰')) {
          return (
            <div key={i} className="font-bold mt-3 mb-2">
              {line}
            </div>
          );
        } else if (line.startsWith('•')) {
          return (
            <div key={i} className="ml-4 mb-1">
              {line}
            </div>
          );
        } else if (line.trim().startsWith('[') || line.includes('/')) {
          return (
            <div key={i} className="text-sm text-gray-600 ml-4 mb-2">
              {line.trim()}
            </div>
          );
        }
        return <div key={i} className="mb-1">{line}</div>;
      });
    }
    return msg.text;
  };

  // Show connection error if not connected
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4">
          {language === 'am' 
            ? 'ከሰርቨር ጋር መገናኘት አልተቻለም። እባክዎ ኢንተርኔት ግንኙነትዎን ያረጋግጡ።'
            : 'Cannot connect to server. Please check your internet connection.'}
        </div>
        <button
          onClick={checkServerConnection}
          className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {language === 'am' ? 'እንደገና ሞክር' : 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto px-4 py-2">
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Chat container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto rounded-t-xl bg-white shadow-inner p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-center">
              {language === 'am' 
                ? 'እንኳን ደህና መጡ! ጥያቄዎን ይጠይቁ...'
                : 'Welcome! Ask your question...'}
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-xl p-4 ${
              msg.sender === 'user' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {renderMessage(msg)}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-xl p-4 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span>{language === 'am' ? 'በመመለስ ላይ...' : 'Thinking...'}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input form */}
      <div className="bg-white rounded-b-xl shadow-md p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'am' ? 'ጥያቄዎን ይግቡ...' : 'Enter your question...'}
              className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={!isConnected || loading}
            />
            <VoiceInput onResult={handleVoiceResult} language={language} disabled={!isConnected || loading} />
            <button
              type="submit"
              disabled={!isConnected || loading}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {language === 'am' ? 'ላክ' : 'Send'}
            </button>
          </div>
          
          <div className="flex justify-end">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="am">አማርኛ</option>
              <option value="en">English</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 