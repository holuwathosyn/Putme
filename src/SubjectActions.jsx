import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        setErrorMsg("");

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/subjects?questions=true&count=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }

        const { data } = await response.json();
        setSubjects(data || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setErrorMsg(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subjects List</h1>
        <p className="text-gray-600 mt-1">Manage your subjects and their questions</p>
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

      {!isLoading && !errorMsg && subjects.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <h3 className="mt-2 text-base font-medium text-gray-900">No subjects found</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first subject to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{subject.name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Questions: <span className="font-medium text-indigo-600">{subject.questions?.length ?? 0}</span>
              </p>
            </div>
            <button
              onClick={() => navigate(`/edit-questions/${subject.id}`)}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
            >
              EDIT QUESTIONS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsList;
