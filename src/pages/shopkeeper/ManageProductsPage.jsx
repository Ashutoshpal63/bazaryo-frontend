import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getShopById } from '../../api/shopApi';
import { createProduct, updateProduct, deleteProduct } from '../../api/productApi';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ProductForm } from '../../components/product/ProductForm';
import { Alert } from '../../components/common/Alert';
import { FaPlus, FaPen, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const ManageProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // For quick stock adjustments
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [stockAmount, setStockAmount] = useState(1);
  const [isStockSubmitting, setIsStockSubmitting] = useState(false);

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
    { header: 'Price', accessor: 'price', Cell: ({ row }) => `₹${row.price.toFixed(2)}` },
    { header: 'Stock', accessor: 'quantityAvailable' },
    {
      header: 'Adjust',
      accessor: 'adjust',
      Cell: ({ row }) => (
        <div className="flex">
          <Button
            size="sm"
            variant="primary"
            className="p-2 h-8 w-8"
            onClick={() => { setStockModalProduct(row); setStockAmount(1); setIsStockModalOpen(true); }}
            aria-label={`Add stock to ${row.name}`}
            title="Add stock"
          >
            <FaPlus />
          </Button>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: '_id',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="p-2 h-8 w-8" onClick={() => handleEditProduct(row)}><FaPen /></Button>
          <Button size="sm" variant="danger" className="p-2 h-8 w-8" onClick={() => handleDeleteProduct(row._id)} aria-label={`Delete ${row.name}`} title="Delete">
            <FaTimes />
          </Button>
        </div>
      )
    }
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">My Products</h1>
        <Button onClick={handleAddProduct} icon={FaPlus} disabled={!!error}>
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

      {/* Stock adjustment modal */}
      <Modal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        title={stockModalProduct ? `Add Stock — ${stockModalProduct.name}` : 'Add Stock'}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Current stock: <span className="font-semibold">{stockModalProduct?.quantityAvailable ?? '-'}</span></p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Add quantity</label>
            <input
              type="number"
              min="1"
              value={stockAmount}
              onChange={(e) => setStockAmount(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-md border border-slate-200"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="ghost" onClick={() => setIsStockModalOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!stockModalProduct) return;
                const add = Number(stockAmount) || 0;
                if (add <= 0) {
                  toast.error('Enter a valid quantity to add');
                  return;
                }
                setIsStockSubmitting(true);
                try {
                  const newQty = (stockModalProduct.quantityAvailable || 0) + add;
                  await updateProduct(stockModalProduct._id, { quantityAvailable: newQty });
                  toast.success('Stock updated');
                  setIsStockModalOpen(false);
                  fetchProducts();
                } catch (err) {
                  toast.error(err.response?.data?.message || 'Failed to update stock');
                } finally {
                  setIsStockSubmitting(false);
                }
              }}
              disabled={isStockSubmitting}
            >
              {isStockSubmitting ? 'Updating...' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};