
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useParams } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

export type Team = {
  id: string;
  team_name: string;
  contact_email: string | null;
  status: string;
};

export type Fixture = {
  id: string;
  tournament_id: string;
  round_number: number;
  match_number: number;
  team_1_id: string | null;
  team_2_id: string | null;
  team_1_score: number | null;
  team_2_score: number | null;
  winner_id: string | null;
  scheduled_datetime: string | null;
  venue: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Tournament = {
  id: string;
  name: string;
  description: string | null;
  sport: string;
  format: string;
  rules: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  registration_deadline: string | null;
  entry_fee: number | null;
  team_size: number | null;
  teams_allowed: number;
  organizer_id: string;
  tournament_status: string | null;
  fixture_generation_status: string | null;
};

export const useTournamentData = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Starting tournament data fetch...");
        
        // Get current user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error(`Session error: ${sessionError.message}`);
        }
        
        console.log("Session data:", sessionData ? "exists" : "null", 
                   "User:", sessionData.session?.user ? "authenticated" : "not authenticated");
        
        // Set current user ID from session
        setCurrentUserId(sessionData.session?.user?.id || null);
        
        if (!id) {
          console.error("No tournament ID provided");
          throw new Error("No tournament ID provided");
        }
        
        // Fetch tournament details
        console.log("Fetching tournament data for ID:", id);
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (tournamentError) {
          console.error("Tournament fetch error:", tournamentError);
          throw tournamentError;
        }
        
        if (!tournamentData) {
          console.error("No tournament found with ID:", id);
          throw new Error(`Tournament not found with ID: ${id}`);
        }
        
        console.log("Tournament data retrieved:", tournamentData);
        setTournament(tournamentData);
        
        // Check if current user is the organizer
        const isUserOrganizer = sessionData.session?.user?.id === tournamentData.organizer_id;
        console.log("Is user the organizer:", isUserOrganizer);
        setIsOrganizer(isUserOrganizer);
        
        // Fetch teams for this tournament
        console.log("Fetching teams for tournament:", id);
        const { data: teamsData, error: teamsError } = await supabase
          .from('tournament_teams')
          .select('*')
          .eq('tournament_id', id);
          
        if (teamsError) {
          console.error("Teams fetch error:", teamsError);
          throw teamsError;
        }
        
        console.log(`Found ${teamsData ? teamsData.length : 0} teams`);
        setTeams(teamsData || []);
        
        // Fetch fixtures for this tournament
        console.log("Fetching fixtures for tournament:", id);
        const { data: fixturesData, error: fixturesError } = await supabase
          .from('fixtures')
          .select('*')
          .eq('tournament_id', id)
          .order('round_number', { ascending: true })
          .order('match_number', { ascending: true });
          
        if (fixturesError) {
          console.error("Fixtures fetch error:", fixturesError);
          throw fixturesError;
        }
        
        console.log(`Found ${fixturesData ? fixturesData.length : 0} fixtures`);
        setFixtures(fixturesData || []);
        
      } catch (error: any) {
        console.error("Error in useTournamentData:", error);
        setError(error.message || "An unknown error occurred");
        toast({
          title: "Error",
          description: `Failed to load tournament data: ${error.message || "Unknown error"}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTournamentData();
  }, [id]);

  const addTeam = async (teamName: string, contactEmail?: string) => {
    if (!tournament || !currentUserId) {
      console.error("Cannot add team: No tournament or user ID");
      return null;
    }
    
    try {
      console.log(`Adding team ${teamName} to tournament ${tournament.id}`);
      
      const { data, error } = await supabase
        .from('tournament_teams')
        .insert({
          tournament_id: tournament.id,
          team_name: teamName,
          contact_email: contactEmail || null,
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error adding team:", error);
        toast({
          title: "Error",
          description: `Failed to add team: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Team added successfully:", data);
      
      // Update teams state
      setTeams(prevTeams => [...prevTeams, data]);
      
      toast({
        title: "Success",
        description: `Team ${teamName} added successfully!`,
      });
      
      return data;
    } catch (error: any) {
      console.error("Error in addTeam:", error);
      return null;
    }
  };

  const updateFixtureResult = async (fixtureId: string, team1Score: number, team2Score: number) => {
    if (!isOrganizer) {
      toast({
        title: "Unauthorized",
        description: "Only the tournament organizer can update match results",
        variant: "destructive",
      });
      return false;
    }

    try {
      const fixture = fixtures.find(f => f.id === fixtureId);
      if (!fixture) {
        throw new Error("Fixture not found");
      }

      // Determine winner
      let winnerId = null;
      if (team1Score > team2Score) {
        winnerId = fixture.team_1_id;
      } else if (team2Score > team1Score) {
        winnerId = fixture.team_2_id;
      }
      // If scores are equal, winnerId remains null (draw)

      const { error } = await supabase
        .from('fixtures')
        .update({
          team_1_score: team1Score,
          team_2_score: team2Score,
          winner_id: winnerId,
          status: 'completed',
        })
        .eq('id', fixtureId);

      if (error) throw error;

      // Update local state
      setFixtures(prevFixtures => 
        prevFixtures.map(f => 
          f.id === fixtureId 
            ? { ...f, team_1_score: team1Score, team_2_score: team2Score, winner_id: winnerId, status: 'completed' }
            : f
        )
      );

      toast({
        title: "Success",
        description: "Match result updated successfully!",
      });

      return true;
    } catch (error: any) {
      console.error("Error updating fixture result:", error);
      toast({
        title: "Error",
        description: `Failed to update result: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  return { 
    tournament, 
    teams, 
    fixtures, 
    loading, 
    error, 
    isOrganizer, 
    currentUserId, 
    addTeam, 
    updateFixtureResult 
  };
};
