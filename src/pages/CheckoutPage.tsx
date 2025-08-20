import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Mail, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useCart } from '../context/CartContext';
import { ContactFormData } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';



// Configuration - Change these values as needed
const ADMIN_CONFIG = {
  email: 'jyotsnapriyasuda@gmail.com',
  whatsapp: '+91-9959076740'
};

const EMAILJS_CONFIG = {
  serviceId: 'service_woh5tkq',     // e.g., 'service_abcdefg'
  templateId: 'template_jzk1cq3',   // e.g., 'template_12345'
  adminTemplateId: 'template_m78ozt8', // Admin notification template ID
  publicKey: 'G2mcgmMVJphncNb2L'      // e.g., 'your_public_key_here'
};


export const CheckoutPage: React.FC = () => {
  
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });
  
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { state, getTotalPrice, dispatch } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    

    try {
      
      // Validate required fields
      if (!formData.fullName || !formData.phone || !formData.email || !formData.address) {
        throw new Error('Please fill in all required fields including email');
      }

      if (state.items.length === 0) {
        throw new Error('Your cart is empty');
      }

      // Generate a unique order ID for reference
      const orderId = crypto.randomUUID();

      // Prepare order data
      const orderData = {
        id: orderId,
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email || null,
        address: formData.address,
        cart_details: state.items,
        status: 'Order Placed'
      };
      

      // Send WhatsApp message (simulated)
      await sendWhatsAppMessage(orderData);
      
      // Send email notifications
      await sendUserConfirmationEmail(orderData);
      await sendAdminNotificationEmail(orderData);

      // Clear cart
      dispatch({ type: 'CLEAR_CART' });
      
      // Complete order
      navigate(`/confirmation/${orderId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  const sendWhatsAppMessage = async (orderData: any) => {
    // Simulate WhatsApp API call
    const message = `🛍️ NEW ORDER RECEIVED!

📋 Order ID: ${orderData.id}

👤 Customer Details:
• Name: ${orderData.name}
• Phone: ${orderData.phone}
• Email: ${orderData.email || 'Not provided'}
• Address: ${orderData.address}

🛒 Items Ordered:
${orderData.cart_details.map((item: any) => 
  `• ${item.product.name} (Qty: ${item.quantity})${item.selectedSize ? ` - Size: ${item.selectedSize}` : ''}${item.selectedColor ? ` - Color: ${item.selectedColor}` : ''} - ₹${((item.product.discounted_price || item.product.price) * item.quantity).toLocaleString()}`
).join('\n')}

💰 Total Amount: ₹${getTotalPrice().toLocaleString()}

Please contact the customer to confirm the order and arrange payment & delivery.`;

    console.log(`📱 WhatsApp message to ${ADMIN_CONFIG.whatsapp}:`, message);
    
    // 🔧 PRODUCTION IMPLEMENTATION:
    // For production, you would need to implement a backend service or use a provider like:
    // 1. Twilio WhatsApp Business API
    // 2. Meta WhatsApp Business API
    // 3. Third-party services like Wati, Interakt, etc.
    // 
    // Example with Twilio (backend required):
    // await fetch('/api/whatsapp/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     to: ADMIN_CONFIG.whatsapp, 
    //     message: message 
    //   })
    // });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  

  const sendUserConfirmationEmail = async (orderData: any) => {
    const orderRows = orderData.cart_details.map((item: any) => `
  <tr style="vertical-align: top">
    <td style="padding: 24px 8px 0 4px; display: inline-block; width: max-content">
      <a href="${window.location.origin}/product/${item.product.id}" target="_blank" style="text-decoration: none;">
        <img style="height: 64px" height="64px" src="${item.product.image || item.product.img_url}" alt="item" />
      </a>
    </td>
    <td style="padding: 24px 8px 0 8px; width: 100%">
      <a href="${window.location.origin}/product/${item.product.id}" target="_blank" style="text-decoration: none; color: inherit;">
        <div>${item.product.name}</div>
      </a>
      <div style="font-size: 14px; color: #888; padding-top: 4px">QTY: ${item.quantity}</div>
    </td>
    <td style="padding: 24px 4px 0 0; white-space: nowrap">
      <strong>₹${((item.product.discounted_price || item.product.price) * item.quantity).toLocaleString()}</strong>
    </td>
  </tr>
`).join("");
    try {
      // Prepare orders array for email template
      const orders = orderData.cart_details.map((item: any) => ({
        name: item.product.name,
        units: item.quantity,
        price: ((item.product.discounted_price || item.product.price) * item.quantity).toLocaleString(),
        image_url: item.product.image || item.product.img_url,
        product_link: `${window.location.origin}/product/${item.product.id}`
      }));

      // Calculate costs
      const totalAmount = getTotalPrice();
      const shipping = 0; // Free shipping for now
      const tax = 0; // No tax for now

      // Prepare template parameters for user confirmation email
      const templateParams = {
  to_email: orderData.email,
  order_id: orderData.id,
  order_date: new Date().toLocaleString(),
  customer_name: orderData.name,
  customer_phone: orderData.phone,
  customer_email: orderData.email,
  customer_address: orderData.address,
  order_rows: orderRows, // ✅ formatted HTML
  shipping: shipping.toFixed(2),
  tax: tax.toFixed(2),
  total: totalAmount.toLocaleString(),
  grand_total: (totalAmount + 100).toLocaleString(),
};

      console.log('📧 Sending user confirmation email with EmailJS...', templateParams);

      // Send user confirmation email using EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('✅ User confirmation email sent successfully:', response);
      return { success: true, response };

    } catch (error) {
      console.error('❌ User confirmation email sending failed:', error);
      
      // Don't throw error to prevent order submission from failing
      return { success: false, error };
    }
  };

  const sendAdminNotificationEmail = async (orderData: any) => {
    try {
      // Prepare items summary for admin email
      const itemsSummary = orderData.cart_details.map((item: any) => 
        `• ${item.product.name} (Qty: ${item.quantity})${item.selectedSize ? ` - Size: ${item.selectedSize}` : ''}${item.selectedColor ? ` - Color: ${item.selectedColor}` : ''} - ₹${((item.product.discounted_price || item.product.price) * item.quantity).toLocaleString()}`
      ).join('\n');

      // Prepare template parameters for admin notification email
      const templateParams = {
        to_email: ADMIN_CONFIG.email,
        order_id: orderData.id,
        order_date: new Date().toLocaleString(),
        customer_name: orderData.name,
        customer_phone: orderData.phone,
        customer_email: orderData.email,
        customer_address: orderData.address,
        items_summary: itemsSummary,
        total_amount: `₹${getTotalPrice().toLocaleString()}`,
        from_name: 'Jyotsna Designs Order System'
      };

      console.log('📧 Sending admin notification email with EmailJS...', templateParams);

      // Send admin notification email using EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.adminTemplateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('✅ Admin notification email sent successfully:', response);
      return { success: true, response };

    } catch (error) {
      console.error('❌ Admin notification email sending failed:', error);
      
      // If EmailJS fails, fall back to console logging for debugging
      console.log(`📧 Admin email would have been sent to ${ADMIN_CONFIG.email} with order details:`, {
        orderId: orderData.id,
        customer: orderData.name,
        phone: orderData.phone,
        email: orderData.email,
        address: orderData.address,
        items: orderData.cart_details.length,
        total: getTotalPrice()
      });
      
      // Don't throw error to prevent order submission from failing
      return { success: false, error };
    }
  };

  // 🔧 HOW TO CHANGE ADMIN DETAILS LATER:
  // 
  // METHOD 1: Update the ADMIN_CONFIG object at the top of this file
  // const ADMIN_CONFIG = {
  //   email: 'your-new-email@example.com',
  //   whatsapp: '+91-your-new-number'
  // };
  //
  // METHOD 2: Use environment variables (recommended for production)
  // Create these in your .env file:
  // VITE_ADMIN_EMAIL=your-email@example.com
  // VITE_ADMIN_WHATSAPP=+91-your-number
  // Then use: import.meta.env.VITE_ADMIN_EMAIL
  //
  // METHOD 3: Store in Supabase configuration table (most flexible)
  // Create a 'settings' table with key-value pairs and fetch on app load
  
  const oldSendEmailNotification = async (orderData: any) => {
    // Old simplified version - keeping for reference
    const emailContent = {
      to: ADMIN_CONFIG.email,
      subject: `New Order #${orderData.id} - Jyotsna Designs`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order ID:</strong> ${orderData.id}</p>
        <p><strong>Customer:</strong> ${orderData.name}</p>
        <p><strong>Phone:</strong> ${orderData.phone}</p>
        <p><strong>Email:</strong> ${orderData.email || 'Not provided'}</p>
        <p><strong>Address:</strong> ${orderData.address}</p>
        
        <h3>Items:</h3>
        <ul>
          ${orderData.cart_details.map((item: any) => 
            `<li>${item.product.name} (Qty: ${item.quantity}) - ₹${((item.product.discounted_price || item.product.price) * item.quantity).toLocaleString()}</li>`
          ).join('')}
        </ul>
        
        <p><strong>Total: ₹${getTotalPrice().toLocaleString()}</strong></p>
      `
    };

    console.log(`Email to ${ADMIN_CONFIG.email}:`, emailContent);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Cart is Empty</h1>
            <p className="text-gray-600 mb-6">
              Add some products to your cart before proceeding to checkout.
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h1>
        <p className="text-gray-600 mb-8">Our executive will contact you soon to confirm your order!</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Your Details</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    placeholder="+91 9959076940"
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Complete Address <span className="text-primary">*</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    rows={3}
                    placeholder="Enter your complete address including city, state, and pincode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Phone className="w-5 h-5 text-accent mr-2" />
                    <h3 className="font-medium text-black">What happens next?</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Our executive will contact you within 24 hours to confirm your order details, 
                    discuss payment options, and arrange delivery.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting Order...' : 'Submit Order'}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                    )}
                    {item.selectedColor && (
                      <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>
                    )}
                  </div>
                  <p className="font-medium text-gray-900">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                *Final pricing and shipping charges will be confirmed by our executive
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
