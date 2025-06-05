import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const MobileToggle = ({ setIsCollapsed, isCollapsed }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the button after a small delay for a nice entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      className={`
        fixed z-50 bottom-6 right-6 p-4 
        bg-red-600 rounded-full shadow-lg text-white lg:hidden 
        hover:bg-red-700 transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        transform transition-all ease-in-out duration-500
      `}
      style={{
        boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.4)'
      }}
    >
      {isCollapsed ? (
        <Menu className="h-5 w-5 animate-pulse" />
      ) : (
        <X className="h-5 w-5" />
      )}
      
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
    </button>
  );
};

export default MobileToggle;
