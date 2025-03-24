import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, updateTask } from '../api/tasks';

const TaskDetail = () => {
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'pending',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        
        // Only fetch if we have an ID and it's not "new"
        if (id && id !== 'new') {
          const response = await getTask(id);
          
          if (response.success) {
            setTask(response.task);
            // Format date for input type="date"
            const formattedDueDate = response.task.due_date 
              ? new Date(response.task.due_date).toISOString().split('T')[0] 
              : '';
            
            setFormData({
              title: response.task.title || '',
              description: response.task.description || '',
              due_date: formattedDueDate,
              priority: response.task.priority || 'medium',
              status: response.task.status || 'pending',
            });
          } else {
            setError(response.error || 'Failed to fetch task');
          }
        } else {
          // New task, reset form
          setLoading(false);
        }
      } catch (error) {
        setError('An unexpected error occurred');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError('');
      
      const response = await updateTask(id, formData);
      
      if (response.success) {
        navigate('/tasks');
      } else {
        setError(response.error || 'Failed to update task');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div>Loading task...</div>;
  }
  
  return (
    <div>
      <h1>{id === 'new' ? 'Create New Task' : 'Edit Task'}</h1>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="due_date">Due Date</label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn" 
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Task'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/tasks')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail; 