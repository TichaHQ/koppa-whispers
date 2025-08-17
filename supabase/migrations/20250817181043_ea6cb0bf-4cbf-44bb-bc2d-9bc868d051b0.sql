-- Fix security vulnerability by restricting profile visibility
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows users to view their own profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- For the sharing functionality, we'll create a separate public view with limited data
-- that doesn't expose sensitive information like email
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  username,
  batch,
  stream,
  year_of_deployment,
  state_of_deployment,
  created_at
FROM public.profiles
WHERE username IS NOT NULL;

-- Grant access to the public view for authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;

-- Create RLS policy for the public view (allows reading limited profile data)
ALTER VIEW public.public_profiles SET (security_invoker = true);