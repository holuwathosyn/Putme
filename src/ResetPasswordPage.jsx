import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RESET_PASSWORD_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`;

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get('token');

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "At least 8 characters.";
    if (!/[a-z]/.test(pwd)) return "Include at least one lowercase letter.";
    if (!/[A-Z]/.test(pwd)) return "Include at least one uppercase letter.";
    if (!/[0-9]/.test(pwd)) return "Include at least one number.";
    if (!/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(pwd)) return "Include at least one special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Missing or invalid reset token.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(RESET_PASSWORD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Password reset failed.');
      }

      toast.success('Password reset successful! Redirecting...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Reset Password</h2>
        <div className="text-sm text-gray-600 mb-6">
          Your new password must include:
          <ul className="list-disc list-inside mt-2">
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
            <li>One special character</li>
          </ul>
        </div>

        {!token ? (
          <div className="text-center text-red-600 font-medium">
            Missing reset token. Please use the link sent to your email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter new password"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Re-enter password"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition disabled:opacity-70"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default ResetPasswordPage;
