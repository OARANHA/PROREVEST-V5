-- Migration: Create profiles table
-- This migration creates the profiles table to store user profile information

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'professional', 'customer')),
  phone TEXT,
  cpf TEXT,
  cnpj TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Create helper function to avoid recursion in RLS policies
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy for admin users to manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON profiles FOR ALL 
TO authenticated 
USING (is_admin_user());

-- Grant necessary permissions
GRANT ALL ON TABLE profiles TO authenticated;