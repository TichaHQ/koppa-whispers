-- Add last_sign_in_at column to profiles table
ALTER TABLE public.profiles
ADD COLUMN last_sign_in_at TIMESTAMP WITH TIME ZONE;

-- Create function to sync last_sign_in_at from auth.users to profiles
CREATE OR REPLACE FUNCTION public.sync_last_sign_in()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.profiles
  SET last_sign_in_at = NEW.last_sign_in_at
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Create trigger to sync on auth.users update
CREATE TRIGGER on_auth_user_sign_in
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.sync_last_sign_in();

-- Backfill existing data
UPDATE public.profiles p
SET last_sign_in_at = (
  SELECT au.last_sign_in_at 
  FROM auth.users au 
  WHERE au.id = p.user_id
);