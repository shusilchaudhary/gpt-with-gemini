import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

function Main() {
  const { 
    onSent, 
    setInput, 
    input, 
    prevPrompts, 
    setPrevPrompts,
    isSidebarOpen 
  } = useContext(Context);
  
  const [qaPairs, setQaPairs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    // Load saved chat pairs
    const savedQaPairs = localStorage.getItem('qaPairs');
    if (savedQaPairs) {
      setQaPairs(JSON.parse(savedQaPairs));
    }
    
    // Load saved prompts history
    const savedPrompts = localStorage.getItem('prevPrompts');
    if (savedPrompts && JSON.parse(savedPrompts).length > 0) {
      setPrevPrompts(JSON.parse(savedPrompts));
    }
  }, [setPrevPrompts]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (qaPairs.length > 0) {
      localStorage.setItem('qaPairs', JSON.stringify(qaPairs));
    }
  }, [qaPairs]);

  const handleSent = async () => {
    if (!input.trim()) return;

    const userPrompt = input;
    setInput('');
    setQaPairs((prev) => [...prev, { question: userPrompt, answer: null }]);
    setLoading(true);

    // Add to previous prompts if not already there - do this here only
    if (!prevPrompts.includes(userPrompt)) {
      const updatedPrompts = [...prevPrompts, userPrompt];
      setPrevPrompts(updatedPrompts);
      // Save updated prompts to localStorage for persistence
      localStorage.setItem('prevPrompts', JSON.stringify(updatedPrompts));
    }

    try {
      const response = await onSent(userPrompt);
      console.log("Raw response from onSent:", response);

      // Check if response exists
      if (response) {
        // Remove any remaining stars that might have been missed
        const cleanResponse = response.replace(/\*/g, "");
        setQaPairs((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].answer = cleanResponse;
          return updated;
        });
      } else {
        setQaPairs((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].answer = "Sorry, I couldn't generate a response. Please try again.";
          return updated;
        });
      }
    } catch (error) {
      console.error('Error generating answer:', error);
      setQaPairs((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].answer = 'Failed to generate response. Please try again.';
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setQaPairs([]);
    setPrevPrompts([]);
    localStorage.removeItem('qaPairs');
    localStorage.removeItem('prevPrompts');
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      {/* Header Section - Modified to remove Gemini text and empty div */}
      <div className="w-full flex justify-end items-center px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="flex items-center gap-4">
          {qaPairs.length > 0 && (
            <button 
              onClick={clearChat}
              className="px-3 py-1 bg-blue-600 text-black text-2xl font-bold  bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all"
            >
              Clear Chat
            </button>
          )}
          <img className="h-10 w-10 rounded-full" src={assets.user_icon} alt="User Icon" />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        {qaPairs.length === 0 && !loading && (
          <>
            {/* Welcome Section */}
            <div className="text-center my-8">
              <p className="text-4xl font-semibold text-gray-800">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                  Hello, Dev.
                </span>
              </p>
              <p className="text-lg text-gray-500">How can we help you today?</p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition duration-300 hover:bg-gray-100"
                onClick={() => {
                  setInput("Suggest a beautiful place for upcoming trial");
                  setTimeout(handleSent, 100);
                }}
              >
                <p className="text-lg text-gray-800">Suggest a beautiful place for upcoming trial</p>
                <img className="w-9 absolute bottom-4 right-4" src={assets.compass_icon} alt="Compass Icon" />
              </div>
              <div 
                className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition duration-300 hover:bg-gray-100"
                onClick={() => {
                  setInput("Briefly summarize the concept of Urban Planning!");
                  setTimeout(handleSent, 100);
                }}
              >
                <p className="text-lg text-gray-800">Briefly summarize the concept of Urban Planning!</p>
                <img className="w-9 absolute bottom-4 right-4" src={assets.bulb_icon} alt="Bulb Icon" />
              </div>
              <div 
                className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition duration-300 hover:bg-gray-100"
                onClick={() => {
                  setInput("Brainstorm team bonding activities for the work retreat!");
                  setTimeout(handleSent, 100);
                }}
              >
                <p className="text-lg text-gray-800">Brainstorm team bonding activities for the work retreat!</p>
                <img className="w-9 absolute bottom-4 right-4" src={assets.message_icon} alt="Message Icon" />
              </div>
              <div 
                className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition duration-300 hover:bg-gray-100"
                onClick={() => {
                  setInput("Improve the readability of my following code!");
                  setTimeout(handleSent, 100);
                }}
              >
                <p className="text-lg text-gray-800">Improve the readability of my following code!</p>
                <img className="w-9 absolute bottom-4 right-4" src={assets.code_icon} alt="Code Icon" />
              </div>
            </div>
          </>
        )}

        {/* QA Section */}
        <div className="max-h-[70vh] overflow-y-auto mt-8 scrollbar-hide space-y-6">
          {qaPairs.map((pair, index) => (
            <div key={index}>
              <div className="flex items-center gap-3 my-4">
                <img className="rounded-full w-12" src={assets.user_icon} alt="User Icon" />
                <p className="text-xl font-semibold text-gray-800">{pair.question}</p>
              </div>
              <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-md">
                <img className="w-12" src={assets.gemini_icon} alt="Gemini Icon" />
                <div className="flex-1">
                  <p className="text-gray-700">
                    {pair.answer === null ? 
                      <span className="text-gray-400 animate-pulse">Thinking...</span> : 
                      <span dangerouslySetInnerHTML={{ __html: pair.answer }} />
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[600px] lg:w-[900px] bg-white shadow-lg rounded-xl py-3 px-6 mb-4 flex items-center gap-4">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => e.key === 'Enter' && handleSent()}
            className="flex-1 p-3 text-base rounded-xl bg-gray-100 border-none focus:outline-none"
            type="text"
            placeholder="Enter a prompt here..."
          />
          <div className="flex gap-4">
            <img className="w-6 cursor-pointer" src={assets.gallery_icon} alt="Gallery" />
            <img className="w-6 cursor-pointer" src={assets.mic_icon} alt="Mic" />
            {input && (
              <img
                onClick={handleSent}
                className="w-6 cursor-pointer"
                src={assets.send_icon}
                alt="Send"
              />
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center mt-2 text-gray-500 px-6">
          Sometimes, Gemini generates incorrect info. Please, verify before using it.
        </p>
      </div>
    </div>
  );
}

export default Main;