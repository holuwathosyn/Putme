import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheck, FiX, FiAward, FiBook, FiHome, FiBarChart2 } from "react-icons/fi";
import axiosClient from "./axiosClient";

const ExamResultsScreen = () => {
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("exam-id");
  const [examDetail, setExamDetail] = useState({});
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function getExamDetails(examId) {
    try {
      setIsLoading(true);
      const response = await axiosClient.get(`/exams/${examId}`);
      setExamDetail(response.data.data.results);
      setResults(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch exam results. Please try again later.");
      console.error("Error fetching exam details:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (examId) {
      getExamDetails(examId);
    }
  }, [examId]);

  const transformedData = useMemo(() => {
    const data = examDetail;
    const subjects = Object.keys(data);
    return subjects.map((subject) => ({
      subject: subject,
      questions: data[subject],
    }));
  }, [examDetail]);

  // Calculate subject results based on transformed data
  const subjectResults = useMemo(() => {
    return transformedData.map((subject) => {
      const questionsWithAnswers = subject.questions.map((question) => {
        const isCorrect = question.selectedOptionId === question.correctOptionId;
        return {
          ...question,
          selectedOptionText: question.selectedOptionText || null,
          correctOptionText: question.correctOptionText || null,
          isCorrect,
        };
      });

      const correctAnswers = questionsWithAnswers.filter((q) => q.isCorrect).length;

      return {
        subject: subject.subject,
        total: subject.questions.length,
        correct: correctAnswers,
        percentage: Math.round((correctAnswers / subject.questions.length) * 100),
        questions: questionsWithAnswers,
      };
    });
  }, [transformedData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl font-semibold">Loading your results...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4 text-red-600">{error}</div>
          <button
            onClick={() => getExamDetails(examId)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!examDetail || !results) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">No Results Found</div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8">Exam Results</h1>

        {/* Summary Card */}
        {results && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-center">Your Performance Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <FiBarChart2 className="text-blue-600 text-2xl mx-auto mb-2" />
                <div className="text-sm text-gray-600">Total Questions</div>
                <div className="text-2xl font-bold">{results.total_questions}</div>
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
        )}

        {/* Subject-wise Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Subject Performance</h2>

          <div className="space-y-4">
            {subjectResults.map((subject, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{subject.subject}</h3>
                  <span
                    className={`font-bold ${
                      subject.percentage >= 70
                        ? "text-green-600"
                        : subject.percentage >= 50
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {subject.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      subject.percentage >= 70
                        ? "bg-green-500"
                        : subject.percentage >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
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
                      key={question.questionId}
                      className={`border-l-4 p-4 rounded-r-lg ${
                        question.isCorrect
                          ? "border-green-500 bg-green-50"
                          : question.selectedOptionId
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-medium">
                          Q{qIndex + 1}: {question.questionText}
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            question.isCorrect
                              ? "bg-green-100 text-green-800"
                              : question.selectedOptionId
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {question.isCorrect
                            ? "Correct"
                            : question.selectedOptionId
                            ? "Incorrect"
                            : "Unanswered"}
                        </span>
                      </div>

                      <div className="space-y-3 ml-4">
                        {/* Your Answer */}
                        <div
                          className={`p-3 rounded-lg ${
                            question.isCorrect
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : question.selectedOptionId
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          <p className="font-medium">Your answer:</p>
                          <p>{question.selectedOptionText || "Not answered"}</p>
                        </div>

                        {/* Correct Answer (shown if incorrect or unanswered) */}
                        {(question.isCorrect === false || !question.selectedOptionId) && (
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
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Return Home
          </button>
          {/* <button
            onClick={() => navigate("/exam-review", { state: { examData, results } })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Detailed Review
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ExamResultsScreen;