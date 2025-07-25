import axios from 'axios';

// Create a new Axios instance with a custom configuration
const api = axios.create({
  // Get the base URL from your environment variables
  baseURL: import.meta.env.VITE_API_URL,
  // This is crucial for sending cookies (and thus sessions) with every request
  withCredentials: true,
});

// Use an interceptor to dynamically add the Authorization header to requests
// This runs before each request is sent
api.interceptors.request.use(
  (config) => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    // If a token exists, add it to the Authorization header as a Bearer token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Return the modified config to proceed with the request
    return config;
  },
  (error) => {
    // If there's an error during the request setup, reject the promise
    return Promise.reject(error);
  }
);

export default api;