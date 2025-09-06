-- Create table for named anonymous message links
CREATE TABLE public.anonymous_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  link_name TEXT NOT NULL,
  link_slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.anonymous_links ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous_links
CREATE POLICY "Users can view their own links" 
ON public.anonymous_links 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own links" 
ON public.anonymous_links 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links" 
ON public.anonymous_links 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links" 
ON public.anonymous_links 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow public access to view active links (needed for anonymous messaging)
CREATE POLICY "Anyone can view active links for messaging" 
ON public.anonymous_links 
FOR SELECT 
TO public
USING (is_active = true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_anonymous_links_updated_at
BEFORE UPDATE ON public.anonymous_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add a link_id column to anonymous_messages to associate with specific links
ALTER TABLE public.anonymous_messages 
ADD COLUMN link_id UUID REFERENCES public.anonymous_links(id) ON DELETE SET NULL;