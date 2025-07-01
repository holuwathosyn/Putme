import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FontAwesomeIcon = ({ icon, className }) => {
    const icons = {
        'star': 'fas fa-star',
        'calendar-alt': 'fas fa-calendar-alt',
        'chart-pie': 'fas fa-chart-pie',
        'sign-out-alt': 'fas fa-sign-out-alt',
        'lock': 'fas fa-lock',
        'rocket': 'fas fa-rocket',
        'crown': 'fas fa-crown',
        'chart-line': 'fas fa-chart-line',
        'clock': 'fas fa-clock',
        'gem': 'fas fa-gem',
        'calendar-check': 'fas fa-calendar-check',
        'award': 'fas fa-award',
        'bolt': 'fas fa-bolt',
        'check-circle': 'fas fa-check-circle',
        'user-shield': 'fas fa-user-shield',
        'chevron-down': 'fas fa-chevron-down',
        'bell': 'fas fa-bell',
        'search': 'fas fa-search',
        'graduation-cap': 'fas fa-graduation-cap'
    };
    return <i className={`${icons[icon]} ${className}`}></i>;
};

const MetricCard = ({ title, value, icon, color, trend, trendValue }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group flex flex-col"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${color} transition-all duration-300`}>
                <FontAwesomeIcon icon={icon} className="text-xl text-white" />
            </div>
            {trend && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {trend === 'up' ? '↑' : '↓'} {trendValue}
                </span>
            )}
        </div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </motion.div>
);

export default function App() {
    const userName = "Mayuri K.";
    const [profilePicture, setProfilePicture] = useState(() =>
        localStorage.getItem('userProfilePicture') || `https://placehold.co/100x100/f8fafc/1e40af?text=${userName.charAt(0)}`
    );
    const [daysRemaining, setDaysRemaining] = useState('...');
    const [examProgress, setExamProgress] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setDaysRemaining('185 Days');
            setExamProgress(82);
        }, 500);
    }, []);

    const handlePictureUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setProfilePicture(ev.target.result);
                localStorage.setItem('userProfilePicture', ev.target.result);
                toast.success('Profile updated!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    theme: "colored",
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        toast.info('Logging out...', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            onClose: () => localStorage.removeItem('userProfilePicture')
        });
    };

    const analyticsData = [
        { name: 'Subscription', value: 100, icon: 'gem' },
        { name: 'Days Remaining', value: 185, icon: 'calendar-check' },
        { name: 'Exam Progress', value: 82, icon: 'award' }
    ];

    const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd'];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />

            {/* Modern Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mt-10 mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon="graduation-cap" className="text-blue-600 text-2xl" />
                        <h1 className="text-xl font-bold text-gray-900">EduMetrics</h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon="search" className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        
                        <button className="relative p-1 text-gray-500 hover:text-gray-700">
                            <FontAwesomeIcon icon="bell" />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                        </button>
                        
                        <div className="flex items-center space-x-2">
                            <img 
                                src={profilePicture} 
                                alt="Profile" 
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => e.target.src = `https://placehold.co/100x100/f8fafc/1e40af?text=${userName.charAt(0)}`}
                            />
                            <span className="text-sm font-medium">{userName}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 mb-8 text-white"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <label htmlFor="profile-picture-upload" className="relative block w-16 h-16 rounded-full overflow-hidden cursor-pointer border-2 border-white/20 hover:border-white/40 transition">
                                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                <input type="file" id="profile-picture-upload" accept="image/*" className="hidden" onChange={handlePictureUpload} />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                    <FontAwesomeIcon icon="star" className="text-yellow-300" />
                                </div>
                            </label>
                            <div>
                                <h2 className="text-2xl font-bold">Welcome back, {userName}!</h2>
                                <p className="text-blue-100">Ready to continue your learning journey?</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toast.info('Redirecting to exams...')}
                                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg flex items-center space-x-2 transition"
                            >
                                <FontAwesomeIcon icon="rocket" />
                                <span>Start Learning</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.section>

                {/* Metrics Grid */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Subscription Plan"
                            value="Premium"
                            icon="crown"
                            color="bg-gradient-to-br from-blue-600 to-blue-500"
                            trend="up"
                            trendValue="Active"
                        />
                        <MetricCard
                            title="Days Remaining"
                            value={daysRemaining}
                            icon="clock"
                            color="bg-gradient-to-br from-indigo-600 to-indigo-500"
                        />
                        <MetricCard
                            title="Exam Progress"
                            value={`${examProgress}%`}
                            icon="award"
                            color="bg-gradient-to-br from-green-500 to-teal-500"
                            trend="up"
                            trendValue="12%"
                        />
                        <MetricCard
                            title="Courses Taken"
                            value="8"
                            icon="graduation-cap"
                            color="bg-gradient-to-br from-purple-600 to-purple-500"
                            trend="up"
                            trendValue="2 new"
                        />
                    </div>
                </motion.section>

                {/* Analytics Dashboard */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
                >
                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Progress Analytics</h3>
                            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
                                <option>Last 30 days</option>
                                <option>Last 90 days</option>
                                <option>All time</option>
                            </select>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analyticsData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        cornerRadius={8}
                                    >
                                        {analyticsData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]} 
                                                stroke="#fff"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            padding: '12px'
                                        }}
                                        formatter={(value, name) => [`${value}`, name]}
                                    />
                                    <Legend 
                                        iconType="circle"
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ x: 5 }}
                                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FontAwesomeIcon icon="calendar-alt" className="text-blue-600" />
                                    </div>
                                    <span>Schedule Study Session</span>
                                </div>
                                <FontAwesomeIcon icon="chevron-down" className="text-xs" />
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ x: 5 }}
                                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <FontAwesomeIcon icon="chart-line" className="text-purple-600" />
                                    </div>
                                    <span>Purchase Past Questions</span>
                                </div>
                                <FontAwesomeIcon icon="chevron-down" className="text-xs" />
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ x: 5 }}
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <FontAwesomeIcon icon="sign-out-alt" className="text-red-600" />
                                    </div>
                                    <span>Logout</span>
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </motion.section>

                {/* Recent Activity */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition">
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FontAwesomeIcon icon={item === 1 ? 'check-circle' : item === 2 ? 'bolt' : 'gem'} 
                                            className={item === 1 ? 'text-green-500' : item === 2 ? 'text-yellow-500' : 'text-blue-500'} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        {item === 1 ? 'Completed "Advanced Algebra" quiz' : 
                                         item === 2 ? 'New course "Data Science 101" added' : 
                                         'Subscription renewed for 6 months'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item === 1 ? 'Scored 92% - 2 days ago' : 
                                         item === 2 ? 'Available now - 1 week ago' : 
                                         'Active until Dec 2023 - 1 month ago'}
                                    </p>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <FontAwesomeIcon icon="chevron-down" className="text-xs" />
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </main>
        </div>
    );
}