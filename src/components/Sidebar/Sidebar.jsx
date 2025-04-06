import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

function Sidebar() {
  const [extended, setExtended] = useState(false);
  const { 
    onSent, 
    prevPrompts, 
    setRecentPrompt, 
    newChat, 
    setIsSidebarOpen 
  } = useContext(Context);
  
  // Persist expanded state in localStorage
  useEffect(() => {
    const savedExtended = localStorage.getItem('sidebarExtended');
    if (savedExtended) {
      setExtended(JSON.parse(savedExtended));
      // Initialize the sidebar state in context
      setIsSidebarOpen(JSON.parse(savedExtended));
    }
  }, [setIsSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebarExtended', JSON.stringify(extended));
    // Update the sidebar visibility state in context
    setIsSidebarOpen(extended);
  }, [extended, setIsSidebarOpen]);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  const handleNewChat = () => {
    newChat();
    // You might want to redirect to home or clear the current chat
    window.location.reload(); // Simple way to clear the current chat
  };

  return (
    <div className={`hidden lg:flex h-screen fixed ${extended ? 'w-64' : 'w-20'} flex-col bg-gray-800 text-white shadow-lg top-0 left-0 transition-all duration-300`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 bg-blue-600">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="w-8 cursor-pointer filter invert hover:scale-110 transition-all duration-300"
          src={assets.menu_icon}
          alt="Menu Icon"
        />
        {extended && <p className="text-lg font-semibold">Gemini Chat</p>}
      </div>

      {/* Sidebar Items */}
      <div className="flex flex-col flex-grow gap-4 px-4 mt-4">
        {/* New Chat Button */}
        <div
          onClick={handleNewChat}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200"
        >
          <img
            className="w-6 filter invert"
            src={assets.plus_icon}
            alt="New Chat Icon"
          />
          {extended && <p>New Chat</p>}
        </div>

        {/* Recent Section */}
        {prevPrompts.length > 0 && (
          <div className="mt-4">
            {extended && <p className="text-gray-400 text-sm mb-2">Recent</p>}
            <div className="max-h-[60vh] overflow-y-auto">
              {prevPrompts.map((item, index) => (
                <div
                  key={index}
                  onClick={() => loadPrompt(item)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200 mb-1"
                >
                  <img
                    className="w-6 filter invert"
                    src={assets.message_icon}
                    alt="Message Icon"
                  />
                  {extended && (
                    <p className="text-sm truncate max-w-[180px]">
                      {item.length > 25 ? item.substring(0, 25) + "..." : item}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex justify-center p-4 mt-auto mb-6 text-gray-400 text-xs">
          {extended && <p>Powered by Gemini</p>}
        </div>
      </div>

      {/* Help, Activity, Settings */}
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200">
          <img
            className="w-6 filter invert"
            src={assets.question_icon}
            alt="Help Icon"
          />
          {extended && <p>Help</p>}
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200">
          <img
            className="w-6 filter invert"
            src={assets.history_icon}
            alt="History Icon"
          />
          {extended && <p>Activity</p>}
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200">
          <img
            className="w-6 filter invert"
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