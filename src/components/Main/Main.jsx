import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

function Main() {
  const { onSent, setInput, input, resultData } = useContext(Context);
  const [qaPairs, setQaPairs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSent = async () => {
    if (!input.trim()) return;

    const userPrompt = input;
    setInput('');
    setLoading(true);

    try {
      let answer = await onSent(userPrompt);

      if (!answer && resultData) {
        answer = resultData;
      }

      const cleanAnswer = (answer || 'Sorry, I couldn’t generate a response.').replace(/\*/g, '');

      setQaPairs((prev) => [...prev, { question: userPrompt, answer: cleanAnswer }]);
    } catch (error) {
      console.error('Error generating answer:', error);
      setQaPairs((prev) => [...prev, { question: userPrompt, answer: 'Failed to generate response. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <p className="text-3xl font-bold">Gemini</p>
        <img className="h-10 w-10 rounded-full" src={assets.user_icon} alt="User Icon" />
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
              <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition duration-300 hover:bg-gray-100">
                <p className="text-lg text-gray-800">Suggest a beautiful place for upcoming trial</p>
                <img className="w-9 absolute bottom-4 right-4" src={assets.compass_icon} alt="Compass Icon" />
              </div>
              <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition duration-300 hover:bg-gray-100">
                <p className="text-lg text-gray-800">Briefly summarize the concept of Urban Planning!</p>
                <img className="w-9 absolute bottom-4 right-4" src={assets.bulb_icon} alt="Bulb Icon" />
              </div>
              <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition duration-300 hover:bg-gray-100">
                <p className="text-lg text-gray-800">Brainstorm team bonding activities for the work retreat!</p>
                <img className="w-9 absolute bottom-4 right-4" src={assets.message_icon} alt="Message Icon" />
              </div>
              <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition duration-300 hover:bg-gray-100">
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
                <div>
                  <p dangerouslySetInnerHTML={{ __html: pair.answer }} className="text-gray-700"></p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-md">
              <img className="w-12" src={assets.gemini_icon} alt="Gemini Icon" />
              <div className="flex items-center">
                <p className="text-gray-500 animate-pulse">Thinking...</p>
                <span className="dot-flash ml-1"></span>
              </div>
            </div>
          )}
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
