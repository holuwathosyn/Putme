import React, { useEffect, useState } from 'react';
import {
  FiBook,
  FiUsers,
  FiDollarSign,
  FiBookOpen,
  FiClipboard,
  FiUserPlus,
  FiList,
  FiMenu
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList
} from 'recharts';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    subscribers: 0,
    totalAmount: 0,
    isLoading: true,
    error: null
  });

  const [showSidebar, setShowSidebar] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://rwuierui"); // Replace with real endpoint
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setDashboardData({
          totalCourses: data.totalCourses || 0,
          subscribers: data.subscribers || 0,
          totalAmount: data.totalAmount || 0,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setDashboardData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const currency = Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN"
  }).format(dashboardData.totalAmount);

  const chartData = [
    { name: 'Courses', value: dashboardData.totalCourses },
    { name: 'Subscribers', value: dashboardData.subscribers },
    { name: 'Revenue (₦)', value: dashboardData.totalAmount }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow z-50">
        <h1 className="text-xl font-bold text-indigo-600">Admin Panel</h1>
        <button onClick={() => setShowSidebar(!showSidebar)} className="text-indigo-600">
          <FiMenu className="text-2xl" />
        </button>
      </div>

      {/* Mobile Sidebar (Below header) */}
      {showSidebar && (
        <div className="md:hidden bg-white border-t border-b border-gray-200 p-4 space-y-4 shadow-sm">
          <SidebarLinks />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-6 shadow-sm">
        <SidebarLinks />
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 mt-36 p-4 sm:p-6 md:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-light text-gray-800 mb-4 sm:mb-0">Dashboard</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/AddExam">
              <button className="flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:shadow-md  hover:border-indigo-300">
                <FiBookOpen className="mr-2" />
                <span>Add Exam</span>
              </button>
            </Link>
            <Link to="/AddCourses">
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
              <FiClipboard className="mr-2" />
              <span>Add Subject</span>
            </button>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard icon={<FiBook />} label="Total Courses" value={dashboardData.totalCourses} bg="bg-indigo-100" text="text-indigo-600" />
          <DashboardCard icon={<FiUsers />} label="Subscribers" value={dashboardData.subscribers} bg="bg-green-100" text="text-green-600" />
          <DashboardCard icon={<FiDollarSign />} label="Total Revenue" value={currency} bg="bg-blue-100" text="text-blue-600" />
        </div>

        {/* Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow ">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Overview Chart</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => v.toLocaleString()} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="value" position="top" formatter={(v) => v.toLocaleString()} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sidebar Links Component
const SidebarLinks = () => (
  <nav className="space-y-4 text-gray-700">
    <Link to="/dashboard" className="flex items-center space-x-2 hover:text-indigo-600 transition">
      <FiBook className="text-xl" />
      <span>Dashboard</span>
    </Link>
    <Link to="/register" className="flex items-center space-x-2 hover:text-indigo-600 transition">
      <FiUserPlus className="text-xl" />
      <span>Registration</span>
    </Link>
    <Link to="/transactions" className="flex items-center space-x-2 hover:text-indigo-600 transition">
      <FiList className="text-xl" />
      <span>Transaction History</span>
    </Link>
    <Link to="/AddExam" className="flex items-center space-x-2 hover:text-indigo-600 transition">
      <FiBookOpen className="text-xl" />
      <span>Add Exam</span>
    </Link>
  </nav>
);

// Dashboard Card Component
const DashboardCard = ({ icon, label, value, bg, text }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow ">
    <div className="flex items-center">
      <div className={`p-2 rounded-lg ${bg} ${text}`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-xl font-semibold">{value}</h3>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
