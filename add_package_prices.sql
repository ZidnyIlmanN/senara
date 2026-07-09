-- Add role-based pricing columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS price_reseller INTEGER,
ADD COLUMN IF NOT EXISTS price_agen INTEGER,
ADD COLUMN IF NOT EXISTS price_distributor INTEGER;
