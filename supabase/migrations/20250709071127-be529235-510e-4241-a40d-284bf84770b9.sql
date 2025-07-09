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

-- Create a trigger function to automatically schedule cleanup
CREATE OR REPLACE FUNCTION public.schedule_tournament_cleanup()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only schedule cleanup when a tournament is actually canceled
  IF NEW.cancelled_at IS NOT NULL AND OLD.cancelled_at IS NULL THEN
    -- This will be handled by a scheduled job or can be called manually
    -- The actual scheduling would depend on the cron setup
    NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to detect when tournaments are canceled
CREATE OR REPLACE TRIGGER trigger_tournament_canceled
  AFTER UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.schedule_tournament_cleanup();

-- Create a simple cron job using pg_cron extension (if available)
-- This will run the cleanup function daily at 2 AM
-- Note: pg_cron extension needs to be enabled in your Supabase project
SELECT cron.schedule(
  'cleanup-canceled-tournaments',
  '0 2 * * *', -- Daily at 2 AM
  $$SELECT public.cleanup_old_canceled_tournaments();$$
);

-- If pg_cron is not available, you can manually call the function:
-- SELECT public.cleanup_old_canceled_tournaments();