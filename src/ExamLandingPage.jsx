import React from "react";
import { motion } from "framer-motion";
import Footer from "./Footer";
import { Link } from "react-router-dom";

export default function ExamLandingPage() {
  // Array of Nigerian student images
  const nigerianStudents = [
    "istockphoto-947895320-612x612.jpg",
    "femmale.jpg",
    "TwoFemal.jpg",
    "istockphoto-947895320-612x612.jpg"
  ];

  // Exam Mode features with icons
  const examFeatures = [
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      ),
      title: "Exam Mode",
      description: "Timed multiple-choice exams by subject"
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      ),
      title: "Secure Access",
      description: "Login and payment required for exams"
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      ),
      title: "Progress Tracking",
      description: "Tracks answers and shows next question"
    },
   
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      title: "Instant Results",
      description: "Scores exam with answer explanations"
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      ),
      title: "Retry Option",
      description: "Try again with another subject or exam"
    }
  ];

  // Animation variants for features section
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className=" mila min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-900 overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-20"></div>
      
      {/* Floating 3D elements - optimized for mobile */}
      <motion.div 
        className="absolute top-[10%] -left-12 w-32 h-32 md:w-64 md:h-64 bg-blue-500 rounded-full filter blur-[40px] md:blur-[60px] opacity-20"
        animate={{
          x: [0, 60, 0],
          y: [0, -30, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-[20%] -right-12 w-36 h-36 md:w-72 md:h-72 bg-indigo-500 rounded-full filter blur-[50px] md:blur-[70px] opacity-20"
        animate={{
          x: [0, -60, 0],
          y: [0, 30, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 lg:py-16 h-full flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 relative z-10">
        {/* Text content */}
        <motion.div 
          className="w-full lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.h1 
              className="text-3xl xs:text-4xl sm:text-5xl md:text-[3.5rem] lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }} 
            >
              <span className="block font-sans">Master Your</span>
              <span className="block bg-gradient-to-r from-blue-300 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                Post-UTME Exams
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 md:mb-10 max-w-md sm:max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }} 
            >
              Access thousands of curated questions, track your progress in real-time, and get personalized recommendations to ace your exams.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6"
          >
          <Link to="/registrationPage">
  <motion.button 
    whileHover={{ 
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(255,255,255,0.2)"
    }}
    whileTap={{ scale: 0.95 }} 
    className="bg-white text-blue-800 font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-sm sm:text-base font-sans"
  >
    Start Learning Now
    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
    </svg>
  </motion.button>
</Link>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
  {/* Avatar group */}
  <div className="flex -space-x-2 sm:-space-x-3">
    {nigerianStudents.map((student, index) => (
      <img 
        key={index}
        src={student}
        alt="Nigerian student"
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/80 hover:border-white transition-all duration-300 hover:scale-110 object-cover"
      />
    ))}
  </div>

  {/* Text */}
  <p className="text-blue-200 text-xs sm:text-sm md:text-base ml-1 sm:ml-3">
    <span className="font-semibold text-white">10,000+</span> successful students
  </p>
</div>

          </motion.div>
        </motion.div>

        {/* Image section */}
        <motion.div 
          className="w-full lg:w-1/2 mt-8 lg:mt-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            delay: 0.3
          }}
        >
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl border-2 md:border-[3px] border-white/10 hover:border-white/20 transition-all duration-500 aspect-video max-h-[500px]">
            <img 
              src="colleagues-studying-together-university-library.jpg" 
              alt="Nigerian students studying together"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-indigo-900/30"></div>
            
            {/* Trusted Platform badge */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur-sm text-blue-900 font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md flex items-center text-xs sm:text-sm font-sans">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Trusted Platform
            </div>
          </div>
        </motion.div>
      </div>

     {/* Exam Mode Features Section - positioned9 below the hero section */}
<div className="container mx-auto px-4 sm:px-6 pb-12 md:pb-16 lg:pb-20 relative z-10">
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 }}
    className="mt-8 md:mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/20 max-w-6xl mx-auto"
  >
    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-5 flex items-center gap-2 font-sans">
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
      Exam Mode App
    </h3>
    <p className="text-sm sm:text-base text-blue-100 mb-5 sm:mb-6 font-sans">Professional exam simulation with advanced features:</p>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {examFeatures.map((feature, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 hover:from-blue-800/50 hover:to-indigo-800/50 p-3 sm:p-4 rounded-lg transition-all duration-200 border border-white/10"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-900/50 rounded-lg text-blue-300">
              {feature.icon}
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm sm:text-base font-sans">{feature.title}</h4>
              <p className="text-blue-100 text-xs sm:text-sm font-sans">{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
</div>
      <Footer/>
    </div>
  );
}