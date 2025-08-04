import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../api/productApi';
import { useCart } from '../../contexts/CartContext';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { FaStore, FaPlus, FaMinus } from 'react-icons/fa';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }
  
  if (!product) {
    return <div className="text-center py-16">Product not found.</div>;
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex justify-center items-center bg-slate-100 rounded-2xl p-8">
            <img 
              src={product.imageUrl || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="max-w-full h-auto max-h-96 object-contain"
            />
          </div>

          {/* Product Details */}
          <div>
            <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wider">{product.category}</span>
            <h1 className="text-4xl font-extrabold text-slate-900 my-2">{product.name}</h1>
            
            <Link to={`/shops/${product.shopId._id}`} className="inline-flex items-center text-slate-500 hover:text-cyan-600 transition-colors">
              <FaStore className="mr-2" />
              <span>{product.shopId.name}</span>
            </Link>

            <p className="text-3xl font-bold text-slate-800 my-6">₹{product.price.toFixed(2)}</p>
            
            <p className="text-slate-600 leading-relaxed mb-8">{product.description}</p>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-full">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-slate-600"><FaMinus /></button>
                <span className="px-4 font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-slate-600"><FaPlus /></button>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="flex-1">
                Add to Cart
              </Button>
            </div>
            
             <p className="text-sm text-slate-500 mt-4">
                {product.quantityAvailable > 0 ? `${product.quantityAvailable} in stock` : 'Out of stock'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};