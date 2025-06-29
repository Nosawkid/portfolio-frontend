import React, { useState, useEffect, useRef } from 'react';

// Main App Component
export default function App() {
  // State management
  const [messages, setMessages] = useState([
    // Initial message from the bot
    { text: "Hello! I'm Yaseen's portfolio assistant. Feel free to ask me about his skills, projects, or experience.", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for the chat container to enable auto-scrolling
  const chatEndRef = useRef(null);

  // Effect to scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return; // Don't send empty messages

    // Add user's message to the chat
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send the message to the backend API
      // const response = await fetch('http://localhost:8080/chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ message: userMessage }),
      // });
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Add bot's response to the chat
      setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      // Display an error message to the user in the chat
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the component
  return (
    <div className="font-sans bg-gray-100 flex h-screen justify-center items-center">
      <div className="w-full max-w-2xl h-full md:h-[90vh] md:max-h-[700px] flex flex-col bg-white shadow-2xl rounded-lg">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center shadow-md">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Portfolio Assistant</h1>
            <p className="text-sm text-blue-200">Ask me anything about Yaseen Sidhik</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-2xl p-3 rounded-bl-none">
                  <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}
            {/* Invisible element to scroll to */}
            <div ref={chatEndRef}></div>
          </div>
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white border-t rounded-b-lg shadow-inner">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tell me about your projects..."
              className="flex-1 p-3 border rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
