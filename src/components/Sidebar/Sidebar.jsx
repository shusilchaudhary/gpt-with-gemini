import React, { useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

function Sidebar() {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  return (
    <div className="hidden lg:flex h-screen fixed w-60 flex-col bg-gray-400 text-white shadow-lg top-0 left-0 transition-all duration-300">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 bg-blue-500">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="w-8 cursor-pointer filter grayscale hover:filter-none transition-all duration-300"
          src={assets.menu_icon}
          alt="Menu Icon"
        />
        <div className="flex items-center gap-2">
          {extended && <p className="text-lg">Hello, User</p>}
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="flex flex-col flex-grow gap-4 px-4 mt-4">
        {/* New Chat Button */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200"
        >
          <img
            className="w-6 filter grayscale hover:filter-none transition-all duration-300"
            src={assets.plus_icon}
            alt="New Chat Icon"
          />
          {extended && <p>New Chat</p>}
        </div>

        {/* Recent Section */}
        {extended && (
          <div className="mt-4">
            <p className="text-gray-400">Recent</p>
            {prevPrompts.map((item, index) => (
              <div
                key={index}
                onClick={() => loadPrompt(item)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200"
              >
                <img
                  className="w-6 filter grayscale hover:filter-none transition-all duration-300"
                  src={assets.message_icon}
                  alt="Message Icon"
                />
                <p className="text-sm">{item}...</p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex justify-center p-4 mt-auto mb-6 text-gray-400 text-xs">
          <p>Powered by Gemini</p>
        </div>
      </div>

      {/* Help, Activity, Settings */}
      <div className="flex flex-col gap-4 p-4 mt-4">
        <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200">
          <img
            className="w-6 filter grayscale hover:filter-none transition-all duration-300"
            src={assets.question_icon}
            alt="Help Icon"
          />
          {extended && <p>Help</p>}
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200">
          <img
            className="w-6 filter grayscale hover:filter-none transition-all duration-300"
            src={assets.history_icon}
            alt="History Icon"
          />
          {extended && <p>Activity</p>}
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200">
          <img
            className="w-6 filter grayscale hover:filter-none transition-all duration-300"
            src={assets.setting_icon}
            alt="Settings Icon"
          />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

