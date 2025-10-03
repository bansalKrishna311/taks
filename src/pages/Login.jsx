import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/auth';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [serverError, setServerError] = useState('');
  const nav = useNavigate();
  const { login } = useAuth();

  const onSubmit = async data => {
    setServerError('');
    try {
      const res = await api.post('/auth/login', data);
      login(res.data);
      nav('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                     err.response?.data?.errors?.[0]?.msg || 
                     'Login failed';
      setServerError(errorMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>
        
        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              })} 
              placeholder="Enter your email" 
              className="w-full input focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              {...register('password', { required: 'Password is required' })} 
              placeholder="Enter your password" 
              className="w-full input focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          
          <button 
            type="submit"
            className="w-full btn bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
