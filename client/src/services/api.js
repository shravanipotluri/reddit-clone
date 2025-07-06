import { API_CONFIG } from '../constants/config';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body) {
      config.headers['Content-Type'] = 'application/json';
    }



    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        // For expected errors like 409 (duplicate), return the error data instead of throwing
        if (response.status === 409) {
          return { error: true, message: data.message || 'Post already exists' };
        }
        // For other errors, also return error data instead of throwing
        return { error: true, message: data.message || `Request failed with status: ${response.status}` };
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(token) {
    return this.request('/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Post endpoints
  async getPosts() {
    return this.request('/posts');
  }

  async createPost(postData, token) {
    return this.request('/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
  }

  async upvotePost(postId, token) {
    return this.request(`/posts/${postId}/upvote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async downvotePost(postId, token) {
    return this.request(`/posts/${postId}/downvote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async deletePost(postId, token) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getAdminPosts(token) {
    return this.request('/posts/admin/all', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export default new ApiService(); 