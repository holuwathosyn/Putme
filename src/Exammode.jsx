import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaCalculator, FaLock, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ExamMode = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [examId, setExamId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(2700);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPaid, setHasPaid] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: 'exam' } });
      return;
    }

    setIsLoggedIn(true);
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/subjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data.data || []);
    } catch (err) {
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };
  const startExam = async (subjectId) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
  
      const response = await axios.get(
        `${API_BASE_URL}/exams/start?subject=${subjectId}&count=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const data = response.data.data;
  
      setExamId(data.exam.id);
      setQuestions(data.questions);
      setSelectedOptions(Array(data.questions.length).fill(null));
      setSelectedSubject(subjects.find(s => s.id === subjectId));
      setQuizCompleted(false);
      setQuizResults(null);
      setTimeRemaining(2700);
      setCurrentIndex(0);
      setShowCalculator(false);
      setHasPaid(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response?.status === 403) {
        setHasPaid(false);
      } else {
        setError(err.response?.data?.message || "Could not start exam. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const initializePayment = async () => {
    try {
      setPaymentLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/subscriptions`,
        { 
          callback_url: `${window.location.origin}/studentdashboard`,
          amount: 1000, 
          email: localStorage.getItem('userEmail')
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.data?.authorization_url) {
        window.location.href = res.data.data.authorization_url;
      } else {
        setError('Failed to initialize payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCalculatorInput = (value) => {
    if (value === 'C') {
      setCalculatorValue('0');
      setPrevValue(null);
      setOperation(null);
    } else if (value === '=') {
      if (!operation) return;
      const current = parseFloat(calculatorValue);
      const previous = parseFloat(prevValue);
      let result;
      switch(operation) {
        case '+': result = previous + current; break;
        case '-': result = previous - current; break;
        case '×': result = previous * current; break;
        case '÷': result = previous / current; break;
        default: return;
      }
      setCalculatorValue(result.toString());
      setPrevValue(null);
      setOperation(null);
    } else if (['+', '-', '×', '÷'].includes(value)) {
      setPrevValue(calculatorValue);
      setOperation(value);
      setCalculatorValue('0');
    } else {
      setCalculatorValue(calculatorValue === '0' ? value : calculatorValue + value);
    }
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
    });
  };

  useEffect(() => {
    if (!selectedSubject || quizCompleted) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedSubject, quizCompleted]);

  const questionOptionsMap = useMemo(() => {
    const map = {};
    questions.forEach(q => {
      map[q.id] = q.options.reduce((acc, opt) => {
        acc[opt.id] = opt.optionText;
        return acc;
      }, {});
    });
    return map;
  }, [questions]);

  const handleSelect = (index, optionId) => {
    const updated = [...selectedOptions];
    updated[index] = optionId;
    setSelectedOptions(updated);
  };
  const submitQuiz = async () => {
    if (!examId) {
      setError('Exam ID missing.');
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const answers = questions.map((q, i) => ({
        question_id: q.id,
        selected_option_id: selectedOptions[i],
      })).filter(a => a.selected_option_id !== null);
  
      await axios.post(  // This should remain POST
        `${API_BASE_URL}/exams/${examId}/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const res = await axios.get(`${API_BASE_URL}/exams/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Rest of the function remains the same
      // ...
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const restart = () => {
    setSelectedSubject(null);
    setExamId(null);
    setQuestions([]);
    setSelectedOptions([]);
    setCurrentIndex(0);
    setQuizCompleted(false);
    setQuizResults(null);
    setTimeRemaining(1800);
    setError(null);
    setShowCalculator(false);
    setHasPaid(true);
  };

  const formatTime = s => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading exam content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={restart}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Login Required</h3>
          <p className="text-gray-600 mb-6">You need to be logged in to access exam mode.</p>
          <button
            onClick={() => navigate('/login', { state: { from: 'exam' } })}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Payment required screen
  if (!hasPaid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-blue-600 text-2xl" />
          </div>
         
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Payment Required</h3>
<p className="text-gray-600 mb-6">
  Access to exams requires a one-time monthly payment of ₦1000.
</p>

          <button
            onClick={initializePayment}
            disabled={paymentLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium w-full hover:bg-indigo-700 transition-colors disabled:opacity-70"
          >
            {paymentLoading ? 'Processing...' : 'Pay ₦1000 to Continue'}
          </button>
          
          {error && (
            <p className="text-red-500 mt-4 text-sm">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // Subjects loading screen
  if (hasPaid && subjects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Loading Subjects...</h3>
          <p className="text-gray-600">Please wait while we load your available courses.</p>
        </div>
      </div>
    );
  }

  // Subject selection
  if (!selectedSubject && !quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto mt-11">
          <div className="text-center mb-8">
            <h1  className=" text-2xl lg:text-4xl font-bold text-gray-600 mb-3  bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        >
              Exam Mode
            </h1>
            <p className="text-gray-600">
              Select a subject to begin your exam
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <motion.button
                key={subject.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startExam(subject.id)}
                className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left border border-gray-100"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 text-xl font-bold text-indigo-600">
                  {subject.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{subject.name}</h3>
                <p className="text-xs text-gray-500">Click to start exam</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No questions available
  if (selectedSubject && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto bg-white  rounded-xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-6">
            There are currently no questions available for {selectedSubject.name}.
            Please check back later or select another subject.
          </p>
          <button
            onClick={restart}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (quizCompleted && quizResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Exam Completed!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You scored <span className="font-bold text-indigo-600">{quizResults.percentage}%</span> in {selectedSubject.name}
            </p>
            
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-8">
              <div 
                className={`h-full rounded-full ${
                  quizResults.percentage >= 70 
                    ? 'bg-green-500' 
                    : 'bg-yellow-500'
                }`}
                style={{ width: `${quizResults.percentage}%` }}
              />
            </div>
            
            <div className="space-y-4 mb-8">
              {quizResults.details.map((d, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border-l-4 ${
                    d.isCorrect 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <p className="font-medium text-gray-800 mb-2">
                    <span className="font-bold">Q{i + 1}:</span> {d.questionText}
                  </p>
                  <p className={`text-sm mb-1 ${
                    d.isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <span className="font-medium">Your answer:</span> {d.selectedOptionText}
                  </p>
                  {!d.isCorrect && (
                    <p className="text-green-700 mb-2">
                      <span className="font-medium">Correct answer:</span> {d.correctOptionText}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 italic">
                    <span className="font-medium">Explanation:</span> {d.explanation}
                  </p>
                </div>
              ))}
            </div>
            
            <button
              onClick={restart}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Take Another Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam in progress
  const question = questions[currentIndex];
  const selectedId = selectedOptions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      {/* Calculator toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCalculator(!showCalculator)}
        className="fixed top-24 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg z-20"
        aria-label="Calculator"
      >
        <FaCalculator size={20} />
      </motion.button>

      {/* Calculator popup */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-32 right-6 w-72 bg-white rounded-lg shadow-xl z-10 border border-gray-200"
          >
            <div className="p-3 bg-indigo-600 text-white text-right text-xl font-mono h-14 flex items-center justify-end overflow-x-auto">
              {calculatorValue}
            </div>
            <div className="grid grid-cols-4 gap-1 p-2 bg-gray-50">
              {['C', '÷', '×', '-'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalculatorInput(btn)}
                  className={`p-3 text-lg font-medium rounded ${
                    ['C'].includes(btn)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                  }`}
                >
                  {btn}
                </button>
              ))}
              {[7, 8, 9, '+'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalculatorInput(btn.toString())}
                  className={`p-3 text-lg font-medium rounded ${
                    ['+'].includes(btn.toString())
                      ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {btn}
                </button>
              ))}
              {[4, 5, 6, '='].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalculatorInput(btn.toString())}
                  className={`p-3 text-lg font-medium rounded ${
                    ['='].includes(btn.toString())
                      ? 'bg-green-100 text-green-600 hover:bg-green-200 row-span-2 h-full'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {btn}
                </button>
              ))}
              {[1, 2, 3].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalculatorInput(btn.toString())}
                  className="p-3 text-lg font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 rounded"
                >
                  {btn}
                </button>
              ))}
              {[0, '.'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalculatorInput(btn.toString())}
                  className="p-3 text-lg font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 rounded"
                >
                  {btn}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto mt-15 bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header with timer */}
        <div className="p-4 bg-indigo-600 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-semibold">{selectedSubject?.name}</h3>
              <p className="text-indigo-100 text-xs sm:text-sm">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              Time: {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
        
        {/* Question content */}
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            {question?.questionText}
          </h3>
          
          <div className="space-y-2 sm:space-y-3">
            {question?.options.map((opt, i) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(currentIndex, opt.id)}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all ${
                  selectedId === opt.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-2 sm:mr-3 flex-shrink-0 flex items-center justify-center ${
                    selectedId === opt.id 
                      ? 'border-indigo-500 bg-indigo-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedId === opt.id && (
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm sm:text-base">{opt.optionText}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-6 sm:mt-8">
            <button
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>
            
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(i => i + 1)}
                disabled={selectedId === null}
                className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-white text-sm sm:text-base ${
                  selectedId === null
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                disabled={selectedId === null || isSubmitting}
                className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-white text-sm sm:text-base ${
                  selectedId === null || isSubmitting
                    ? 'bg-green-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamMode;