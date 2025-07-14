import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChannelAlert = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show alert after a slight delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Remove any localStorage dismissal setting
    localStorage.removeItem('channelAlertDismissed');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.div 
            className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 w-80"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              {/* Decorative gradient bar */}
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              
              {/* Content */}
              <div className="p-5">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg 
                      className="w-8 h-8 text-blue-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Join Our Community!
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Get updates, tips, and connect with other students in our channel.
                    </p>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="mt-4 flex justify-between space-x-3">
                  <button 
                    onClick={handleDismiss}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Maybe later
                  </button>
                  <a
                    href="https://whatsapp.com/channel/0029Vb66EGZGE56mVPmjHr2x" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors shadow-sm flex-1 text-center"
                  >
                    Join Now
                  </a>
                </div>
              </div>
              
              {/* Close button */}
              <button 
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg 
                  className="w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChannelAlert;