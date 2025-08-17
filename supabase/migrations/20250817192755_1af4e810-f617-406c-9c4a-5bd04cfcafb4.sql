-- Create anonymous messages table
CREATE TABLE public.anonymous_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_user_id UUID NOT NULL,
  sender_ip TEXT,
  message TEXT NOT NULL CHECK (char_length(message) <= 256),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.anonymous_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous messages
CREATE POLICY "Users can view messages sent to them" 
ON public.anonymous_messages 
FOR SELECT 
USING (auth.uid() = recipient_user_id);

CREATE POLICY "Anyone can insert anonymous messages" 
ON public.anonymous_messages 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_anonymous_messages_recipient ON public.anonymous_messages(recipient_user_id, created_at DESC);