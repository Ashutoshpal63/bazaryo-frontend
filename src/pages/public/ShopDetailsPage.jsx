import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShopById } from '../../api/shopApi';
import { ProductCard } from '../../components/product/ProductCard';
import { Spinner } from '../../components/common/Spinner';
import { FaMapMarkerAlt } from 'react-icons/fa';

export const ShopDetailsPage = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const response = await getShopById(id);
        setShop(response.data);
      } catch (error) {
        console.error('Failed to fetch shop:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }
  
  if (!shop) {
    return <div className="text-center py-16">Shop not found.</div>;
  }

  return (
    <div>
      {/* Shop Header */}
      <div className="relative bg-slate-800 py-20 text-white">
        <img 
          src={shop.coverImageUrl || 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1'} 
          alt={`${shop.name} cover`}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center">
            <img 
              src={shop.logoUrl || 'https://via.placeholder.com/150'} 
              alt={`${shop.name} logo`}
              className="h-24 w-24 rounded-full border-4 border-white object-cover"
            />
            <div className="ml-6">
              <h1 className="text-4xl font-extrabold">{shop.name}</h1>
              <p className="text-lg opacity-80">{shop.category}</p>
              <div className="flex items-center text-sm mt-1 opacity-80">
                <FaMapMarkerAlt className="mr-2" />
                <span>{shop.location.city}, {shop.location.pincode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products from this Shop */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Products from {shop.name}</h2>
        {shop.products && shop.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shop.products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-lg">
            <p className="text-xl text-slate-500">This shop has not listed any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};