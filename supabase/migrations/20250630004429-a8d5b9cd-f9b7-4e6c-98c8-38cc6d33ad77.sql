
-- Enable RLS on team_join_requests table (safe to run multiple times)
ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for team join requests
DO $$
BEGIN
    -- Policy: Users can view their own join requests
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_join_requests' 
        AND policyname = 'Users can view their own join requests'
    ) THEN
        CREATE POLICY "Users can view their own join requests" 
        ON public.team_join_requests
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    -- Policy: Users can create join requests
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_join_requests' 
        AND policyname = 'Users can create join requests'
    ) THEN
        CREATE POLICY "Users can create join requests" 
        ON public.team_join_requests
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Policy: Team owners/captains can view requests for their teams
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_join_requests' 
        AND policyname = 'Team owners can view team requests'
    ) THEN
        CREATE POLICY "Team owners can view team requests" 
        ON public.team_join_requests
        FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM public.team_members tm 
            WHERE tm.team_id = team_join_requests.team_id 
            AND tm.user_id = auth.uid() 
            AND tm.role IN ('owner', 'captain')
          )
        );
    END IF;

    -- Policy: Team owners/captains can update join requests
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_join_requests' 
        AND policyname = 'Team owners can update join requests'
    ) THEN
        CREATE POLICY "Team owners can update join requests" 
        ON public.team_join_requests
        FOR UPDATE 
        USING (
          EXISTS (
            SELECT 1 FROM public.team_members tm 
            WHERE tm.team_id = team_join_requests.team_id 
            AND tm.user_id = auth.uid() 
            AND tm.role IN ('owner', 'captain')
          )
        );
    END IF;

    -- Policy: Team owners/captains can delete join requests
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'team_join_requests' 
        AND policyname = 'Team owners can delete join requests'
    ) THEN
        CREATE POLICY "Team owners can delete join requests" 
        ON public.team_join_requests
        FOR DELETE 
        USING (
          EXISTS (
            SELECT 1 FROM public.team_members tm 
            WHERE tm.team_id = team_join_requests.team_id 
            AND tm.user_id = auth.uid() 
            AND tm.role IN ('owner', 'captain')
          )
        );
    END IF;
END $$;

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    -- Add team_id foreign key constraint if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_team_join_requests_team_id'
        AND table_name = 'team_join_requests'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.team_join_requests 
        ADD CONSTRAINT fk_team_join_requests_team_id 
        FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
    END IF;

    -- Add user_id foreign key constraint if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_team_join_requests_user_id'
        AND table_name = 'team_join_requests'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.team_join_requests 
        ADD CONSTRAINT fk_team_join_requests_user_id 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Add processed_by foreign key constraint if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_team_join_requests_processed_by'
        AND table_name = 'team_join_requests'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.team_join_requests 
        ADD CONSTRAINT fk_team_join_requests_processed_by 
        FOREIGN KEY (processed_by) REFERENCES auth.users(id);
    END IF;
END $$;
