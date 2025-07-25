import api from './api';

/**
 * Initiates a dummy payment process for a specific order.
 * @param {string} orderId - The ID of the order to be paid for.
 * @returns {Promise<object>} A confirmation that payment processing has started.
 */
export const processPayment = async (orderId) => {
  const { data } = await api.post('/payment/process-payment', { orderId });
  return data;
};