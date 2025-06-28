
-- Enable RLS on team_updates table (safe to run multiple times)
ALTER TABLE public.team_updates ENABLE ROW LEVEL SECURITY;

-- Enable RLS on team_members table (safe to run multiple times)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
    -- Policy: Team members can view updates for teams they belong to
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_updates' 
        AND policyname = 'Team members can view team updates'
    ) THEN
        CREATE POLICY "Team members can view team updates" 
        ON public.team_updates 
        FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM public.team_members 
            WHERE team_members.team_id = team_updates.team_id 
            AND team_members.user_id = auth.uid()
          )
        );
    END IF;

    -- Policy: Team owners and captains can create updates
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_updates' 
        AND policyname = 'Team owners and captains can create updates'
    ) THEN
        CREATE POLICY "Team owners and captains can create updates" 
        ON public.team_updates 
        FOR INSERT 
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.team_members 
            WHERE team_members.team_id = team_updates.team_id 
            AND team_members.user_id = auth.uid()
            AND team_members.role IN ('owner', 'captain')
          )
        );
    END IF;

    -- Policy: Authors can update their own updates
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_updates' 
        AND policyname = 'Authors can update their own updates'
    ) THEN
        CREATE POLICY "Authors can update their own updates" 
        ON public.team_updates 
        FOR UPDATE 
        USING (author_id = auth.uid());
    END IF;

    -- Policy: Team owners and captains can delete updates
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_updates' 
        AND policyname = 'Team owners and captains can delete updates'
    ) THEN
        CREATE POLICY "Team owners and captains can delete updates" 
        ON public.team_updates 
        FOR DELETE 
        USING (
          EXISTS (
            SELECT 1 FROM public.team_members 
            WHERE team_members.team_id = team_updates.team_id 
            AND team_members.user_id = auth.uid()
            AND team_members.role IN ('owner', 'captain')
          )
          OR author_id = auth.uid()
        );
    END IF;

    -- Policy: Team members can view other team members in their teams
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_members' 
        AND policyname = 'Team members can view team members'
    ) THEN
        CREATE POLICY "Team members can view team members" 
        ON public.team_members 
        FOR SELECT 
        USING (
          user_id = auth.uid() 
          OR EXISTS (
            SELECT 1 FROM public.team_members tm 
            WHERE tm.team_id = team_members.team_id 
            AND tm.user_id = auth.uid()
          )
        );
    END IF;

    -- Policy: Team owners and captains can manage team members
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_members' 
        AND policyname = 'Team owners and captains can manage members'
    ) THEN
        CREATE POLICY "Team owners and captains can manage members" 
        ON public.team_members 
        FOR ALL 
        USING (
          EXISTS (
            SELECT 1 FROM public.team_members tm 
            WHERE tm.team_id = team_members.team_id 
            AND tm.user_id = auth.uid()
            AND tm.role IN ('owner', 'captain')
          )
        );
    END IF;

    -- Policy: Users can join teams (for accepted invitations)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_members' 
        AND policyname = 'Users can join teams'
    ) THEN
        CREATE POLICY "Users can join teams" 
        ON public.team_members 
        FOR INSERT 
        WITH CHECK (user_id = auth.uid());
    END IF;

END $$;
