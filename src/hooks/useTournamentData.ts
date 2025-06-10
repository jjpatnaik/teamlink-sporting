
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
    if (!tournamentId) {
      console.error("No tournament ID provided");
      setLoading(false);
      return;
    }

    console.log("Fetching tournament data for ID:", tournamentId);

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
      setIsOrganizer(user?.id === tournamentData.organizer_id);

      // Fetch teams
      console.log("Fetching teams...");
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
      } else {
        console.log("Teams data:", teamsData);
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
    console.log("useEffect triggered with tournamentId:", tournamentId);
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
