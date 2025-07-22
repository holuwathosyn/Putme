import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCrown,
  FaSignOutAlt,
  FaShoppingCart,
  FaUser,
  FaClipboardList,
  FaGraduationCap,
  FaBolt,
  FaChevronDown,
  FaKey,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { GiBrain } from "react-icons/gi";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import axiosClient from "./axiosClient";
import { formatTimeSpent } from "./lib/utils";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [showExams, setShowExams] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/users");
        const userData = response.data.data;

        setUserDetails(userData);
        setIsPremium(userData.subscriptionStatus);
        setLoading(false);

        // Check subscription status and show payment modal if not subscribed
        if (!userData.subscriptionStatus) {
          setShowPaymentModal(true);
          initializePayment();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const initializePayment = async () => {
    try {
      const response = await axiosClient.post(`/subscriptions`, {
        callback_url: `${window.location.origin}/StudentDashboard`,
      });

      if (response.data.status) {
        setPaymentUrl(response.data.data.authorization_url);
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
      toast.error("Failed to initialize payment");
    }
  };

  useEffect(() => {
    const fetchTotalExam = async () => {
      try {
        const getTotalExam = await axiosClient.get(`/users/exams`);
        setExams(getTotalExam.data.data);
      } catch (err) {
        console.error("Error fetching total exams:", err);
      }
    };
    fetchTotalExam();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to logout");

      await res.json();
      toast.success("Logged out successfully");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Could not logout properly.");
      localStorage.clear();
      navigate("/login");
    }
  };

  const handlePurchase = () => {
    toast.info("Redirecting to past questions store...");
    navigate("/BuyPdf");
  };

  const handleUpdatePassword = () => {
    navigate("/UpdatePassword");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "In Progress";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return "text-green-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
  };

  const handlePaymentRedirect = () => {
    window.location.href = paymentUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Payment Modal */}
      {showPaymentModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
          >
            <div className="mb-6">
              <FaCrown className="text-4xl text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Premium Subscription Required
              </h3>
              <p className="text-gray-600 mb-6">
                You need to subscribe to access all features. Get unlimited exams, detailed
                analytics, and more!
              </p>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={handlePaymentRedirect}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!paymentUrl}
              >
                {paymentUrl ? "Proceed to Payment" : "Initializing Payment..."}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mt-16 max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-600 text-white">
              <FaGraduationCap className="text-2xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Student Dashboard</h1>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={handleUpdatePassword}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaKey /> <span className="hidden sm:inline">Update Password</span>
            </motion.button>

            {isPremium && (
              <motion.div
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-2 rounded-full shadow"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              >
                <FaCrown className="text-white" />
              </motion.div>
            )}

            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* User Greeting */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow p-6 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {userDetails?.name || "Student"}!
              </h2>
              <p className="text-blue-100">Track your learning progress and analytics</p>
            </div>

            <motion.div
              className="hidden md:block"
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring" }}
            >
              <GiBrain className="text-5xl text-white opacity-70" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* My Exams Card */}
          <motion.div
            className="bg-white p-5 rounded-xl shadow border border-gray-200"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">My Exams</h3>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaClipboardList className="text-purple-600 text-xl" />
              </div>
            </div>
            <div className="text-center py-2">
              {exams && <p className="text-4xl font-bold text-gray-800 mb-1">{exams.length}</p>}
              <p className="text-sm text-gray-500">Total exams taken</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowExams(!showExams)}
                className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
              >
                {showExams ? "Hide exams" : "View exams"}
                <FaChevronDown
                  className={`transition-transform ${showExams ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            className="bg-white p-5 rounded-xl shadow border border-gray-200"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Quick Start</h3>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <FaBolt className="text-amber-600 text-xl" />
              </div>
            </div>
            <div className="space-y-3 mt-6">
              <motion.button
                onClick={handlePurchase}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaShoppingCart /> Get Past Questions
              </motion.button>
              <Link to="/ExamMode">
                <motion.button
                  className="w-full flex items-center font-bold text-3xl p-2 justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MdOutlineDashboardCustomize /> PROCEED WITH THE EXAM
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Exam List Section - Only shown when expanded */}
        {showExams && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8 overflow-hidden"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Exam History</h3>

            {exams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No exams taken yet</p>
                <Link to="/ExamMode">
                  <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
                    Start Your First Exam
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        {/* <h4 className="font-medium text-gray-800">
                          {exam.subject.charAt(0).toUpperCase() + exam.subject.slice(1)} Exam
                        </h4> */}
                        <p className="text-sm text-gray-500">
                          {formatDate(exam.startedAt)} • {exam.totalQuestions} questions
                        </p>
                      </div>
                      <div className={`text-lg font-semibold ${getScoreColor(exam.percentage)}`}>
                        {exam.completedAt ? `${exam.percentage}%` : "In Progress"}
                      </div>
                      <Link
                        to={`/exam-results?exam-id=${exam.id}`}
                        className="text-sm underline text-blue-500"
                      >
                        View Details
                      </Link>
                    </div>

                    {exam.completedAt && (
                      <div className="mt-3 pt-3 border-t border-gray-100 grid sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Correct Answers</p>
                          <p className="font-medium">
                            {exam.correctAnswers}/{exam.totalQuestions}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Completed At</p>
                          <p className="font-medium">{formatDate(exam.completedAt)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Time Spent</p>
                          <p className="font-medium">
                            {formatTimeSpent(exam.startedAt, exam.completedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* User Profile Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-500" /> Profile Information
            </h3>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold">{userDetails?.name?.charAt(0) || "U"}</span>
            </div>
          </div>

          {userDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="font-medium text-gray-800">{userDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800">{userDetails.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className={`font-medium ${isPremium ? "text-amber-500" : "text-gray-800"}`}>
                  {isPremium ? "SUBSCRIBED" : "NOT SUBSCRIBED"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p className="font-medium text-gray-800">
                  {new Date(userDetails.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard</h3>
              <p className="text-gray-600">Preparing your personalized learning analytics...</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          fontSize: "14px",
        }}
        progressStyle={{
          background: "linear-gradient(to right, #4f46e5, #7c3aed)",
        }}
      />
    </div>
  );
};

export default StudentDashboard;
