import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className="mila min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-700 p-6 text-center">
          <svg
            className="h-16 w-16 mx-auto text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-white mt-4">404</h1>
          <p className="text-blue-100 mt-2">Page Not Found</p>
        </div>
        
        <div className="p-6 text-center">
          <img
            src="https://illustrations.popsy.co/blue/crashed-error.svg"
            alt="Error illustration"
            className="h-48 mx-auto mb-6"
          />
          <h2 className="text-xl font-semibold text-gray-800">Oops! Looks like you're lost</h2>
          <p className="text-gray-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
            >
              Home Page
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-gray-500 mt-8 text-center">
        Need help? <Link to="/ContactPage" className="text-blue-600 hover:underline">Contact support</Link>
      </p>
    </div>
    <Footer/>
  </>
  );
};

export default NotFoundPage;