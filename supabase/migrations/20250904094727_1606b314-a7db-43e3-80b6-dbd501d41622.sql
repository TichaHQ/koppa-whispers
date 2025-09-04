-- Update profiles table RLS policies to allow public read access for profiles
DROP POLICY IF EXISTS "Users can view only their own profile" ON public.profiles;

-- Allow users to view their own profile (for authenticated users)
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow anyone to read basic profile info (for public profiles view)
CREATE POLICY "Allow public read access to profiles for anonymous messaging"
ON public.profiles
FOR SELECT
TO public
USING (true);