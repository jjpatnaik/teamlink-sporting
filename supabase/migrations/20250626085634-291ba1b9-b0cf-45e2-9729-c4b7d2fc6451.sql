
-- Add missing columns to teams table for better team information
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS introduction text;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS sport text;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS established_year integer;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS achievements text;

-- Create team invitations table for sending invites to users
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone,
  UNIQUE(team_id, receiver_id, status) DEFERRABLE INITIALLY DEFERRED
);

-- Create team updates table for owner/captain announcements
CREATE TABLE IF NOT EXISTS public.team_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add captain role to team_members role check
ALTER TABLE public.team_members DROP CONSTRAINT IF EXISTS team_members_role_check;
ALTER TABLE public.team_members ADD CONSTRAINT team_members_role_check 
  CHECK (role IN ('owner', 'admin', 'captain', 'member'));

-- Enable RLS on new tables
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_updates ENABLE ROW LEVEL SECURITY;

-- RLS policies for team_invitations
CREATE POLICY "Users can view invitations they sent or received" ON public.team_invitations
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id OR
    EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.team_id = team_invitations.team_id 
      AND tm.user_id = auth.uid() 
      AND tm.role IN ('owner', 'captain', 'admin')
    )
  );

CREATE POLICY "Team owners and captains can send invitations" ON public.team_invitations
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.team_id = team_invitations.team_id 
      AND tm.user_id = auth.uid() 
      AND tm.role IN ('owner', 'captain', 'admin')
    )
  );

CREATE POLICY "Receivers can update invitation status" ON public.team_invitations
  FOR UPDATE USING (auth.uid() = receiver_id);

-- RLS policies for team_updates
CREATE POLICY "Team members can view team updates" ON public.team_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.team_id = team_updates.team_id 
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and captains can create updates" ON public.team_updates
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.team_id = team_updates.team_id 
      AND tm.user_id = auth.uid() 
      AND tm.role IN ('owner', 'captain')
    )
  );

CREATE POLICY "Authors can update their own updates" ON public.team_updates
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Team owners and captains can delete updates" ON public.team_updates
  FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.team_id = team_updates.team_id 
      AND tm.user_id = auth.uid() 
      AND tm.role IN ('owner', 'captain')
    )
  );

-- Add trigger for team_updates updated_at
CREATE TRIGGER update_team_updates_updated_at BEFORE UPDATE ON public.team_updates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
