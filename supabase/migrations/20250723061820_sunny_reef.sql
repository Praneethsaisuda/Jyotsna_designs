/*
  # Add order status tracking

  1. New Columns
    - `orders.status` (text) - Track order progress through different stages
      - Default: 'Order Placed'
      - Allowed values: 'Order Placed', 'Process Started', 'Process Done', 'Delivery Started', 'Delivery Done'

  2. Security
    - Add policy for authenticated users to update order status
    - Maintain existing RLS policies

  3. Changes
    - Add status column with check constraint
    - Create update policy for order status management
*/

-- Add status column to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'status'
  ) THEN
    ALTER TABLE orders ADD COLUMN status text DEFAULT 'Order Placed';
  END IF;
END $$;

-- Add check constraint for valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'orders_status_check'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_status_check 
    CHECK (status IN ('Order Placed', 'Process Started', 'Process Done', 'Delivery Started', 'Delivery Done'));
  END IF;
END $$;

-- Create policy for updating order status
CREATE POLICY "Allow authenticated users to update order status"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);