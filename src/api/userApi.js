import api from './api';

// --- For any logged-in user ---

/**
 * Fetches the profile of the currently authenticated user.
 * @returns {Promise<object>} The user's profile data.
 */
export const getMyProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

/**
 * Updates the profile of the currently authenticated user.
 * @param {FormData} formData - The user data to update, including a potential avatar file.
 * @returns {Promise<object>} The updated user profile data.
 */
export const updateMyProfile = async (formData) => {
  const { data } = await api.put('/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};


// --- Admin-only functions ---

/**
 * (Admin) Fetches a list of all users, with optional query parameters for filtering.
 * @param {object} params - Optional query params like { role: 'customer' }.
 * @returns {Promise<object>} A list of users.
 */
export const getAllUsers = async (params) => {
  const { data } = await api.get('/users', { params });
  return data;
};

/**
 * (Admin) Fetches a single user by their ID.
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<object>} The specific user's data.
 */
export const getUserById = async (userId) => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

/**
 * (Admin) Deletes a user by their ID.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  await api.delete(`/users/${userId}`);
};