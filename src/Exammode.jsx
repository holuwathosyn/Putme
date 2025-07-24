import React, { useEffect, useState } from "react";
import axiosClient from "./axiosClient";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiCheck, FiX, FiInfo } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Constants
const MAX_TOTAL_SUBJECTS = 4;
const COMPULSORY_SUBJECT_NAME = "English Language";

const SubjectSelectionScreen = () => {
  // State management
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMaxSelectionToast, setShowMaxSelectionToast] = useState(false);
  const navigate = useNavigate();

  // Data fetching
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosClient.get("/subjects");
        const allSubjects = response.data.data;

        const englishSubject = allSubjects.find(
          (subject) => subject.name === COMPULSORY_SUBJECT_NAME
        );

        if (!englishSubject) {
          throw new Error("English Language subject not found");
        }

        setSubjects(allSubjects);
        setFilteredSubjects(allSubjects);
        setSelectedSubjects([englishSubject]);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Subject filtering
  useEffect(() => {
    setFilteredSubjects(
      searchTerm.trim() === ""
        ? subjects
        : subjects.filter((subject) =>
            subject.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );
  }, [searchTerm, subjects]);

  // Subject selection handlers
  const handleSubjectToggle = (subject) => {
    if (subject.name === COMPULSORY_SUBJECT_NAME) return;

    const isSelected = selectedSubjects.some((s) => s.id === subject.id);

    if (isSelected) {
      setSelectedSubjects(selectedSubjects.filter((s) => s.id !== subject.id));
    } else {
      if (selectedSubjects.length >= MAX_TOTAL_SUBJECTS) {
        setShowMaxSelectionToast(true);
        return;
      }
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Exam initialization
  const handleExamStart = async () => {
    try {
      // Ensure English is included
      const englishSubject = selectedSubjects.find((s) => s.name === COMPULSORY_SUBJECT_NAME);
      if (!englishSubject) {
        alert("English is required.");
        return;
      }

      const response = await axiosClient.post(
        "/exams/start",
        {
          subject_ids: selectedSubjects.map((s) => s.id),
          count: 60,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Transform questions object into array of grouped subjects
      const { questions, exam_id } = response.data.data;
      const groupedSubjects = Object.entries(questions).map(([subject, questions]) => ({
        subject,
        questions,
      }));

      // Navigate to exam with data instead of storing in localStorage
      navigate("/exam", {
        state: {
          examData: {
            exam_id,
            groupedSubjects,
          },
        },
      });
    } catch (error) {
      console.error("Failed to start exam:", error);
    }
  };

  // Component rendering functions
  const renderSubjectItem = (subject) => {
    const isSelected = selectedSubjects.some((s) => s.id === subject.id);
    const isCompulsory = subject.name === COMPULSORY_SUBJECT_NAME;

    return (
      <motion.li
        key={subject.id}
        layout
        className={`rounded-lg overflow-hidden ${
          isCompulsory
            ? "bg-green-50 border border-green-100 shadow-sm"
            : "bg-white border border-gray-100"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={() => handleSubjectToggle(subject)}
          className="w-full text-left p-4 flex items-center"
          disabled={isCompulsory}
        >
          <div
            className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
              isCompulsory
                ? "bg-green-500 border-green-600"
                : isSelected
                ? "bg-blue-600 border-blue-700"
                : "border-gray-300"
            }`}
          >
            {(isSelected || isCompulsory) && <FiCheck className="text-white text-xs" />}
          </div>
          <div className="flex-1 text-left">
            <p className={`${isCompulsory ? "font-semibold text-green-800" : ""}`}>
              {subject.name}
              {isCompulsory && <span className="ml-2 text-xs text-green-600">(Required)</span>}
            </p>
            {isCompulsory && (
              <p className="text-xs text-green-600 mt-1">Compulsory for all exams</p>
            )}
          </div>
        </button>
      </motion.li>
    );
  };

  const optionalSlotsAvailable = MAX_TOTAL_SUBJECTS - selectedSubjects.length;

  return (
    <div className="relative h-screen mila bg-gray-50 overflow-hidden">
      {/* Header Section */}
      <motion.header
        className="bg-blue-700 p-4 shadow-md "
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Select Subjects</h1>
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500"
          >
            <FiInfo size={20} />
          </button>
        </div>

        <div className="mt-2">
          <div className="flex justify-between text-sm text-blue-100">
            <span>{selectedSubjects.length} selected (English required)</span>
            <span>
              {optionalSlotsAvailable > 0
                ? `${optionalSlotsAvailable} more can be added`
                : "Maximum subjects selected"}
            </span>
          </div>
          <div className="w-full bg-blue-600 rounded-full h-1.5 mt-1">
            <motion.div
              className="bg-yellow-400 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(selectedSubjects.length / MAX_TOTAL_SUBJECTS) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.header>

      {/* Modals and Toasts */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-sm w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-lg font-bold mb-2">Exam Information</h2>
              <div className="mb-4">
                <p className="text-gray-700">
                  <span className="font-semibold text-green-600">English Language</span> is required
                  and automatically included.
                </p>
                <p className="text-gray-700 mt-2">
                  You can select up to {MAX_TOTAL_SUBJECTS - 1} additional subjects (total of{" "}
                  {MAX_TOTAL_SUBJECTS} subjects).
                </p>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMaxSelectionToast && (
          <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-40"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            Maximum {MAX_TOTAL_SUBJECTS} subjects allowed (including English)
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="h-[calc(100%-120px)] overflow-y-auto pb-4">
        {/* Search Bar */}
        <div className="sticky top-0 bg-white p-3 shadow-sm z-30">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        {/* Selected Subjects Preview */}
        <div className="px-4 py-3 bg-white mx-3 rounded-lg shadow-sm my-3">
          <div className="flex flex-wrap gap-2">
            {selectedSubjects.map((subject) => (
              <div
                key={subject.id}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  subject.name === COMPULSORY_SUBJECT_NAME
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {subject.name}
                {subject.name !== COMPULSORY_SUBJECT_NAME && (
                  <button
                    onClick={() => handleSubjectToggle(subject)}
                    className="ml-1 text-xs hover:text-blue-700"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Subjects List */}
        <div className="px-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-gray-500">Loading subjects...</p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No subjects found matching "{searchTerm}"
            </div>
          ) : (
            <motion.ul className="space-y-2">
              {filteredSubjects.map((subject) => (
                <motion.li
                  key={subject.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderSubjectItem(subject)}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>

      {/* Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleExamStart}
          disabled={selectedSubjects.length === 1} // Only English selected
          className={`w-full py-3 rounded-lg text-white font-medium shadow ${
            selectedSubjects.length > 1
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Start Exam with {selectedSubjects.length} Subjects
        </button>
      </div>
    </div>
  );
};

export default SubjectSelectionScreen;
