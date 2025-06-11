
-- Add approval status and rejection reason to tournament_teams table
ALTER TABLE tournament_teams 
ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN rejection_reason TEXT,
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN approved_by UUID;

-- Update existing RLS policies to handle approval workflow
DROP POLICY IF EXISTS "Anyone can view registered teams" ON tournament_teams;
DROP POLICY IF EXISTS "Users can update their own team registrations" ON tournament_teams;

-- Create new policy for viewing teams (organizers can see all, users can see their own)
CREATE POLICY "Users can view tournament teams" 
ON tournament_teams 
FOR SELECT 
TO authenticated 
USING (
  auth.uid() = registered_by OR 
  auth.uid() IN (
    SELECT organizer_id FROM tournaments WHERE id = tournament_id
  )
);

-- Create policy for organizers to update team approval status
CREATE POLICY "Organizers can update team approvals" 
ON tournament_teams 
FOR UPDATE 
TO authenticated 
USING (
  auth.uid() IN (
    SELECT organizer_id FROM tournaments WHERE id = tournament_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT organizer_id FROM tournaments WHERE id = tournament_id
  )
);

-- Update existing policy for users updating their own registrations
CREATE POLICY "Users can update their own team registrations" 
ON tournament_teams 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = registered_by AND approval_status = 'pending')
WITH CHECK (auth.uid() = registered_by);
