import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
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
      setError('');
      setSuccess('');
      setLoading(true);
      
      const { name, email } = formData;
      
      // Only update if something changed
      if (name !== currentUser.name || email !== currentUser.email) {
        const result = await updateProfile({ name, email });
        
        if (result.success) {
          setSuccess('Profile updated successfully');
        } else {
          setError(result.error || 'Failed to update profile');
        }
      } else {
        setSuccess('No changes to save');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1>Profile</h1>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      {success && (
        <div className="alert alert-success">{success}</div>
      )}
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <p>Role: {currentUser?.role || 'user'}</p>
              <p>Account created: {currentUser?.created_at 
                ? new Date(currentUser.created_at).toLocaleDateString() 
                : 'Unknown'}</p>
            </div>
            
            <button 
              type="submit" 
              className="btn" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 