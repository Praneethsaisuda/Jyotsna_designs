/*
  # Update order status constraint

  1. Changes
    - Drop existing check constraint on orders.status column
    - Add new check constraint with updated status values:
      - Order Placed
      - Manufacturing Started  
      - Manufacturing Done
      - Shipping Started
      - Shipped

  2. Security
    - No changes to existing RLS policies
*/

-- Drop the existing check constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the new check constraint with updated status values
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK ((status = ANY (ARRAY['Order Placed'::text, 'Manufacturing Started'::text, 'Manufacturing Done'::text, 'Shipping Started'::text, 'Shipped'::text])));