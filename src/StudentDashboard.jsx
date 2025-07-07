import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaCrown, FaSignOutAlt, FaShoppingCart,
  FaUser, FaClipboardList, FaGraduationCap, 
  FaHistory, FaBolt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { GiBrain } from 'react-icons/gi';
import { MdOutlineDashboardCustomize } from 'react-icons/md';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [daysRemaining, setDaysRemaining] = useState(30);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [userResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const [userData] = await Promise.all([
          userResponse.json()
        ]);
        
        setUserDetails(userData.data);
        setIsPremium(userData.data.subscriptionStatus);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) throw new Error('Failed to logout');

      const data = await res.json();
      toast.success('Logged out successfully');
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Could not logout properly.');
      localStorage.clear();
      navigate('/login');
    }
  };

  const handlePurchase = () => {
    toast.info('Redirecting to past questions store...');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  // Color scheme
  const colors = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    accent: 'bg-gradient-to-r from-amber-500 to-orange-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex mt-14 flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div 
            className={`flex items-center gap-3 ${colors.primary} text-white px-6 py-3 rounded-xl shadow-lg`}
            whileHover={{ scale: 1.02 }}
          >
            <FaGraduationCap className="text-2xl" />
            <h1 className="text-2xl md:text-3xl font-bold">Student Dashboard</h1>
          </motion.div>
          
          <div className="flex gap-3">
            {isPremium && (
              <motion.div 
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-2 rounded-full shadow-md"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              >
                <FaCrown className="text-white" />
                <span>Premium Member</span>
                <span className="ml-2 bg-white text-amber-600 text-xs px-2 py-1 rounded-full font-bold">
                  {daysRemaining}d left
                </span>
              </motion.div>
            )}
            
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt /> Logout
            </motion.button>
          </div>
        </motion.div>

        {/* User Greeting */}
        <motion.div 
          variants={itemVariants}
          className={`${colors.secondary} rounded-xl shadow-xl p-6 mb-8 text-white`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {userDetails?.name || localStorage.getItem('email') || 'Student'}!
              </h2>
              <p className="text-blue-100">Track your learning progress and analytics</p>
            </div>
            
            <motion.div 
              className="hidden md:block"
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring' }}
            >
              <GiBrain className="text-5xl text-white opacity-70" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* My Exams Card */}
          <motion.div 
            className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-purple-500"
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
              <p className="text-4xl font-bold text-gray-800 mb-1">{exams.length}</p>
              <p className="text-sm text-gray-500">Total exams taken</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
            
              <FaHistory className="text-purple-400" />
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div 
            className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-amber-500"
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
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MdOutlineDashboardCustomize /> Custom Test
              </motion.button></Link>
            </div>
          </motion.div>
        </motion.div>

        {/* User Profile Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-500" /> Profile
            </h3>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold">
                {userDetails?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          
          {userDetails ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-gray-800 font-medium">{userDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800 font-medium">{userDetails.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <p className={`font-medium ${isPremium ? 'text-amber-500' : 'text-gray-800'}`}>
                  {isPremium ? 'Subscribed' : 'Not Subscribed'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-gray-800 font-medium">
                  {new Date(userDetails.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
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
              transition={{ type: 'spring' }}
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
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          padding: '16px',
          fontSize: '14px'
        }}
        progressStyle={{
          background: 'linear-gradient(to right, #4f46e5, #7c3aed)'
        }}
      />
    </div>
  );
};

export default StudentDashboard;