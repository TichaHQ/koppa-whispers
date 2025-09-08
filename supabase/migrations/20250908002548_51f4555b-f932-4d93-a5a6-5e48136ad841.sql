-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.update_user_session()
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  INSERT INTO public.user_sessions (user_id, last_seen)
  VALUES (auth.uid(), now())
  ON CONFLICT (user_id)
  DO UPDATE SET last_seen = now();
$$;