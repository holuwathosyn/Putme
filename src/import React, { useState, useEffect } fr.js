import React, { useState, useEffect } from 'react';

// Font Awesome Imports
// These would typically be installed via npm and imported from @fortawesome/react-fontawesome
// For this self-contained example, we assume Font Awesome CSS is loaded via CDN in the HTML.
// We'll define simple placeholder components for FontAwesomeIcon and icons for demo purposes.
// In a real React app, you would do:
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar, faCalendarAlt, faChartPie, faSignOutAlt, faRocket, faUsers, faClipboard, faBullhorn, faChevronDown } from '@fortawesome/free-solid-svg-icons';

// Placeholder for FontAwesomeIcon and icons if not using the library directly in this environment.
// In a real environment with FontAwesome installed, you would remove this placeholder and use the actual imports.
const FontAwesomeIcon = ({ icon, className }) => {
    let faClass = '';
    switch (icon) {
        case 'star': faClass = 'fas fa-star'; break;
        case 'calendar-alt': faClass = 'fas fa-calendar-alt'; break;
        case 'chart-pie': faClass = 'fas fa-chart-pie'; break;
        case 'sign-out-alt': faClass = 'fas fa-sign-out-alt'; break;
        case 'rocket': faClass = 'fas fa-rocket'; break;
        case 'users': faClass = 'fas fa-users'; break;
        case 'clipboard': faClass = 'fas fa-clipboard'; break;
        case 'bullhorn': faClass = 'fas fa-bullhorn'; break;
        case 'chevron-down': faClass = 'fas fa-chevron-down'; break;
        default: faClass = '';
    }
    return <i className={`${faClass} ${className}`}></i>;
};
const faStar = 'star';
const faCalendarAlt = 'calendar-alt';
const faChartPie = 'chart-pie';
const faSignOutAlt = 'sign-out-alt';
const faRocket = 'rocket';
const faUsers = 'users';
const faClipboard = 'clipboard';
const faBullhorn = 'bullhorn';
const faChevronDown = 'chevron-down';


