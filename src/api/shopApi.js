import api from './api';

/**
 * Creates a new shop for the authenticated shopkeeper.
 * @param {FormData} formData - Shop details, including logo and coverImage files.
 * @returns {Promise<object>} The newly created shop data.
 */
export const createShop = async (formData) => {
  const { data } = await api.post('/shops', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

/**
 * (Admin) Fetches all shops from the database.
 * @returns {Promise<object>} A list of all shops.
 */
export const getAllShops = async () => {
  const { data } = await api.get('/shops');
  return data;
};

/**
 * Fetches a single shop by its ID.
 * @param {string} shopId - The ID of the shop.
 * @returns {Promise<object>} The shop's detailed data.
 */
export const getShopById = async (shopId) => {
  const { data } = await api.get(`/shops/${shopId}`);
  return data;
};

/**
 * Updates a shop's details.
 * @param {string} shopId - The ID of the shop to update.
 * @param {FormData} formData - The updated data, including potential new images.
 * @returns {Promise<object>} The updated shop data.
 */
export const updateShop = async (shopId, formData) => {
  const { data } = await api.put(`/shops/${shopId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

/**
 * (Admin) Deletes a shop by its ID.
 * @param {string} shopId - The ID of the shop to delete.
 * @returns {Promise<void>}
 */
export const deleteShop = async (shopId) => {
  await api.delete(`/shops/${shopId}`);
};