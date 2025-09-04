-- Fix public_profiles RLS policies to allow public access
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read public profiles
CREATE POLICY "Allow public read access to public profiles"
ON public.public_profiles
FOR SELECT
TO public
USING (true);

-- Update the handle_new_user function to not set email automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;