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
}

interface Team {
  id: string;
  team_name: string;
  contact_email: string | null;
  status: string;
}

export const useTournamentData = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchTournamentData = async () => {
    if (!tournamentId) return;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // Fetch tournament details
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (tournamentError) {
        console.error("Error fetching tournament:", tournamentError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch tournament details",
        });
        return;
      }

      setTournament(tournamentData);
      setIsOrganizer(user?.id === tournamentData.organizer_id);

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('tournament_teams')
        .select('*')
        .eq('tournament_id', tournamentId);

      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch tournament teams",
        });
        return;
      }

      setTeams(teamsData || []);
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

  const addTeam = async (teamName: string, contactEmail: string) => {
    if (!tournamentId || !currentUserId) return;

    try {
      const { error } = await supabase
        .from('tournament_teams')
        .insert({
          tournament_id: tournamentId,
          team_name: teamName,
          contact_email: contactEmail,
          status: 'registered'
        });

      if (error) {
        console.error("Error adding team:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to register team",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Team registered successfully",
      });

      // Refresh teams data
      fetchTournamentData();
    } catch (error) {
      console.error("Error in addTeam:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  useEffect(() => {
    fetchTournamentData();
  }, [tournamentId]);

  return {
    tournament,
    teams,
    loading,
    isOrganizer,
    currentUserId,
    addTeam,
    refreshData: fetchTournamentData
  };
};
