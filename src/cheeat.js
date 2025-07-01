import React, { useState, useEffect } from 'react';
import { FiBook, FiUsers, FiDollarSign, FiBookOpen, FiClipboard } from 'react-icons/fi';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalCourses: { value: 0, loading: true, error: null },
    subscribers: { value: 0, loading: true, error: null },
    totalAmount: { value: 0, loading: true, error: null }
  });

  useEffect(() => {
    const fetchAllMetrics = async () => {
      try {
        // Fetch total courses
        const coursesResponse = await fetch('https://api.yourdomain.com/total-courses');
        if (!coursesResponse.ok) throw new Error('Failed to fetch courses');
        const coursesData = await coursesResponse.json();

        // Fetch subscribers
        const subsResponse = await fetch('https://api.yourdomain.com/total-subscribers');
        if (!subsResponse.ok) throw new Error('Failed to fetch subscribers');
        const subsData = await subsResponse.json();

        // Fetch total amount
        const amountResponse = await fetch('https://api.yourdomain.com/total-amount');
        if (!amountResponse.ok) throw new Error('Failed to fetch amount');
        const amountData = await amountResponse.json();

        setMetrics({
          totalCourses: { value: coursesData.count || 0, loading: false, error: null },
          subscribers: { value: subsData.count || 0, loading: false, error: null },
          totalAmount: { value: amountData.amount || 0, loading: false, error: null }
        });
      } catch (error) {
        setMetrics(prev => ({
          totalCourses: { ...prev.totalCourses, loading: false, error: error.message },
          subscribers: { ...prev.subscribers, loading: false, error: error.message },
          totalAmount: { ...prev.totalAmount, loading: false, error: error.message }
        }));
      }
    };

    fetchAllMetrics();
    
    // Optional: Set up polling
    const intervalId = setInterval(fetchAllMetrics, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Format Naira amount
  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Check if any metric is still loading
  const isLoading = Object.values(metrics).some(metric => metric.loading);
  const hasError = Object.values(metrics).some(metric => metric.error);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading dashboard data</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header with Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <h1 className="text-3xl font-light text-gray-800 mb-4 md:mb-0">Dashboard</h1>
        <div className="flex space-x-4">
          <button className="flex items-center px-6 py-3 bg-white text-indigo-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-indigo-300">
            <FiBookOpen className="mr-3 text-lg" />
            <span className="font-medium">Add Subject</span>
          </button>
          <button className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-indigo-700">
            <FiClipboard className="mr-3 text-lg" />
            <span className="font-medium">Add Exam</span>
          </button>
        </div
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Total Courses Card */}
        <MetricCard
          icon={<FiBook className="h-5 w-5" />}
          title="Total Courses"
          value={metrics.totalCourses.value.toLocaleString()}
          loading={metrics.totalCourses.loading}
          error={metrics.totalCourses.error}
          color="indigo"
        />

        {/* Subscribers Card */}
        <MetricCard
          icon={<FiUsers className="h-5 w-5" />}
          title="Subscribers"
          value={metrics.subscribers.value.toLocaleString()}
          loading={metrics.subscribers.loading}
          error={metrics.subscribers.error}
          color="green"
        />

        {/* Total Amount Card */}
        <MetricCard
          icon={<FiDollarSign className="h-5 w-5" />}
          title="Total Amount"
          value={formatNaira(metrics.totalAmount.value)}
          loading={metrics.totalAmount.loading}
          error={metrics.totalAmount.error}
          color="blue"
        />
      </div>
    </div>
  );
};

// Reusable Metric Card Component
const MetricCard = ({ icon, title, value, loading, error, color }) => {
  const colorClasses = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color].bg} ${colorClasses[color].text}`}>
          {icon}
        </div>
        <div className="ml-5 flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {loading ? (
            <div className="mt-2 h-8 bg-gray-200 rounded-md w-4/5 animate-pulse"></div>
          ) : error ? (
            <p className="mt-2 text-red-500 text-sm">Error loading data</p>
          ) : (
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;