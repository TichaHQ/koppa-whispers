-- Drop the existing public_profiles view
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate the view without SECURITY DEFINER
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

-- Enable RLS on the view
ALTER VIEW public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read public profile data
-- This makes sense since it's called "public_profiles"
CREATE POLICY "Anyone can view public profiles" 
ON public.public_profiles 
FOR SELECT 
USING (true);