// --- Sidebar Component ---
const Sidebar = ({ userName, onLogout }) => {
    // State to manage the profile picture URL
    const [profilePicture, setProfilePicture] = useState(() => {
        // Initialize state from localStorage, fallback to a placeholder if not found
        return localStorage.getItem('userProfilePicture') || 'https://placehold.co/60x60/dbeafe/2563eb?text=UP'; // Placeholder with Tailwind blue-100 bg and blue-600 text
    });
    // State for dynamic content in sidebar
    const [daysRemaining, setDaysRemaining] = useState('...');
    const [examProgress, setExamProgress] = useState('...');

    // useEffect to simulate fetching dynamic data like days remaining and exam progress
    useEffect(() => {
        // Simulate an API call delay for dynamic data
        const fetchDynamicData = () => {
            setTimeout(() => {
                setDaysRemaining('185 Days'); // Example data
                setExamProgress('82% Complete'); // Example data
            }, 500); // Short delay for demonstration
        };
        fetchDynamicData();
    }, []); // Empty dependency array means this runs once on mount

    // Handler for profile picture file input change
    const handlePictureUpload = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader(); // Create a FileReader instance
            reader.onload = (e) => {
                const imageUrl = e.target.result; // Get the base64 encoded image URL
                setProfilePicture(imageUrl); // Update the state with the new image
                localStorage.setItem('userProfilePicture', imageUrl); // Store image in localStorage
                alert('Profile picture updated and saved locally!'); // User feedback
            };
            reader.readAsDataURL(file); // Read the file as a Data URL
        }
    };

    return (
        <aside className="w-64 bg-white p-6 shadow-lg flex flex-col items-center border-r border-gray-100 rounded-lg m-4">
            {/* User Profile Section */}
            <div className="text-center mb-10 pt-5 w-full">
                <label htmlFor="profile-picture-upload" className="relative block w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3 overflow-hidden cursor-pointer border-2 border-primary-600 flex items-center justify-center group">
                    <img id="profile-picture-preview" src={profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full" onError={(e) => e.target.src = 'https://placehold.co/60x60/dbeafe/2563eb?text=UP'} />
                    {/* Hidden file input */}
                    <input
                        type="file"
                        id="profile-picture-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePictureUpload}
                    />
                    {/* Overlay for hover effect */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                        <FontAwesomeIcon icon={faStar} className="text-white text-xl" /> {/* Star icon on hover */}
                    </div>
                </label>
                <div className="font-semibold text-lg text-gray-800">{userName}</div>
            </div>

            {/* Main Navigation */}
            <nav className="w-full flex-grow">
                <ul>
                    {/* Subscription Item */}
                    <li className="mb-1">
                        <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-200 border-l-4 border-transparent hover:border-primary-600">
                            <FontAwesomeIcon icon={faStar} className="text-xl w-6 mr-4 text-primary-600" />
                            <div className="flex flex-col leading-tight">
                                <span className="font-medium text-base">Subscription</span>
                                <span className="text-sm text-gray-500">Premium Plan</span>
                            </div>
                        </a>
                    </li>
                    {/* Days Remaining Item */}
                    <li className="mb-1">
                        <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-200 border-l-4 border-transparent hover:border-primary-600">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-xl w-6 mr-4 text-primary-600" />
                            <div className="flex flex-col leading-tight">
                                <span className="font-medium text-base">Days Remaining</span>
                                <span className="text-sm font-semibold text-primary-600">{daysRemaining}</span>
                            </div>
                        </a>
                    </li>
                    {/* Exam Progress Item */}
                    <li className="mb-1">
                        <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-200 border-l-4 border-transparent hover:border-primary-600">
                            <FontAwesomeIcon icon={faChartPie} className="text-xl w-6 mr-4 text-primary-600" />
                            <div className="flex flex-col leading-tight">
                                <span className="font-medium text-base">Exam Progress</span>
                                <span className="text-sm font-semibold text-primary-600">{examProgress}</span>
                            </div>
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Logout Section */}
            <div className="w-full p-4 border-t border-gray-200 mt-auto">
                <button
                    onClick={onLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-md"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-lg" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

// --- ReportCard Component ---
const ReportCard = ({ title, count, linkText, linkHref, icon, bgColorClass }) => {
    return (
        <div className={`relative ${bgColorClass} text-white p-5 rounded-xl shadow-lg overflow-hidden min-h-[140px] flex flex-col justify-between transform transition-transform duration-300 hover:scale-105`}>
            <div>
                <h3 className="text-lg font-medium mb-1">{title}</h3>
                <p className="text-4xl font-bold mb-3">{count}</p>
            </div>
            <a href={linkHref} className="text-white text-opacity-80 hover:underline text-sm font-light">
                {linkText}
            </a>
            <FontAwesomeIcon icon={icon} className="absolute bottom-4 right-4 text-white text-opacity-20 text-6xl" />
        </div>
    );
};

// --- App Component (Main Dashboard) ---
function App() {
    // Handler for logout action
    const handleLogout = () => {
        alert('Logging out...'); // Simple alert for demonstration
        localStorage.removeItem('userProfilePicture'); // Clear profile picture on logout
        // In a real application, you would handle authentication state and redirection here.
        // E.g., redirect to login page: window.location.href = '/login';
    };

    // Dummy data for report cards to populate the dashboard
    const reportData = [
        { title: 'Total Class', count: 4, linkText: 'View Classes', linkHref: '#', icon: faRocket, bgColorClass: 'bg-primary-600' },
        { title: 'Total Students', count: 2, linkText: 'View Students', linkHref: '#', icon: faUsers, bgColorClass: 'bg-orange-500' }, // Using default Tailwind orange
        { title: 'Total Class Notice', count: 2, linkText: 'View Notices', linkHref: '#', icon: faClipboard, bgColorClass: 'bg-green-500' }, // Using default Tailwind green
        { title: 'Total Public Notice', count: 1, linkText: 'View PublicNotices', linkHref: '#', icon: faBullhorn, bgColorClass: 'bg-red-500' }, // Using default Tailwind red
    ];

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-inter"> {/* Use Inter font if available globally or import it */}
            {/* Sidebar Component */}
            <Sidebar userName="Mayuri K." onLogout={handleLogout} />

            <main className="flex-1 p-4 sm:p-8 overflow-y-auto no-scrollbar">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-md mb-8">
                    <h1 className="text-2xl font-semibold text-primary-700 mb-4 sm:mb-0">Welcome to Edu Authorities !</h1>
                    <div className="flex items-center space-x-4">
                        <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm">
                            <option>Select Language</option>
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                        <div className="flex items-center cursor-pointer text-gray-700 font-medium">
                            Mayuri K <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-sm" />
                        </div>
                    </div>
                </header>

                {/* Report Summary Section */}
                <section className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 pb-4 mb-6 border-b border-gray-200">Report Summary</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {reportData.map((card, index) => (
                            <ReportCard
                                key={index}
                                title={card.title}
                                count={card.count}
                                linkText={card.linkText}
                                linkHref={card.linkHref}
                                icon={card.icon}
                                bgColorClass={card.bgColorClass}
                            />
                        ))}
                    </div>
                </section>

                {/* My Daily Activities Section (Placeholder for Chart) */}
                <section className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 pb-4 mb-6 border-b border-gray-200">My Daily Activities</h2>
                    <div className="flex flex-col items-center justify-center gap-6">
                        {/* Placeholder for a real chart component (e.g., using Chart.js, Recharts, Nivo) */}
                        <div className="w-full max-w-xl h-56 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-lg border border-dashed border-gray-300">
                            <p>Pie Chart Placeholder</p>
                        </div>
                        {/* Chart Legend */}
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-600 text-sm">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-primary-600 mr-2 shadow-sm"></span>Total Class
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-orange-500 mr-2 shadow-sm"></span>Total Students
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-sm"></span>Total Class Notice
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-sm"></span>Total Public Notice
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;
