import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getShopById } from '../../api/shopApi';
import { createProduct, updateProduct, deleteProduct } from '../../api/productApi';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ProductForm } from '../../components/product/ProductForm';
import { Alert } from '../../components/common/Alert';
import { FaPlusCircle, FaPen, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const ManageProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!user) return; // Wait for user object to be available
    
    if (!user.shop) {
      setLoading(false);
      if (user.role === 'shopkeeper') {
          setError("Your user account is not linked to a shop. Please contact support.");
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getShopById(user.shop);
      setProducts(response.data.products || []);
    } catch (err) {
      toast.error('Failed to fetch products.');
      setError("There was a problem loading your products. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully.');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        toast.success('Product updated successfully.');
      } else {
        await createProduct(formData);
        toast.success('Product created successfully.');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const columns = useMemo(() => [
    {
      header: 'Product',
      accessor: 'name',
      Cell: ({ row }) => (
        <div className="flex items-center">
          <img src={row.imageUrl || 'https://via.placeholder.com/40'} alt={row.name} className="h-10 w-10 rounded-md object-cover mr-4" />
          <div>
            <div className="font-medium text-slate-800">{row.name}</div>
            <div className="text-sm text-slate-500">{row.category}</div>
          </div>
        </div>
      )
    },
    { header: 'Price', accessor: 'price', Cell: ({ row }) => `$${row.price.toFixed(2)}` },
    { header: 'Stock', accessor: 'quantityAvailable' },
    {
      header: 'Actions',
      accessor: '_id',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="p-2 h-8 w-8" onClick={() => handleEditProduct(row)}><FaPen /></Button>
          <Button size="sm" variant="danger" className="p-2 h-8 w-8" onClick={() => handleDeleteProduct(row._id)}><FaTrash /></Button>
        </div>
      )
    }
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">My Products</h1>
        <Button onClick={handleAddProduct} icon={FaPlusCircle} disabled={!!error}>
          Add Product
        </Button>
      </div>
      
      {error ? (
        <Alert type="error" title="Cannot Manage Products" message={error} />
      ) : (
        <Table columns={columns} data={products} isLoading={loading} />
      )}

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm 
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};