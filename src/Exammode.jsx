import { useState, useEffect } from 'react';
import { FiCheckCircle, FiAward, FiClock, FiDivide, FiX, FiMinus, FiPlus, FiPercent } from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';

const QuizApp = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'History' },
    { id: 4, name: 'English' }
  ]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateMockQuestions = (subjectId) => {
    // Generate 10 mock questions for the selected subject
    const mockQuestions = [];
    for (let i = 1; i <= 10; i++) {
      mockQuestions.push({
        id: i,
        questionText: `Sample question ${i} for ${subjects.find(s => s.id === subjectId)?.name || 'subject'}`,
        options: [
          { id: `${i}-1`, optionText: 'Option A' },
          { id: `${i}-2`, optionText: 'Option B' },
          { id: `${i}-3`, optionText: 'Option C' },
          { id: `${i}-4`, optionText: 'Option D' }
        ]
      });
    }
    return mockQuestions;
  };

  const selectSubject = (subject) => {
    setSelectedSubject(subject);
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockQuestions = generateMockQuestions(subject.id);
      setQuestions(mockQuestions);
      setSelectedOptions(Array(mockQuestions.length).fill(null));
      setQuizStarted(true);
      setLoading(false);
    }, 500);
  };

  const submitAnswers = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Calculate random score (between 40% and 90% correct)
      const correct = Math.floor(questions.length * (0.4 + Math.random() * 0.5));
      setScore(correct);
      
      // Generate mock quiz results
      const mockResults = {
        correct,
        answers: questions.map((q, index) => ({
          questionText: q.questionText,
          isCorrect: Math.random() > 0.3, // 70% chance of being correct
          explanation: `This is a sample explanation for question ${index + 1}`
        }))
      };
      
      setQuizResults(mockResults);
      setShowScore(true);
      setLoading(false);
    }, 800);
  };

  const handleOptionSelect = (optionId) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestion] = optionId;
    setSelectedOptions(newSelectedOptions);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAnswers();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOptions([]);
    setScore(0);
    setShowScore(false);
    setQuizStarted(false);
    setQuizResults(null);
    setQuestions([]);
  };

  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
  };

  if (loading && !quizStarted) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-blue-500">Loading...</div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-300 p-6 text-white">
            <h1 className="text-2xl font-bold">Select a Subject</h1>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => selectSubject(subject)}
                  className="p-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors text-center"
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full mt-24 max-w-6xl flex flex-col md:flex-row gap-4 sm:gap-6 relative">
        {/* Quiz Section */}
        <div className={`w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
          showCalculator && !isMobile ? 'md:w-2/3' : 'w-full'
        }`}>
          {/* Header */}
          <div className="bg-blue-300 p-4 sm:p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{selectedSubject?.name} Quiz</h1>
                <div className="flex justify-between items-center mt-2 text-sm sm:text-base">
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    <span>{questions.length} Questions</span>
                  </div>
                  <div className="flex items-center">
                    <FiAward className="mr-1" />
                    <span>Score: {score}/{questions.length}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleCalculator}
                className={`flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-all ${
                  showCalculator
                    ? 'bg-blue-400 hover:bg-blue-500'
                    : 'bg-blue-200 hover:bg-blue-300'
                } shadow-md hover:shadow-lg active:scale-95 text-sm sm:text-base`}
              >
                <FaCalculator className="text-sm sm:text-base" />
                <span className="hidden sm:inline">Calculator</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-blue-100">
            <div
              className="h-full bg-blue-400 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Quiz Content */}
          <div className="p-4 sm:p-6">
            {showScore ? (
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-blue-500 mb-4">Quiz Completed!</div>
                <div className="text-xl sm:text-2xl mb-6">
                  Your score: <span className="font-bold">{score}</span> out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
                </div>
                
                {quizResults && (
                  <div className="mb-6 text-left">
                    {quizResults.answers.map((answer, index) => (
                      <div key={index} className={`mb-4 p-3 rounded-lg ${answer.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="font-semibold">{answer.questionText}</div>
                        <div className="text-sm mt-1">
                          {answer.isCorrect ? (
                            <span className="text-green-600">✓ Correct</span>
                          ) : (
                            <span className="text-red-600">✗ Incorrect</span>
                          )}
                        </div>
                        {answer.explanation && (
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Explanation:</span> {answer.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={resetQuiz}
                  className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Start New Quiz
                </button>
              </div>
            ) : (
              <>
                {questions.length > 0 && (
                  <>
                    <div className="mb-4 sm:mb-6">
                      <div className="text-sm sm:text-base text-gray-500 mb-1">
                        Question {currentQuestion + 1} of {questions.length}
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {questions[currentQuestion].questionText}
                      </h2>
                    </div>

                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      {questions[currentQuestion].options.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => handleOptionSelect(option.id)}
                          className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedOptions[currentQuestion] === option.id
                              ? 'border-blue-300 bg-blue-50 text-blue-600'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border mr-2 sm:mr-3 flex items-center justify-center ${
                                selectedOptions[currentQuestion] === option.id
                                  ? 'border-blue-300 bg-blue-300 text-white'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedOptions[currentQuestion] === option.id && <FiCheckCircle size={12} className="sm:w-3.5 sm:h-3.5" />}
                            </div>
                            <span className="text-sm sm:text-base">{option.optionText}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestion === 0}
                        className={`py-1 sm:py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base ${
                          currentQuestion === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNextQuestion}
                        disabled={!selectedOptions[currentQuestion]}
                        className={`py-1 sm:py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base ${
                          !selectedOptions[currentQuestion]
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-300 hover:bg-blue-400 text-white font-bold'
                        } transition-colors`}
                      >
                        {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Calculator Section */}
        {showCalculator && (
          <Calculator onClose={toggleCalculator} isMobile={isMobile} />
        )}
      </div>
    </div>
  );
};

const Calculator = ({ onClose, isMobile }) => {
  const [calcInput, setCalcInput] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setCalcInput(String(digit));
      setWaitingForOperand(false);
    } else {
      setCalcInput(calcInput === '0' ? String(digit) : calcInput + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setCalcInput('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!calcInput.includes('.')) {
      setCalcInput(calcInput + '.');
    }
  };

  const clearAll = () => {
    setCalcInput('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(calcInput);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue = 0;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        case '%':
          newValue = currentValue % inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setPrevValue(newValue);
      setCalcInput(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const handleEquals = () => {
    if (!operation || prevValue === null) return;
    
    performOperation(null);
    setOperation(null);
    setPrevValue(null);
  };

  return (
    <div className={`
      ${isMobile ? 
        'fixed inset-0 z-50 bg-white p-4 flex flex-col' : 
        'w-full md:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in'}
    `}>
      {isMobile && (
        <div className="bg-blue-300 p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Calculator</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-blue-400 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}
      {!isMobile && (
        <div className="bg-blue-300 p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Calculator</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-blue-400 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}
      <div className={`p-4 ${isMobile ? 'flex-1' : ''}`}>
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="text-right text-2xl sm:text-3xl font-semibold text-blue-800 overflow-x-auto">
            {calcInput}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <button
            onClick={clearAll}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            AC
          </button>
          <button
            onClick={() => performOperation('%')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 sm:p-3 rounded-lg transition-colors active:scale-95"
          >
            <FiPercent className="mx-auto text-sm sm:text-base" />
          </button>
          <button
            onClick={() => performOperation('÷')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 sm:p-3 rounded-lg transition-colors active:scale-95"
          >
            <FiDivide className="mx-auto text-sm sm:text-base" />
          </button>
          <button
            onClick={() => performOperation('×')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 sm:p-3 rounded-lg transition-colors active:scale-95"
          >
            <FiX className="mx-auto text-sm sm:text-base" />
          </button>

          <button
            onClick={() => inputDigit(7)}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            7
          </button>
          <button
            onClick={() => inputDigit(8)}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            8
          </button>
          <button
            onClick={() => inputDigit(9)}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            9
          </button>
          <button
            onClick={() => performOperation('-')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 sm:p-3 rounded-lg transition-colors active:scale-95"
          >
            <FiMinus className="mx-auto text-sm sm:text-base" />
          </button>

          <button
            onClick={() => inputDigit(4)}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            4
          </button>
          <button
            onClick={() => inputDigit(5)}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            5
          </button>
          <button
            onClick={() => inputDigit(6)}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            6
          </button>
          <button
            onClick={() => performOperation('+')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 sm:p-3 rounded-lg transition-colors active:scale-95"
          >
            <FiPlus className="mx-auto text-sm sm:text-base" />
          </button>

          <button
            onClick={() => inputDigit(1)}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            1
          </button>
          <button
            onClick={() => inputDigit(2)}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            2
          </button>
          <button
            onClick={() => inputDigit(3)}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            3
          </button>
          <button
            onClick={handleEquals}
            className="bg-blue-300 hover:bg-blue-400 text-white p-2 sm:p-3 rounded-lg row-span-2 transition-colors active:scale-95 text-sm sm:text-base"
          >
            =
          </button>

          <button
            onClick={() => inputDigit(0)}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium col-span-2 transition-colors active:scale-95 text-sm sm:text-base"
          >
            0
          </button>
          <button
            onClick={inputDecimal}
            className="bg-gray-100 hover:bg-gray-200 p-2 sm:p-3 rounded-lg font-medium transition-colors active:scale-95 text-sm sm:text-base"
          >
            .
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;