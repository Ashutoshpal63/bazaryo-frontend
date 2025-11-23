import api from './api';

/**
 * Fetches a list of products with powerful filtering and pagination.
 * @param {object} params - Query parameters for filtering, e.g., { category, minPrice, latitude, longitude, page, limit }.
 * @returns {Promise<object>} Paginated list of products.
 */
export const getProducts = async (params) => {
  const { data } = await api.get('/products', { params });
  return data;
};

/**
 * Fetches a single product by its ID.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<object>} The product's detailed data.
 */
export const getProductById = async (productId) => {
  const { data } = await api.get(`/products/${productId}`);
  return data;
};

/**
 * (Shopkeeper) Creates a new product.
 * @param {FormData} formData - Product details, including the product image file.
 * @returns {Promise<object>} The newly created product data.
 */
export const createProduct = async (formData) => {
  const { data } = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

/**
 * (Shopkeeper/Admin) Updates an existing product.
 * @param {string} productId - The ID of the product to update.
 * @param {object} productData - The fields to update.
 * @returns {Promise<object>} The updated product data.
 */
export const updateProduct = async (productId, productData) => {
  // Send multipart/form-data when productData is a FormData (for image updates),
  // otherwise send JSON so numeric fields (like quantityAvailable) are preserved.
  const isForm = productData instanceof FormData;
  const config = isForm
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  const { data } = await api.put(`/products/${productId}`, productData, config);
  return data;
};

/**
 * (Shopkeeper/Admin) Deletes a product by its ID.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  await api.delete(`/products/${productId}`);
};