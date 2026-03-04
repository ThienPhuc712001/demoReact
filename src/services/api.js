const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
};

export const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/employees`);
    return response.json();
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/employees/${id}`);
    return response.json();
  },

  // Create new employee
  createEmployee: async (employee) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    return response.json();
  },

  // Update employee
  updateEmployee: async (id, employee) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    return response.json();
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};