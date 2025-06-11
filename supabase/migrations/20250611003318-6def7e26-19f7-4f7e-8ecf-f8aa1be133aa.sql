
-- Add missing columns to tournament_teams table
ALTER TABLE tournament_teams 
ADD COLUMN IF NOT EXISTS captain_name text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS registered_by uuid,
ADD COLUMN IF NOT EXISTS social_media_links jsonb;

-- Add foreign key constraint for registered_by if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tournament_teams_registered_by_fkey'
    ) THEN
        ALTER TABLE tournament_teams 
        ADD CONSTRAINT tournament_teams_registered_by_fkey 
        FOREIGN KEY (registered_by) REFERENCES auth.users(id);
    END IF;
END $$;
