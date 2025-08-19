export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  price: number;
  discounted_price?: number;
  currency: string;
  brand: string;
  color: string[];
  size: string[];
  material?: string;
  care_instructions?: string;
  rating: number;
  total_reviews: number;
  stock_quantity: number;
  availability: boolean;
  is_featured: boolean;
  weight_grams?: number;
  dimensions_cm?: string;
  sku?: string;
  tags?: string[];
  category_id: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  created_at: string;
  updated_at: string;
  img_url?: string; // Main product image URL from Supabase Storage
  // Legacy fields for compatibility
  image: string; // Primary image URL
  reviewCount: number; // Alias for total_reviews
  inStock: boolean; // Alias for availability
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  is_primary: boolean;
  variant?: string;
  alt_text?: string;
  sort_order: number;
  uploaded_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size?: string;
  color?: string;
  price_adjustment: number;
  stock_quantity: number;
  sku?: string;
  is_available: boolean;
  created_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email?: string;
  rating: number;
  title?: string;
  review_text?: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  img_url?: string; // Category image URL from Supabase Storage
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Banner {
  id: string;
  title?: string;
  description?: string;
  url: string; // Banner image URL from Supabase Storage
  type: 'hero' | 'promo' | 'testimonial';
  is_active: boolean;
  uploaded_at: string;
}

export interface Logo {
  id: string;
  name: string;
  url: string; // Logo image URL from Supabase Storage
  uploaded_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface ContactOrder {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  cart_details: CartItem[];
  status: string;
  created_at: string;
}

export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

export interface FilterOptions {
  category?: string;
  brand?: string;
  priceRange?: [number, number];
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popularity';
}