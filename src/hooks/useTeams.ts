
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Team {
  id: string;
  name: string;
  sport: string;
  location: string;
  description: string;
  created_by: string;
  created_at: string;
  member_count?: number;
}

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTeams = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_members(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const teamsWithCount = data?.map(team => ({
        ...team,
        member_count: team.team_members?.[0]?.count || 0
      })) || [];

      setTeams(teamsWithCount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [user]);

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams
  };
};
