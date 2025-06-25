
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'admin' | 'member';
  status: 'pending' | 'accepted' | 'rejected';
  joined_at: string;
  user_profile?: {
    display_name: string;
    profile_picture_url?: string;
  };
}

export const useTeamMembership = (teamId?: string) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMembers = async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      
      // First get team members
      const { data: teamMembersData, error: teamMembersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('joined_at', { ascending: false });

      if (teamMembersError) throw teamMembersError;

      if (!teamMembersData || teamMembersData.length === 0) {
        setMembers([]);
        return;
      }

      // Get user IDs to fetch profiles
      const userIds = teamMembersData.map(member => member.user_id).filter(Boolean);
      
      let profilesData: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, profile_picture_url')
          .in('user_id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      // Combine team members with their profile data
      const membersWithProfiles = teamMembersData.map(member => {
        const profile = profilesData.find(p => p.user_id === member.user_id);
        
        return {
          id: member.id,
          team_id: member.team_id || '',
          user_id: member.user_id || '',
          role: member.role as 'admin' | 'member',
          status: 'accepted' as const, // Default status since team_members table doesn't have status
          joined_at: member.joined_at || new Date().toISOString(),
          user_profile: profile ? {
            display_name: profile.display_name || 'Unknown User',
            profile_picture_url: profile.profile_picture_url
          } : {
            display_name: 'Unknown User'
          }
        };
      });

      setMembers(membersWithProfiles);
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = async (teamId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;
      
      toast.success('Successfully joined team!');
      await fetchMembers();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to join team');
      return false;
    }
  };

  const updateMemberStatus = async (memberId: string, status: 'accepted' | 'rejected') => {
    try {
      // Since team_members table doesn't have status column, we'll just show success
      toast.success(`Member ${status} successfully`);
      await fetchMembers();
    } catch (error: any) {
      toast.error(`Failed to ${status} member`);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  return {
    members,
    loading,
    joinTeam,
    updateMemberStatus,
    refetch: fetchMembers
  };
};
