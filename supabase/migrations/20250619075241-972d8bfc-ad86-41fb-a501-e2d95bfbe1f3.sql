
-- Add roles column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN roles text[] DEFAULT ARRAY['enthusiast'];

-- Update existing profiles to have the default role if they don't have any
UPDATE public.profiles 
SET roles = ARRAY['enthusiast'] 
WHERE roles IS NULL OR array_length(roles, 1) IS NULL;

-- Make roles column non-nullable
ALTER TABLE public.profiles 
ALTER COLUMN roles SET NOT NULL;
