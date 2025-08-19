import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { AdminPage } from './pages/AdminPage';
import { OrdersPage } from './pages/OrdersPage';
import { Cart } from './components/cart/Cart';
import { SearchModal } from './components/search/SearchModal';
import { useState } from 'react';

// About Page Component
const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-2xl mx-auto px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">About Us</h1>
      <p className="text-gray-600 mb-6">
        We are a modern e-commerce platform dedicated to bringing you the best products
        with exceptional customer service. Our curated selection ensures quality and value
        in every purchase.
      </p>
    </div>
  </div>
);

// Contact Page Component
const ContactPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-2xl mx-auto px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-6">
        Get in touch with our customer service team. We're here to help with any questions
        or concerns you may have.
      </p>
      <div className="text-gray-600">
        <p>Email: jyotsnapriyasuda@gmail.com </p>
        <p>Phone: +91 77607 75564</p>
        <p>Address: Swarna, Andhra Pradesh, Chirala</p>
      </div>
    </div>
  </div>
);

// 404 Not Found Page Component
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full mx-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  </div>
);

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header onSearchOpen={() => setIsSearchOpen(true)} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/add-product" element={<AdminPage />} />
            <Route path="/jp1981s" element={<OrdersPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <Footer />
        
        <Cart />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>
    </CartProvider>
  );
}

export default App;