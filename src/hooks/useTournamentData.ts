import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Tournament {
  id: string;
  name: string;
  sport: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  teams_allowed: number;
  tournament_status: string | null;
  description: string | null;
  format: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  registration_deadline: string | null;
  fixture_generation_status: string | null;
  organizer_id: string;
  entry_fee: number;
  rules: string | null;
}

interface Team {
  id: string;
  tournament_id: string;
  team_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  captain_name: string | null;
  status: string;
  approval_status: string;
  created_at: string;
  registered_by: string | null;
  social_media_links: any;
}

export const useTournamentData = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchTournamentData = async () => {
    if (!tournamentId) {
      console.error("No tournament ID provided");
      setLoading(false);
      return;
    }

    console.log("Fetching tournament data for ID:", tournamentId);
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user?.id);
      setCurrentUserId(user?.id || null);

      // Fetch tournament details
      console.log("Fetching tournament details...");
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (tournamentError) {
        console.error("Error fetching tournament:", tournamentError);
        if (tournamentError.code === 'PGRST116') {
          toast({
            variant: "destructive",
            title: "Tournament Not Found",
            description: "The tournament you're looking for doesn't exist or has been removed.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch tournament details",
          });
        }
        setLoading(false);
        return;
      }

      console.log("Tournament data:", tournamentData);
      setTournament(tournamentData);
      const isOrganizerUser = user?.id === tournamentData.organizer_id;
      setIsOrganizer(isOrganizerUser);

      // Fetch teams - show ALL teams to organizers, only approved teams to public
      console.log("Fetching teams...");
      let teamsQuery = supabase
        .from('tournament_teams')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('status', 'registered')
        .order('created_at', { ascending: true });

      // If not organizer, only show approved teams
      if (!isOrganizerUser) {
        teamsQuery = teamsQuery.eq('approval_status', 'approved');
      }

      const { data: teamsData, error: teamsError } = await teamsQuery;

      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch tournament teams",
        });
        setTeams([]);
      } else {
        console.log("Teams data fetched:", teamsData);
        setTeams(teamsData || []);
      }
    } catch (error) {
      console.error("Error in fetchTournamentData:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with tournamentId:", tournamentId);
    fetchTournamentData();
  }, [tournamentId]);

  return {
    tournament,
    teams,
    loading,
    isOrganizer,
    currentUserId,
    refreshData: fetchTournamentData
  };
};
