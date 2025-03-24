import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask } from '../api/tasks';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      
      if (response.success) {
        setTasks(response.tasks || []);
      } else {
        setError(response.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await deleteTask(id);
        
        if (response.success) {
          // Remove task from list
          setTasks(tasks.filter(task => task.id !== id));
        } else {
          setError(response.error || 'Failed to delete task');
        }
      } catch (error) {
        setError('An unexpected error occurred');
        console.error(error);
      }
    }
  };
  
  if (loading) {
    return <div>Loading tasks...</div>;
  }
  
  return (
    <div>
      <div className="card-header">
        <h1>Tasks</h1>
        <Link to="/tasks/new" className="btn btn-secondary">
          Add New Task
        </Link>
      </div>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      {tasks.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <p>No tasks found. Create a new task to get started.</p>
          </div>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item priority-${task.priority} ${task.status === 'completed' ? 'completed' : ''}`}
            >
              <div>
                <h3>{task.title}</h3>
                {task.description && (
                  <p>{task.description}</p>
                )}
                {task.due_date && (
                  <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
                )}
                <div className="task-meta">
                  <span className="priority">Priority: {task.priority}</span>
                  <span className="status">Status: {task.status}</span>
                </div>
              </div>
              <div className="actions">
                <Link to={`/tasks/${task.id}`} className="btn">
                  Edit
                </Link>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList; 