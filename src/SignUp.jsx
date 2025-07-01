import React, { useState } from 'react'; 
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const registerUser = async (formData) => {
  const res = await fetch( import.meta.env.VITE_API_REG,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Registration failed');
  }
  return res.json();
};

const RegistrationPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' // ✅ added
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const patterns = {
    name: /^[a-zA-Z ]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  };

  const validateField = (name, value) => {
    if (!value.trim()) return 'This field is required';

    // ✅ custom confirm password check
    if (name === 'confirmPassword') {
      if (value !== formData.password) return 'Passwords do not match';
      return '';
    }

    if (!patterns[name]?.test(value)) {
      switch (name) {
        case 'name': return 'Name must be 2-50 letters';
        case 'email': return 'Invalid email address';
        case 'password': return 'Password must include uppercase, lowercase, number, min 8 chars';
        default: return '';
      }
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

    // ✅ live update confirm password if already touched
    if (name === 'password' && touched.confirmPassword) {
      setErrors({ ...errors, confirmPassword: validateField('confirmPassword', formData.confirmPassword) });
    }
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Registration successful!');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' }); // ✅ reset
      setTouched({});
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

    const isValid = Object.values(newErrors).every(err => !err);
    if (isValid) {
      mutate(formData);
    } else {
      toast.error('Please correct the errors in the form.');
    }
  };

  return (
    <div className="mina min-h-screen flex items-center justify-center px-4 py-8">
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600">Create Account</h2>
          <p className="text-center text-gray-500 mb-6">Start your journey to academic success</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {['name', 'email', 'password', 'confirmPassword'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                  {field === 'confirmPassword' ? 'Confirm Password' : field}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {/* icon placeholder */}
                  </div>
                  <input
                    type={(field === 'password' || field === 'confirmPassword') && !showPassword ? 'password' : 'text'}
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
              </div>
            ))}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms</a> and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              Create Account
            </button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-semibold">Sign in</Link>
            </p>
          </form>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RegistrationPage;
