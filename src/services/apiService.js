// API base configuration
const API_BASE_URL = 'http://localhost:4000/api'; // C# API runs on port 4000

class ApiService {
  // Generic HTTP request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      // Handle no content responses
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Equipment API methods
  async getEquipment() {
    return await this.request('/equipment');
  }

  async getEquipmentById(id) {
    return await this.request(`/equipment/${id}`);
  }

  async addEquipment(equipment) {
    return await this.request('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipment),
    });
  }

  async updateEquipment(id, equipment) {
    return await this.request(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipment),
    });
  }

  async deleteEquipment(id) {
    return await this.request(`/equipment/${id}`, {
      method: 'DELETE',
    });
  }

  // User API methods
  async login(loginData) {
    return await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async register(userData) {
    return await this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUsers() {
    return await this.request('/users');
  }

  // Request API methods
  async getRequests() {
    return await this.request('/requests');
  }

  async getRequestById(id) {
    return await this.request(`/requests/${id}`);
  }

  async getUserRequests(userEmail) {
    return await this.request(`/requests/user/${encodeURIComponent(userEmail)}`);
  }

  async addRequest(request) {
    return await this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateRequestStatus(id, status) {
    return await this.request(`/requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteRequest(id) {
    return await this.request(`/requests/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;