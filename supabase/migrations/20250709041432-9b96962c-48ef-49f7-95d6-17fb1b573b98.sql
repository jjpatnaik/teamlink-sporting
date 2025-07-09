-- Create tournament updates table for real-time tournament communication
CREATE TABLE public.tournament_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  update_type TEXT NOT NULL DEFAULT 'general',
  is_important BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.tournament_updates 
ADD CONSTRAINT tournament_updates_tournament_id_fkey 
FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.tournament_updates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Tournament organizers can create updates" 
ON public.tournament_updates 
FOR INSERT 
WITH CHECK (
  auth.uid() = author_id AND 
  EXISTS (
    SELECT 1 FROM public.tournaments 
    WHERE id = tournament_id AND organizer_id = auth.uid()
  )
);

CREATE POLICY "Tournament organizers can update their updates" 
ON public.tournament_updates 
FOR UPDATE 
USING (
  auth.uid() = author_id AND 
  EXISTS (
    SELECT 1 FROM public.tournaments 
    WHERE id = tournament_id AND organizer_id = auth.uid()
  )
);

CREATE POLICY "Tournament organizers can delete their updates" 
ON public.tournament_updates 
FOR DELETE 
USING (
  auth.uid() = author_id AND 
  EXISTS (
    SELECT 1 FROM public.tournaments 
    WHERE id = tournament_id AND organizer_id = auth.uid()
  )
);

CREATE POLICY "Users can view tournament updates" 
ON public.tournament_updates 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_tournament_updates_updated_at
BEFORE UPDATE ON public.tournament_updates
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add indexes for better performance
CREATE INDEX idx_tournament_updates_tournament_id ON public.tournament_updates(tournament_id);
CREATE INDEX idx_tournament_updates_created_at ON public.tournament_updates(created_at DESC);

-- Add participant tracking table for better tournament management
CREATE TABLE public.tournament_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL,
  user_id UUID NOT NULL,
  team_id UUID NULL,
  registration_type TEXT NOT NULL DEFAULT 'individual',
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  UNIQUE(tournament_id, user_id)
);

-- Add foreign key constraints
ALTER TABLE public.tournament_participants 
ADD CONSTRAINT tournament_participants_tournament_id_fkey 
FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;

ALTER TABLE public.tournament_participants 
ADD CONSTRAINT tournament_participants_team_id_fkey 
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

-- Enable RLS on participants table
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for participants
CREATE POLICY "Users can register for tournaments" 
ON public.tournament_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view tournament participants" 
ON public.tournament_participants 
FOR SELECT 
USING (true);

CREATE POLICY "Organizers can manage participants" 
ON public.tournament_participants 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.tournaments 
    WHERE id = tournament_id AND organizer_id = auth.uid()
  )
);

-- Add indexes
CREATE INDEX idx_tournament_participants_tournament_id ON public.tournament_participants(tournament_id);
CREATE INDEX idx_tournament_participants_user_id ON public.tournament_participants(user_id);