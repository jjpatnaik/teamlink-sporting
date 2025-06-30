
-- Drop all existing policies on team_members table first
DROP POLICY IF EXISTS "Team members can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Team owners and captains can manage members" ON public.team_members;
DROP POLICY IF EXISTS "Users can join teams" ON public.team_members;
DROP POLICY IF EXISTS "Users can view their own membership" ON public.team_members;
DROP POLICY IF EXISTS "Team members can view other members in same team" ON public.team_members;

-- Drop all existing policies on team_updates table
DROP POLICY IF EXISTS "Team members can view team updates" ON public.team_updates;
DROP POLICY IF EXISTS "Team owners and captains can create updates" ON public.team_updates;
DROP POLICY IF EXISTS "Authors can update their own updates" ON public.team_updates;
DROP POLICY IF EXISTS "Team owners and captains can delete updates" ON public.team_updates;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.get_user_team_role(team_id_param uuid)
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.team_members 
    WHERE team_id = team_id_param 
    AND user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_team_member(team_id_param uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.team_members 
    WHERE team_id = team_id_param 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new team_members policies
CREATE POLICY "Users can view their own membership" 
ON public.team_members 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Team members can view other members in same team" 
ON public.team_members 
FOR SELECT 
USING (public.is_team_member(team_id));

CREATE POLICY "Team owners and captains can manage members" 
ON public.team_members 
FOR ALL 
USING (
  user_id = auth.uid() 
  OR public.get_user_team_role(team_id) IN ('owner', 'captain')
);

CREATE POLICY "Users can join teams" 
ON public.team_members 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Create new team_updates policies
CREATE POLICY "Team members can view team updates" 
ON public.team_updates 
FOR SELECT 
USING (public.is_team_member(team_id));

CREATE POLICY "Team owners and captains can create updates" 
ON public.team_updates 
FOR INSERT 
WITH CHECK (
  public.get_user_team_role(team_id) IN ('owner', 'captain')
);

CREATE POLICY "Authors can update their own updates" 
ON public.team_updates 
FOR UPDATE 
USING (author_id = auth.uid());

CREATE POLICY "Team owners and captains can delete updates" 
ON public.team_updates 
FOR DELETE 
USING (
  author_id = auth.uid() 
  OR public.get_user_team_role(team_id) IN ('owner', 'captain')
);

-- Remove title column from team_updates table
ALTER TABLE public.team_updates DROP COLUMN IF EXISTS title;

-- Add constraint to limit content length to 500 characters
ALTER TABLE public.team_updates ADD CONSTRAINT content_length_check CHECK (length(content) <= 500);
