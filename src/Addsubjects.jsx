import React, { useState, useEffect } from 'react';
import { 
  FiUpload, FiPlusCircle, FiMinusCircle, FiCheckCircle, 
  FiAlertCircle, FiChevronDown 
} from 'react-icons/fi';

const AdminQuestionUploader = () => {
  const MAX_OPTIONS_PER_QUESTION = 5;
  const INITIAL_QUESTION_COUNT = 10;
  const API_ENDPOINT = import.meta.env.VITE_API_QUESTION;

  const subjects = [
    { id: 1, name: "English" },
    { id: 2, name: "Maths" },
    { id: 3, name: "General paper/Current affairs" },
    { id: 4, name: "Vocational studies" },
    { id: 5, name: "Aptitude test" },
    { id: 6, name: "History" },
    { id: 7, name: "Government" },
    { id: 8, name: "Economics" },
    { id: 9, name: "Accounting" },
    { id: 10, name: "Crk" },
    { id: 11, name: "Geography" },
    { id: 12, name: "Islamic studies" },
    { id: 13, name: "Literature in English" },
    { id: 14, name: "Physics" },
    { id: 15, name: "Biology" },
    { id: 16, name: "Chemistry" },
    { id: 17, name: "Music" },
    { id: 18, name: "French" },
    { id: 19, name: "Agric" }
  ];

  const [questions, setQuestions] = useState(
    Array(INITIAL_QUESTION_COUNT).fill().map(() => ({
      question: '',
      options: [''],
      answer: '',
      workings: ''
    }))
  );

  const [currentSubjectId, setCurrentSubjectId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localFeedback, setLocalFeedback] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubjectChange = (value) => {
    setCurrentSubjectId(Number(value));
  };

  const submitQuestionsToAPI = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to perform this action.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      return await response.json();
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
      const result = await submitQuestionsToAPI(questionsToSubmit);
      
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

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 lg:p-10 font-sans">
      <h2 className="text-2xl sm:text-3xl  mt-32 font-bold text-gray-800 mb-6 text-center">
        Question Upload Portal
      </h2>

      <div className="mb-6">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject for All Questions *
        </label>
        <div className="relative">
          <select
            id="subject"
            value={currentSubjectId}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 appearance-none"
            required
            disabled={isSubmitting}
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {totalFilledQuestions > 0 && !currentSubjectId && (
          <p className="mt-2 text-sm text-red-600">Please select a subject before continuing</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
          <div>
            Question <span className="text-blue-600">{currentIndex + 1}</span> of {' '}
            <span className="text-gray-500">{questions.length}</span>
            {totalFilledQuestions > 0 && (
              <span className="ml-3 text-sm text-gray-500">({totalFilledQuestions} ready to submit)</span>
            )}
          </div>
          {currentSubjectId && (
            <div className="mt-2 text-lg font-medium text-indigo-700">
              Subject: {currentSubjectName}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0 || isSubmitting}
            className={`p-2 rounded-full ${currentIndex === 0 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            disabled={currentIndex === questions.length - 1 || isSubmitting}
            className={`p-2 rounded-full ${currentIndex === questions.length - 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
          Question Text *
        </label>
        <textarea
          id="question"
          value={current.question}
          onChange={handleQuestionChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
          rows={3}
          placeholder="Enter the question..."
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options *
          <span className="ml-2 text-xs text-gray-500">(Select the correct one)</span>
        </label>
        
        {current.options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="radio"
              name="correctAnswer"
              checked={current.answer === option}
              onChange={() => handleAnswerChange(option)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              disabled={!option.trim() || isSubmitting}
            />
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
              placeholder={`Option ${index + 1}`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => removeOption(index)}
              disabled={current.options.length <= 1 || isSubmitting}
              className={`ml-2 p-2 rounded-full ${current.options.length <= 1 ? 'text-gray-400' : 'text-red-600 hover:bg-red-50'}`}
            >
              <FiMinusCircle size={18} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addOption}
          disabled={current.options.length >= MAX_OPTIONS_PER_QUESTION || isSubmitting}
          className={`mt-2 flex items-center text-sm ${current.options.length >= MAX_OPTIONS_PER_QUESTION ? 'text-gray-400' : 'text-green-600 hover:text-green-700'}`}
        >
          <FiPlusCircle className="mr-1" size={16} />
          Add Option
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="workings" className="block text-sm font-medium text-gray-700 mb-2">
          Explanation/Workings (Optional)
        </label>
        <textarea
          id="workings"
          value={current.workings}
          onChange={handleWorkingsChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
          rows={2}
          placeholder="Enter explanation or workings (optional)..."
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={addNewQuestion}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:text-gray-600"
          >
            <FiPlusCircle className="mr-2" />
            Add New Question
          </button>
          <button
            type="button"
            onClick={() => removeQuestion(currentIndex)}
            disabled={questions.length <= 1 || isSubmitting}
            className={`flex items-center px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${questions.length <= 1 ? 'bg-gray-300 text-gray-500' : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'}`}
          >
            <FiMinusCircle className="mr-2" />
            Remove This Question
          </button>
        </div>

        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">
            Ready to submit: {totalFilledQuestions}/{questions.length}
          </span>
        </div>
      </div>

      {localFeedback.message && (
        <div className={`mb-6 p-4 rounded-lg ${localFeedback.type === 'error' ? 'bg-red-100 text-red-700' : localFeedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          <div className="flex items-center">
            {localFeedback.type === 'error' ? (
              <FiAlertCircle className="mr-2" size={20} />
            ) : localFeedback.type === 'success' ? (
              <FiCheckCircle className="mr-2" size={20} />
            ) : (
              <FiUpload className="mr-2" size={20} />
            )}
            {localFeedback.message}
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={handleSubmitAll}
          disabled={!currentSubjectId || totalFilledQuestions === 0 || isSubmitting}
          className={`px-6 py-3 rounded-full font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
            !currentSubjectId || totalFilledQuestions === 0 || isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
          }`}
        >
          {isSubmitting ? 'Submitting...' : `Submit All Questions (${totalFilledQuestions})`}
        </button>
      </div>
    </div>
  );
};

export default AdminQuestionUploader;