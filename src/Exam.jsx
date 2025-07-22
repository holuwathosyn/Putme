import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "./axiosClient";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCheck,
  FiGrid,
  FiSave,
  FiCheckCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Constants
 */
const ENGLISH_SUBJECT_REGEX = /english/i;
const EXAM_DURATION_SECONDS = 7200; // 2 hours in seconds

/**
 * ExamScreen Component
 *
 * This component handles the exam interface including:
 * - Displaying questions and options
 * - Navigation between questions
 * - Time management with a visible countdown timer
 * - Answer submission
 * - Auto-submission when time expires
 */
const ExamScreen = () => {
  // State management
  const [examData, setExamData] = useState(null);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Derived state
  const currentSubject = examData?.groupedSubjects?.[currentSubjectIndex] || null;
  const currentQuestions = currentSubject?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isEnglishSubject = ENGLISH_SUBJECT_REGEX.test(currentSubject?.subject || "");

  const totalQuestions =
    examData?.groupedSubjects?.reduce((total, group) => total + group.questions.length, 0) || 0;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  /**
   * Formats seconds into HH:MM:SS format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  /**
   * Submits a single answer to the server
   * @param {number} questionId - ID of the question being answered
   * @param {number} optionId - ID of the selected option
   */
  const submitSingleAnswer = useCallback(
    async (questionId, optionId) => {
      try {
        setSaveStatus((prev) => ({ ...prev, [questionId]: "saving" }));

        await axiosClient.post(`/exams/${examData.exam_id}/answer`, {
          question_id: questionId,
          selected_option_id: optionId,
        });

        setSaveStatus((prev) => ({ ...prev, [questionId]: "saved" }));

        // Reset save status after 2 seconds
        setTimeout(() => {
          setSaveStatus((prev) => ({ ...prev, [questionId]: null }));
        }, 2000);
      } catch (error) {
        console.error("Failed to save answer:", error);
        setSaveStatus((prev) => ({ ...prev, [questionId]: "error" }));
        setError("Failed to save answer. Please try again.");
        setTimeout(() => setError(null), 5000);
      }
    },
    [examData?.exam_id]
  );

  /**
   * Submits the entire exam to the server
   */
  const submitExam = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post(`/exams/${examData.exam_id}/submit`, {});

      setSubmitResult(response.data.data);

      navigate(`/exam-results?exam-id=${examData.exam_id}`);
    } catch (error) {
      console.error("Failed to submit exam:", error);
      setError("Failed to submit exam. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles auto-submission when time expires
   */
  const handleAutoSubmit = useCallback(async () => {
    if (timeLeft <= 0 && !isSubmitting && !submitResult) {
      await submitExam();
    }
  }, [timeLeft, isSubmitting, submitResult]);

  // Load exam data and initialize timer on component mount
  useEffect(() => {
    const loadExamData = () => {
      try {
        const examDataFromState = location.state?.examData;
        if (!examDataFromState) {
          navigate("/");
          return;
        }

        if (!examDataFromState.groupedSubjects || examDataFromState.groupedSubjects.length === 0) {
          throw new Error("No questions found");
        }

        setExamData(examDataFromState);

        // Initialize selected options from existing answers
        const initialSelected = {};
        examDataFromState.groupedSubjects.forEach((group) => {
          group.questions.forEach((q) => {
            if (q.selected_option_id !== null && q.selected_option_id !== undefined) {
              initialSelected[q.id] = q.selected_option_id;
            }
          });
        });
        // setSelectedOptions(initialSelected);
      } catch (error) {
        console.error("Error loading exam data:", error);
        navigate("/");
      }
    };

    loadExamData();

    // Set up timer that counts down and auto-submits when time expires
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, location.state, handleAutoSubmit]);

  // Track answered questions count
  useEffect(() => {
    if (!examData?.groupedSubjects) return;

    const totalAnswered = examData.groupedSubjects
      .flatMap((group) => group.questions)
      .filter((q) => selectedOptions[q.id] !== undefined || q.selected_option_id !== null).length;
    setAnsweredCount(totalAnswered);
  }, [selectedOptions, examData]);

  /**
   * Handles option selection
   * @param {number} questionId - ID of the question being answered
   * @param {number} optionId - ID of the selected option
   */
  const handleOptionSelect = useCallback(
    (questionId, optionId) => {
      setSelectedOptions((prev) => ({
        ...prev,
        [questionId]: optionId,
      }));
      submitSingleAnswer(questionId, optionId);
    },
    [submitSingleAnswer]
  );

  /**
   * Navigates to a specific question
   * @param {number} subjectIdx - Index of the subject
   * @param {number} questionIdx - Index of the question within the subject
   */
  const navigateToQuestion = useCallback(
    (subjectIdx, questionIdx) => {
      if (!examData?.groupedSubjects?.[subjectIdx]?.questions?.[questionIdx]) return;
      setCurrentSubjectIndex(subjectIdx);
      setCurrentQuestionIndex(questionIdx);
      setShowSubjectMenu(false);
    },
    [examData]
  );

  /**
   * Navigates to the next question
   */
  const goToNextQuestion = useCallback(() => {
    if (!examData?.groupedSubjects) return;

    const currentSubject = examData.groupedSubjects[currentSubjectIndex];
    if (currentQuestionIndex < currentSubject.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSubjectIndex < examData.groupedSubjects.length - 1) {
      setCurrentSubjectIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  }, [currentSubjectIndex, currentQuestionIndex, examData]);

  /**
   * Navigates to the previous question
   */
  const goToPrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentSubjectIndex > 0) {
      const prevSubject = examData.groupedSubjects[currentSubjectIndex - 1];
      setCurrentSubjectIndex((prev) => prev - 1);
      setCurrentQuestionIndex(prevSubject.questions.length - 1);
    }
  }, [currentSubjectIndex, currentQuestionIndex, examData]);

  // Calculate progress for each subject
  const subjectProgress =
    examData?.groupedSubjects?.map((group) => {
      const answered = group.questions.filter(
        (q) => selectedOptions[q.id] !== undefined || q.selected_option_id !== null
      ).length;
      return {
        subject: group.subject,
        answered,
        total: group.questions.length,
        percentage: Math.round((answered / group.questions.length) * 100),
      };
    }) || [];

  // Loading state
  if (!examData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with progress and timer */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowSubjectMenu(!showSubjectMenu)}
              className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
              aria-label="Toggle subject menu"
            >
              <FiGrid className="text-lg" />
            </button>

            <div className="flex-1 mx-4">
              <div className="w-full bg-blue-800 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>
                  {answeredCount}/{totalQuestions} answered
                </span>
                <span>{progressPercentage}%</span>
              </div>
            </div>

            {/* Timer display - more prominent with warning colors when time is low */}
            <div
              className={`flex items-center px-4 py-2 rounded-lg ${
                timeLeft <= 300 ? "bg-red-600 animate-pulse" : "bg-blue-800"
              }`}
            >
              <FiClock className="mr-2" />
              <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
              {timeLeft <= 300 && <span className="ml-2 text-xs">HURRY!</span>}
            </div>
          </div>
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {error}
        </div>
      )}

      {/* Subject tabs */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex">
            {subjectProgress.map((subject, idx) => {
              const isEnglish = ENGLISH_SUBJECT_REGEX.test(subject.subject);
              return (
                <button
                  key={idx}
                  onClick={() => navigateToQuestion(idx, 0)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    currentSubjectIndex === idx
                      ? isEnglish
                        ? "border-green-500 text-green-700"
                        : "border-blue-600 text-blue-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  aria-current={currentSubjectIndex === idx ? "page" : undefined}
                >
                  <div className="flex flex-col items-center">
                    <span>
                      {subject.subject}
                      {isEnglish && <span className="ml-1 text-xs text-green-600">★</span>}
                    </span>
                    <span className="text-xs mt-1">
                      {subject.answered}/{subject.total}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject menu modal */}
      <AnimatePresence>
        {showSubjectMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-white shadow-lg z-10 mx-4 rounded-lg overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {examData.groupedSubjects.map((group, groupIdx) => {
                const isEnglish = ENGLISH_SUBJECT_REGEX.test(group.subject);
                return (
                  <div key={groupIdx} className="border-b border-gray-100 last:border-0">
                    <h3
                      className={`px-4 py-2 font-medium ${
                        isEnglish ? "bg-green-50 text-green-700" : "bg-gray-50 text-blue-700"
                      }`}
                    >
                      {group.subject} ({subjectProgress[groupIdx]?.answered || 0}/
                      {group.questions.length})
                      {isEnglish && (
                        <span className="ml-2 text-xs text-green-600">(Compulsory)</span>
                      )}
                    </h3>
                    <div className="grid grid-cols-5 gap-2 p-2">
                      {group.questions.map((q, qIdx) => (
                        <button
                          key={q.id}
                          onClick={() => navigateToQuestion(groupIdx, qIdx)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-colors ${
                            currentSubjectIndex === groupIdx && currentQuestionIndex === qIdx
                              ? isEnglish
                                ? "bg-green-600 text-white"
                                : "bg-blue-600 text-white"
                              : selectedOptions[q.id] !== undefined || q.selected_option_id !== null
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          aria-label={`Question ${qIdx + 1}`}
                        >
                          {qIdx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Question progress */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
          </div>
          <div
            className={`text-sm font-medium ${
              isEnglishSubject ? "text-green-600" : "text-blue-600"
            }`}
          >
            {subjectProgress[currentSubjectIndex]?.percentage || 0}% complete
            {isEnglishSubject && <span className="ml-1 text-xs">(Required)</span>}
          </div>
        </div>

        {/* Question card */}
        {currentQuestion ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentSubjectIndex}-${currentQuestion.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-6">
                {currentQuestion.question_text || "Question text not available"}
              </h3>

              {currentQuestion.options?.length > 0 ? (
                <ul className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <li key={option.id}>
                      <button
                        onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedOptions[currentQuestion.id] === option.id ||
                          currentQuestion.selected_option_id === option.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        aria-label={`Option ${option.option_text}`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                              selectedOptions[currentQuestion.id] === option.id ||
                              currentQuestion.selected_option_id === option.id
                                ? "bg-blue-600 border-blue-700"
                                : "border-gray-300"
                            }`}
                          >
                            {(selectedOptions[currentQuestion.id] === option.id ||
                              currentQuestion.selected_option_id === option.id) && (
                              <FiCheck className="text-white text-xs" />
                            )}
                          </div>
                          <span>{option.option_text || "Option text not available"}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No options available for this question
                </div>
              )}

              {/* Save status indicator */}
              {saveStatus[currentQuestion.id] && (
                <div
                  className={`mt-4 text-sm flex items-center ${
                    saveStatus[currentQuestion.id] === "saving"
                      ? "text-blue-600"
                      : saveStatus[currentQuestion.id] === "saved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {saveStatus[currentQuestion.id] === "saving" ? (
                    <>
                      <FiSave className="mr-1 animate-pulse" />
                      <span>Saving...</span>
                    </>
                  ) : saveStatus[currentQuestion.id] === "saved" ? (
                    <>
                      <FiCheckCircle className="mr-1" />
                      <span>Answer saved</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-1" />
                      <span>Save failed</span>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100 text-center py-12 text-gray-500">
            Question not found or unavailable
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0 && currentSubjectIndex === 0}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg ${
              currentQuestionIndex === 0 && currentSubjectIndex === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
            aria-label="Previous question"
          >
            <FiChevronLeft className="mr-2" />
            Previous
          </button>

          <button
            onClick={goToNextQuestion}
            disabled={
              currentQuestionIndex === currentQuestions.length - 1 &&
              currentSubjectIndex === examData.groupedSubjects.length - 1
            }
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg ${
              currentQuestionIndex === currentQuestions.length - 1 &&
              currentSubjectIndex === examData.groupedSubjects.length - 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-label="Next question"
          >
            Next
            <FiChevronRight className="ml-2" />
          </button>
        </div>

        {/* Submit button */}
        <div className="mt-6 text-center">
          <button
            onClick={submitExam}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg text-white font-medium ${
              isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Exam"
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ExamScreen;
