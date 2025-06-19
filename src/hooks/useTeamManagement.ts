import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Team {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  userRole?: string;
  memberCount?: number;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  profile?: {
    display_name: string;
    profile_type: string;
  };
}

export interface TeamJoinRequest {
  id: string;
  team_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
  profile?: {
    display_name: string;
    profile_type: string;
  };
}

export const useTeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<{ [teamId: string]: TeamMember[] }>({});
  const [joinRequests, setJoinRequests] = useState<TeamJoinRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTeams = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          team_id,
          role,
          teams (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const teams = data?.map(item => ({
        ...item.teams,
        userRole: item.role
      })) || [];
      
      setUserTeams(teams);
    } catch (error: any) {
      console.error('Error fetching user teams:', error);
      toast.error('Failed to fetch your teams');
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      // First get team members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('joined_at', { ascending: true });

      if (membersError) throw membersError;

      // Then get profile information for each member
      const membersWithProfiles = await Promise.all(
        (membersData || []).map(async (member) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name, profile_type')
            .eq('user_id', member.user_id)
            .single();

          return {
            ...member,
            role: member.role as 'owner' | 'admin' | 'member',
            profile: profileData || { display_name: 'Unknown User', profile_type: 'User' }
          };
        })
      );

      setTeamMembers(prev => ({
        ...prev,
        [teamId]: membersWithProfiles
      }));
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to fetch team members');
    }
  };

  const fetchJoinRequests = async (teamId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('team_join_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get profile information for each request
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name, profile_type')
            .eq('user_id', request.user_id)
            .single();

          return {
            ...request,
            status: request.status as 'pending' | 'approved' | 'rejected',
            profile: profileData || { display_name: 'Unknown User', profile_type: 'User' }
          };
        })
      );

      setJoinRequests(requestsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching join requests:', error);
      toast.error('Failed to fetch join requests');
    }
  };

  const createTeam = async (teamData: { name: string; description?: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamData.name,
          description: teamData.description,
          owner_id: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add owner as team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      toast.success('Team created successfully!');
      await fetchTeams();
      await fetchUserTeams();
      return { success: true, team };
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast.error(error.message || 'Failed to create team');
      return { success: false, error: error.message };
    }
  };

  const joinTeam = async (teamId: string, message?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('team_join_requests')
        .insert({
          team_id: teamId,
          user_id: user.id,
          message: message || null
        });

      if (error) throw error;

      toast.success('Join request sent successfully!');
      return { success: true };
    } catch (error: any) {
      console.error('Error sending join request:', error);
      toast.error(error.message || 'Failed to send join request');
      return { success: false, error: error.message };
    }
  };

  const processJoinRequest = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the request details
      const { data: request, error: requestError } = await supabase
        .from('team_join_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Update request status
      const { error: updateError } = await supabase
        .from('team_join_requests')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: user.id
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, add user as team member
      if (action === 'approve') {
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_id: request.team_id,
            user_id: request.user_id,
            role: 'member'
          });

        if (memberError) throw memberError;
      }

      toast.success(`Join request ${action}d successfully!`);
      await fetchJoinRequests();
      return { success: true };
    } catch (error: any) {
      console.error('Error processing join request:', error);
      toast.error(error.message || 'Failed to process join request');
      return { success: false, error: error.message };
    }
  };

  const updateMemberRole = async (teamId: string, userId: string, newRole: 'admin' | 'member') => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Member role updated successfully!');
      await fetchTeamMembers(teamId);
      return { success: true };
    } catch (error: any) {
      console.error('Error updating member role:', error);
      toast.error(error.message || 'Failed to update member role');
      return { success: false, error: error.message };
    }
  };

  const removeMember = async (teamId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Member removed successfully!');
      await fetchTeamMembers(teamId);
      return { success: true };
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error(error.message || 'Failed to remove member');
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchUserTeams();
  }, []);

  return {
    teams,
    userTeams,
    teamMembers,
    joinRequests,
    loading,
    createTeam,
    joinTeam,
    processJoinRequest,
    updateMemberRole,
    removeMember,
    fetchTeamMembers,
    fetchJoinRequests,
    refetch: () => {
      fetchTeams();
      fetchUserTeams();
    }
  };
};
