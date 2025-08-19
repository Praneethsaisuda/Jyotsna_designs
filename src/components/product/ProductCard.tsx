import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectionError, setSelectionError] = useState('');
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const productImages = product.images && product.images.length > 0 
    ? product.images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    : [{ url: product.img_url || product.image, alt_text: product.name }];

  // Hover slideshow effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isHovered && productImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === productImages.length - 1 ? 0 : prev + 1
        );
      }, 800); // Change image every 800ms
    } else {
      setCurrentImageIndex(0); // Reset to first image when not hovered
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, productImages.length]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if product has size or color options
    const hasSize = product.size && product.size.length > 0;
    const hasColor = product.color && product.color.length > 0;
    
    if (hasSize || hasColor) {
      setShowSelectionModal(true);
      setSelectionError('');
    } else {
      // No options required, add directly to cart
      dispatch({
        type: 'ADD_ITEM',
        payload: { product, quantity: 1 }
      });
    }
  };

  const handleConfirmAddToCart = () => {
    const hasSize = product.size && product.size.length > 0;
    const hasColor = product.color && product.color.length > 0;
    
    // Validate selections
    if (hasSize && !selectedSize) {
      setSelectionError('Please select a size');
      return;
    }
    
    if (hasColor && !selectedColor) {
      setSelectionError('Please select a color');
      return;
    }
    
    // Add to cart with selections
    dispatch({
      type: 'ADD_ITEM',
      payload: { 
        product, 
        quantity: 1,
        selectedSize: selectedSize || undefined,
        selectedColor: selectedColor || undefined
      }
    });
    
    // Reset and close modal
    setShowSelectionModal(false);
    setSelectedSize('');
    setSelectedColor('');
    setSelectionError('');
  };

  const displayPrice = product.discounted_price || product.price;
  const hasDiscount = product.discounted_price && product.discounted_price < product.price;
  const currentImage = productImages[currentImageIndex];

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={currentImage?.url || product.img_url || product.image}
          alt={currentImage?.alt_text || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Image indicators for multiple images */}
        {productImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {productImages.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs rounded">
            Out of Stock
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-2 left-2 bg-purple text-white px-2 py-1 text-xs rounded">
            Featured
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-accent text-white px-2 py-1 text-xs rounded">
            {Math.round(((product.price - product.discounted_price!) / product.price) * 100)}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-black mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-accent fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.total_reviews || product.reviewCount})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">₹{displayPrice.toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            icon={ShoppingCart}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            disabled={!product.inStock}
          >
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* Size/Color Selection Modal */}
      <Modal
        isOpen={showSelectionModal}
        onClose={() => {
          setShowSelectionModal(false);
          setSelectedSize('');
          setSelectedColor('');
          setSelectionError('');
        }}
        title="Select Options"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <img
              src={currentImage?.url || product.img_url || product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-medium text-black">{product.name}</h3>
              <p className="text-primary font-semibold">₹{displayPrice.toLocaleString()}</p>
            </div>
          </div>
          
          {selectionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{selectionError}</p>
            </div>
          )}
          
          {/* Size Selection */}
          {product.size && product.size.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Size <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.size.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 text-black hover:border-primary hover:text-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Color Selection */}
          {product.color && product.color.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Color <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.color.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 text-black hover:border-primary hover:text-primary'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowSelectionModal(false);
                setSelectedSize('');
                setSelectedColor('');
                setSelectionError('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmAddToCart}
              className="flex-1"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};