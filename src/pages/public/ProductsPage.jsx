import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/productApi';
import { ProductCard } from '../../components/product/ProductCard';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useForm } from 'react-hook-form';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { register, handleSubmit, reset } = useForm();

  const fetchProducts = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await getProducts(params);
      setProducts(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        pages: response.pages,
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    fetchProducts(params);
    reset(params); // Sync form with URL params
  }, [searchParams, fetchProducts, reset]);

  const onFilterSubmit = (data) => {
    const newParams = {};
    if (data.name) newParams.name = data.name;
    if (data.category) newParams.category = data.category;
    setSearchParams(newParams);
  };
  
  const handlePageChange = (newPage) => {
      const currentParams = Object.fromEntries(searchParams.entries());
      setSearchParams({ ...currentParams, page: newPage });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8">Explore Products</h1>

      {/* Filters and Search Bar */}
      <div className="mb-8 p-6 bg-white rounded-2xl shadow-md">
        <form onSubmit={handleSubmit(onFilterSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="Search by Name"
            id="name"
            register={register}
            placeholder="e.g., Fresh Milk"
          />
          <Input
            label="Filter by Category"
            id="category"
            register={register}
            placeholder="e.g., Grocery"
          />
          <Button type="submit" className="w-full md:w-auto">Apply Filters</Button>
        </form>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-12 flex justify-center items-center space-x-2">
            <Button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1}>
              Previous
            </Button>
            <span className="text-slate-600 font-medium">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.pages}>
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-slate-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};