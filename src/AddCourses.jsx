import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const subjects = [
  "English",
  "Maths",
  "General paper/Current affairs",
  "Vocational studies",
  "Aptitude test",
  "History",
  "Government",
  "Economics",
  "Accounting",
  "Crk",
  "Geography",
  "Islamic studies",
  "Literature in English",
  "Physics",
  "Biology",
  "Chemistry",
  "Music",
  "French",
  "Agric",
];

export default function CourseSelection() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert("Please select a subject to begin.");
      return;
    }
    // Navigate to quiz page with the selected course
    navigate(`/quiz/${encodeURIComponent(selectedCourse)}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Choose a Subject</h2>
      <form onSubmit={handleSubmit}>
        <select
          className="w-full p-3 border rounded mb-4"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Select Subject --</option>
          {subjects.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-900 transition-colors"
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
}
