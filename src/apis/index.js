// Local backend:
// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || "https://iamsbackend-production.up.railway.app/api";
const API_BASE_URL = /^https?:\/\//i.test(RAW_API_BASE_URL)
  ? RAW_API_BASE_URL
  : `https://${RAW_API_BASE_URL}`;

// Token storage management
export const tokenStorage = {
  getAccessToken: () => sessionStorage.getItem('iams_token'),
  getRefreshToken: () => sessionStorage.getItem('iams_refresh_token'),
  setTokens: (token, refreshToken) => {
    if (token) sessionStorage.setItem('iams_token', token);
    if (refreshToken) sessionStorage.setItem('iams_refresh_token', refreshToken);
  },
  clearTokens: () => {
    sessionStorage.removeItem('iams_token');
    sessionStorage.removeItem('iams_refresh_token');
  }
};

// Track if token refresh is in progress to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshSubscribers = [];

// Add request to queue when refresh is in progress
function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// Notify all queued requests with new token
function notifyRefreshSubscribers(token) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

// Refresh token function
async function refreshToken() {
  const refreshToken = tokenStorage.getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Token refresh failed');
  }

  if (data.success && data.token && data.refreshToken) {
    tokenStorage.setTokens(data.token, data.refreshToken);
    return data.token;
  }

  throw new Error('Invalid refresh response');
}

// Handle token expiry and redirect to login
function handleAuthError() {
  tokenStorage.clearTokens();
  // Redirect to login page
  window.location.href = '/login';
}

async function request(endpoint, options = {}) {
  let token = tokenStorage.getAccessToken();
  
  const makeRequest = async (authToken) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { "Authorization": `Bearer ${authToken}` }),
        ...(options.headers || {}),
      },
      // credentials: "include", // Commented out - using token-based auth only
      ...options,
    });

    return response;
  };

  let response = await makeRequest(token);
  let data;
  
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // If token is expired (401), try to refresh it
  if (response.status === 401 && tokenStorage.getRefreshToken()) {
    if (isRefreshing) {
      // If refresh is already in progress, wait for it
      const newToken = await new Promise((resolve, reject) => {
        addRefreshSubscriber((token) => {
          if (token) {
            resolve(token);
          } else {
            reject(new Error('Token refresh failed'));
          }
        });
      });
      
      // Retry the original request with new token
      response = await makeRequest(newToken);
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      // Start token refresh process
      isRefreshing = true;
      
      try {
        const newToken = await refreshToken();
        
        // Retry the original request with new token
        response = await makeRequest(newToken);
        try {
          data = await response.json();
        } catch {
          data = null;
        }
        
        // Notify all waiting requests
        notifyRefreshSubscribers(newToken);
      } catch (refreshError) {
        // Refresh failed, notify all waiting requests and redirect to login
        notifyRefreshSubscribers(null);
        handleAuthError();
        throw new Error('Session expired. Please login again.');
      } finally {
        isRefreshing = false;
      }
    }
  }

  if (!response.ok) {
    // If we get another 401 after refresh attempt, redirect to login
    if (response.status === 401) {
      handleAuthError();
    }
    throw new Error(data?.message || `HTTP Error: ${response.status}`);
  }

  return data;
}

export const apiClient = {
  get: (endpoint) =>
    request(endpoint, { method: "GET" }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (endpoint) =>
    request(endpoint, { method: "DELETE" }),

  // Explicit logout method
  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenStorage.clearTokens();
      window.location.href = '/login';
    }
  },
};
