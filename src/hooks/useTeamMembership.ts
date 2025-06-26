import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'captain' | 'admin' | 'member';
  status: 'pending' | 'accepted' | 'rejected';
  joined_at: string;
  user_profile?: {
    display_name: string;
    profile_picture_url?: string;
  };
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  processed_at?: string;
  sender_profile?: {
    display_name: string;
  };
  team?: {
    name: string;
  };
}

export const useTeamMembership = (teamId?: string) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMembers = async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      
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

      const membersWithProfiles = teamMembersData.map(member => {
        const profile = profilesData.find(p => p.user_id === member.user_id);
        
        return {
          id: member.id,
          team_id: member.team_id || '',
          user_id: member.user_id || '',
          role: member.role as 'owner' | 'captain' | 'admin' | 'member',
          status: 'accepted' as const,
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

  const fetchInvitations = async () => {
    if (!user) return;

    try {
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (invitationsError) throw invitationsError;

      if (!invitationsData || invitationsData.length === 0) {
        setInvitations([]);
        return;
      }

      // Fetch sender profiles
      const senderIds = invitationsData.map(inv => inv.sender_id).filter(Boolean);
      let senderProfiles: any[] = [];
      
      if (senderIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', senderIds);

        if (profilesError) {
          console.error('Error fetching sender profiles:', profilesError);
        } else {
          senderProfiles = profiles || [];
        }
      }

      // Fetch team names
      const teamIds = invitationsData.map(inv => inv.team_id).filter(Boolean);
      let teamsData: any[] = [];
      
      if (teamIds.length > 0) {
        const { data: teams, error: teamsError } = await supabase
          .from('teams')
          .select('id, name')
          .in('id', teamIds);

        if (teamsError) {
          console.error('Error fetching teams:', teamsError);
        } else {
          teamsData = teams || [];
        }
      }

      const formattedInvitations = invitationsData.map(inv => {
        const senderProfile = senderProfiles.find(p => p.user_id === inv.sender_id);
        const team = teamsData.find(t => t.id === inv.team_id);

        return {
          id: inv.id,
          team_id: inv.team_id,
          sender_id: inv.sender_id,
          receiver_id: inv.receiver_id,
          status: inv.status as 'pending' | 'accepted' | 'rejected',
          message: inv.message,
          created_at: inv.created_at,
          processed_at: inv.processed_at,
          sender_profile: senderProfile ? {
            display_name: senderProfile.display_name || 'Unknown User'
          } : {
            display_name: 'Unknown User'
          },
          team: team ? {
            name: team.name
          } : {
            name: 'Unknown Team'
          }
        };
      });

      setInvitations(formattedInvitations);
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
    }
  };

  const sendInvitation = async (receiverEmail: string, message?: string) => {
    if (!user || !teamId) return false;

    try {
      // First find the user by email/name
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('user_id')
        .ilike('display_name', `%${receiverEmail}%`)
        .single();

      if (userError || !userData) {
        toast.error('User not found');
        return false;
      }

      const { error } = await supabase
        .from('team_invitations')
        .insert({
          team_id: teamId,
          sender_id: user.id,
          receiver_id: userData.user_id,
          message: message || null
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Invitation already sent to this user');
        } else {
          throw error;
        }
        return false;
      }

      toast.success('Invitation sent successfully!');
      return true;
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
      return false;
    }
  };

  const respondToInvitation = async (invitationId: string, response: 'accepted' | 'rejected') => {
    if (!user) return false;

    try {
      const { data: invitation, error: fetchError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('team_invitations')
        .update({
          status: response,
          processed_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      if (response === 'accepted') {
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_id: invitation.team_id,
            user_id: user.id,
            role: 'member'
          });

        if (memberError) throw memberError;
      }

      toast.success(`Invitation ${response} successfully!`);
      await fetchInvitations();
      return true;
    } catch (error: any) {
      console.error('Error responding to invitation:', error);
      toast.error(`Failed to ${response} invitation`);
      return false;
    }
  };

  const updateMemberRole = async (memberId: string, newRole: 'captain' | 'admin' | 'member') => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Member role updated successfully');
      await fetchMembers();
      return true;
    } catch (error: any) {
      console.error('Error updating member role:', error);
      toast.error('Failed to update member role');
      return false;
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Member removed successfully');
      await fetchMembers();
      return true;
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
      return false;
    }
  };

  const transferOwnership = async (newOwnerId: string) => {
    if (!user || !teamId) return false;

    try {
      // Update current owner to admin
      const { error: currentOwnerError } = await supabase
        .from('team_members')
        .update({ role: 'admin' })
        .eq('team_id', teamId)
        .eq('user_id', user.id);

      if (currentOwnerError) throw currentOwnerError;

      // Update new owner
      const { error: newOwnerError } = await supabase
        .from('team_members')
        .update({ role: 'owner' })
        .eq('team_id', teamId)
        .eq('user_id', newOwnerId);

      if (newOwnerError) throw newOwnerError;

      // Update team owner_id
      const { error: teamError } = await supabase
        .from('teams')
        .update({ owner_id: newOwnerId })
        .eq('id', teamId);

      if (teamError) throw teamError;

      toast.success('Ownership transferred successfully');
      await fetchMembers();
      return true;
    } catch (error: any) {
      console.error('Error transferring ownership:', error);
      toast.error('Failed to transfer ownership');
      return false;
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  return {
    members,
    invitations,
    loading,
    sendInvitation,
    respondToInvitation,
    updateMemberRole,
    removeMember,
    transferOwnership,
    refetch: fetchMembers,
    refetchInvitations: fetchInvitations
  };
};
