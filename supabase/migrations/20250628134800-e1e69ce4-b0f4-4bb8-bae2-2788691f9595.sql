
-- Check if policies exist and add only missing ones
DO $$
BEGIN
    -- Add RLS if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'team_join_requests' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Add policy to allow users to view their own join requests (if not exists)
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

    -- Add policy to allow users to create join requests (if not exists)
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

    -- Add policy to allow team owners/captains to update join requests (if not exists)
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
