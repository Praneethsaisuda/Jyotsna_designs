import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { Button } from '../ui/Button';

interface HeaderProps {
  onSearchOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, dispatch } = useCart();
  const { logos } = useSupabaseData();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleMobileNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  // Get the latest logo or fallback to brand name
  const brandLogo = logos.length > 0 ? logos[0] : null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center text-2xl font-bold text-black hover:text-primary transition-colors"
            >
              {brandLogo ? (
                <img 
                  src={brandLogo.url} 
                  alt={brandLogo.name}
                  className="h-8 w-auto mr-2"
                />
              ) : null}
              <span>Jyotsna Designs</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-black hover:text-primary px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path ? 'text-primary border-b-2 border-primary' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onSearchOpen}
              className="p-2 text-black hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="p-2 text-black hover:text-primary hover:bg-primary/10 rounded-full transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-black hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={handleMobileNavigation}
                  className={`text-left px-3 py-2 text-base font-medium text-black hover:text-primary hover:bg-primary/10 rounded-lg transition-colors ${
                    location.pathname === item.path ? 'text-primary bg-primary/10' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};