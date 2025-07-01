import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loginUser = async (formData) => {
  const res = await fetch(import.meta.env.VITE_API_LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Login failed');
  }
  return res.json();
};

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  };

  const validateField = (name, value) => {
    if (!value.trim()) return 'This field is required';
    if (!patterns[name].test(value)) {
      if (name === 'email') return 'Invalid email address';
      if (name === 'password') return 'Password must include uppercase, lowercase, number, min 8 characters';
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("role", data.data.role);  // optional, to use later

      toast.success("Welcome back");
      console.log('Login data:', data);

      
      const role = data.data.role;
      if (role === "admin") {
      navigate('/AdminDasboard');
      } else {
      navigate('/StudentDashboard');
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      newErrors[name] = validateField(name, value);
    });
    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((err) => !err);

    if (isValid) {
      mutate(formData);
    } else {
      toast.error('Please correct the errors in the form.');
    }
  };

  const icons = {
    email: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    password: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    )
  };

  return (
    <div className="mina min-h-screen flex items-center justify-center px-4 py-8">
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600">Sign In</h2>
          <p className="text-center text-gray-500 mb-6">Welcome back! Please login to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {['email', 'password'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {icons[field]}
                  </div>
                  <input
                    type={field === 'password' && !showPassword ? 'password' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-150 focus:outline-none ${
                      errors[field]
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-200'
                    }`}
                    aria-label={field}
                  />
                </div>
                {errors[field] && (
                  <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
                )}

                {field === 'password' && (
                  <Link to="/ForgotPasswordPage">
                    <p className="text-sm text-blue-600 mt-2 text-right hover:underline cursor-pointer">
                      Forgot password?
                    </p>
                  </Link>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/RegistrationPage" className="text-blue-600 hover:underline font-semibold">
                Create one
              </Link>
            </p>
          </form>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginPage;