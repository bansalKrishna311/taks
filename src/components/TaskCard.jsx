import React, { useState } from 'react';
import api from '../utils/api';

export default function TaskCard({ task, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      onDelete(task._id);
    } catch (err) {
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === task.status) return;
    
    setIsUpdating(true);
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      // Reload the page to reflect changes
      window.location.reload();
    } catch (err) {
      alert('Failed to update task status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${isOverdue ? 'border-red-300' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{task.title}</h3>
        {isOverdue && (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            Overdue
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className="mb-3">
          <span className="text-xs text-gray-500">Due: </span>
          <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
          {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </div>

      {/* Status Update Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {task.status !== 'todo' && (
          <button
            onClick={() => handleStatusUpdate('todo')}
            disabled={isUpdating}
            className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-2 py-1 rounded transition-colors disabled:opacity-50"
          >
            Mark as Todo
          </button>
        )}
        {task.status !== 'in-progress' && (
          <button
            onClick={() => handleStatusUpdate('in-progress')}
            disabled={isUpdating}
            className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-200 px-2 py-1 rounded transition-colors disabled:opacity-50"
          >
            Start Progress
          </button>
        )}
        {task.status !== 'done' && (
          <button
            onClick={() => handleStatusUpdate('done')}
            disabled={isUpdating}
            className="text-xs bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1 rounded transition-colors disabled:opacity-50"
          >
            Mark Done
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-400">
          Created {formatDate(task.createdAt)}
        </div>
        <button 
          onClick={handleDelete} 
          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
