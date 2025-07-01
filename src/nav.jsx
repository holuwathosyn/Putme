import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-md text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
       {/* Modern Logo */}
<div className="relative group">
  <div 
    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
    className="text-blue-600 text-3xl lg:text-4xl tracking-tighter relative inline-block"
  >
    <span className="relative z-10">
      <span className="text-blue-500">My</span>
      <span className="text-blue-700">post</span>
      <span className="text-blue-800">UTME</span>
    </span>
    
    {/* Modern underline effect */}
    <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
    
    {/* Floating dots decoration */}
    <span className="absolute -top-2 -right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
    </span>
  </div>
  
  {/* Optional subtle glow on hover */}
  <div className="absolute inset-0 rounded-lg bg-blue-100 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 -z-10"></div>
</div>
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center text-gray-900">
          <Link to="/" className="hover:text-blue-500 transition">Home</Link>
          <Link to="/TestMode" className="hover:text-blue-500 transition">Practice</Link>
          <Link to="/ExamMode" className="hover:text-blue-500 transition">Examination</Link>
          <Link to="#" className="hover:text-blue-500 transition">FAQs</Link>
          <Link to="#" className="hover:text-blue-500 transition">Past Questions</Link>
          <Link to="/ContactPage" className="hover:text-blue-500 transition">Contact</Link>
         <Link to="/RegistrationPage"> <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Sign Up</button>
         </Link>
        </div>

        {/* Toggle Button (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white bg-black p-3 rounded-full font-bold text-2xl">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4 text-gray-900 bg-white/10 backdrop-blur-md">
          <Link to="/" className="hover:text-blue-500 transition">Home</Link>
          <Link to="/TestMode" className="hover:text-blue-500 transition">Practice</Link>
          <Link to="/ExamMode" className="hover:text-blue-500 transition">Examination</Link>
          <Link to="#" className="hover:text-blue-500 transition">FAQs</Link>
          <Link to="#" className="hover:text-blue-500 transition">Past Questions</Link>
          <Link to="/ContactPage" className="hover:text-blue-500 transition">Contact</Link>
     <Link to="/RegistrationPage">    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Sign In</button>
     </Link> 
        </div>
      )}
    </nav>
  );
};

export default Navbar;
