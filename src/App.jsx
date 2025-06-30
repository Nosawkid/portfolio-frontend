import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm Yaseen's portfolio assistant. Feel free to ask me about his skills, projects, or experience.",
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 text-gray-100 flex h-screen justify-center items-center font-sans">
      <div className="w-full max-w-2xl h-full md:h-[90vh] md:max-h-[700px] flex flex-col bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center space-x-4 p-4 bg-gray-800 border-b border-gray-700 shadow-md">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center shadow-inner">
            {/* Stylish Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Portfolio Assistant</h1>
            <p className="text-sm text-gray-400">Ask me anything about Yaseen Sidhik</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md px-4 py-3 rounded-2xl shadow ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-bl-none'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-200 rounded-2xl px-4 py-3 shadow rounded-bl-none">
                <div className="flex space-x-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-full placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
