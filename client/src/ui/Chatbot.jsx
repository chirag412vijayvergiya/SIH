import React, { useState, useEffect, useRef } from 'react';
import { BsChatHeartFill } from 'react-icons/bs';
import { GiCrossedSabres } from 'react-icons/gi';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const chatbotRef = useRef(null);

  // Function to toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Function to handle clicks outside the chatbot
  const handleClickOutside = (event) => {
    if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the chatbot
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[2000]">
      {/* Chatbot Button */}
      <button
        className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105"
        onClick={toggleChatbot}
      >
        <BsChatHeartFill className="h-8 w-8" />
      </button>

      {/* Chatbot Window */}
      <div
        ref={chatbotRef}
        className={`fixed bottom-16 right-4 h-96 w-80 transform rounded-lg border border-gray-300 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div
          className="flex cursor-pointer items-center justify-between rounded-t-lg bg-blue-600 p-3 text-white"
          onClick={toggleChatbot}
        >
          <h3 className="text-lg font-semibold">Chatbot</h3>
          <button
            className="border-none bg-transparent text-xl text-white"
            onClick={(e) => {
              e.stopPropagation(); // Prevents the button click from propagating to the div
              toggleChatbot();
            }}
          >
            <GiCrossedSabres className="mr-7 h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Chat content */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-start space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              <div className="rounded-lg bg-gray-100 p-2">
                <p>Hello! How can I assist you today?</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-x-2">
              <div className="rounded-lg bg-blue-100 p-2">
                <p>I need help with my account.</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-300"></div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 bg-gray-100 p-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
