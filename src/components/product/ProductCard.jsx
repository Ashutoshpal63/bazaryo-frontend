import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORT useNavigate
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate(); // 2. INITIALIZE the navigate hook

  // This function is called when the card itself is clicked
  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  // This function is ONLY called when the "Add" button is clicked
  const handleAddToCart = (e) => {
    // 3. CRITICAL: This stops the click from "bubbling up" to the card.
    // Without this, clicking the button would BOTH add to cart AND navigate.
    e.stopPropagation(); 
    
    addToCart(product, 1); 
  };

  return (
    // 4. The <Link> wrapper is REMOVED. The Card is now the clickable element.
    <Card 
      className="group h-full flex flex-col justify-between cursor-pointer"
      onClick={handleCardClick} // 5. Clicking the card triggers navigation
    >
      {/* Top part of the card: Image and Text */}
      <div>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">{product.category}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-800 truncate" title={product.name}>
            {product.name}
          </h3>
        </div>
      </div>
      
      {/* Bottom part of the card: Price and "Add" button */}
      <div className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-bold text-cyan-600">₹{product.price.toFixed(2)}</p>
        <Button size="sm" onClick={handleAddToCart} icon={FiShoppingBag}>
          Add
        </Button>
      </div>
    </Card>
  );
};