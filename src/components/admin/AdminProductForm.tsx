import React, { useState } from 'react';
import { Upload, Plus, X, Save, LogOut, Trash2 } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useImageUpload } from '../../hooks/useImageUpload';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AdminProductFormProps {
  onLogout: () => void;
}

interface ProductFormData {
  name: string;
  description: string;
  long_description: string;
  category_id: string;
  price: string;
  discounted_price: string;
  color: string;
  size: string;
  stock_quantity: string;
  brand: string;
  rating: string;
  is_featured: boolean;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ onLogout }) => {
  const { categories, refetch } = useProducts();
  const { uploadProductImage } = useImageUpload();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    long_description: '',
    category_id: '',
    price: '',
    discounted_price: '',
    color: '',
    size: '',
    stock_quantity: '',
    brand: 'Jyotsna Designs',
    rating: '4.5',
    is_featured: false
  });

  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrimaryImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryImage(file);
    }
  };

  const handleAdditionalImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAdditionalImages(prev => [...prev, ...files]);
  };

  const removePrimaryImage = () => {
    setPrimaryImage(null);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const generateUniqueSlug = async (baseName: string) => {
    let slug = generateSlug(baseName);
    let counter = 1;
    
    while (true) {
      // Check if slug exists in database
      const { data: existingProduct, error } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      
      if (!existingProduct) {
        // No product found with this slug, it's unique
        return slug;
      }
      
      if (error) {
        // Some other error occurred
        throw error;
      }
      
      // Slug exists, generate a new one with counter
      slug = `${generateSlug(baseName)}-${counter}`;
      counter++;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.category_id || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      if (!primaryImage) {
        throw new Error('Please select a primary product image');
      }

      console.log('Starting product creation process...');

      // Generate unique slug
      const uniqueSlug = await generateUniqueSlug(formData.name);
      console.log('Generated unique slug:', uniqueSlug);

      // Create product record
      const productData = {
        name: formData.name,
        slug: uniqueSlug,
        description: formData.description,
        long_description: formData.long_description || null,
        category_id: formData.category_id,
        price: parseFloat(formData.price),
        discounted_price: formData.discounted_price ? parseFloat(formData.discounted_price) : null,
        color: formData.color ? formData.color.split(',').map(c => c.trim()) : [],
        size: formData.size ? formData.size.split(',').map(s => s.trim()) : [],
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        brand: formData.brand,
        rating: parseFloat(formData.rating) || 4.5,
        is_featured: formData.is_featured,
        availability: true,
        total_reviews: 0,
        currency: 'INR'
      };

      console.log('Creating product with data:', productData);

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (productError) throw productError;
      
      console.log('Product created successfully:', product);

      // Upload primary image
      console.log('Uploading primary image...');
      const { url: primaryUrl, error: primaryError } = await uploadProductImage(primaryImage);
      
      if (primaryError || !primaryUrl) {
        console.error('Primary image upload failed:', primaryError);
        throw new Error(`Failed to upload primary image: ${primaryError || 'No URL returned'}`);
      }
      
      console.log('Primary image uploaded successfully:', primaryUrl);

      // Upload additional images
      const additionalImageData = [];
      for (let i = 0; i < additionalImages.length; i++) {
        console.log(`Uploading additional image ${i + 1}...`);
        const { url, error: uploadError } = await uploadProductImage(additionalImages[i]);
        
        if (uploadError || !url) {
          console.error(`Additional image ${i + 1} upload failed:`, uploadError);
          throw new Error(`Failed to upload image ${i + 1}: ${uploadError || 'No URL returned'}`);
        }
        
        console.log(`Additional image ${i + 1} uploaded successfully:`, url);
        
        additionalImageData.push({
          product_id: product.id,
          url: url!,
          is_primary: false,
          sort_order: i + 1,
          alt_text: `${formData.name} - Image ${i + 2}`
        });
      }

      // Insert all image records
      const allImageData = [
        {
          product_id: product.id,
          url: primaryUrl!,
          is_primary: true,
          sort_order: 0,
          alt_text: `${formData.name} - Primary Image`
        },
        ...additionalImageData
      ];

      console.log('Inserting image records:', allImageData);

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(allImageData);

      if (imagesError) {
        console.error('Failed to insert image records:', imagesError);
        throw new Error(`Failed to save image records: ${imagesError.message}`);
      }
      
      console.log('Image records inserted successfully');

      // Update product with primary image URL
      console.log('Updating product with primary image URL...');
      const { error: updateError } = await supabase
        .from('products')
        .update({ img_url: primaryUrl })
        .eq('id', product.id);

      if (updateError) {
        console.error('Failed to update product with image URL:', updateError);
        throw new Error(`Failed to update product with image: ${updateError.message}`);
      }
      
      console.log('Product updated with primary image URL successfully');
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        long_description: '',
        category_id: '',
        price: '',
        discounted_price: '',
        color: '',
        size: '',
        stock_quantity: '',
        brand: 'Jyotsna Designs',
        rating: '4.5',
        is_featured: false
      });
      setPrimaryImage(null);
      setAdditionalImages([]);
      
      // Refresh products data
      refetch();

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);

    } catch (err) {
      console.error('Product creation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_auth_time');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Admin Product Management</h1>
            <p className="text-gray-600">Add new products to the Jyotsna Designs collection</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            icon={LogOut}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Exit Admin Mode
          </Button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-green-800 font-medium">Product added successfully!</p>
                <p className="text-green-700 text-sm">The product has been added to the store and is now visible to customers.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-black mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Enter product name"
                />
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Category <span className="text-primary">*</span>
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <Input
                  label="Short Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  placeholder="Brief product description"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-black mb-1">
                  Long Description
                </label>
                <textarea
                  value={formData.long_description}
                  onChange={(e) => handleInputChange('long_description', e.target.value)}
                  placeholder="Detailed product description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-black mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Price (₹)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                
                <Input
                  label="Discounted Price (₹)"
                  type="number"
                  value={formData.discounted_price}
                  onChange={(e) => handleInputChange('discounted_price', e.target.value)}
                  placeholder="0.00 (optional)"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-black mb-4">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Jyotsna Designs"
                />
                
                <Input
                  label="Stock Quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Input
                  label="Colors (comma-separated)"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="Red, Blue, Green"
                />
                
                <Input
                  label="Sizes (comma-separated)"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  placeholder="S, M, L, XL"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Input
                  label="Rating"
                  type="number"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  placeholder="4.5"
                  min="0"
                  max="5"
                  step="0.1"
                />
                
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                    className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-black">
                    Featured Product
                  </label>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-medium text-black mb-4">Product Images</h3>
              
              {/* Primary Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">
                  Primary Image <span className="text-primary">*</span>
                </label>
                
                {!primaryImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePrimaryImageSelect}
                      className="hidden"
                      id="primary-image-upload"
                    />
                    <label
                      htmlFor="primary-image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload primary image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WebP up to 2MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(primaryImage)}
                      alt="Primary preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-primary"
                    />
                    <button
                      type="button"
                      onClick={removePrimaryImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Additional Images (Optional)
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAdditionalImagesSelect}
                    className="hidden"
                    id="additional-images-upload"
                  />
                  <label
                    htmlFor="additional-images-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Plus className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to add more images</p>
                    <p className="text-sm text-gray-500">Multiple images allowed</p>
                  </label>
                </div>

                {additionalImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {additionalImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Additional preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="submit"
                variant="primary"
                disabled={uploading}
                icon={Save}
                className="flex-1"
              >
                {uploading ? 'Adding Product...' : 'Add Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};