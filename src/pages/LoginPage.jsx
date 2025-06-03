import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../utils/axiosConfig';

// Input component for reusable form fields
const FormInput = ({ id, name, type, placeholder, value, onChange, autoComplete }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-4"
  >
    <label htmlFor={id} className="sr-only">{placeholder}</label>
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      required
      value={value}
      onChange={onChange}
      className="appearance-none w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
      placeholder={placeholder}
    />
  </motion.div>
);

// Button component with loading state
const SubmitButton = ({ loading }) => (
  <motion.button
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    type="submit"
    disabled={loading}
    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? (
      <span className="flex items-center">
        <svg className="animate-spin h-5 w-5 mr-2 text-white\" viewBox="0 0 24 24">
          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4\" fill="none" />
          <path className="opacity-75\" fill="currentColor\" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" />
        </svg>
        Signing in...
      </span>
    ) : (
      'Sign In'
    )}
  </motion.button>
);

// Error message component
const ErrorMessage = ({ error }) => (
  error && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-red-600 dark:text-red-400 text-sm text-center"
    >
      {error}
    </motion.div>
  )
);

// Main LoginPage component
const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/profile';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/auth/login', form);
      const { token, role, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate back to the original destination
      navigate(from);
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || 'Invalid email or password';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl"
      >
        {/* Add a logo and a more welcoming intro */}
        <div className="flex flex-col items-center mb-6">
          <img src="https://bloodfornepal.org/img/logo.png" alt="Blood For Nepal Logo" className="h-24 w-24 object-contain mb-2" />
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-2 text-sm text-gray-600 dark:text-gray-400"
          >
            Sign in to access your account
          </motion.p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FormInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
          />
          <FormInput
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <ErrorMessage error={error} />
          <SubmitButton loading={loading} />
        </form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-sm text-gray-600 dark:text-gray-400"
        >
          Don't have an account?{' '}
          <Link to="/register-user" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Register
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;