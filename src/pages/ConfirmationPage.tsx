import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';


export const ConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Order</h1>
            <p className="text-gray-600 mb-6">
              No order ID found. Please try placing your order again.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Submitted Successfully!</h1>
            <p className="text-gray-600">
              Thank you for your interest! Your order ID is <strong>{orderId}</strong>
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <span>Our executive will call you within 24 hours</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-primary" />
                <span>WhatsApp confirmation sent to admin</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                <span>Email notification sent to our team</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              <strong>Our executive will contact you soon!</strong><br />
              They will confirm your order details, discuss payment options, and arrange delivery to your location.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};