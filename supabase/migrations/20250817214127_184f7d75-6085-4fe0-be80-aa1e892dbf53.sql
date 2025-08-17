-- Drop the existing public_profiles view
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate the view without SECURITY DEFINER (default is SECURITY INVOKER)
-- This ensures the view uses the permissions of the querying user, not the creator
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