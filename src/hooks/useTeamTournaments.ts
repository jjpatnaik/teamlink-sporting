import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TeamTournament {
  id: string;
  tournament_id: string;
  team_name: string;
  status: string;
  approval_status: string;
  created_at: string;
  tournament: {
    id: string;
    name: string;
    sport: string;
    location: string;
    start_date: string;
    end_date: string;
    tournament_status: string;
    description: string;
  };
}

export const useTeamTournaments = (teamId: string | undefined) => {
  const [tournaments, setTournaments] = useState<TeamTournament[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTeamTournaments = async () => {
    if (!teamId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournament_teams')
        .select(`
          id,
          tournament_id,
          team_name,
          status,
          approval_status,
          created_at,
          tournaments!inner (
            id,
            name,
            sport,
            location,
            start_date,
            end_date,
            tournament_status,
            description
          )
        `)
        .eq('team_name', teamId) // This might need to be adjusted based on your data structure
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching team tournaments:', error);
        return;
      }

      const formattedTournaments: TeamTournament[] = (data || []).map(item => ({
        ...item,
        tournament: item.tournaments
      }));
      
      setTournaments(formattedTournaments);
    } catch (error) {
      console.error('Error in fetchTeamTournaments:', error);
      toast.error('Failed to load team tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchTeamTournaments();
    }
  }, [teamId]);

  return {
    tournaments,
    loading,
    refreshTournaments: fetchTeamTournaments
  };
};