import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter a password');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        // Registration successful
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please sign in with your new account.' 
          }
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1222] flex flex-col items-center justify-center p-4">
      <div className="text-center text-[#8B9CC8] mb-8">
        <p className="text-lg">
          Join our platform to streamline your workflow
        </p>
        <p className="text-lg">
          and enhance productivity
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

        <h2 className="text-2xl font-bold text-white text-center mb-2">Create Account</h2>
        <p className="text-[#8B9CC8] text-center mb-6">Sign up to get started</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
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
                placeholder="Create a password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4B5320] text-[#FFD700] py-2 rounded-lg font-semibold hover:bg-[#5C6627] transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center text-[#8B9CC8]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FFD700] hover:text-[#FFE55C] transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;