import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaCalculator, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ExamMode = () => {
  // State management
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [examId, setExamId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(1800);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: 'exam' } });
      return;
    }

    setIsLoggedIn(true);
    verifyPaymentAndLoad();
  }, [navigate]);

  // ✅ FIXED verifyPaymentAndLoad
  const verifyPaymentAndLoad = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams(window.location.search);
      const reference = params.get('reference');

      if (reference) {
        console.log('Detected Paystack return, forcing verify...');
        const paymentStatus = await checkPaymentStatus(true);
        if (paymentStatus) {
          await fetchSubjects();
          window.history.replaceState({}, '', window.location.pathname);
        } else {
          setError('Payment verification failed. Please try again.');
        }
      } else {
        console.log('No reference, checking normal status...');
        const isPaid = await checkPaymentStatus();
        if (isPaid) {
          await fetchSubjects();
        }
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Payment verification error. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reusable payment check
  const checkPaymentStatus = async (force = false) => {
    try {
      const token = localStorage.getItem('token');
      const url = force
        ? `${API_BASE_URL}/subscriptions/verify`
        : `${API_BASE_URL}/subscriptions/status`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: Date.now() }
      });

      console.log('Checking payment status:', force ? 'force verify' : 'status', res.data);

      const isSubscribed = res.data?.status === true;
      setHasPaid(isSubscribed);
      return isSubscribed;
    } catch (err) {
      console.error('Payment check failed:', err);
      setHasPaid(false);
      return false;
    }
  };

  const initializePayment = async () => {
    try {
      setPaymentLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/subscriptions`,
        {
          callback_url: `${window.location.origin}/exam`,
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
      setError(err.response?.data?.message || 'Payment initialization failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(res.data.data || []);
    } catch (err) {
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const startExam = async subjectId => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: 'exam' } });
        return;
      }

      if (!hasPaid) {
        const isPaid = await checkPaymentStatus();
        if (!isPaid) {
          setError('Payment verification failed. Please try again.');
          return;
        }
      }

      const res = await axios.get(
        `${API_BASE_URL}/exams/start?subject=${subjectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data.data;
      setExamId(data.exam.id);
      setQuestions(data.questions || []);
      setSelectedOptions(Array(data.questions.length).fill(null));
      setSelectedSubject(subjects.find(s => s.id === subjectId));
      setQuizCompleted(false);
      setQuizResults(null);
      setTimeRemaining(1800);
      setCurrentIndex(0);
      setShowCalculator(false);
    } catch {
      setError('Could not start exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Render states unchanged - loader, error, payment screen, etc
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
        />
        {paymentLoading && (
          <p className="text-gray-600">Processing payment...</p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={verifyPaymentAndLoad}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Login Required</h3>
          <p className="text-gray-600 mb-6">You need to be logged in to access exam mode.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login', { state: { from: 'exam' } })}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md"
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!hasPaid && subjects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-purple-500 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Payment Required</h3>
          <p className="text-gray-600 mb-6">Access to exams requires a one-time payment of ₦1000</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initializePayment}
            disabled={paymentLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium shadow-md w-full"
          >
            {paymentLoading ? 'Processing...' : 'Pay ₦1000 to Continue'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Render actual exam or subject selection here...
  // Show course selection if subjects are loaded and quiz hasn't started
if (subjects.length > 0 && !quizCompleted && questions.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select a Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map(subject => (
            <motion.div
              key={subject.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startExam(subject.id)}
              className="cursor-pointer p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{subject.name}</h3>
              <p className="text-gray-500">Click to start exam</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

};

export default ExamMode;
