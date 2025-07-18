
import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from './axiosClient';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  FaCalculator, 
  FaArrowLeft, 
  FaCheck, 
  FaTimes, 
  FaChartBar, 
  FaClock,
  FaBook,
  FaChevronRight,
  FaMoneyBillWave,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const JambExamSimulator = () => {
  // State declarations
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [exams, setExams] = useState({});
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResults, setExamResults] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(7200);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('0');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [subjectSelectionCompleted, setSubjectSelectionCompleted] = useState(false);
  const [showSubjectResults, setShowSubjectResults] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [submittingAll, setSubmittingAll] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Constants
  const ENGLISH_SUBJECT_ID = 1;
  const MAX_SUBJECTS = 4;
  const TOTAL_EXAM_TIME = 7200;

  // Helper functions
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
    });
  }, []);

  // Save exam state to localStorage
  const saveExamState = useCallback(() => {
    const examState = {
      subjects,
      selectedSubjects,
      exams,
      currentSubjectIndex,
      questions,
      selectedOptions,
      currentQuestionIndex,
      examCompleted,
      examResults,
      timeRemaining,
      examStarted,
      subjectSelectionCompleted,
      showSubjectResults,
      showAnswers
    };
    localStorage.setItem('jambExamState', JSON.stringify(examState));
  }, [
    subjects,
    selectedSubjects,
    exams,
    currentSubjectIndex,
    questions,
    selectedOptions,
    currentQuestionIndex,
    examCompleted,
    examResults,
    timeRemaining,
    examStarted,
    subjectSelectionCompleted,
    showSubjectResults,
    showAnswers
  ]);

  // Load exam state from localStorage
  const loadExamState = useCallback(() => {
    const savedState = localStorage.getItem('jambExamState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setSubjects(state.subjects || []);
      setSelectedSubjects(state.selectedSubjects || []);
      setExams(state.exams || {});
      setCurrentSubjectIndex(state.currentSubjectIndex || 0);
      setQuestions(state.questions || []);
      setSelectedOptions(state.selectedOptions || []);
      setCurrentQuestionIndex(state.currentQuestionIndex || 0);
      setExamCompleted(state.examCompleted || false);
      setExamResults(state.examResults || null);
      setTimeRemaining(state.timeRemaining || TOTAL_EXAM_TIME);
      setExamStarted(state.examStarted || false);
      setSubjectSelectionCompleted(state.subjectSelectionCompleted || false);
      setShowSubjectResults(state.showSubjectResults || false);
      setShowAnswers(state.showAnswers || false);
    }
  }, []);

  // Clear exam state from localStorage
  const clearExamState = useCallback(() => {
    localStorage.removeItem('jambExamState');
  }, []);

  // API functions
  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/subjects');
      const allSubjects = res.data.data || [];
      
      const processedSubjects = allSubjects.map(subject => ({
        ...subject,
        isCompulsory: subject.id === ENGLISH_SUBJECT_ID
      }));
      
      setSubjects(processedSubjects);
    } catch (err) {
      if (err.response?.status === 403) {
        setPaymentRequired(true);
      } else {
        setError('Failed to load subjects. Please try again later.');
      }
      console.error('Fetch subjects error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const startSubjectExam = useCallback(async (subjectId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get(
        `/exams/start?subject=${subjectId}&count=50`
      );

      const { data } = response.data;

      if (!data?.exam?.id || !data?.questions) {
        throw new Error('Invalid exam data received');
      }

      return {
        examId: data.exam.id,
        questions: data.questions,
        subject: subjects.find(s => s.id === subjectId)
      };
    } catch (err) {
      console.error('Exam start error:', err.response?.data || err.message);
      if (err.response?.status === 403) {
        setPaymentRequired(true);
        return null;
      }
      setError(err.response?.data?.message || "Could not start exam. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [subjects]);
 // Subject selection handlers
  const handleSubjectSelect = useCallback((subject) => {
    if (subject.isCompulsory && selectedSubjects.some(s => s.id === subject.id)) {
      return;
    }

    setSelectedSubjects(prev => {
      if (prev.some(s => s.id === subject.id)) {
        return prev.filter(s => s.id !== subject.id);
      }
      
      if (prev.length < MAX_SUBJECTS) {
        return [...prev, subject];
      }
      
      const englishIndex = prev.findIndex(s => s.isCompulsory);
      const replaceIndex = englishIndex === 0 ? 1 : 0;
      return [
        ...prev.slice(0, replaceIndex),
        subject,
        ...prev.slice(replaceIndex + 1)
      ];
    });
  }, [selectedSubjects]);

  const completeSubjectSelection = useCallback(async () => {
    if (selectedSubjects.length !== MAX_SUBJECTS) {
      setError(`Please select exactly ${MAX_SUBJECTS} subjects.`);
      return;
    }

    try {
      setLoading(true);
      
      const examPromises = selectedSubjects.map(subject => 
        startSubjectExam(subject.id)
      );
      
      const examResults = await Promise.all(examPromises);
      
      if (examResults.some(result => !result)) {
        throw new Error('Failed to start some exams');
      }
      
      const examsData = {};
      examResults.forEach((result, index) => {
        if (result) {
          examsData[index] = {
            examId: result.examId,
            questions: result.questions,
            subject: result.subject,
            selectedOptions: Array(result.questions.length).fill(null)
          };
        }
      });
      
      setExams(examsData);
      setQuestions(examsData[0].questions);
      setSelectedOptions(examsData[0].selectedOptions);
      setSubjectSelectionCompleted(true);
      setExamStarted(true);
      setTimeRemaining(TOTAL_EXAM_TIME);
    } catch (err) {
      if (err.response?.status === 403) {
        setPaymentRequired(true);
      } else {
        setError('Failed to initialize exams. Please try again.');
      }
      console.error('Exam initialization error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSubjects, startSubjectExam]);

  // Exam functions
  const handleOptionSelect = useCallback((questionIndex, optionId) => {
    setSelectedOptions(prev => {
      const updated = [...prev];
      updated[questionIndex] = optionId;
      return updated;
    });
    
    setExams(prev => ({
      ...prev,
      [currentSubjectIndex]: {
        ...prev[currentSubjectIndex],
        selectedOptions: {
          ...prev[currentSubjectIndex].selectedOptions,
          [questionIndex]: optionId
        }
      }
    }));
  }, [currentSubjectIndex]);

  const submitSubjectExam = useCallback(async () => {
    if (!exams[currentSubjectIndex]?.examId) {
      setError('Exam ID missing. Cannot submit answers.');
      return;
    }
  
    const currentExam = exams[currentSubjectIndex];
    const answers = currentExam.questions.map((q, i) => ({
      question_id: q.id,
      selected_option_id: currentExam.selectedOptions[i] ?? null,
    }));
  
    try {
      setIsSubmitting(true);
  
      const response = await axiosClient.post(
        `/exams/${currentExam.examId}/submit`,
        { answers }
      );
  
      const { score, total, results } = response.data;
  
      const transformedDetails = results.map(result => ({
        questionText: result.questionText,
        selectedOptionId: result.selectedOptionId,
        selectedOptionText: result.selectedOptionText,
        correctOptionId: result.correctOptionId,
        correctOptionText: result.correctOptionText,
        explanation: result.explanation,
        isCorrect: result.isCorrect,
        options: currentExam.questions.find(q => q.id === result.questionId)?.options || [],
      }));
  
      setExams(prev => ({
        ...prev,
        [currentSubjectIndex]: {
          ...prev[currentSubjectIndex],
          results: {
            totalQuestions: total,
            correctAnswers: score,
            percentage: Math.round((score / total) * 100),
            details: transformedDetails
          }
        }
      }));
  
      setShowSubjectResults(true);
      
      if (currentSubjectIndex === MAX_SUBJECTS - 1) {
        setExamCompleted(true);
        calculateOverallResults();
        fireConfetti();
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentSubjectIndex, exams, fireConfetti]);

  const submitAllSubjects = useCallback(async () => {
    try {
      setSubmittingAll(true);
      
      // Submit all subjects that haven't been submitted yet
      for (let i = currentSubjectIndex; i < MAX_SUBJECTS; i++) {
        if (!exams[i]?.results) {
          setCurrentSubjectIndex(i);
          setQuestions(exams[i].questions);
          setSelectedOptions(exams[i].selectedOptions);
          await submitSubjectExam();
        }
      }
      
      setExamCompleted(true);
      calculateOverallResults();
      fireConfetti();
    } catch (err) {
      console.error("Submit all error:", err);
      setError('Failed to submit all subjects. Please try again.');
    } finally {
      setSubmittingAll(false);
    }
  }, [currentSubjectIndex, exams, submitSubjectExam, fireConfetti]);

  const calculateOverallResults = useCallback(() => {
    let totalQuestions = 0;
    let totalCorrect = 0;
    const subjectResults = [];
    
    Object.values(exams).forEach(exam => {
      if (exam.results) {
        totalQuestions += exam.results.totalQuestions;
        totalCorrect += exam.results.correctAnswers;
        subjectResults.push({
          subject: exam.subject.name,
          score: exam.results.correctAnswers,
          total: exam.results.totalQuestions,
          percentage: exam.results.percentage
        });
      }
    });
    
    setExamResults({
      totalQuestions,
      totalCorrect,
      overallPercentage: Math.round((totalCorrect / totalQuestions) * 100),
      subjectResults,
      timeTaken: TOTAL_EXAM_TIME - timeRemaining
    });
  }, [exams, timeRemaining]);

  const moveToNextSubject = useCallback(() => {
    const nextSubjectIndex = currentSubjectIndex + 1;
    if (nextSubjectIndex < MAX_SUBJECTS) {
      setCurrentSubjectIndex(nextSubjectIndex);
      setQuestions(exams[nextSubjectIndex].questions);
      setSelectedOptions(exams[nextSubjectIndex].selectedOptions);
      setCurrentQuestionIndex(0);
      setShowSubjectResults(false);
    }
  }, [currentSubjectIndex, exams]);

  const switchSubject = useCallback((subjectIndex) => {
    if (subjectIndex < 0 || subjectIndex >= MAX_SUBJECTS) return;
    
    setCurrentSubjectIndex(subjectIndex);
    setQuestions(exams[subjectIndex].questions);
    setSelectedOptions(exams[subjectIndex].selectedOptions);
    setCurrentQuestionIndex(0);
    setShowSubjectResults(false);
  }, [exams]);

  const restartExam = useCallback(() => {
    setSelectedSubjects([]);
    setExams({});
    setCurrentSubjectIndex(0);
    setQuestions([]);
    setSelectedOptions([]);
    setCurrentQuestionIndex(0);
    setExamCompleted(false);
    setExamResults(null);
    setTimeRemaining(TOTAL_EXAM_TIME);
    setError(null);
    setShowCalculator(false);
    setExamStarted(false);
    setSubjectSelectionCompleted(false);
    setShowSubjectResults(false);
    setShowAnswers(false);
    setPaymentRequired(false);
    clearExamState();
  }, [clearExamState]);

  // Calculator functions
  const handleCalculatorInput = useCallback((value) => {
    if (value === 'C') {
      setCalculatorValue('0');
    } else if (value === '=') {
      try {
        const expression = calculatorValue.replace(/×/g, '*').replace(/÷/g, '/');
        setCalculatorValue(eval(expression).toString());
      } catch {
        setCalculatorValue('Error');
      }
    } else if (['+', '-', '×', '÷'].includes(value)) {
      setCalculatorValue(prev => prev + ' ' + value + ' ');
    } else {
      setCalculatorValue(prev => prev === '0' ? value : prev + value);
    }
  }, [calculatorValue]);

  // Render functions (moved before the main render logic)
  const renderLoading = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading exam content...</p>
      </div>
    </div>
  );

  const renderError = () => (
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
          onClick={restartExam}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const renderLoginRequired = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Login Required</h3>
        <p className="text-gray-600 mb-6">You need to be logged in to access the JAMB simulator.</p>
        <button
          onClick={() => navigate('/login', { state: { from: 'exam' } })}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  const renderPaymentRequired = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaMoneyBillWave className="text-blue-600 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Payment Required</h3>
        <p className="text-gray-600 mb-6">
          Access to the JAMB simulator requires a one-time payment of ₦1000.
        </p>
        <button
          onClick={initializePayment}
          disabled={initializingPayment}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium w-full hover:bg-indigo-700 transition-colors disabled:opacity-70"
        >
          {initializingPayment ? 'Processing...' : 'Pay ₦1000 to Continue'}
        </button>
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );

  const renderSubjectSelection = () => {
    const englishSubject = subjects.find(s => s.isCompulsory);
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto mt-11">
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-600 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              JAMB Exam Simulator
            </h1>
            <p className="text-gray-600">
              Select {MAX_SUBJECTS} subjects for your exam (English is compulsory)
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {subjects.map((subject) => {
              const isSelected = selectedSubjects.some(s => s.id === subject.id);
              const isCompulsory = subject.isCompulsory;
              
              return (
                <motion.button
                  key={subject.id}
                  whileHover={{ scale: isCompulsory ? 1 : 1.02 }}
                  whileTap={{ scale: isCompulsory ? 1 : 0.98 }}
                  onClick={() => !isCompulsory && handleSubjectSelect(subject)}
                  className={`p-5 rounded-lg shadow-sm transition-all duration-200 text-left border ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300'
                  } ${
                    isCompulsory ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
                      isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FaBook />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                        {subject.name}
                        {isCompulsory && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Compulsory
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {isSelected ? 'Selected' : isCompulsory ? 'Automatically included' : 'Click to select'}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-gray-800 mb-4">Selected Subjects ({selectedSubjects.length}/{MAX_SUBJECTS})</h3>
            
            {selectedSubjects.length === 0 ? (
              <p className="text-gray-500 text-sm">No subjects selected yet</p>
            ) : (
              <div className="space-y-3">
                {selectedSubjects.map((subject, index) => (
                  <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-800">{subject.name}</span>
                      {subject.isCompulsory && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Compulsory
                        </span>
                      )}
                    </div>
                    {!subject.isCompulsory && (
                      <button 
                        onClick={() => handleSubjectSelect(subject)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={completeSubjectSelection}
              disabled={selectedSubjects.length !== MAX_SUBJECTS}
              className={`mt-6 w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center ${
                selectedSubjects.length === MAX_SUBJECTS
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Start Exam <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNoQuestions = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Questions Available</h2>
        <p className="text-gray-600 mb-6">
          There are currently no questions available for {exams[currentSubjectIndex]?.subject?.name}.
          Please check back later or select another subject.
        </p>
        <button
          onClick={restartExam}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
        >
          <FaArrowLeft className="mr-2" /> Back to Subject Selection
        </button>
      </div>
    </div>
  );

  const renderSubjectResults = () => {
    const currentExam = exams[currentSubjectIndex];
    const results = currentExam?.results;
    const subjectName = currentExam?.subject?.name;
    
    if (!results) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {subjectName} Results
              </h2>
              <button 
                onClick={() => setShowSubjectResults(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Score:</span>
                <span className="font-bold text-lg">
                  {results.correctAnswers} / {results.totalQuestions} (
                  {results.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    results.percentage >= 70 ? 'bg-green-500' : 
                    results.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${results.percentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Question Review</h3>
              {results.details.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <p className="font-medium mb-2">{result.questionText}</p>
                  <div className="space-y-2">
                    {result.options.map(option => (
                      <div 
                        key={option.id}
                        className={`p-2 rounded ${
                          option.id === result.correctOptionId 
                            ? 'bg-green-100 border border-green-300'
                            : option.id === result.selectedOptionId
                              ? 'bg-red-100 border border-red-300'
                              : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                            option.id === result.correctOptionId
                              ? 'bg-green-500 text-white'
                              : option.id === result.selectedOptionId
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200'
                          }`}>
                            {option.id === result.correctOptionId ? (
                              <FaCheck className="w-3 h-3" />
                            ) : option.id === result.selectedOptionId ? (
                              <FaTimes className="w-3 h-3" />
                            ) : null}
                          </div>
                          <span>{option.optionText}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {!result.isCorrect && result.explanation && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <p className="font-medium text-blue-800">Explanation:</p>
                      <p className="text-blue-700">{result.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              {currentSubjectIndex < MAX_SUBJECTS - 1 ? (
                <button
                  onClick={moveToNextSubject}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Next Subject
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowSubjectResults(false);
                    setExamCompleted(true);
                    calculateOverallResults();
                    fireConfetti();
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  View Final Results
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExamResults = () => {
    const overallPercentage = examResults?.overallPercentage || 0;
    const totalCorrect = examResults?.totalCorrect || 0;
    const totalQuestions = examResults?.totalQuestions || 0;
    const subjectResults = examResults?.subjectResults || [];
    
    const scoreColor = overallPercentage >= 70 ? 'text-green-500' : 
                      overallPercentage >= 50 ? 'text-yellow-500' : 'text-red-500';
    const performanceMessage = overallPercentage >= 70 
      ? "Excellent performance! You've scored above the JAMB cutoff." 
      : overallPercentage >= 50 
        ? "Good effort! With more practice you can score higher." 
        : "Keep studying! Review your answers and try again.";

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={overallPercentage >= 70 ? '#10b981' : overallPercentage >= 50 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(overallPercentage / 100) * 283} 283`}
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-3xl font-bold ${scoreColor}`}
                    >
                      {overallPercentage}%
                    </text>
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">JAMB Exam Results</h2>
                <p className="text-lg text-gray-600 mb-6">
                  {performanceMessage}
                </p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <FaCheck className="text-green-500" />
                      <span className="font-semibold">Correct</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{totalCorrect}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <FaTimes className="text-red-500" />
                      <span className="font-semibold">Incorrect</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{totalQuestions - totalCorrect}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <FaChartBar className="text-blue-500" />
                      <span className="font-semibold">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{totalQuestions}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <FaClock className="text-purple-500" />
                      <span className="font-semibold">Time</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{formatTime(examResults.timeTaken)}</p>
                  </div>
                </div>

                <div className="w-full max-w-md mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Breakdown</h3>
                  <div className="space-y-3">
                    {subjectResults.map((result, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800">{result.subject}</span>
                          <span className={`font-bold ${
                            result.percentage >= 70 ? 'text-green-600' : 
                            result.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {result.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              result.percentage >= 70 ? 'bg-green-500' : 
                              result.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${result.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{result.score} correct</span>
                          <span>{result.total} questions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center"
                  >
                    {showAnswers ? (
                      <>
                        <FaEyeSlash className="mr-2" /> Hide Answers
                      </>
                    ) : (
                      <>
                        <FaEye className="mr-2" /> Show Answers
                      </>
                    )}
                  </button>
                  <button
                    onClick={restartExam}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                  >
                    Take Another Exam
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Answers and Explanations Section */}
          {showAnswers && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Answers & Explanations</h3>
                
                {Object.values(exams).map((exam, examIndex) => (
                  <div key={examIndex} className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                      {exam.subject.name} ({exam.results.correctAnswers}/{exam.results.totalQuestions})
                    </h4>
                    
                    <div className="space-y-4">
                      {exam.results.details.map((result, questionIndex) => (
                        <div 
                          key={questionIndex} 
                          className={`p-4 rounded-lg border ${
                            result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <p className="font-medium mb-2">
                            <span className="text-gray-600">Q{questionIndex + 1}:</span> {result.questionText}
                          </p>
                          <div className="space-y-2">
                            {result.options.map(option => (
                              <div 
                                key={option.id}
                                className={`p-2 rounded ${
                                  option.id === result.correctOptionId 
                                    ? 'bg-green-100 border border-green-300'
                                    : option.id === result.selectedOptionId
                                      ? 'bg-red-100 border border-red-300'
                                      : 'bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                                    option.id === result.correctOptionId
                                      ? 'bg-green-500 text-white'
                                      : option.id === result.selectedOptionId
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-200'
                                  }`}>
                                    {option.id === result.correctOptionId ? (
                                      <FaCheck className="w-3 h-3" />
                                    ) : option.id === result.selectedOptionId ? (
                                      <FaTimes className="w-3 h-3" />
                                    ) : null}
                                  </div>
                                  <span>{option.optionText}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          {result.explanation && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                              <p className="font-medium text-blue-800">Explanation:</p>
                              <p className="text-blue-700">{result.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActiveExam = () => {
    const currentExam = exams[currentSubjectIndex];
    const currentSubject = currentExam?.subject;
    const currentQuestion = questions[currentQuestionIndex];
    const selectedId = selectedOptions[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = questions.length;

    return (
      <div className="min-h-screen bg-gray-50 p-4 relative">
        {/* Calculator Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCalculator(!showCalculator)}
          className="fixed top-24 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg z-20"
          aria-label="Calculator"
        >
          <FaCalculator size={20} />
        </motion.button>

        {/* Calculator Popup */}
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

        {/* Main Exam Container */}
        <div className="max-w-3xl mx-auto mt-15 bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Exam Header */}
          <div className="p-4 bg-indigo-600 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h3 className="font-semibold">{currentSubject?.name}</h3>
                <p className="text-indigo-100 text-xs sm:text-sm">
                  Question {questionNumber} of {totalQuestions}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  Time: {formatTime(timeRemaining)}
                </div>
                <div className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  Subject {currentSubjectIndex + 1} of {MAX_SUBJECTS}
                </div>
              </div>
            </div>
          </div>
          
          {/* Subject Navigation Tabs */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {Array.from({ length: MAX_SUBJECTS }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => switchSubject(index)}
                  className={`px-4 py-2 text-sm font-medium flex-shrink-0 ${
                    currentSubjectIndex === index
                      ? 'border-b-2 border-indigo-500 text-indigo-600 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {exams[index]?.subject?.name || `Subject ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
          
          {/* Question Content */}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {currentQuestion?.questionText}
            </h3>
            
            <div className="space-y-2 sm:space-y-3">
              {currentQuestion?.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(currentQuestionIndex, opt.id)}
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
            
            <div className="flex justify-between mt-6 sm:mt-8">
              <button
                onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                disabled={currentQuestionIndex === 0}
                className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>
              
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(i => i + 1)}
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
                <div className="flex space-x-3">
                  {currentSubjectIndex < MAX_SUBJECTS - 1 && (
                    <button
                      onClick={submitSubjectExam}
                      disabled={selectedId === null || isSubmitting}
                      className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-white text-sm sm:text-base ${
                        selectedId === null || isSubmitting
                          ? 'bg-green-300 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Subject'}
                    </button>
                  )}
                  <button
                    onClick={submitAllSubjects}
                    disabled={selectedId === null || submittingAll}
                    className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-white text-sm sm:text-base ${
                      selectedId === null || submittingAll
                        ? 'bg-purple-300 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {submittingAll ? 'Submitting All...' : 'Submit All Subjects'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="max-w-3xl mx-auto mt-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h4 className="font-medium text-gray-800 mb-3">Progress</h4>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    currentQuestionIndex === i
                      ? 'bg-indigo-600 text-white'
                      : selectedOptions[i] !== null
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Effects
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: 'exam' } });
      return;
    }
    
    setIsLoggedIn(true);
    loadExamState();
    fetchSubjects();
  }, [navigate, fetchSubjects, loadExamState]);

  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjects.some(s => s.isCompulsory)) {
      const englishSubject = subjects.find(s => s.isCompulsory);
      if (englishSubject) {
        setSelectedSubjects(prev => [...prev, englishSubject]);
      }
    }
  }, [subjects, selectedSubjects]);

  useEffect(() => {
    if (!examStarted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!examCompleted) {
            submitAllSubjects();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
        return () => clearInterval(timer);
  }, [examStarted, examCompleted, submitAllSubjects]);

  useEffect(() => {
    if (examStarted) {
      saveExamState();
    }
  }, [
    examStarted,
    selectedSubjects,
    exams,
    currentSubjectIndex,
    questions,
    selectedOptions,
    currentQuestionIndex,
    examCompleted,
    examResults,
    timeRemaining,
    showSubjectResults,
    showAnswers,
    saveExamState
  ]);

  // Main render logic
  if (!isLoggedIn) {
    return renderLoginRequired();
  }

  if (paymentRequired) {
    return renderPaymentRequired();
  }

  if (loading && !examStarted) {
    return renderLoading();
  }

  if (error && !examStarted) {
    return renderError();
  }

  if (!subjectSelectionCompleted) {
    return renderSubjectSelection();
  }

  if (questions.length === 0) {
    return renderNoQuestions();
  }

  if (examCompleted) {
    return renderExamResults();
  }

  return (
    <>
      {renderActiveExam()}
      {showSubjectResults && renderSubjectResults()}
    </>
  );
};

export default JambExamSimulator; 