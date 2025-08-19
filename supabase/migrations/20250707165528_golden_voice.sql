/*
  # Multi-Image System for Products

  1. Table Updates
    - Enhance `product_images` table with additional columns
    - Add `alt_text` and `sort_order` columns if they don't exist
    - Ensure proper indexing and constraints

  2. Sample Data
    - Insert 2-5 images per product for slideshow functionality
    - Set proper sort order and primary image flags
    - Include descriptive variants and alt text

  3. Security
    - Maintain existing RLS policies
    - Ensure public read access for product images
*/

-- Ensure product_images table exists with basic structure
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  variant text,
  is_primary boolean DEFAULT false,
  uploaded_at timestamptz DEFAULT now()
);

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add alt_text column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_images' AND column_name = 'alt_text'
  ) THEN
    ALTER TABLE product_images ADD COLUMN alt_text text;
  END IF;

  -- Add sort_order column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_images' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE product_images ADD COLUMN sort_order integer DEFAULT 0;
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_images' 
    AND policyname = 'Public read access for product_images'
  ) THEN
    CREATE POLICY "Public read access for product_images"
      ON product_images FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_images' 
    AND policyname = 'Authenticated users can insert product_images'
  ) THEN
    CREATE POLICY "Authenticated users can insert product_images"
      ON product_images FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Clear existing product images to avoid duplicates
DELETE FROM product_images;

-- Insert multiple images for each product (2-5 images per product)
-- Only insert if products exist

-- Elegant Silk Saree
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order)
SELECT id, 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Front View', 'Elegant Silk Saree - Front View', 1
FROM products WHERE slug = 'elegant-silk-saree'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Detail View', 'Elegant Silk Saree - Border Detail', 2
FROM products WHERE slug = 'elegant-silk-saree'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Drape Style', 'Elegant Silk Saree - Drape Style', 3
FROM products WHERE slug = 'elegant-silk-saree'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Back View', 'Elegant Silk Saree - Back View', 4
FROM products WHERE slug = 'elegant-silk-saree';

-- Royal Wedding Lehenga
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order)
SELECT id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Full Set', 'Royal Wedding Lehenga - Complete Set', 1
FROM products WHERE slug = 'royal-wedding-lehenga'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Choli Detail', 'Royal Wedding Lehenga - Choli Embroidery', 2
FROM products WHERE slug = 'royal-wedding-lehenga'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Skirt Detail', 'Royal Wedding Lehenga - Skirt Work', 3
FROM products WHERE slug = 'royal-wedding-lehenga'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Dupatta', 'Royal Wedding Lehenga - Dupatta Design', 4
FROM products WHERE slug = 'royal-wedding-lehenga'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Side View', 'Royal Wedding Lehenga - Side Profile', 5
FROM products WHERE slug = 'royal-wedding-lehenga';

-- Cotton Printed Kurti
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order)
SELECT id, 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Front View', 'Cotton Printed Kurti - Front View', 1
FROM products WHERE slug = 'cotton-printed-kurti'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Print Detail', 'Cotton Printed Kurti - Print Close-up', 2
FROM products WHERE slug = 'cotton-printed-kurti'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Back View', 'Cotton Printed Kurti - Back Design', 3
FROM products WHERE slug = 'cotton-printed-kurti';

-- Designer Anarkali Suit
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order)
SELECT id, 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Full Length', 'Designer Anarkali Suit - Full Length', 1
FROM products WHERE slug = 'designer-anarkali-suit'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Mirror Work', 'Designer Anarkali Suit - Mirror Work Detail', 2
FROM products WHERE slug = 'designer-anarkali-suit'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Sleeve Detail', 'Designer Anarkali Suit - Sleeve Embroidery', 3
FROM products WHERE slug = 'designer-anarkali-suit'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Flowing Style', 'Designer Anarkali Suit - Flowing Silhouette', 4
FROM products WHERE slug = 'designer-anarkali-suit';

-- Traditional Jewelry Set
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order)
SELECT id, 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Complete Set', 'Traditional Jewelry Set - Complete Collection', 1
FROM products WHERE slug = 'traditional-jewelry-set'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Necklace', 'Traditional Jewelry Set - Necklace Detail', 2
FROM products WHERE slug = 'traditional-jewelry-set'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Earrings', 'Traditional Jewelry Set - Earrings Close-up', 3
FROM products WHERE slug = 'traditional-jewelry-set';

-- Festive Sharara Set
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order)
SELECT id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Full Outfit', 'Festive Sharara Set - Complete Outfit', 1
FROM products WHERE slug = 'festive-sharara-set'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Kurta Detail', 'Festive Sharara Set - Kurta Embroidery', 2
FROM products WHERE slug = 'festive-sharara-set'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Sharara Pants', 'Festive Sharara Set - Sharara Pants', 3
FROM products WHERE slug = 'festive-sharara-set'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Dupatta Style', 'Festive Sharara Set - Dupatta Draping', 4
FROM products WHERE slug = 'festive-sharara-set';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON product_images(product_id, sort_order);