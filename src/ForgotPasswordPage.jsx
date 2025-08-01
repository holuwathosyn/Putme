import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Get the environment variable
const FORGOT_PASSWORD_URL = import.meta.env.VITE_FORGOT_PASSWORD_URL;
console.log('Reset link URL:', FORGOT_PASSWORD_URL); // Debug log

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(FORGOT_PASSWORD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: `${window.location.origin}/ResetPasswordPage`,
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send reset link');
      }

      toast.success('Password reset link sent. Please check your email.');
      setEmail('');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default ForgotPasswordPage;
