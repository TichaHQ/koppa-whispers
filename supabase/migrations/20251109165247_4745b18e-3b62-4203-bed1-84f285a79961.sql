-- Grant admin role to user
INSERT INTO public.user_roles (user_id, role)
VALUES ('efee1c3e-61c7-452d-95e3-e105e22d16f7', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;