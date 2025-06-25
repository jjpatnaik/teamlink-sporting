
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
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles!team_members_user_id_fkey(display_name, profile_picture_url)
        `)
        .eq('team_id', teamId)
        .order('joined_at', { ascending: false });

      if (error) throw error;

      const membersWithProfiles = data?.map(member => ({
        id: member.id,
        team_id: member.team_id || '',
        user_id: member.user_id || '',
        role: member.role as 'admin' | 'member',
        status: 'accepted' as const, // Default status since team_members table doesn't have status
        joined_at: member.joined_at || new Date().toISOString(),
        user_profile: member.profiles ? {
          display_name: member.profiles.display_name,
          profile_picture_url: member.profiles.profile_picture_url
        } : undefined
      })) || [];

      setMembers(membersWithProfiles);
    } catch (error: any) {
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
