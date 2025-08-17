-- Remove the sender_ip column completely to protect anonymity
-- This is the safest approach for truly anonymous messaging
ALTER TABLE public.anonymous_messages 
DROP COLUMN IF EXISTS sender_ip;

-- Verify our RLS policies are still secure after the column removal
-- (The existing policies should remain intact and secure)