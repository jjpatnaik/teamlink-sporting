
-- Check the current constraint on the tournaments table
SELECT conname, pg_get_constraintdef(oid) as constraint_def 
FROM pg_constraint 
WHERE conrelid = 'public.tournaments'::regclass 
AND conname = 'tournaments_format_check';

-- If the constraint exists but has wrong values, let's drop it and recreate with correct ones
ALTER TABLE public.tournaments DROP CONSTRAINT IF EXISTS tournaments_format_check;

-- Add the correct check constraint that matches our form options
ALTER TABLE public.tournaments ADD CONSTRAINT tournaments_format_check 
CHECK (format IN ('knockout', 'round_robin', 'league', 'swiss'));
