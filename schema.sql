-- Create Products Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_desc TEXT,
  "desc" TEXT,
  price INTEGER NOT NULL,
  image TEXT,
  badge TEXT,
  badge_style TEXT,
  type TEXT,
  conditions TEXT[],
  ingredients TEXT[],
  volume TEXT,
  benefits TEXT,
  how_to_use TEXT,
  full_ingredients TEXT,
  rating NUMERIC(3, 1),
  reviews_count INTEGER,
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create About Content Table
CREATE TABLE about_content (
  id TEXT PRIMARY KEY,
  title TEXT,
  "desc" TEXT,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Timeline Events Table
CREATE TABLE timeline_events (
  id TEXT PRIMARY KEY,
  year TEXT,
  month TEXT,
  date TEXT,
  title TEXT,
  "desc" TEXT,
  content JSONB,
  image_captions JSONB,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access for about_content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access for timeline_events" ON timeline_events FOR SELECT USING (true);

-- Allow authenticated users (Admin) to manage data
CREATE POLICY "Allow authenticated full access for products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access for about_content" ON about_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access for timeline_events" ON timeline_events FOR ALL USING (auth.role() = 'authenticated');
