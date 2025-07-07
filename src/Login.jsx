import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loginUser = async (formData) => {
  const normalizedData = {
    ...formData,
    email: formData.email.toLowerCase()
  };

  const res = await fetch(import.meta.env.VITE_API_LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizedData)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
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
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
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
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store all important data
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("userId", data.data.userId);
      localStorage.setItem("email", data.data.email);
      localStorage.setItem("role", data.data.role);
      localStorage.setItem("name", data.data.name); 

      toast.success("Welcome back!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      console.log('Login data:', data);

      setTimeout(() => {
        if (data.data.role === "admin") {
          navigate('/AdminDasboard');
        } else {
          navigate('/StudentDashboard');
        }
      }, 1000);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      toast.error(error.message || 'Something went wrong.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    for (const [name, value] of Object.entries(formData)) {
      newErrors[name] = validateField(name, value);
    }
    setErrors(newErrors);

    const isValid = Object.values(newErrors).every(err => !err);
    if (!isValid) {
      toast.error('Please correct the errors in the form.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    mutate(formData);
  };

  return (
    <div className="mina min-h-screen flex items-center justify-center px-4 py-8">
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
                <input
                  type={field === 'password' && !showPassword ? 'password' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-3 pr-4 py-3 rounded-lg border transition focus:outline-none ${
                    errors[field]
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-200'
                  }`}
                  aria-label={field}
                  style={{ textTransform: field === 'email' ? 'none' : 'initial' }}
                />
                {field === 'password' && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59M3 3l18 18"/>
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                )}
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
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/RegistrationPage" className="text-blue-600 hover:underline font-semibold">
              Create one
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
