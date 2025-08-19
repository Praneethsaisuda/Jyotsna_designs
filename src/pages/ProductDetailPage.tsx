import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/ui/Button';
import { ImageZoom } from '../components/product/ImageZoom';

export const ProductDetailPage: React.FC = () => {

  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [addToCartError, setAddToCartError] = useState('');
  const { dispatch } = useCart();
  const { fetchProductWithImages } = useSupabaseData();
  const { products, getProductById } = useProducts();

  // Fetch product data
  useEffect(() => {
  window.scrollTo(0, 0);
}, [productId]);


  useEffect(() => {
    if (!productId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const loadProductData = async () => {
      setLoading(true);
      setNotFound(false);
      
      // First try to get product from the products list
      const cachedProduct = getProductById(productId);
      
      if (cachedProduct) {
        setProduct(cachedProduct);
        setLoading(false);
        return;
      }

      // If not found in cache, try to fetch from database
      try {
        const { data, error } = await fetchProductWithImages(productId);
        
        if (data && !error) {
          // Transform the data to match our Product interface
          const primaryImage = data.images?.find((img: any) => img.is_primary) || data.images?.[0];
          const transformedProduct: Product = {
            ...data,
            image: data.img_url || primaryImage?.url || 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
            reviewCount: data.total_reviews || 0,
            inStock: data.availability && (data.stock_quantity || data.stock || 0) > 0,
            currency: data.currency || 'INR',
            brand: data.brand || 'Jyotsna Designs',
            color: data.color || [],
            size: data.size || [],
            tags: data.tags || [],
            price: parseFloat(data.price) || 0,
            discounted_price: data.discounted_price ? parseFloat(data.discounted_price) : undefined,
            rating: parseFloat(data.rating) || 4.5,
            stock_quantity: data.stock_quantity || data.stock || 0,
            total_reviews: data.total_reviews || 0,
            images: data.images || []
          };
          setProduct(transformedProduct);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [productId, getProductById, fetchProductWithImages]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const hasSize = product.size && product.size.length > 0;
    const hasColor = product.color && product.color.length > 0;
    
    // Validate selections
    if (hasSize && !selectedSize) {
      setAddToCartError('Please select a size before adding to cart');
      return;
    }
    
    if (hasColor && !selectedColor) {
      setAddToCartError('Please select a color before adding to cart');
      return;
    }
    
    // Clear any previous errors
    setAddToCartError('');
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        quantity,
        selectedSize: selectedSize || undefined,
        selectedColor: selectedColor || undefined
      }
    });
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')}>
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    : [{ url: product.img_url || product.image, alt_text: product.name, is_primary: true }];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const currentImage = productImages[currentImageIndex];
  const displayPrice = product.discounted_price || product.price;
  const hasDiscount = product.discounted_price && product.discounted_price < product.price;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Home
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Shop</span>
          <span className="text-gray-400">/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images with Zoom */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div className="relative">
              <ImageZoom
                src={currentImage?.url || product.img_url || product.image}
                alt={currentImage?.alt_text || product.name}
                className="aspect-square bg-gray-100 rounded-lg shadow-sm"
              />
              
              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 transition-colors shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 transition-colors shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'border-primary shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Image Counter */}
            {productImages.length > 1 && (
              <div className="text-center text-sm text-gray-500">
                {currentImageIndex + 1} of {productImages.length}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.brand}</p>
              {product.sku && (
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-accent fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.total_reviews || product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">₹{displayPrice.toLocaleString()}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
                  <span className="bg-accent text-white px-2 py-1 text-sm rounded">
                    {Math.round(((product.price - product.discounted_price!) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {product.long_description && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-black mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.long_description}</p>
              </div>
            )}

            {/* Add to Cart Error */}
            {addToCartError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{addToCartError}</p>
              </div>
            )}

            {/* Size Selection */}
            {product.size && product.size.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-black mb-3">
                  Size <span className="text-primary">*</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.size.map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setAddToCartError('');
                      }}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
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
                <h3 className="text-lg font-medium text-black mb-3">
                  Color <span className="text-primary">*</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.color.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setAddToCartError('');
                      }}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
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

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium text-black mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity || 10, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock_quantity || 10} items available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                icon={ShoppingCart}
                className="flex-1"
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="ghost" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-black mb-4">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-black">{product.category?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="text-black">{product.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-black mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};