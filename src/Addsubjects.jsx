import axiosClient from './axiosClient';
import React, { useState, useEffect } from 'react';
import { 
  FiUpload, FiPlusCircle, FiMinusCircle, FiCheckCircle, 
  FiAlertCircle, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiZap
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminQuestionUploader = () => {
  const MAX_OPTIONS_PER_QUESTION = 5;
  const INITIAL_QUESTION_COUNT = 10;
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [questions, setQuestions] = useState(
    Array(INITIAL_QUESTION_COUNT).fill().map(() => ({
      question: '',
      options: [''],
      answer: '',
      workings: ''
    }))
  );

  const [subjects, setSubjects] = useState([]);
  const [currentSubjectId, setCurrentSubjectId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localFeedback, setLocalFeedback] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [showGenerationMethod, setShowGenerationMethod] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const current = questions[currentIndex];
  const totalFilledQuestions = questions.filter(q => q.question.trim() !== '' && q.options.length >= 2 && q.answer.trim() !== '').length;
  const currentSubjectName = subjects.find(s => s.id === currentSubjectId)?.name || '';

  useEffect(() => {
    if (localFeedback.message) {
      const timer = setTimeout(() => {
        setLocalFeedback({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [localFeedback]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subjects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }
        
        const data = await response.json();
        setSubjects(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setLocalFeedback({ 
          message: 'Failed to load subjects. Please refresh the page.', 
          type: 'error' 
        });
      }
    };
  
    fetchSubjects();
  }, [API_BASE_URL]);

  const handleSubjectSelection = (subjectId) => {
    setCurrentSubjectId(subjectId);
    setIsSubjectDropdownOpen(false);
    setShowGenerationMethod(true);
  };

  const handleManualGeneration = () => {
    setShowGenerationMethod(false);
  };

  const handleAIGeneration = async () => {
    if (!currentSubjectId) return;
    
    setIsGeneratingAI(true);
    setLocalFeedback({ message: 'Generating questions with AI...', type: 'info' });
    
    try {
      const response = await axiosClient.post('/questions/generate', {
        subject_id: currentSubjectId,
        subject_name: currentSubjectName,
        num_questions: 100
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status) {
        setLocalFeedback({ 
          message: 'AI questions generated successfully! Review and edit them as needed.', 
          type: 'success' 
        });
        
        // If the API returns the generated questions, you would set them here
        // For now, we'll just add empty questions to demonstrate
        setQuestions(
          Array(100).fill().map(() => ({
            question: '',
            options: [''],
            answer: '',
            workings: ''
          }))
        );
      } else {
        throw new Error(response.data.message || 'Failed to generate questions');
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      setLocalFeedback({ 
        message: `AI generation failed: ${error.message}`, 
        type: 'error' 
      });
    } finally {
      setIsGeneratingAI(false);
      setShowGenerationMethod(false);
    }
  };

  const addNewQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: [''],
      answer: '',
      workings: ''
    }]);
    setCurrentIndex(questions.length);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) return;
    
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    
    if (currentIndex >= newQuestions.length) {
      setCurrentIndex(newQuestions.length - 1);
    }
  };

  const handleQuestionChange = (e) => {
    const newQuestions = [...questions];
    newQuestions[currentIndex].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[currentIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = () => {
    if (current.options.length >= MAX_OPTIONS_PER_QUESTION) return;
    
    const newQuestions = [...questions];
    newQuestions[currentIndex].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (optionIndex) => {
    if (current.options.length <= 1) return;
    
    const newQuestions = [...questions];
    newQuestions[currentIndex].options.splice(optionIndex, 1);
    
    if (newQuestions[currentIndex].answer === current.options[optionIndex]) {
      newQuestions[currentIndex].answer = '';
    }
    
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (value) => {
    const newQuestions = [...questions];
    newQuestions[currentIndex].answer = value;
    setQuestions(newQuestions);
  };

  const handleWorkingsChange = (e) => {
    const newQuestions = [...questions];
    newQuestions[currentIndex].workings = e.target.value;
    setQuestions(newQuestions);
  };

  const validateCurrentQuestion = () => {
    if (!currentSubjectId) {
      setLocalFeedback({ 
        message: 'Please select a subject first', 
        type: 'error' 
      });
      return false;
    }

    if (!current.question.trim()) {
      setLocalFeedback({ 
        message: 'Question text cannot be empty', 
        type: 'error' 
      });
      return false;
    }

    if (current.options.some(opt => !opt.trim())) {
      setLocalFeedback({ 
        message: 'Options cannot be empty', 
        type: 'error' 
      });
      return false;
    }

    if (!current.answer) {
      setLocalFeedback({ 
        message: 'Please select the correct answer', 
        type: 'error' 
      });
      return false;
    }

    return true;
  };

  
  const submitQuestionsToAPI = async (data) => {
    try { 
      const response = await axiosClient.post(`/questions/bulk`, data);

      if(response.data.ok){
        toast.success(`Successfully submitted ${data.questions.length} questions`);
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.message.includes('Failed to fetch') ||
          error.message.includes('ERR_NETWORK_CHANGED') ||
          error.message.includes('Connection refused')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  const handleSubmitAll = async () => {
    if (!currentSubjectId) {
      setLocalFeedback({
        message: 'Please select a subject first',
        type: 'error'
      });
      return;
    }

    const questionsToSubmit = {
      subject_id: Number(currentSubjectId),
      questions: questions
        .filter(q => q.question.trim() !== '')
        .map(q => ({
          questionText: q.question.trim(),
          options: q.options.filter(opt => opt.trim() !== '').map(opt => opt.trim()),
          correctAnswer: q.answer.trim(),
          explanation: q.workings.trim() || ""
        }))
    };

    if (questionsToSubmit.questions.length === 0) {
      setLocalFeedback({
        message: 'No valid questions to submit',
        type: 'error'
      });
      return;
    }

    const invalidOptions = questionsToSubmit.questions.filter(q => q.options.length < 2);
    if (invalidOptions.length > 0) {
      setLocalFeedback({
        message: `Each question needs at least 2 options (check question ${questions.findIndex(q => q.question.trim() === invalidOptions[0].questionText) + 1})`,
        type: 'error'
      });
      return;
    }

    const invalidAnswers = questionsToSubmit.questions.filter(
      q => !q.options.includes(q.correctAnswer)
    );
    if (invalidAnswers.length > 0) {
      setLocalFeedback({
        message: `Correct answer must match one of the options (check question ${questions.findIndex(q => q.question.trim() === invalidAnswers[0].questionText) + 1})`,
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    setLocalFeedback({ message: 'Submitting questions...', type: 'info' });

    try {
      await submitQuestionsToAPI(questionsToSubmit);
      
      setLocalFeedback({ 
        message: `Success! ${questionsToSubmit.questions.length} questions submitted for ${currentSubjectName}.`, 
        type: 'success' 
      });
      
      setQuestions(
        Array(INITIAL_QUESTION_COUNT).fill().map(() => ({
          question: '',
          options: [''],
          answer: '',
          workings: ''
        }))
      );
      setCurrentSubjectId('');
      setCurrentIndex(0);
    } catch (error) {
      setLocalFeedback({ 
        message: `Submission failed: ${error.message}`, 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showGenerationMethod) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            How would you like to create questions for {currentSubjectName}?
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={handleManualGeneration}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlusCircle size={20} />
              <span className="text-lg font-medium">Create Questions Manually</span>
            </button>
            
            <button
              onClick={handleAIGeneration}
              disabled={isGeneratingAI}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-colors ${isGeneratingAI ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
            >
              <FiZap size={20} />
              <span className="text-lg font-medium">
                {isGeneratingAI ? 'Generating...' : 'Generate with AI (100 questions)'}
              </span>
            </button>
          </div>

          {localFeedback.message && (
            <div 
              className={`mt-6 p-3 rounded-lg ${localFeedback.type === 'error' ? 'bg-red-100 text-red-700' : localFeedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
            >
              {localFeedback.message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 font-sans">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Question Upload Page
        </h1>

        {/* Subject Selection */}
        <div className="mb-8">
          <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-2">
            Subject for All Questions *
          </label>
          <div className="relative">
            <button
              id="subject-select"
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              className={`w-full flex justify-between items-center p-4 text-left rounded-xl border ${currentSubjectId ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} transition-all duration-200`}
              aria-expanded={isSubjectDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className={currentSubjectId ? "text-blue-700 font-medium" : "text-gray-500"}>
                {currentSubjectId ? currentSubjectName : "Select a subject"}
              </span>
              <FiChevronDown className={`transform ${isSubjectDropdownOpen ? 'rotate-180' : ''} transition-transform duration-200`} />
            </button>
            
            {isSubjectDropdownOpen && (
              <div 
                className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 max-h-60 overflow-auto"
                role="listbox"
              >
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelection(subject.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${currentSubjectId === subject.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
                    role="option"
                    aria-selected={currentSubjectId === subject.id}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {totalFilledQuestions > 0 && !currentSubjectId && (
            <p className="mt-2 text-sm text-red-600">Please select a subject before continuing</p>
          )}
        </div>

        {/* Question Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0 || isSubmitting}
              className={`p-3 rounded-full ${currentIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'} transition-colors`}
              aria-label="Previous question"
            >
              <FiChevronLeft size={24} />
            </button>
            
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-700">
                Question <span className="text-blue-600">{currentIndex + 1}</span> of {' '}
                <span className="text-gray-500">{questions.length}</span>
              </div>
              {totalFilledQuestions > 0 && (
                <div className="text-sm text-gray-500 mt-1">
                  {totalFilledQuestions} ready to submit
                </div>
              )}
            </div>
            
            <button
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === questions.length - 1 || isSubmitting}
              className={`p-3 rounded-full ${currentIndex === questions.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'} transition-colors`}
              aria-label="Next question"
            >
              <FiChevronRight size={24} />
            </button>
          </div>

          {currentSubjectId && (
            <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium">
              Subject: {currentSubjectName}
            </div>
          )}
        </div>

        {/* Question Input */}
        <div className="mb-8">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Question Text *
          </label>
          <textarea
            id="question"
            value={current.question}
            onChange={handleQuestionChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
            rows={4}
            placeholder="Enter the question..."
            disabled={isSubmitting}
            aria-describedby="question-help"
          />
          <p id="question-help" className="mt-1 text-sm text-gray-500">
            Markdown formatting is supported
          </p>
        </div>

        {/* Options Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Options * <span className="ml-2 text-xs text-gray-500">(Select the correct one)</span>
          </label>
          
          <div className="space-y-3">
            {current.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAnswerChange(option)}
                  className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${current.answer === option ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-blue-400'} ${!option.trim() || isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={!option.trim() || isSubmitting}
                  aria-label={`Select option ${index + 1} as correct answer`}
                >
                  {current.answer === option && (
                    <FiCheckCircle className="text-white" size={16} />
                  )}
                </button>
                
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                  placeholder={`Option ${index + 1}`}
                  aria-label={`Option ${index + 1}`}
                />
                
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  disabled={current.options.length <= 1 || isSubmitting}
                  className={`flex-shrink-0 p-2 rounded-full ${current.options.length <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'} transition-colors`}
                  aria-label={`Remove option ${index + 1}`}
                >
                  <FiMinusCircle size={20} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addOption}
            disabled={current.options.length >= MAX_OPTIONS_PER_QUESTION || isSubmitting}
            className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg ${current.options.length >= MAX_OPTIONS_PER_QUESTION ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-green-600 bg-green-50 hover:bg-green-100'} transition-colors`}
            aria-label="Add option"
          >
            <FiPlusCircle size={18} />
            Add Option
          </button>
        </div>

        {/* Workings Section */}
        <div className="mb-8">
          <label htmlFor="workings" className="block text-sm font-medium text-gray-700 mb-2">
            Explanation/Workings (Optional)
          </label>
          <textarea
            id="workings"
            value={current.workings}
            onChange={handleWorkingsChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
            rows={3}
            placeholder="Enter explanation or workings (optional)..."
            disabled={isSubmitting}
            aria-describedby="workings-help"
          />
          <p id="workings-help" className="mt-1 text-sm text-gray-500">
            Markdown formatting is supported
          </p>
        </div>

        {/* Question Management */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addNewQuestion}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
              aria-label="Add new question"
            >
              <FiPlusCircle size={18} />
              Add New Question
            </button>
            <button
              type="button"
              onClick={() => removeQuestion(currentIndex)}
              disabled={questions.length <= 1 || isSubmitting}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${questions.length <= 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'}`}
              aria-label="Remove this question"
            >
              <FiMinusCircle size={18} />
              Remove This Question
            </button>
          </div>

          <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
            Ready to submit: {totalFilledQuestions}/{questions.length}
          </div>
        </div>

        {/* Feedback Message */}
        {localFeedback.message && (
          <div 
            className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${localFeedback.type === 'error' ? 'bg-red-100 text-red-700' : localFeedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
            role="alert"
            aria-live="polite"
          >
            {localFeedback.type === 'error' ? (
              <FiAlertCircle size={20} aria-hidden="true" />
            ) : localFeedback.type === 'success' ? (
              <FiCheckCircle size={20} aria-hidden="true" />
            ) : (
              <FiUpload size={20} aria-hidden="true" />
            )}
            <span>{localFeedback.message}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={!currentSubjectId || totalFilledQuestions === 0 || isSubmitting}
            className={`px-8 py-4 text-lg rounded-xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              !currentSubjectId || totalFilledQuestions === 0 || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
            }`}
            aria-disabled={!currentSubjectId || totalFilledQuestions === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              `Submit All Questions (${totalFilledQuestions})`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminQuestionUploader;