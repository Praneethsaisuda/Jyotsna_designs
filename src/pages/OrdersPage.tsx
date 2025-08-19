import React, { useState, useEffect } from 'react';
import { Package, Phone, Mail, MapPin, Calendar, CheckCircle, Clock, Truck, Eye, EyeOff } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { ContactOrder } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const ORDER_STATUSES = [
  'Order Placed',
  'Process Started', 
  'Process Done',
  'Delivery Started',
  'Delivery Done'
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Order Placed':
      return <Package className="w-4 h-4" />;
    case 'Process Started':
      return <Clock className="w-4 h-4" />;
    case 'Process Done':
      return <CheckCircle className="w-4 h-4" />;
    case 'Delivery Started':
      return <Truck className="w-4 h-4" />;
    case 'Delivery Done':
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Order Placed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Process Started':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Process Done':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Delivery Started':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Delivery Done':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const OrdersAuth: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ORDERS_PASSWORD = 'jp1981s';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ORDERS_PASSWORD) {
      sessionStorage.setItem('orders_authenticated', 'true');
      sessionStorage.setItem('orders_auth_time', Date.now().toString());
      onAuthenticated();
    } else {
      setError('Incorrect password. Access denied.');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">Orders Management</h1>
            <p className="text-gray-600">Enter the password to access the orders dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Access Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || !password.trim()}
            >
              {loading ? 'Verifying...' : 'Access Orders'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              This is a secure area for order management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCard: React.FC<{ 
  order: ContactOrder; 
  onStatusUpdate: (orderId: string, newStatus: string) => Promise<void>;
  updating: boolean;
}> = ({ order, onStatusUpdate, updating }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localUpdating, setLocalUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === order.status) return;
    
    setLocalUpdating(true);
    await onStatusUpdate(order.id, newStatus);
    setLocalUpdating(false);
  };

  const totalAmount = order.cart_details.reduce((total, item) => {
    const price = item.product.discounted_price || item.product.price;
    return total + (price * item.quantity);
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span>{order.status}</span>
            </div>
            <span className="text-sm text-gray-500">
              #{order.id.slice(0, 8)}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Package className="w-4 h-4 text-gray-400 mr-2" />
              <span className="font-medium">{order.name}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              <span>{order.phone}</span>
            </div>
            {order.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span>{order.email}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-primary">₹{totalAmount.toLocaleString()}</span>
              <span className="text-gray-500 ml-1">({order.cart_details.length} items)</span>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">Update Status</label>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating || localUpdating}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
          >
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {(updating || localUpdating) && (
            <p className="text-sm text-gray-500 mt-1">Updating status...</p>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t pt-4 space-y-4">
            {/* Address */}
            <div>
              <div className="flex items-start text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <span className="font-medium text-black">Delivery Address:</span>
                  <p className="text-gray-600 mt-1">{order.address}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-medium text-black mb-2">Order Items:</h4>
              <div className="space-y-2">
                {order.cart_details.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                          {item.selectedSize && ` • Size: ${item.selectedSize}`}
                          {item.selectedColor && ` • Color: ${item.selectedColor}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium text-sm">
                      ₹{((item.product.discounted_price || item.product.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const OrdersPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const { orders, loading: ordersLoading, error, fetchOrders, updateOrderStatus } = useOrders();

  useEffect(() => {
    const checkAuth = () => {
      const authFlag = sessionStorage.getItem('orders_authenticated');
      const authTime = sessionStorage.getItem('orders_auth_time');
      
      if (authFlag === 'true' && authTime) {
        const timeElapsed = Date.now() - parseInt(authTime);
        const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours
        
        if (timeElapsed < sessionDuration) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('orders_authenticated');
          sessionStorage.removeItem('orders_auth_time');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (!result.success) {
      alert(`Failed to update order status: ${result.error}`);
    }
    
    setUpdatingOrderId(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('orders_authenticated');
    sessionStorage.removeItem('orders_auth_time');
    setIsAuthenticated(false);
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
    return <OrdersAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Orders Management</h1>
            <p className="text-gray-600">Manage and track all customer orders</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={fetchOrders}
              disabled={ordersLoading}
            >
              {ordersLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {ORDER_STATUSES.map(status => (
            <div key={status} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{status}</p>
                  <p className="text-2xl font-bold text-black">{statusCounts[status] || 0}</p>
                </div>
                <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Orders List */}
        {ordersLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                updating={updatingOrderId === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};