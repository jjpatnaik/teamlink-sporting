-- Create function to clean up old canceled tournaments
CREATE OR REPLACE FUNCTION public.cleanup_old_canceled_tournaments()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Delete tournaments that were canceled more than 3 weeks ago
  DELETE FROM public.tournaments 
  WHERE cancelled_at IS NOT NULL 
    AND cancelled_at < (NOW() - INTERVAL '3 weeks');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup operation
  RAISE NOTICE 'Cleaned up % canceled tournaments older than 3 weeks', deleted_count;
  
  RETURN deleted_count;
END;
$$;

-- Create an edge function trigger that will call the cleanup periodically
-- This function can be called manually or scheduled externally
COMMENT ON FUNCTION public.cleanup_old_canceled_tournaments() IS 'Removes tournaments that have been canceled for more than 3 weeks';