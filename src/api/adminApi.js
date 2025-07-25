import api from './api';

/**
 * (Admin) Fetches aggregated data for the admin dashboard.
 * @returns {Promise<object>} Dashboard statistics (user counts, order stats, revenue, etc.).
 */
export const getAdminDashboardStats = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data;
};