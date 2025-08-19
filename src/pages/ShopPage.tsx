import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { FilterOptions } from '../types';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';


export const ShopPage: React.FC = () => {
  const location = useLocation();
  
  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState<FilterOptions>(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    return categoryParam ? { category: categoryParam } : {};
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const { products, categories, loading } = useProducts(filters);

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const brands = ['Jyotsna Designs', 'Traditional Crafts', 'Heritage Wear'];

  const handleFilterToggle = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => {
      const currentValue = prev[key];
      
      // For arrays (like priceRange), compare by stringifying
      if (Array.isArray(value) && Array.isArray(currentValue)) {
        const isSame = JSON.stringify(currentValue) === JSON.stringify(value);
        return { ...prev, [key]: isSame ? undefined : value };
      }
      
      // For strings, toggle on/off
      return { ...prev, [key]: currentValue === value ? undefined : value };
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const isFilterActive = (key: keyof FilterOptions, value: any) => {
    const currentValue = filters[key];
    
    if (Array.isArray(value) && Array.isArray(currentValue)) {
      return JSON.stringify(currentValue) === JSON.stringify(value);
    }
    
    return currentValue === value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Shop</h1>
            <p className="text-gray-600">Discover our complete collection</p>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            icon={SlidersHorizontal}
            className="lg:hidden"
          >
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-black">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-black mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.slug}
                      onClick={() => handleFilterToggle('category', category.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isFilterActive('category', category.slug)
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-black mb-3">Brand</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => handleFilterToggle('brand', brand)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isFilterActive('brand', brand)
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-black mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹2,000', range: [0, 2000] },
                    { label: '₹2,000 - ₹5,000', range: [2000, 5000] },
                    { label: '₹5,000 - ₹10,000', range: [5000, 10000] },
                    { label: 'Over ₹10,000', range: [10000, 100000] }
                  ].map(({ label, range }) => (
                    <button
                      key={label}
                      onClick={() => handleFilterToggle('priceRange', range)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isFilterActive('priceRange', range)
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {products.length} products found
                </p>
                <select
                  value={filters.sortBy || ''}
                  onChange={(e) => handleFilterToggle('sortBy', e.target.value || undefined)}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Sort by</option>
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <ProductGrid
              products={products}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};