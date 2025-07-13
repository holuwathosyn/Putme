import React, { useEffect, useState } from 'react';
import {
  FiBook,
  FiUsers,
  FiDollarSign,
  FiBookOpen,
  FiClipboard,
  FiUserPlus,
  FiList,
  FiMenu,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiCheck
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
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  // Dashboard state
  const [dashboardData, setDashboardData] = useState({
    totalPdfs: 0,
    subscribers: 0,
    totalRevenue: 0,
    pdfAnalytics: [],
    isLoading: true,
    error: null
  });

  // Subjects state
  const [subjects, setSubjects] = useState([]);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [subjectError, setSubjectError] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setDashboardData(prev => ({
          ...prev,
          isLoading: false,
          error: "Please login to view dashboard"
        }));
        return;
      }
      
      const [analyticsRes, pdfAnalyticsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/analytics/pdf`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Calculate total revenue from PDF analytics
      const totalRevenue = pdfAnalyticsRes.data?.data?.reduce((sum, pdf) => {
        return sum + (pdf.price * pdf.purchase_count);
      }, 0) || 0;

      setDashboardData({
        totalPdfs: pdfAnalyticsRes.data?.data?.length || 0,
        subscribers: analyticsRes.data?.data?.subscribedUsers || 0,
        totalRevenue,
        pdfAnalytics: pdfAnalyticsRes.data?.data || [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      setDashboardData(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Failed to load dashboard data"
      }));
      toast.error('Failed to load dashboard data');
    }
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      setSubjectLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setSubjectError("Please login to manage subjects");
        setSubjectLoading(false);
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/subjects`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          } 
        }
      );
      
      // Handle different API response structures
      let subjectsData = [];
      if (Array.isArray(response.data)) {
        subjectsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        subjectsData = response.data.data;
      } else if (response.data && response.data.subjects) {
        subjectsData = response.data.subjects;
      }
      
      setSubjects(subjectsData);
      setSubjectError(null);
    } catch (error) {
      setSubjectError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to load subjects"
      );
      toast.error('Failed to load subjects');
    } finally {
      setSubjectLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchSubjects();
  }, []);

  // Format currency
  const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN"
  }).format(dashboardData.totalRevenue);

  // Chart data
  const chartData = [
    { name: 'PDFs', value: dashboardData.totalPdfs },
    { name: 'Subscribers', value: dashboardData.subscribers },
    { name: 'Revenue (₦)', value: dashboardData.totalRevenue }
  ];

  // Update subject
  const handleUpdateSubject = async (id) => {
    if (!newSubjectName.trim()) {
      toast.warning('Subject name cannot be empty');
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error('Please login to update subjects');
      return;
    }
  
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/subjects/${id}`,
        { subject: newSubjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchSubjects();
      setEditingSubject(null);
      setNewSubjectName('');
      toast.success('Subject updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update subject");
    }
  };
  
  // Delete subject
  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error('Please login to delete subjects');
      return;
    }
  
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/subjects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchSubjects();
      toast.success('Subject deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete subject");
    }
  };
  
  // Add new subject
  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      toast.warning('Subject name cannot be empty');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error('Please login to add subjects');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/subjects`,
        { subjects: [newSubjectName] },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data) {
        setNewSubjectName('');
        setShowAddForm(false);
        toast.success('Subject added successfully');
        await fetchSubjects();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to add subject"
      );
    }
  };

  return (
    <div className=" mila flex flex-col  md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden  flex items-center justify-between p-4 bg-white shadow z-50">
        <h1 className="text-xl font-bold text-indigo-600">Admin Panel</h1>
        <button 
          onClick={() => setShowSidebar(!showSidebar)} 
          className="text-indigo-600 focus:outline-none"
        >
          <FiMenu className="text-2xl" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="md:hidden bg-white border-t border-b border-gray-200 p-4 space-y-4 shadow-sm">
          <SidebarLinks />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-6 shadow-sm">
        <SidebarLinks />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-light text-gray-800 mb-4 sm:mb-0">Dashboard</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/AddExam">
              <button className="flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:shadow-md hover:border-indigo-300 transition-all">
                <FiBookOpen className="mr-2" />
                <span>Add Exam</span>
              </button>
            </Link>
            <Link to="/PdfUploader">
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all">
                <FiClipboard className="mr-2" />
                <span>Upload Pdf</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            icon={<FiBook />} 
            label="Total PDFs" 
            value={dashboardData.isLoading ? "Loading..." : dashboardData.totalPdfs} 
            bg="bg-indigo-100" 
            text="text-indigo-600" 
          />
          <DashboardCard 
            icon={<FiUsers />} 
            label="Subscribers" 
            value={dashboardData.isLoading ? "Loading..." : dashboardData.subscribers} 
            bg="bg-green-100" 
            text="text-green-600" 
          />
          <DashboardCard 
            icon={<FiDollarSign />} 
            label="Total Revenue" 
            value={dashboardData.isLoading ? "Loading..." : currency} 
            bg="bg-blue-100" 
            text="text-blue-600" 
          />
        </div>

        {/* Chart */}
        {!dashboardData.isLoading && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Overview Chart</h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => v.toLocaleString()} />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      formatter={(v) => v.toLocaleString()} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* PDF Analytics */}
        {!dashboardData.isLoading && dashboardData.pdfAnalytics.length > 0 && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">PDF Analytics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchases</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.pdfAnalytics.map((pdf) => (
                    <tr key={pdf.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pdf.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN"
                        }).format(pdf.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pdf.purchase_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN"
                        }).format(pdf.price * pdf.purchase_count)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subjects Management */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Manage Subjects</h3>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingSubject(null);
                setNewSubjectName('');
              }}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiPlus className="mr-1" />
              <span>{showAddForm ? 'Cancel' : 'Add Subject'}</span>
            </button>
          </div>

          {/* Add Subject Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Enter subject name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={handleAddSubject}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiCheck />
                </button>
              </div>
            </div>
          )}

          {/* Subjects List */}
          {subjectLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : subjectError ? (
            <div className="text-red-500 p-4 text-center">
              {subjectError}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.length > 0 ? (
                    subjects.map((subject, index) => (
                      <tr key={subject.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.id || index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {editingSubject === (subject.id || index) ? (
                            <input
                              type="text"
                              value={newSubjectName}
                              onChange={(e) => setNewSubjectName(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          ) : (
                            subject.subject || subject.name
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            {editingSubject === (subject.id || index) ? (
                              <>
                                <button
                                  onClick={() => handleUpdateSubject(subject.id)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <FiCheck />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingSubject(null);
                                    setNewSubjectName('');
                                  }}
                                  className="text-gray-600 hover:text-gray-800"
                                >
                                  <FiX />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingSubject(subject.id || index);
                                    setNewSubjectName(subject.subject || subject.name);
                                    setShowAddForm(false);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-800"
                                >
                                  <FiEdit2 />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubject(subject.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FiTrash2 />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No subjects found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Sidebar Component
const SidebarLinks = () => (
  <nav className="space-y-4 text-gray-700">
    <Link 
      to="#" 
      className="flex items-center space-x-2 hover:text-indigo-600 transition-colors p-2 rounded hover:bg-indigo-50"
    >
      <FiBook className="text-xl" />
      <span>Dashboard</span>
    </Link>
    
    <Link 
      to="#" 
      className="flex items-center space-x-2 hover:text-indigo-600 transition-colors p-2 rounded hover:bg-indigo-50"
    >
      <FiList className="text-xl" />
      <span>Transaction History</span>
    </Link>
    <Link 
      to="/AddExam" 
      className="flex items-center space-x-2 hover:text-indigo-600 transition-colors p-2 rounded hover:bg-indigo-50"
    >
      <FiBookOpen className="text-xl" />
      <span>Add Exam</span>
    </Link>
  </nav>
);

// Dashboard Card Component
const DashboardCard = ({ icon, label, value, bg, text }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${bg} ${text}`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-xl font-semibold">{value}</h3>
      </div>
    </div>
  </div>
);

export default AdminDashboard;