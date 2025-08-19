import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuth } from '../components/admin/AdminAuth';
import { AdminProductForm } from '../components/admin/AdminProductForm';


export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authFlag = sessionStorage.getItem('admin_authenticated');
      const authTime = sessionStorage.getItem('admin_auth_time');
      
      if (authFlag === 'true' && authTime) {
        const timeElapsed = Date.now() - parseInt(authTime);
        const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
        
        if (timeElapsed < sessionDuration) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear storage
          sessionStorage.removeItem('admin_authenticated');
          sessionStorage.removeItem('admin_auth_time');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Navigate back to home page after logout
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return <AdminProductForm onLogout={handleLogout} />;
};