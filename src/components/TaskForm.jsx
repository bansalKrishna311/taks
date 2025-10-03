import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../utils/api';

export default function TaskForm({ onCreate }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      status: 'todo'
    }
  });
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const res = await api.post('/tasks', data);
      onCreate(res.data);
      reset();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create task';
      setServerError(errorMsg);
    }
  };

  return (
    <div>
      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {serverError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input 
              {...register('title', { 
                required: 'Task title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                }
              })} 
              placeholder="Enter task title" 
              className="w-full input focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea 
              {...register('description')} 
              placeholder="Enter task description (optional)" 
              rows={3}
              className="w-full input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" 
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input 
              type="date" 
              {...register('dueDate')} 
              min={new Date().toISOString().split('T')[0]}
              className="w-full input focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              Initial Status
            </label>
            <select 
              {...register('status')} 
              className="w-full input focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="btn bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 md:flex-none"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
          
          <button 
            type="button"
            onClick={() => reset()}
            className="btn bg-gray-500 hover:bg-gray-600 transition-colors flex-1 md:flex-none"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
