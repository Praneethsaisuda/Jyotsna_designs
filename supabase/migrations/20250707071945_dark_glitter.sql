/*
  # Update Schema for Complete Image Management

  1. Schema Updates
    - Add img_url column to categories table
    - Add img_url column to products table
    - Update existing tables to support image URLs
  
  2. Sample Data
    - Add 6 fashion products with complete details
    - Add category images
    - Update existing data structure
  
  3. Storage
    - Ensure proper bucket structure for organized image storage
*/

-- Add img_url column to categories if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'img_url'
  ) THEN
    ALTER TABLE categories ADD COLUMN img_url TEXT;
  END IF;
END $$;

-- Add img_url column to products if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'img_url'
  ) THEN
    ALTER TABLE products ADD COLUMN img_url TEXT;
  END IF;
END $$;

-- Add additional product fields for better e-commerce functionality
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'slug'
  ) THEN
    ALTER TABLE products ADD COLUMN slug TEXT UNIQUE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'long_description'
  ) THEN
    ALTER TABLE products ADD COLUMN long_description TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'discounted_price'
  ) THEN
    ALTER TABLE products ADD COLUMN discounted_price NUMERIC(10,2);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'brand'
  ) THEN
    ALTER TABLE products ADD COLUMN brand TEXT DEFAULT 'Jyotsna Designs';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'color'
  ) THEN
    ALTER TABLE products ADD COLUMN color TEXT[];
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size'
  ) THEN
    ALTER TABLE products ADD COLUMN size TEXT[];
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'rating'
  ) THEN
    ALTER TABLE products ADD COLUMN rating NUMERIC(2,1) DEFAULT 4.5;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'total_reviews'
  ) THEN
    ALTER TABLE products ADD COLUMN total_reviews INTEGER DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'availability'
  ) THEN
    ALTER TABLE products ADD COLUMN availability BOOLEAN DEFAULT true;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'currency'
  ) THEN
    ALTER TABLE products ADD COLUMN currency TEXT DEFAULT 'INR';
  END IF;
END $$;

-- Update categories with image URLs
UPDATE categories SET img_url = 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'sarees' AND img_url IS NULL;
UPDATE categories SET img_url = 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'lehengas' AND img_url IS NULL;
UPDATE categories SET img_url = 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'kurtis' AND img_url IS NULL;
UPDATE categories SET img_url = 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'accessories' AND img_url IS NULL;

-- Insert sample fashion products
INSERT INTO products (
  name, 
  slug, 
  description, 
  long_description,
  category_id, 
  price, 
  discounted_price,
  brand,
  color,
  size,
  rating,
  total_reviews,
  stock_quantity,
  availability,
  is_featured,
  img_url
) VALUES 
(
  'Elegant Silk Saree',
  'elegant-silk-saree',
  'Beautiful handwoven silk saree with intricate golden border',
  'This exquisite silk saree features traditional handwoven patterns with a stunning golden border. Perfect for weddings, festivals, and special occasions. The rich fabric drapes beautifully and the intricate work showcases the finest craftsmanship.',
  (SELECT id FROM categories WHERE slug = 'sarees'),
  8999.00,
  7499.00,
  'Jyotsna Designs',
  ARRAY['Red', 'Blue', 'Green', 'Purple'],
  ARRAY['Free Size'],
  4.8,
  156,
  25,
  true,
  true,
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Royal Wedding Lehenga',
  'royal-wedding-lehenga',
  'Stunning bridal lehenga with heavy embroidery and sequin work',
  'A magnificent bridal lehenga crafted with the finest fabrics and adorned with intricate embroidery, sequins, and beadwork. This piece is designed to make you feel like royalty on your special day.',
  (SELECT id FROM categories WHERE slug = 'lehengas'),
  45999.00,
  39999.00,
  'Jyotsna Designs',
  ARRAY['Maroon', 'Pink', 'Gold', 'Red'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  4.9,
  89,
  12,
  true,
  true,
  'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Cotton Printed Kurti',
  'cotton-printed-kurti',
  'Comfortable daily wear kurti with beautiful floral prints',
  'A versatile and comfortable cotton kurti featuring beautiful floral prints. Perfect for daily wear, office, or casual outings. The breathable fabric ensures comfort throughout the day.',
  (SELECT id FROM categories WHERE slug = 'kurtis'),
  1299.00,
  999.00,
  'Jyotsna Designs',
  ARRAY['White', 'Blue', 'Pink', 'Yellow'],
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  4.6,
  234,
  50,
  true,
  false,
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Designer Anarkali Suit',
  'designer-anarkali-suit',
  'Graceful Anarkali suit with mirror work and embroidery',
  'An elegant Anarkali suit featuring beautiful mirror work and embroidery. The flowing silhouette and intricate details make it perfect for festive occasions and celebrations.',
  (SELECT id FROM categories WHERE slug = 'kurtis'),
  3499.00,
  2799.00,
  'Jyotsna Designs',
  ARRAY['Black', 'Navy', 'Emerald', 'Wine'],
  ARRAY['S', 'M', 'L', 'XL'],
  4.7,
  167,
  30,
  true,
  true,
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Traditional Jewelry Set',
  'traditional-jewelry-set',
  'Complete jewelry set with necklace, earrings, and bangles',
  'A stunning traditional jewelry set that includes a statement necklace, matching earrings, and elegant bangles. Crafted with attention to detail and perfect for completing your ethnic look.',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  2999.00,
  2499.00,
  'Jyotsna Designs',
  ARRAY['Gold', 'Silver', 'Rose Gold'],
  ARRAY['One Size'],
  4.5,
  98,
  40,
  true,
  false,
  'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Festive Sharara Set',
  'festive-sharara-set',
  'Beautiful sharara set with dupatta for festive occasions',
  'A gorgeous sharara set featuring a beautifully embroidered kurta, flowing sharara pants, and a matching dupatta. Perfect for festivals, weddings, and special celebrations.',
  (SELECT id FROM categories WHERE slug = 'lehengas'),
  6999.00,
  5999.00,
  'Jyotsna Designs',
  ARRAY['Peach', 'Mint', 'Lavender', 'Coral'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  4.8,
  145,
  20,
  true,
  true,
  'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800'
);

-- Update existing products with missing fields
UPDATE products SET 
  slug = LOWER(REPLACE(name, ' ', '-')),
  brand = COALESCE(brand, 'Jyotsna Designs'),
  rating = COALESCE(rating, 4.5),
  total_reviews = COALESCE(total_reviews, 0),
  stock_quantity = COALESCE(stock, stock_quantity, 10),
  availability = COALESCE(availability, true),
  currency = COALESCE(currency, 'INR'),
  img_url = COALESCE(img_url, 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800')
WHERE slug IS NULL;