import axiosClient from "./axiosClient";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditQuestions = () => {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchSubjectWithQuestions = async () => {
      try {
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const response = await axiosClient.get(`/subjects/${subjectId}`);

        const { data } = await response.data;

        setSubject(data);

        // Normalize API data to your preferred format
        const normalizedQuestions = (data.questions || []).map((q) => ({
          id: q.id,
          Question: q.question || "",
          Explanation: q.explanation || "",
          correctAnswer: q.correctAnswer || "",
          Options: (q.options || []).map((opt) => ({
            id: opt.id,
            Text: opt.optionText || "",
          })),
        }));

        setQuestions(normalizedQuestions);
      } catch (err) {
        console.error("Fetch error:", err);
        setErrorMsg(err.message || "Failed to fetch questions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectWithQuestions();
  }, [subjectId]);

  const handleEdit = (id) => {
    setEditingId(id);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (questionId) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const questionToUpdate = questions.find((q) => q.id === questionId);
      if (!questionToUpdate) {
        throw new Error("Question not found");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      // Fix: Change "questions" to "question" to match API expectations
      const payload = {
        question: questionToUpdate.Question, // singular "question"
        explanation: questionToUpdate.Explanation,
        correctAnswer: questionToUpdate.correctAnswer,
        options: questionToUpdate.Options.map((opt) => ({
          id: opt.id,
          text: opt.Text,
        })),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/questions/${questionId}/update`,
        {
          method: "POST", // or "PUT" based on your API
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || `Failed with status ${response.status}`);
      }

      setSuccessMsg("Question updated successfully!");
      setEditingId(null);
    } catch (err) {
      console.error("Update error:", err);
      setErrorMsg(err.message || "Failed to update question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (id, value) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, Question: value } : q)));
  };

  const handleExplanationChange = (id, value) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, Explanation: value } : q)));
  };

  const handleCorrectAnswerChange = (id, value) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, correctAnswer: value } : q)));
  };

  const handleOptionChange = (questionId, optionId, value) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const updatedOptions = q.Options.map((opt) =>
          opt.id === optionId ? { ...opt, Text: value } : opt
        );
        return { ...q, Options: updatedOptions };
      })
    );
  };

  const handleAddOption = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const newOption = {
          id: Date.now(), // Temporary ID
          Text: "",
        };
        return { ...q, Options: [...q.Options, newOption] };
      })
    );
  };

  const handleRemoveOption = (questionId, optionId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const filteredOptions = q.Options.filter((opt) => opt.id !== optionId);
        return { ...q, Options: filteredOptions };
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Questions for {subject?.name || "Subject"}
        </h1>
        <p className="text-gray-600 mt-1">Manage all questions under this subject</p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
          <p className="text-sm text-green-700">{successMsg}</p>
        </div>
      )}

      {!isLoading && !errorMsg && questions.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <h3 className="mt-2 text-base font-medium text-gray-900">No questions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            You can start adding questions to this subject.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
          >
            {editingId === question.id ? (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                  <input
                    type="text"
                    value={question.Question}
                    onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Explanation
                  </label>
                  <textarea
                    value={question.Explanation}
                    onChange={(e) => handleExplanationChange(question.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    value={question.correctAnswer}
                    onChange={(e) => handleCorrectAnswerChange(question.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    <button
                      onClick={() => handleAddOption(question.id)}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm hover:bg-indigo-200"
                    >
                      + Add Option
                    </button>
                  </div>

                  <div className="space-y-2">
                    {question.Options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option.Text}
                          onChange={(e) =>
                            handleOptionChange(question.id, option.id, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          onClick={() => handleRemoveOption(question.id, option.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave(question.id)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.Question}</h3>

                {question.Explanation && (
                  <div className="bg-blue-50 p-3 rounded-md mb-3">
                    <p className="text-sm text-blue-700 italic">
                      <span className="font-medium">Explanation:</span> {question.Explanation}
                    </p>
                  </div>
                )}

                {question.correctAnswer && (
                  <div className="bg-green-50 p-3 rounded-md mb-3">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Correct Answer:</span> {question.correctAnswer}
                    </p>
                  </div>
                )}

                {question.Options && question.Options.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {question.Options.map((option) => (
                      <li
                        key={option.id}
                        className={`px-3 py-2 rounded-md ${
                          option.Text === question.correctAnswer
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-50"
                        }`}
                      >
                        {option.Text}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => handleEdit(question.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditQuestions;
