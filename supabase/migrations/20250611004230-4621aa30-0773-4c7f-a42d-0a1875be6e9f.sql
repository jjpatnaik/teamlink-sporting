
-- Enable RLS on tournament_teams table (if not already enabled)
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert teams
CREATE POLICY "Users can register teams for tournaments" 
ON tournament_teams 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = registered_by);

-- Create policy to allow users to view teams in tournaments
CREATE POLICY "Anyone can view registered teams" 
ON tournament_teams 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow users to update their own team registrations
CREATE POLICY "Users can update their own team registrations" 
ON tournament_teams 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = registered_by)
WITH CHECK (auth.uid() = registered_by);

-- Create policy to allow users to delete their own team registrations
CREATE POLICY "Users can delete their own team registrations" 
ON tournament_teams 
FOR DELETE 
TO authenticated 
USING (auth.uid() = registered_by);
