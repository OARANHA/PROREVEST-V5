-- Migration: Create products structure
-- This migration creates all tables needed for the paint products system

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create finishes table
CREATE TABLE IF NOT EXISTS finishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create textures table
CREATE TABLE IF NOT EXISTS textures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create colors table
CREATE TABLE IF NOT EXISTS colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  hex_code TEXT,
  rgb TEXT,
  ral_code TEXT,
  pantone_code TEXT,
  ncs_code TEXT,
  category TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_description TEXT,
  category_id UUID REFERENCES categories(id),
  finish_id UUID REFERENCES finishes(id),
  price DECIMAL(10,2),
  technical_data JSONB,
  warranty JSONB,
  badges TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  application_video_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  color_id UUID REFERENCES colors(id),
  texture_id UUID REFERENCES textures(id),
  sku TEXT UNIQUE NOT NULL,
  image_url TEXT,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_finish ON products(finish_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_archived ON products(is_archived);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_color ON product_variants(color_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_texture ON product_variants(texture_id);
CREATE INDEX IF NOT EXISTS idx_colors_archived ON colors(is_archived);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE finishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE textures ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view categories" ON categories FOR SELECT TO public USING (NOT is_archived);
CREATE POLICY "Public can view finishes" ON finishes FOR SELECT TO public USING (NOT is_archived);
CREATE POLICY "Public can view textures" ON textures FOR SELECT TO public USING (NOT is_archived);
CREATE POLICY "Public can view colors" ON colors FOR SELECT TO public USING (NOT is_archived);
CREATE POLICY "Public can view products" ON products FOR SELECT TO public USING (NOT is_archived);
CREATE POLICY "Public can view product variants" ON product_variants FOR SELECT TO public USING (is_available);

-- Create policies for admin management
CREATE POLICY "Admins can manage categories" ON categories FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admins can manage finishes" ON finishes FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admins can manage textures" ON textures FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admins can manage colors" ON colors FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admins can manage products" ON products FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admins can manage product variants" ON product_variants FOR ALL TO authenticated USING (is_admin_user());

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Tinta Acrílica', 'tinta-acrilica', 'Tintas acrílicas para uso interno e externo'),
('Tinta Esmalte', 'tinta-esmalte', 'Esmaltes sintéticos para acabamentos especiais'),
('Tinta Texturizada', 'tinta-texturizada', 'Tintas com efeitos texturizados'),
('Primer/Selador', 'primer-selador', 'Produtos preparatórios para superfícies'),
('Verniz', 'verniz', 'Vernizes e acabamentos transparentes')
ON CONFLICT (slug) DO NOTHING;

-- Insert default finishes
INSERT INTO finishes (name, slug, description) VALUES
('Fosco', 'fosco', 'Acabamento fosco sem brilho'),
('Acetinado', 'acetinado', 'Acabamento com leve brilho'),
('Semi-Brilho', 'semi-brilho', 'Acabamento com brilho moderado'),
('Brilhante', 'brilhante', 'Acabamento com alto brilho'),
('Texturizado', 'texturizado', 'Acabamento com textura')
ON CONFLICT (slug) DO NOTHING;

-- Insert default textures
INSERT INTO textures (name, slug, description) VALUES
('Lisa', 'lisa', 'Superfície lisa'),
('Riscada', 'riscada', 'Textura riscada'),
('Casca de Ovo', 'casca-de-ovo', 'Textura casca de ovo'),
('Grafiato', 'grafiato', 'Textura grafiato'),
('Rustica', 'rustica', 'Textura rústica')
ON CONFLICT (slug) DO NOTHING;