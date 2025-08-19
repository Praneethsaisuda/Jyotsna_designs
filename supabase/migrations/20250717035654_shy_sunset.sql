/*
  # Remove Authentication System and Add Orders Table

  1. Database Changes
    - Drop user_profiles table
    - Drop user_cart table
    - Drop admin_sessions table
    - Add new orders table for contact form submissions

  2. Security
    - Remove all user-related RLS policies
    - Add public access policies for orders table
*/

-- Drop existing user-related tables
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS user_cart CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop trigger functions if they exist
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create orders table for contact form submissions
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  cart_details jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public to insert orders (contact form submissions)
CREATE POLICY "Anyone can submit orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only allow reading orders for authenticated users (future admin access)
CREATE POLICY "Authenticated users can read orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

-- Update product_images policies to remove user-specific restrictions
DROP POLICY IF EXISTS "Admins can delete product_images" ON product_images;
DROP POLICY IF EXISTS "Admins can insert product_images" ON product_images;
DROP POLICY IF EXISTS "Admins can update product_images" ON product_images;
DROP POLICY IF EXISTS "Authenticated users can insert product_images" ON product_images;

-- Add simple policies for product_images
CREATE POLICY "Anyone can view product_images"
  ON product_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert product_images"
  ON product_images
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update product_images"
  ON product_images
  FOR UPDATE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can delete product_images"
  ON product_images
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Update products policies to remove user-specific restrictions
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;

-- Add simple policies for products
CREATE POLICY "Anyone can insert products"
  ON products
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products
  FOR UPDATE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can delete products"
  ON products
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Update categories policies
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;

CREATE POLICY "Anyone can insert categories"
  ON categories
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Update banners policies
DROP POLICY IF EXISTS "Authenticated users can insert banners" ON banners;

CREATE POLICY "Anyone can insert banners"
  ON banners
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Update logos policies
DROP POLICY IF EXISTS "Authenticated users can insert logos" ON logos;

CREATE POLICY "Anyone can insert logos"
  ON logos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);