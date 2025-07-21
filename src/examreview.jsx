import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from './axiosClient';
import { FiCheck, FiX, FiAward, FiBook, FiHome, FiBarChart2, FiChevronLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ExamReview = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        const response = await axiosClient.get(`/exams/${examId}`);
        setExamData(response.data.data);
        console.log(examId)
        setLoading(false);
      } catch (err) {
        setError('Failed to load exam results');
        setLoading(false);
        console.error('Error fetching exam results:', err);
      }
    };

    fetchExamResults();
  }, [examId]);

  const calculateOverallStats = () => {
    if (!examData) return { totalQuestions: 0, totalCorrect: 0, percentage: 0 };
    
    const subjects = Object.entries(examData);
    const totalQuestions = subjects.reduce((sum, [_, subject]) => sum + subject.total, 0);
    const totalCorrect = subjects.reduce((sum, [_, subject]) => sum + subject.score, 0);
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);
    
    return { totalQuestions, totalCorrect, percentage };
  };

  const overall = calculateOverallStats();

  const renderSubjectCard = (subjectName, subjectData) => {
    return (
      <motion.div 
        key={subjectName}
        className="bg-white rounded-xl shadow-md p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <FiBook className="mr-2 text-blue-500" />
            {subjectName}
          </h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            subjectData.percentage >= 70 ? 'bg-green-100 text-green-800' :
            subjectData.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
            {subjectData.score}/{subjectData.total} ({subjectData.percentage}%)
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className={`h-2.5 rounded-full ${
              subjectData.percentage >= 70 ? 'bg-green-500' :
              subjectData.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${subjectData.percentage}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <FiCheck className="text-green-500 mr-2" />
            <span>Correct: {subjectData.score}</span>
          </div>
          <div className="flex items-center">
            <FiX className="text-red-500 mr-2" />
            <span>Wrong: {subjectData.total - subjectData.score}</span>
          </div>
        </div>

        <div className="space-y-4">
          {subjectData.results.map((question, index) => (
            <motion.div
              key={question.questionId}
              className={`border-l-4 p-4 rounded-r-lg ${
                question.isCorrect ? 'border-green-500 bg-green-50' : 
                question.selectedOptionId ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg">{question.questionText}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  question.isCorrect ? 'bg-green-100 text-green-800' : 
                  question.selectedOptionId ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {question.isCorrect ? 'Correct' : question.selectedOptionId ? 'Incorrect' : 'Unanswered'}
                </span>
              </div>
              
              <div className="space-y-3 ml-4">
                {question.selectedOptionId && (
                  <div className={`p-3 rounded-lg ${
                    question.isCorrect ? 'bg-green-100 text-green-800 border border-green-200' : 
                    'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    <p className="font-medium">Your answer:</p>
                    <p>{question.selectedOptionText || 'Not answered'}</p>
                  </div>
                )}
                
                <div className="p-3 rounded-lg bg-blue-100 text-blue-800 border border-blue-200">
                  <p className="font-medium">Correct answer:</p>
                  <p>{question.correctOptionText}</p>
                </div>
                
                {question.explanation && (
                  <div className="p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-200">
                    <p className="font-medium">Explanation:</p>
                    <p className="whitespace-pre-line">{question.explanation}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">{error}</div>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">No exam data found</div>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-1 rounded-full hover:bg-blue-700"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Exam Results</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 py-8">
        {/* Summary Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-center">Performance Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <FiBarChart2 className="text-blue-600 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Total Questions</div>
              <div className="text-2xl font-bold">{overall.totalQuestions}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <FiCheck className="text-green-600 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Correct Answers</div>
              <div className="text-2xl font-bold">{overall.totalCorrect}</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <FiX className="text-red-600 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Wrong Answers</div>
              <div className="text-2xl font-bold">{overall.totalQuestions - overall.totalCorrect}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <FiAward className="text-purple-600 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Overall Score</div>
              <div className="text-2xl font-bold">{overall.percentage}%</div>
            </div>
          </div>
        </motion.div>

        {/* Subject-wise Review */}
        <div className="space-y-6">
          {Object.entries(examData).map(([subjectName, subjectData]) => 
            renderSubjectCard(subjectName, subjectData)
          )}
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="container mx-auto flex justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              <FiHome className="mr-2" />
              Return Home
            </button>
            <button
              onClick={() => navigate('/exams')}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiBarChart2 className="mr-2" />
              Take Another Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamReview;