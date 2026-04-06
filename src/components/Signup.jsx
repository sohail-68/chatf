import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('https://chatbackendnew-1.onrender.com/api/auth/register', {
        username,
        email,
        password
      });

      // Store user data
      const userData = response.data.payload?.user || response.data.user;
      const token = response.data.token || response.data.payload?.token;
      
      if (userData && token) {
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('userid', userData.id || userData._id);
        sessionStorage.setItem('token', token);
        
        toast.success('Account created successfully!');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Something went wrong. Please try again.';
      toast.error(errorMessage);
      setErrors(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Form animations
  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: '0px 10px 20px rgba(0, 0, 255, 0.3)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#3036ab] via-[#4325a3] to-[#5b3634] py-16 px-4">
      <motion.div
        className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-3">Sign Up</h2>
        <p className="text-center text-gray-300 mb-8">Create an account to get started.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label htmlFor="username" className="block text-gray-200 text-sm mb-2 font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 text-gray-900 bg-white bg-opacity-90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                errors.username ? 'border-2 border-red-500' : ''
              }`}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label htmlFor="email" className="block text-gray-200 text-sm mb-2 font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 text-gray-900 bg-white bg-opacity-90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                errors.email ? 'border-2 border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <label htmlFor="password" className="block text-gray-200 text-sm mb-2 font-medium">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 text-gray-900 bg-white bg-opacity-90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                errors.password ? 'border-2 border-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-all ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'
            }`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : (
              'Sign Up'
            )}
          </motion.button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-gray-300">
          <p>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition"
            >
              Log in
            </button>
          </p>
        </div>

        {/* 3D Rotating Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.1))',
            filter: 'blur(20px)',
            zIndex: -1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}

export default SignUp;
