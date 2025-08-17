-- First, let's ensure the profiles table has the most secure RLS policies
-- The current policies should be sufficient, but let's verify and enhance them

-- Drop existing policies to recreate them with more explicit security
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create more secure and explicit RLS policies
-- Users can only view their own profile data (including email)
CREATE POLICY "Users can view only their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert only their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update only their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Explicitly deny DELETE operations for extra security
-- (no DELETE policy means no one can delete profiles)

-- Ensure the public_profiles view excludes sensitive data like email
-- (this is already correct as confirmed above, but let's make it explicit)
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
SELECT 
  user_id,
  username,
  batch,
  stream,
  year_of_deployment,
  state_of_deployment,
  created_at
FROM public.profiles;

-- Grant SELECT permission on the public view to authenticated users only
-- This ensures only logged-in users can access even the public profile data
GRANT SELECT ON public.public_profiles TO authenticated;