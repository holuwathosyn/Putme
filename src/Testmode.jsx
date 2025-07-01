import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const QuizApp = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCorrect, setIsCorrect] = useState(null);

  // Enhanced confetti effect
  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
    });
  };

  // Fetch subjects with beautiful loading animation
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('https://server.mypostutme.com/api/subjects');
        await new Promise(resolve => setTimeout(resolve, 800)); // Smooth delay
        setSubjects(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch subjects. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Timer with pulse animation when low
  useEffect(() => {
    if (!selectedSubject || quizCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizCompleted]);

  const handleTimeUp = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30);
    } else {
      submitQuiz();
    }
  };

  // Enhanced question fetching with animations
  const fetchQuestions = async (subjectId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://server.mypostutme.com/api/sample/exam?subject_id=${subjectId}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Smooth transition
      setQuestions(response.data.data || []);
      setSelectedSubject(subjects.find(sub => sub.id === subjectId));
      setCurrentQuestionIndex(0);
      setTimeLeft(30);
    } catch (err) {
      setError('Failed to fetch questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced option selection with feedback
  const handleOptionSelect = (questionId, optionId) => {
    setIsCorrect(null); // Reset feedback
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    
    // Visual feedback
    setTimeout(() => {
      setIsCorrect(true); // In a real app, you'd check against correct answer
    }, 200);
  };

  // Enhanced quiz submission
  const submitQuiz = async () => {
    try {
      setLoading(true);
      const answers = Object.entries(selectedOptions).map(([questionId, optionId]) => ({
        question_id: parseInt(questionId),
        selected_option_id: optionId
      }));
      const response = await axios.post('https://server.mypostutme.com/api/sample/score', { answers });
      setScore(response.data.data);
      setQuizCompleted(true);
      if (response.data.data.scorePercentage >= 70) {
        fireConfetti();
      }
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const restartQuiz = () => {
    setSelectedSubject(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setQuizCompleted(false);
    setScore(null);
    setTimeLeft(30);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // ==================
  // UI SCENARIOS BELOW
  // ==================

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut"
          }}
          className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg font-medium text-gray-700"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ repeat: 1, duration: 0.6 }}
        >
          <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-red-500 mb-3 mt-4">Oops!</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(59, 130, 246, 0.3)' }} 
          whileTap={{ scale: 0.95 }}
          onClick={restartQuiz} 
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md"
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );

  if (!selectedSubject && !quizCompleted) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-5xl mt-20 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className=" text-2xl lg:text-4xl font-bold text-gray-600 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
           Welcome to your PUTME TestMode!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600"
          >
            Select a subject to begin your challenge
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {subjects.map((subject, i) => (
            <motion.button 
              key={subject.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }} 
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.2)',
                y: -5
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchQuestions(subject.id)}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100"
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600"
                whileHover={{ rotate: 10 }}
              >
                {subject.name.charAt(0)}
              </motion.div>
              <h3 className="font-semibold text-gray-800 text-lg">{subject.name}</h3>
              <motion.div 
                className="mt-3 text-sm text-blue-500 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Start Quiz →
              </motion.div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );

  if (quizCompleted && score) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 border border-gray-100"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </motion.div>
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Quiz Completed!
          </motion.h2>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            You scored {score.scorePercentage}% in {selectedSubject.name}
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex mt-20 justify-between items-center mb-3">
            <span className="font-medium text-gray-700">Your Score:</span>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {score.correct}/{score.total} correct
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${score.scorePercentage}%` }}
              transition={{ duration: 1.5, delay: 0.6, type: 'spring' }}
              className={`h-full rounded-full ${score.scorePercentage >= 70 ? 'bg-gradient-to-r from-green-400 to-teal-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}
            />
          </div>
          {score.scorePercentage >= 70 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-3 text-center text-green-600 font-medium"
            >
              Congratulations! You passed with flying colors!
            </motion.p>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button 
            whileHover={{ 
              scale: 1.02, 
              boxShadow: '0 5px 20px rgba(99, 102, 241, 0.3)'
            }} 
            whileTap={{ scale: 0.98 }}
            onClick={restartQuiz}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Take Another Quiz
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center"
        >
          <svg className="w-16 h-16 mx-auto text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            No questions available
          </h3>
          <p className="text-gray-600 mb-6">
            There are no questions for this subject yet. Please try another.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={restartQuiz}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md"
          >
            Back to Subjects
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <motion.div 
        key={currentQuestionIndex}
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="max-w-2xl mt-11 mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Header with animated timer */}
        <div className="p-6  bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex  justify-between  items-center mb-4">
            <div>
              <span className="font-semibold">{selectedSubject.name}</span>
              <span className="text-blue-100 opacity-90"> - Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>
            <motion.div 
              animate={timeLeft <= 10 ? { 
                scale: [1, 1.05, 1],
                color: ['#fff', '#fecaca', '#fff']
              } : {}}
              transition={timeLeft <= 10 ? { repeat: Infinity, duration: 1 } : {}}
              className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium"
            >
              Time: {timeLeft}s
            </motion.div>
          </div>
          <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-2 overflow-hidden">
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / 30) * 100}%` }}
              transition={{ duration: 1 }}
              className={`h-full rounded-full ${timeLeft <= 10 ? 'bg-gradient-to-r from-red-400 to-pink-500' : 'bg-gradient-to-r from-white to-blue-100'}`}
            />
          </div>
        </div>
        
        {/* Question content */}
        <div className="p-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-gray-800 mb-6"
          >
            {currentQuestion.questionText}
          </motion.h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    backgroundColor: selectedOptions[currentQuestion.id] === option.id ? 'rgba(219, 234, 254, 1)' : 'rgba(255, 255, 255, 1)'
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 300
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: 'rgba(219, 234, 254, 0.7)'
                  }}
                  className={`block w-full p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    selectedOptions[currentQuestion.id] === option.id 
                      ? 'border-blue-400 shadow-md' 
                      : 'border-gray-200'
                  }`}
                >
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name={`question-${currentQuestion.id}`} 
                      value={option.id}
                      checked={selectedOptions[currentQuestion.id] === option.id}
                      onChange={() => handleOptionSelect(currentQuestion.id, option.id)} 
                      className="sr-only" 
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
                      selectedOptions[currentQuestion.id] === option.id 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedOptions[currentQuestion.id] === option.id && (
                        <motion.svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                    </div>
                    <span className="text-gray-800">{option.optionText}</span>
                  </label>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Navigation buttons */}
          <motion.div 
            className="flex justify-between mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {currentQuestionIndex > 0 && (
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 4px 14px rgba(156, 163, 175, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { 
                  setCurrentQuestionIndex(prev => prev - 1); 
                  setTimeLeft(30); 
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium transition-all"
              >
                ← Previous
              </motion.button>
            )}
            
            {currentQuestionIndex < questions.length - 1 ? (
              <motion.button 
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: selectedOptions[currentQuestion.id] 
                    ? '0 4px 14px rgba(59, 130, 246, 0.3)' 
                    : 'none'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { 
                  setCurrentQuestionIndex(prev => prev + 1); 
                  setTimeLeft(30); 
                }}
                disabled={!selectedOptions[currentQuestion.id]}
                className={`px-6 py-2 ml-auto rounded-lg font-medium transition-all ${
                  selectedOptions[currentQuestion.id]
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next Question →
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: selectedOptions[currentQuestion.id] 
                    ? '0 4px 14px rgba(16, 185, 129, 0.3)' 
                    : 'none'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={submitQuiz} 
                disabled={!selectedOptions[currentQuestion.id]}
                className={`px-6 py-2 ml-auto rounded-lg font-medium transition-all ${
                  selectedOptions[currentQuestion.id]
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit Quiz
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizApp;