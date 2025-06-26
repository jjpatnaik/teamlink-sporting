
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Team {
  id: string;
  name: string;
  sport: string;
  location: string;
  description: string;
  introduction?: string;
  established_year?: number;
  achievements?: string;
  created_by: string;
  created_at: string;
  member_count?: number;
  user_role?: string;
}

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      
      // Fetch all teams with member counts
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          *,
          team_members(count)
        `)
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      const formattedTeams = (teamsData || []).map(team => ({
        id: team.id,
        name: team.name,
        sport: team.sport || 'General',
        location: 'Not specified',
        description: team.description || '',
        introduction: team.introduction,
        established_year: team.established_year,
        achievements: team.achievements,
        created_by: team.owner_id || '',
        created_at: team.created_at,
        member_count: Array.isArray(team.team_members) ? team.team_members.length : (team.team_members?.[0]?.count || 0)
      }));

      setTeams(formattedTeams);
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTeams = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          role,
          teams (
            *,
            team_members(count)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedUserTeams = (data || []).map(item => ({
        id: item.teams.id,
        name: item.teams.name,
        sport: item.teams.sport || 'General',
        location: 'Not specified',
        description: item.teams.description || '',
        introduction: item.teams.introduction,
        established_year: item.teams.established_year,
        achievements: item.teams.achievements,
        created_by: item.teams.owner_id || '',
        created_at: item.teams.created_at,
        member_count: Array.isArray(item.teams.team_members) ? item.teams.team_members.length : (item.teams.team_members?.[0]?.count || 0),
        user_role: item.role
      }));

      setUserTeams(formattedUserTeams);
    } catch (err: any) {
      console.error('Error fetching user teams:', err);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchUserTeams();
  }, [user]);

  return {
    teams,
    userTeams,
    loading,
    error,
    refetch: () => {
      fetchTeams();
      fetchUserTeams();
    }
  };
};
