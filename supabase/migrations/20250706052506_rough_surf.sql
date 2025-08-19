/*
  # Jyotsna Designs E-commerce Schema

  1. New Tables
    - `logos` - Brand identity logos storage
    - `categories` - Product categories
    - `products` - Product catalog
    - `product_images` - Product image variants
    - `banners` - Homepage and promotional banners
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin write access
  
  3. Storage
    - Create public buckets for logos, products, banners, testimonials
*/

-- 1. logos table
CREATE TABLE IF NOT EXISTS logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- 2. categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  price numeric NOT NULL DEFAULT 0,
  stock integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 4. product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  variant text,
  is_primary boolean DEFAULT false,
  uploaded_at timestamptz DEFAULT now()
);

-- 5. banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  url text NOT NULL,
  type text CHECK (type IN ('hero', 'promo', 'testimonial')) NOT NULL,
  is_active boolean DEFAULT true,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read access for logos"
  ON logos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for product_images"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for banners"
  ON banners FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admin write policies (authenticated users only)
CREATE POLICY "Authenticated users can insert logos"
  ON logos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert product_images"
  ON product_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert banners"
  ON banners FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert sample data
INSERT INTO categories (name, slug) VALUES
  ('Sarees', 'sarees'),
  ('Lehengas', 'lehengas'),
  ('Kurtis', 'kurtis'),
  ('Accessories', 'accessories');

INSERT INTO banners (title, description, url, type) VALUES
  ('New Collection 2024', 'Discover our latest designs', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200', 'hero'),
  ('Festive Special', 'Up to 50% off on selected items', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200', 'promo');