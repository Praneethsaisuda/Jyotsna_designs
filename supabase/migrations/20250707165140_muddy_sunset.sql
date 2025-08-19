/*
  # Multi-Image Product System

  1. New Tables
    - Enhanced `product_images` table for multiple images per product
    - Image metadata with variant support and ordering
  
  2. Sample Data
    - 2-5 images per existing product
    - Organized in product-specific folders
  
  3. Security
    - Maintain existing RLS policies
    - Ensure proper image access controls
*/

-- Ensure product_images table exists with enhanced structure
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  variant text,
  is_primary boolean DEFAULT false,
  alt_text text,
  sort_order integer DEFAULT 0,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
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
-- Elegant Silk Saree
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order) VALUES
((SELECT id FROM products WHERE slug = 'elegant-silk-saree'), 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Front View', 'Elegant Silk Saree - Front View', 1),
((SELECT id FROM products WHERE slug = 'elegant-silk-saree'), 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Detail View', 'Elegant Silk Saree - Border Detail', 2),
((SELECT id FROM products WHERE slug = 'elegant-silk-saree'), 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Drape Style', 'Elegant Silk Saree - Drape Style', 3),
((SELECT id FROM products WHERE slug = 'elegant-silk-saree'), 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Back View', 'Elegant Silk Saree - Back View', 4);

-- Royal Wedding Lehenga
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order) VALUES
((SELECT id FROM products WHERE slug = 'royal-wedding-lehenga'), 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Full Set', 'Royal Wedding Lehenga - Complete Set', 1),
((SELECT id FROM products WHERE slug = 'royal-wedding-lehenga'), 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Choli Detail', 'Royal Wedding Lehenga - Choli Embroidery', 2),
((SELECT id FROM products WHERE slug = 'royal-wedding-lehenga'), 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Skirt Detail', 'Royal Wedding Lehenga - Skirt Work', 3),
((SELECT id FROM products WHERE slug = 'royal-wedding-lehenga'), 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Dupatta', 'Royal Wedding Lehenga - Dupatta Design', 4),
((SELECT id FROM products WHERE slug = 'royal-wedding-lehenga'), 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Side View', 'Royal Wedding Lehenga - Side Profile', 5);

-- Cotton Printed Kurti
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order) VALUES
((SELECT id FROM products WHERE slug = 'cotton-printed-kurti'), 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Front View', 'Cotton Printed Kurti - Front View', 1),
((SELECT id FROM products WHERE slug = 'cotton-printed-kurti'), 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Print Detail', 'Cotton Printed Kurti - Print Close-up', 2),
((SELECT id FROM products WHERE slug = 'cotton-printed-kurti'), 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Back View', 'Cotton Printed Kurti - Back Design', 3);

-- Designer Anarkali Suit
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order) VALUES
((SELECT id FROM products WHERE slug = 'designer-anarkali-suit'), 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Full Length', 'Designer Anarkali Suit - Full Length', 1),
((SELECT id FROM products WHERE slug = 'designer-anarkali-suit'), 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Mirror Work', 'Designer Anarkali Suit - Mirror Work Detail', 2),
((SELECT id FROM products WHERE slug = 'designer-anarkali-suit'), 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Sleeve Detail', 'Designer Anarkali Suit - Sleeve Embroidery', 3),
((SELECT id FROM products WHERE slug = 'designer-anarkali-suit'), 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Flowing Style', 'Designer Anarkali Suit - Flowing Silhouette', 4);

-- Traditional Jewelry Set
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order) VALUES
((SELECT id FROM products WHERE slug = 'traditional-jewelry-set'), 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Complete Set', 'Traditional Jewelry Set - Complete Collection', 1),
((SELECT id FROM products WHERE slug = 'traditional-jewelry-set'), 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Necklace', 'Traditional Jewelry Set - Necklace Detail', 2),
((SELECT id FROM products WHERE slug = 'traditional-jewelry-set'), 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Earrings', 'Traditional Jewelry Set - Earrings Close-up', 3);

-- Festive Sharara Set
INSERT INTO product_images (product_id, url, is_primary, variant, alt_text, sort_order) VALUES
((SELECT id FROM products WHERE slug = 'festive-sharara-set'), 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', true, 'Full Outfit', 'Festive Sharara Set - Complete Outfit', 1),
((SELECT id FROM products WHERE slug = 'festive-sharara-set'), 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Kurta Detail', 'Festive Sharara Set - Kurta Embroidery', 2),
((SELECT id FROM products WHERE slug = 'festive-sharara-set'), 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Sharara Pants', 'Festive Sharara Set - Sharara Pants', 3),
((SELECT id FROM products WHERE slug = 'festive-sharara-set'), 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', false, 'Dupatta Style', 'Festive Sharara Set - Dupatta Draping', 4);