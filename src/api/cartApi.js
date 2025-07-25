import api from './api';

/**
 * (Customer) Fetches the contents of the user's shopping cart.
 * @returns {Promise<object>} The user's cart data.
 */
export const getCart = async () => {
  const { data } = await api.get('/cart');
  return data;
};

/**
 * (Customer) Adds an item to the shopping cart or updates its quantity.
 * @param {{ productId: string, quantity: number }} item - The item to add.
 * @returns {Promise<object>} The updated cart data.
 */
export const addItemToCart = async (item) => {
  const { data } = await api.post('/cart', item);
  return data;
};

/**
 * (Customer) Removes an item completely from the shopping cart.
 * @param {string} productId - The ID of the product to remove.
 * @returns {Promise<object>} The updated cart data.
 */
export const removeItemFromCart = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
};

/**
 * (Customer) Clears all items from the shopping cart.
 * @returns {Promise<object>} A confirmation message.
 */
export const clearCart = async () => {
  const { data } = await api.delete('/cart');
  return data;
};