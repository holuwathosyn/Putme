import React, { useState } from 'react';
import axios from 'axios';

const QuestionGenerator = () => {
  const [subjectId, setSubjectId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(''); // In production, use proper auth flow

  const generateQuestions = async () => {
    if (!subjectId || !subjectName) {
      setError('Please provide both subject ID and name');
      return;
    }

    setIsGenerating(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/questions/generate`,
        {
          subject_id: subjectId,
          subject_name: subjectName,
          num_questions: numQuestions
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(response.data.message);
      // If your API returns the generated questions in the response:
      // setGeneratedQuestions(response.data.questions);
      
      // For this demo, we'll simulate generated questions
      const simulatedQuestions = Array.from({ length: numQuestions }, (_, i) => ({
        questionText: `Sample question ${i + 1} about ${subjectName}`,
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 'Option 2',
        explanation: `This is explanation for question ${i + 1}`
      }));
      setGeneratedQuestions(simulatedQuestions);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveQuestions = async () => {
    if (!generatedQuestions.length) {
      setError('No questions to save');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/questions/bulk`,
        {
          subject_id: subjectId,
          questions: generatedQuestions
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(response.data.message);
      setGeneratedQuestions([]); // Clear after saving
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save questions');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">AI Question Generator</h1>
          <p className="mt-2 text-sm text-gray-600">
            Generate and save questions using AI
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">
                Subject ID
              </label>
              <input
                type="number"
                id="subjectId"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700">
                Subject Name
              </label>
              <input
                type="text"
                id="subjectName"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">
                Number of Questions
              </label>
              <input
                type="number"
                id="numQuestions"
                min="1"
                max="50"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                Bearer Token
              </label>
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your auth token"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={generateQuestions}
              disabled={isGenerating}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? 'Generating...' : 'Generate Questions'}
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {generatedQuestions.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Generated Questions</h2>
              <button
                onClick={saveQuestions}
                disabled={isSaving}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? 'Saving...' : 'Save Questions'}
              </button>
            </div>

            <div className="space-y-6">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    {index + 1}. {question.questionText}
                  </h3>
                  <ul className="space-y-2 mb-3">
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex} className={`px-3 py-2 rounded ${option === question.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                        {option}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Explanation:</span> {question.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionGenerator;