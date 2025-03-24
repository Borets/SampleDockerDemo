import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../api/tasks';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriority: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch tasks
        const response = await getTasks();
        
        if (!response.tasks) {
          throw new Error(response.error || 'Failed to fetch tasks');
        }
        
        const tasks = response.tasks;
        
        // Compute statistics
        const completed = tasks.filter(task => task.status === 'completed').length;
        const pending = tasks.filter(task => task.status === 'pending').length;
        const highPriority = tasks.filter(task => task.priority === 'high').length;
        
        setStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          pendingTasks: pending,
          highPriority,
        });
        
        // Get 5 most recent tasks
        const recent = [...tasks]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        
        setRecentTasks(recent);
      } catch (error) {
        console.error('Dashboard error:', error);
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      <h1>Welcome, {currentUser?.name || 'User'}</h1>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <div className="dashboard">
        <div className="stat-card">
          <h3>{stats.totalTasks}</h3>
          <p>Total Tasks</p>
        </div>
        
        <div className="stat-card">
          <h3>{stats.completedTasks}</h3>
          <p>Completed Tasks</p>
        </div>
        
        <div className="stat-card">
          <h3>{stats.pendingTasks}</h3>
          <p>Pending Tasks</p>
        </div>
        
        <div className="stat-card">
          <h3>{stats.highPriority}</h3>
          <p>High Priority</p>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header">
          <h2>Recent Tasks</h2>
        </div>
        <div className="card-body">
          {recentTasks.length === 0 ? (
            <p>No tasks found. Start by creating a new task.</p>
          ) : (
            <ul className="task-list">
              {recentTasks.map(task => (
                <li 
                  key={task.id} 
                  className={`task-item priority-${task.priority} ${task.status === 'completed' ? 'completed' : ''}`}
                >
                  <div>
                    <h4>{task.title}</h4>
                    {task.due_date && (
                      <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="task-status">
                    {task.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 