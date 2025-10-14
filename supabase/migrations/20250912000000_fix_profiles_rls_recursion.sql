-- Migration: Fix profiles table RLS recursion issue
-- This migration fixes the infinite recursion problem in the profiles table policies

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

-- Drop existing problematic policy
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Create new policy using helper function
CREATE POLICY "Admins can manage all profiles" 
ON profiles FOR ALL 
TO public 
USING (is_admin_user());

-- Ensure other policies are correctly set
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
TO public 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
TO public 
USING (auth.uid() = id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO public;
GRANT ALL ON TABLE profiles TO public;