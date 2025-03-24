// Get auth token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Base headers with authentication
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// Get all tasks
export const getTasks = async () => {
  try {
    const response = await fetch('/api/tasks', {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch tasks');
    }
    
    const data = await response.json();
    return { success: true, tasks: data.tasks };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { success: false, error: error.message };
  }
};

// Get a specific task
export const getTask = async (taskId) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch task');
    }
    
    const data = await response.json();
    return { success: true, task: data.task };
  } catch (error) {
    console.error('Error fetching task:', error);
    return { success: false, error: error.message };
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create task');
    }
    
    const data = await response.json();
    return { success: true, task: data.task };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: error.message };
  }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update task');
    }
    
    const data = await response.json();
    return { success: true, task: data.task };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: error.message };
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete task');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: error.message };
  }
}; 