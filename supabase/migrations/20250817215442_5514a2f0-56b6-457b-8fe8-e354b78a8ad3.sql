-- Since public_profiles is a view, we need to control access through permissions
-- First, revoke all existing permissions on the view
REVOKE ALL ON public.public_profiles FROM PUBLIC;
REVOKE ALL ON public.public_profiles FROM anon;

-- Only allow authenticated users to read public profile data
-- This ensures anonymous users cannot access any profile information
GRANT SELECT ON public.public_profiles TO authenticated;

-- Additionally, let's create a more restrictive approach where users can only see
-- profiles of people in their same batch/stream for better privacy
-- But first, let's check if we should make it completely authenticated-only

-- For now, let's implement authenticated-only access as the most secure approach
-- If users need more specific access patterns, they can be added later