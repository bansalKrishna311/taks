import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/me');
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchTasks = async (search = '', status = '') => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.q = search;
      if (status) params.status = status;
      
      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTasks('', '');
  }, []);

  const handleCreate = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setShowForm(false);
  };

  const handleDelete = (id) => setTasks(prev => prev.filter(t => t._id !== id));

  const handleSearch = () => fetchTasks(q, statusFilter);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    fetchTasks(q, status);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const done = tasks.filter(t => t.status === 'done').length;
    
    return { total, todo, inProgress, done };
  };

  const stats = getTaskStats();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
            {user && (
              <p className="text-gray-600 mt-1">Welcome back, <span className="font-medium">{user.name}</span>!</p>
            )}
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800">Total Tasks</h3>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-800">To Do</h3>
          <p className="text-2xl font-bold text-yellow-900">{stats.todo}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-800">In Progress</h3>
          <p className="text-2xl font-bold text-purple-900">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-800">Completed</h3>
          <p className="text-2xl font-bold text-green-900">{stats.done}</p>
        </div>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border">
          <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
          <TaskForm onCreate={handleCreate} />
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input 
              value={q} 
              onChange={e => setQ(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search tasks by title..." 
              className="input w-full" 
            />
          </div>
          <button onClick={handleSearch} className="btn bg-blue-600 hover:bg-blue-700">
            Search
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => handleStatusFilter('')}
              className={`px-3 py-1 rounded text-sm ${!statusFilter ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              All
            </button>
            <button 
              onClick={() => handleStatusFilter('todo')}
              className={`px-3 py-1 rounded text-sm ${statusFilter === 'todo' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
            >
              To Do
            </button>
            <button 
              onClick={() => handleStatusFilter('in-progress')}
              className={`px-3 py-1 rounded text-sm ${statusFilter === 'in-progress' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => handleStatusFilter('done')}
              className={`px-3 py-1 rounded text-sm ${statusFilter === 'done' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-400 mt-2">
            {q || statusFilter ? 'Try adjusting your search or filters' : 'Create your first task to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
