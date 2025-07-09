
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
  isOwned: boolean;
  membershipRole?: string;
  isMember: boolean;
}

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      
      // Fetch all teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      console.log('useTeams: Raw teams data from database:', teamsData);

      // Fetch member counts for each team
      const teamIds = teamsData?.map(team => team.id) || [];
      let memberCounts: { [key: string]: number } = {};
      let userMemberships: { [key: string]: string } = {};

      if (teamIds.length > 0) {
        const { data: membersData, error: membersError } = await supabase
          .from('team_members')
          .select('team_id, user_id, role')
          .in('team_id', teamIds);

        if (membersError) {
          console.error('Error fetching member counts:', membersError);
        } else {
          // Count members for each team and track user memberships
          membersData?.forEach(member => {
            memberCounts[member.team_id] = (memberCounts[member.team_id] || 0) + 1;
            if (user && member.user_id === user.id) {
              userMemberships[member.team_id] = member.role;
            }
          });
        }
      }

      const formattedTeams = (teamsData || []).map(team => {
        const isOwned = user ? team.owner_id === user.id : false;
        const membershipRole = userMemberships[team.id];
        const isMember = !!membershipRole;

        return {
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
          member_count: memberCounts[team.id] || 0,
          user_role: membershipRole,
          isOwned,
          membershipRole,
          isMember
        };
      });

      console.log('useTeams: Formatted teams data:', formattedTeams);
      setTeams(formattedTeams);
    } catch (err: any) {
      console.error('Error fetching teams:', err);
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
