import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Facebook, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic client-side validation
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          shouldRememberSession: rememberMe
        }
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Incorrect email or password. Please try again or reset your password.');
        } else {
          setError('An error occurred during sign in. Please try again.');
        }
        return;
      }

      if (data.user) {
        // Ensure session is properly stored
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          navigate('/', { replace: true });
        } else {
          setError('Failed to establish session. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1222] flex flex-col items-center justify-center p-4">
      <div className="text-center text-[#8B9CC8] mb-8">
        <p className="text-lg">
          Experience a modern and intuitive platform designed to
        </p>
        <p className="text-lg">
          streamline your workflow and enhance productivity
        </p>
      </div>

      <div className="w-full max-w-md bg-[#1A2337] rounded-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="bg-[#4B5320] rounded-lg p-3 flex flex-col items-center">
              <div className="flex">
                <ChevronDown className="h-6 w-6 text-[#FFD700] transform -rotate-45" />
                <ChevronDown className="h-6 w-6 text-[#FFD700] transform rotate-45 -ml-3" />
              </div>
              <div className="flex mt-1">
                <ChevronDown className="h-6 w-6 text-[#FFD700] transform -rotate-45" />
                <ChevronDown className="h-6 w-6 text-[#FFD700] transform rotate-45 -ml-3" />
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
        <p className="text-[#8B9CC8] text-center mb-6">Sign in to your account to continue</p>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <p className="font-medium">{error}</p>
            {error.includes('Incorrect email or password') && (
              <p className="text-sm mt-1">
                Forgot your password?{' '}
                <Link to="/forgot-password" className="text-red-700 underline hover:text-red-800">
                  Reset it here
                </Link>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[#8B9CC8] mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#8B9CC8]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email"
                className="w-full bg-[#0B1222] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder-[#4A5578]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8B9CC8] mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#8B9CC8]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                className="w-full bg-[#0B1222] text-white pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder-[#4A5578]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B9CC8] hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-[#0B1222] border-[#4A5578] text-[#FFD700] focus:ring-[#FFD700]"
              />
              <span className="ml-2 text-sm text-[#8B9CC8]">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-[#FFD700] hover:text-[#FFE55C] transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4B5320] text-[#FFD700] py-2 rounded-lg font-semibold hover:bg-[#5C6627] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <Link
            to="/register"
            className="w-full block text-center bg-black text-white py-2 rounded-lg font-semibold hover:bg-[#1A2337] transition-colors border border-[#4A5578]"
          >
            Create Account
          </Link>

          <div className="text-center">
            <p className="text-[#8B9CC8] text-sm">Or sign in with</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button className="p-2 bg-[#0B1222] rounded-full hover:bg-[#1A2337] transition-colors">
                <Facebook className="h-5 w-5 text-[#8B9CC8]" />
              </button>
              <button className="p-2 bg-[#0B1222] rounded-full hover:bg-[#1A2337] transition-colors">
                <Mail className="h-5 w-5 text-[#8B9CC8]" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;