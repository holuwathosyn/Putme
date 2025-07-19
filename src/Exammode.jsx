import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from './axiosClient';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

// Import React Icons
import { 
  FaBook, FaCalculator, FaFlask, FaAtom, FaVial, 
  FaDna, FaLandmark, FaGlobeAmericas, FaLaptopCode,
  FaCheck, FaPlay, FaSpinner, FaExclamationTriangle
} from 'react-icons/fa';
import { GiChemicalDrop, GiNotebook } from 'react-icons/gi';
import { MdScience, MdHistory } from 'react-icons/md';

const subjectIcons = {
  english: { icon: <FaBook size={20} />, color: 'bg-blue-100', text: 'text-blue-800' },
  math: { icon: <FaCalculator size={20} />, color: 'bg-purple-100', text: 'text-purple-800' },
  science: { icon: <MdScience size={20} />, color: 'bg-green-100', text: 'text-green-800' },
  physics: { icon: <FaAtom size={20} />, color: 'bg-indigo-100', text: 'text-indigo-800' },
  chemistry: { icon: <GiChemicalDrop size={20} />, color: 'bg-cyan-100', text: 'text-cyan-800' },
  biology: { icon: <FaDna size={20} />, color: 'bg-emerald-100', text: 'text-emerald-800' },
  history: { icon: <MdHistory size={20} />, color: 'bg-amber-100', text: 'text-amber-800' },
  geography: { icon: <FaGlobeAmericas size={20} />, color: 'bg-teal-100', text: 'text-teal-800' },
  literature: { icon: <GiNotebook size={20} />, color: 'bg-rose-100', text: 'text-rose-800' },
  computer: { icon: <FaLaptopCode size={20} />, color: 'bg-indigo-100', text: 'text-indigo-800' },
  default: { icon: <FaBook size={20} />, color: 'bg-gray-100', text: 'text-gray-800' }
};

const getSubjectIcon = (subjectName) => {
  if (!subjectName) return subjectIcons.default;
  const lowerName = subjectName.toLowerCase().trim();
  return subjectIcons[lowerName] || subjectIcons.default;
};

const StartExam = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingExam, setIsStartingExam] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosClient.get('/subjects');
        if (response.data.status && response.data.data) {
          const formattedSubjects = response.data.data.map(subject => ({
            id: subject.id,
            name: subject.name,
            isCompulsory: subject.isCompulsory || subject.name.toLowerCase() === 'english'
          }));
          setSubjects(formattedSubjects);
          
          // Auto-select compulsory subjects
          const compulsorySubjects = formattedSubjects.filter(s => s.isCompulsory);
          if (compulsorySubjects.length > 0) {
            setSelectedSubjects(compulsorySubjects);
          }
        } else {
          toast.error('No subjects available');
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Failed to load subjects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectToggle = (subject) => {
    if (subject.isCompulsory) return;

    setSelectedSubjects(prev => {
      if (prev.some(s => s.id === subject.id)) {
        return prev.filter(s => s.id !== subject.id);
      } else {
        if (prev.length >= 4) {
          toast.warning('Maximum of 4 subjects allowed');
          return prev;
        }
        return [...prev, subject];
      }
    });
  };

  const startExam = async () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    setIsStartingExam(true);

    try {
      const subjectIds = selectedSubjects.map(subject => subject.id);
      
      // Using POST request with subject_ids array as per API
      const response = await axiosClient.get('/exams/start', {
        subject_ids: subjectIds
      });

      if (response.data.status) {
        navigate(`/exam/${response.data.data.exam_id}`);
      } else {
        toast.error(response.data.message || 'Failed to start exam');
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      toast.error(error.response?.data?.message || 'Failed to start exam');
    } finally {
      setIsStartingExam(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Start Your Exam</h1>
          <p className="text-gray-600">
            Select up to 4 subjects {selectedSubjects.some(s => s.isCompulsory) && 
              "(Compulsory subjects are already selected)"}
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
            Selected: {selectedSubjects.length}/4 subjects
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Subjects</h2>
          
          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map(subject => {
                const { icon, color, text } = getSubjectIcon(subject.name);
                const isSelected = selectedSubjects.some(s => s.id === subject.id);
                const isDisabled = selectedSubjects.length >= 4 && !isSelected && !subject.isCompulsory;

                return (
                  <div
                    key={subject.id}
                    onClick={() => !isDisabled && handleSubjectToggle(subject)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 
                      subject.isCompulsory ? 'border-blue-300 bg-blue-50' : 
                      'border-gray-200 hover:border-gray-300'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center mr-4 ${color} ${text}`}>
                        {icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className={`font-semibold ${text}`}>{subject.name}</h3>
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                            isSelected || subject.isCompulsory ? 
                            'bg-blue-600 text-white' : 'bg-white border border-gray-300'
                          }`}>
                            {(isSelected || subject.isCompulsory) && <FaCheck className="h-3 w-3" />}
                          </div>
                        </div>
                        {subject.isCompulsory && (
                          <span className="text-xs text-blue-600">Required</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-yellow-100 rounded-full p-4 inline-block mb-4">
                <FaExclamationTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Subjects Available</h3>
              <p className="text-gray-500">Please contact support</p>
            </div>
          )}
        </div>

        <button
          onClick={startExam}
          disabled={isStartingExam || selectedSubjects.length === 0}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isStartingExam ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              Starting Exam...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <FaPlay className="mr-2" />
              Start Exam ({selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''})
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default StartExam;