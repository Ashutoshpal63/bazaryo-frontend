import api from './api';

/**
 * Sends login credentials to the server.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} The server's response data.
 */
export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

/**
 * Sends new user registration data to the server.
 * This can include extra data for shopkeepers.
 * @param {object} userData - { name, email, password, role, ...otherData }
 * @returns {Promise<object>} The server's response data.
 */
export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

/**
 * Sends a request to the server to log the user out and destroy the session.
 * @returns {Promise<object>} The server's response data.
 */
export const logoutUser = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};