
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiAward, FiBook, FiHome, FiBarChart2 } from 'react-icons/fi';

const ExamResultsScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { results, examData } = state || {};

  if (!results || !examData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">No Results Found</div>
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

  // Enhanced subject results calculation with answer tracking
  const subjectResults = examData.groupedSubjects.map(subject => {
    const questionsWithAnswers = subject.questions.map(question => {
      const selectedOption = question.options.find(opt => opt.id === question.selected_option_id);
      const correctOption = question.options.find(opt => opt.is_correct);
      const isCorrect = selectedOption?.is_correct;
      
      return {
        ...question,
        selectedOptionText: selectedOption?.option_text || null,
        correctOptionText: correctOption?.option_text || null,
        isCorrect
      };
    });

    const correctAnswers = questionsWithAnswers.filter(q => q.isCorrect).length;

    return {
      subject: subject.subject,
      total: subject.questions.length,
      correct: correctAnswers,
      percentage: Math.round((correctAnswers / subject.questions.length) * 100),
      questions: questionsWithAnswers
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8">Exam Results</h1>
        
        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Your Performance Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <FiBarChart2 className="text-blue-600 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Total Questions</div>
              <div className="text-2xl font-bold">{results.total_questions}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <FiCheck className="text-green-600 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Correct Answers</div>
              <div className="text-2xl font-bold">{results.score}</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <FiX className="text-red-600 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Wrong Answers</div>
              <div className="text-2xl font-bold">{results.attempted - results.score}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <FiAward className="text-purple-600 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Percentage</div>
              <div className="text-2xl font-bold">{results.percentage}%</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full" 
              style={{ width: `${results.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Subject-wise Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Subject Performance</h2>
          
          <div className="space-y-4">
            {subjectResults.map((subject, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{subject.subject}</h3>
                  <span className={`font-bold ${
                    subject.percentage >= 70 ? 'text-green-600' :
                    subject.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {subject.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      subject.percentage >= 70 ? 'bg-green-500' :
                      subject.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{subject.correct} correct</span>
                  <span>{subject.total - subject.correct} incorrect</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Question Analysis */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Your Answers</h2>
          
          <div className="space-y-8">
            {subjectResults.map((subject, sIndex) => (
              <div key={sIndex} className="mb-8">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <FiBook className="mr-2 text-blue-500" />
                  {subject.subject}
                </h3>
                
                <div className="space-y-4">
                  {subject.questions.map((question, qIndex) => (
                    <div 
                      key={question.id} 
                      className={`border-l-4 p-4 rounded-r-lg ${
                        question.isCorrect ? 'border-green-500 bg-green-50' : 
                        question.selected_option_id ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-medium">
                          Q{qIndex + 1}: {question.question_text}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          question.isCorrect ? 'bg-green-100 text-green-800' : 
                          question.selected_option_id ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {question.isCorrect ? 'Correct' : question.selected_option_id ? 'Incorrect' : 'Unanswered'}
                        </span>
                      </div>
                      
                      <div className="space-y-3 ml-4">
                        {/* Your Answer */}
                        <div className={`p-3 rounded-lg ${
                          question.isCorrect ? 'bg-green-100 text-green-800 border border-green-200' : 
                          question.selected_option_id ? 'bg-red-100 text-red-800 border border-red-200' : 
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          <p className="font-medium">Your answer:</p>
                          <p>{question.selectedOptionText || 'Not answered'}</p>
                        </div>
                        
                        {/* Correct Answer (shown if incorrect or unanswered) */}
                        {(question.isCorrect === false || !question.selected_option_id) && (
                          <div className="p-3 rounded-lg bg-blue-100 text-blue-800 border border-blue-200">
                            <p className="font-medium">Correct answer:</p>
                            <p>{question.correctOptionText}</p>
                          </div>
                        )}
                        
                        {/* Explanation */}
                        {question.explanation && (
                          <div className="p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-200">
                            <p className="font-medium">Explanation:</p>
                            <p className="whitespace-pre-line">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Return Home
          </button>
          <button
            onClick={() => navigate('/exam-review', { state: { examData, results } })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Detailed Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResultsScreen;