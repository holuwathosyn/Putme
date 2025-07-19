import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from './axiosClient';
import { toast } from 'react-toastify';

const Exam = () => {
  const { exam_id } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        // Corrected endpoint to match API documentation
        const response = await axiosClient.get(`/api/exams/${exam_id}`);
        if (response.data.status) {
          setExamData(response.data.data);
          // Set first subject as default
          const firstSubject = Object.keys(response.data.data)[0];
          setCurrentSubject(firstSubject);
        }
      } catch (error) {
        console.error('Error fetching exam data:', error);
        toast.error('Failed to load exam data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamData();

    // Timer logic
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [exam_id]);

  const handleAnswerSelect = async (questionId, optionId) => {
    // Save answer immediately to the server
    try {
      await axiosClient.get(`/api/exams/${exam_id}/answer`, {
        question_id: questionId,
        selected_option_id: optionId
      });
      
      // Update local state
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }));
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Failed to save answer');
    }
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      // Format answers according to API
      const formattedAnswers = Object.entries(answers).map(([question_id, selected_option_id]) => ({
        question_id: parseInt(question_id),
        selected_option_id
      }));

      const response = await axiosClient.post(`/api/exams/${exam_id}/submit`, {
        answers: formattedAnswers
      });

      if (response.data.success) {
        navigate('/results', { state: { examResults: response.data.data } });
      } else {
        toast.error(response.data.message || 'Failed to submit exam');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast.error(error.response?.data?.message || 'Failed to submit exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !examData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentSubjectData = examData[currentSubject] || {};
  const currentQuestions = currentSubjectData.results || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Exam ID: {exam_id}</h2>
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
            Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>

        {/* Subject Navigation */}
        <div className="flex overflow-x-auto mb-6 pb-2">
          {Object.keys(examData).map(subject => (
            <button
              key={subject}
              onClick={() => {
                setCurrentSubject(subject);
                setCurrentQuestionIndex(0);
              }}
              className={`px-4 py-2 mr-2 rounded-lg ${
                currentSubject === subject 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Question Navigation */}
        <div className="flex overflow-x-auto mb-6 pb-2">
          {currentQuestions.map((question, index) => (
            <button
              key={question.questionId}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 mr-2 rounded-full flex items-center justify-center ${
                currentQuestionIndex === index
                  ? 'bg-blue-600 text-white'
                  : answers[question.questionId] 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-200 text-gray-800'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              {currentQuestionIndex + 1}. {currentQuestion.questionText}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options && currentQuestion.options.map(option => (
                <div 
                  key={option.id}
                  onClick={() => handleAnswerSelect(currentQuestion.questionId, option.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion.questionId] === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {option.optionText}
                </div>
              ))}
            </div>
            {currentQuestion.explanation && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(currentQuestions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === currentQuestions.length - 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitExam}
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md disabled:bg-blue-400"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Submitting...
            </span>
          ) : 'Submit Exam'}
        </button>
      </div>
    </div>
  );
};

export default Exam;