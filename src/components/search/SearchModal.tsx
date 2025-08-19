import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';
import { Modal } from '../ui/Modal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { searchProducts } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 2) {
      const results = searchProducts(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    onClose();
    setQuery('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Products"
      className="max-w-2xl"
    >
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          autoFocus
        />
      </div>

      {query.length > 2 && (
        <div className="max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="ml-3 flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <p className="text-sm font-semibold text-orange-500">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No products found for "{query}"</p>
          )}
        </div>
      )}

      {query.length <= 2 && query.length > 0 && (
        <p className="text-gray-500 text-center py-8">Type at least 3 characters to search</p>
      )}
    </Modal>
  );
};