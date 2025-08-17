-- Update the public_profiles view to include user_id for anonymous messages
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