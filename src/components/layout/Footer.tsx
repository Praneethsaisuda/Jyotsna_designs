import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Jyotsna Designs</h3>
            <p className="text-gray-300 mb-4">
              Exquisite traditional wear crafted with passion and elegance for the modern woman.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Collections</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Care Instructions</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary">Customer Service</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns & Exchange</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Custom Orders</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-accent" />
                <span>jyotsnapriyasuda@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-accent" />
                <span>+91 77607 75564</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-accent" />
                <span>Swarna, Chirala, Andhra Pradesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Location Map */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <h3 className="text-xl font-bold mb-4 text-secondary text-center">Visit Our Store</h3>
          <div className="max-w-4xl mx-auto">
            <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4850.943047430789!2d80.287548001115!3d15.85540592681495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a3f2029816d77%3A0x35f7da46811a513d!2sJyotsna%20Designs!5e0!3m2!1sen!2sin!4v1755542473560!5m2!1sen!2sin"
  width="100%"
  height="250"
  allowFullScreen
  loading="lazy"
  className="rounded-xl border border-gray-700"
  title="Jyotsna Designs Location">
</iframe>

            <p className="text-center text-gray-300 mt-4">
              Jyotsna Designs Store, Chirala, Andhra Pradesh
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Jyotsna Designs. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};