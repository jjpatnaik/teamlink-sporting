
import { useState, useCallback } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Tournament {
  id: string;
  name: string;
  description: string;
  sport: string;
  teams_allowed: number;
  format: string;
  rules: string;
  location: string;
  start_date: string;
  end_date: string;
  organizer_id: string;
  registration_deadline?: string;
}

export interface Team {
  id: string;
  team_name: string;
  contact_email: string;
  status: string;
  player_names?: string[];
}

export const useTournamentData = (tournamentId: string | undefined) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true); // Set loading to true when fetching
      
      if (!tournamentId) {
        toast.error("No tournament ID provided");
        setLoading(false);
        return;
      }

      // Fetch tournament details
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();
        
      if (tournamentError) {
        console.error("Error fetching tournament:", tournamentError);
        throw tournamentError;
      }
      
      if (!tournamentData) {
        console.error("Tournament not found with ID:", tournamentId);
        setLoading(false);
        return;
      }
      
      setTournament(tournamentData);
      
      // Test network connectivity with raw fetch to see if there are any CORS or network issues
      try {
        const testResponse = await fetch(`${supabaseUrl}/rest/v1/tournaments?select=count`, {
          method: 'HEAD',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        });
        console.log("Network test status:", testResponse.status, testResponse.statusText);
      } catch (networkError) {
        console.error("Raw fetch network error:", networkError);
      }
      
      // Fetch teams for this tournament
      const { data: teamsData, error: teamsError } = await supabase
        .from('tournament_teams')
        .select('*')
        .eq('tournament_id', tournamentId);
        
      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        throw teamsError;
      }
      
      setTeams(teamsData || []);
    } catch (error: any) {
      console.error("Error in fetchData:", error.message);
      toast.error("Failed to load tournament data");
    } finally {
      setLoading(false); // Set loading to false when done
    }
  }, [tournamentId]);
  
  const addTeam = async (teamName: string, contactEmail: string | null = null) => {
    try {
      if (!tournamentId || !teamName.trim()) {
        toast.error("Missing required information");
        return null;
      }
      
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        toast.error("You must be logged in to add teams");
        return null;
      }
      
      const { data, error } = await supabase
        .from('tournament_teams')
        .insert({
          tournament_id: tournamentId,
          team_name: teamName.trim(),
          contact_email: contactEmail?.trim() || null,
          status: 'registered'
        })
        .select();
      
      if (error) {
        console.error("Error adding team:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        setTeams(prevTeams => [...prevTeams, ...data]);
        return data[0];
      }
      
      return null;
    } catch (error: any) {
      console.error("Error adding team:", error.message);
      toast.error("Failed to add team: " + error.message);
      return null;
    }
  };

  return { tournament, teams, loading, fetchData, addTeam };
};
