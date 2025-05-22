
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useParams } from 'react-router-dom';

export type Team = {
  id: string;
  team_name: string;
  contact_email: string | null;
  status: string;
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
  teams_allowed: number;
  organizer_id: string;
};

export const useTournamentData = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
        
        if (id) {
          // Fetch tournament details
          const { data: tournamentData, error: tournamentError } = await supabase
            .from('tournaments')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
          if (tournamentError) throw tournamentError;
          
          if (tournamentData) {
            setTournament(tournamentData);
            setIsOrganizer(user?.id === tournamentData.organizer_id);
            
            // Fetch teams for this tournament
            const { data: teamsData, error: teamsError } = await supabase
              .from('tournament_teams')
              .select('*')
              .eq('tournament_id', id);
              
            if (teamsError) throw teamsError;
            setTeams(teamsData || []);
          }
        }
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTournamentData();
  }, [id]);

  const addTeam = async (teamName: string, contactEmail?: string) => {
    if (!tournament || !currentUserId) return null;
    
    try {
      const { data, error } = await supabase
        .from('tournament_teams')
        .insert({
          tournament_id: tournament.id,
          team_name: teamName,
          contact_email: contactEmail || null,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update teams state
      setTeams(prevTeams => [...prevTeams, data]);
      
      return data;
    } catch (error) {
      console.error("Error adding team:", error);
      return null;
    }
  };

  return { tournament, teams, loading, isOrganizer, currentUserId, addTeam };
};
