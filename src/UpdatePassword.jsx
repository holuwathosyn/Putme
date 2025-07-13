import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UPDATE_PASSWORD_URL =  `${import.meta.env.VITE_API_BASE_URL}/auth/change-password`;

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      toast.error('Please login to access this page');
    }
  }, [token]);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Must be at least 8 characters";
    if (!/[a-z]/.test(pwd)) return "Must include lowercase letter";
    if (!/[A-Z]/.test(pwd)) return "Must include uppercase letter";
    if (!/[0-9]/.test(pwd)) return "Must include number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "Must include special character";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Session expired. Please login again.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        UPDATE_PASSWORD_URL,
        { old_password: currentPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token.replace(/['"]+/g, '').trim()}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.');
      } else if (err.response) {
        if (err.response.status === 401) {
          toast.error('Invalid current password or session expired.');
        } else if (err.response.status === 400 || err.response.status === 422) {
          toast.error(err.response.data?.message || 'Invalid request.');
        } else {
          toast.error(err.response.data?.message || 'Error changing password.');
        }
      } else {
        toast.error('Network or server error.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p>Please login to change your password.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Current password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="New password"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              At least 8 chars, uppercase, lowercase, number, special char
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-md transition-colors ${
              loading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ChangePassword;
