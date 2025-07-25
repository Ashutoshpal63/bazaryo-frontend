import api from './api';

// --- Customer Actions ---

/**
 * (Customer) Creates orders for all items in the cart from all shops.
 * This is the new function for the unified checkout.
 * @returns {Promise<object>} An object containing the IDs of the newly created orders.
 */
export const createOrdersFromCart = async () => {
  const { data } = await api.post('/orders/checkout-all');
  return data;
};

/**
 * (Customer) Fetches the order history for the authenticated user.
 * @returns {Promise<object>} A list of the user's orders.
 */
export const getMyOrders = async () => {
  const { data } = await api.get('/orders/my-orders');
  return data;
};

// --- Shopkeeper Actions ---

/**
 * (Shopkeeper) Fetches all orders placed at their shop.
 * @param {string} shopId - The ID of the shop (passed in the URL, but backend gets it from auth).
 * @returns {Promise<object>} A list of orders for the shop.
 */
export const getShopOrders = async (shopId) => {
  const { data } = await api.get(`/orders/shop/${shopId}`);
  return data;
};

// --- Delivery Agent Actions ---

/**
 * (Delivery Agent) Fetches orders that are available for pickup.
 * @returns {Promise<object>} A list of available orders.
 */
export const getAvailableOrders = async () => {
  const { data } = await api.get('/orders/available');
  return data;
};

/**
 * (Delivery Agent) Claims an available order.
 * @param {string} orderId - The ID of the order to claim.
 * @returns {Promise<object>} The claimed order data.
 */
export const claimOrder = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}/claim`);
  return data;
};

/**
 * (Delivery Agent) Fetches the agent's current, active deliveries.
 * @returns {Promise<object>} A list of assigned orders.
 */
export const getMyDeliveries = async () => {
  const { data } = await api.get('/orders/my-deliveries');
  return data;
};

// --- Admin Actions ---

/**
 * (Admin) Fetches all orders in the system, with optional filtering.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {Promise<object>} A list of all orders.
 */
export const getAllOrders = async (params) => {
  const { data } = await api.get('/orders', { params });
  return data;
};

/**
 * (Admin) Assigns a delivery agent to a specific order.
 * @param {string} orderId - The ID of the order.
 * @param {string} agentId - The ID of the delivery agent to assign.
 * @returns {Promise<object>} The updated order data.
 */
export const assignAgentToOrder = async (orderId, agentId) => {
  const { data } = await api.patch(`/orders/${orderId}/assign-agent`, { agentId });
  return data;
};


// --- Shared Actions (Multiple Roles) ---

/**
 * Updates the status of an order. Authorization is handled on the backend.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} status - The new status for the order.
 * @returns {Promise<object>} The updated order data.
 */
export const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.patch(`/orders/${orderId}/status`, { status });
  return data;
};

/**
 * Fetches detailed information for tracking an order.
 * @param {string} orderId - The ID of the order to track.
 * @returns {Promise<object>} The order data with populated shop and agent details.
 */
export const trackOrder = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}/track`);
  return data;
};