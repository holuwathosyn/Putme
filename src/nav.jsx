import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Practice", path: "/TestMode" },
    { name: "Examination", path: "/ExamLandingPage" },
    { name: "FAQs", path: "/FAQs" },
    { name: "Past Questions", path: "/BuyPdf" },
    { name: "Contact", path: "/ContactPage" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white"}`}>
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative group"
        >
          <div 
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            className="text-blue-600 text-3xl lg:text-4xl tracking-tighter relative inline-block"
          >
            <span className="relative z-10">
              <span className="text-blue-500">My</span>
              <span className="text-blue-700">post</span>
              <span className="text-blue-800">UTME</span>
            </span>
            <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {menuItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className="text-gray-700 hover:text-blue-500 transition text-lg font-medium"
            >
              {item.name}
            </Link>
          ))}
          <Link to="/RegistrationPage">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition text-lg font-medium"
            >
              Sign Up
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-gray-700 p-2 rounded-md focus:outline-none"
        >
          {isOpen ? (
            <FiX className="h-8 w-8" />
          ) : (
            <FiMenu className="h-8 w-8" />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu - React Native Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25 }}
            className="md:hidden fixed inset-0 bg-white z-40 pt-24 px-6 overflow-y-auto"
          >
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to={item.path} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-4 px-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition"
                  >
                    <span className="text-xl font-medium text-gray-800">{item.name}</span>
                    <FiChevronRight className="text-gray-400 text-xl" />
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                className="mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  to="/RegistrationPage" 
                  onClick={() => setIsOpen(false)}
                  className="block bg-blue-500 text-white text-xl font-medium py-4 rounded-lg text-center hover:bg-blue-600 transition"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>

            {/* Close button at bottom (mobile-friendly) */}
            <motion.button
              onClick={() => setIsOpen(false)}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-700 px-8 py-3 rounded-full text-lg font-medium shadow-sm"
            >
              Close Menu
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;