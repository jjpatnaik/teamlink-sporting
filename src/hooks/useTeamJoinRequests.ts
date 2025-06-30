import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface TeamJoinRequest {
  id: string;
  team_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
  user_profile?: {
    display_name: string;
    profile_type: string;
  };
  team?: {
    name: string;
  };
}

export const useTeamJoinRequests = (teamId?: string) => {
  const [requests, setRequests] = useState<TeamJoinRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchJoinRequests = async () => {
    if (!user || !teamId) return;

    try {
      setLoading(true);
      console.log('Fetching join requests for team:', teamId);

      // Fetch join requests for the team
      const { data: requestsData, error: requestsError } = await supabase
        .from('team_join_requests')
        .select('*')
        .eq('team_id', teamId)
        .order('requested_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching join requests:', requestsError);
        throw requestsError;
      }

      // Get user profiles for each request
      const requestsWithProfiles = await Promise.all(
        (requestsData || []).map(async (request) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name, profile_type')
            .eq('user_id', request.user_id)
            .single();

          const { data: teamData } = await supabase
            .from('teams')
            .select('name')
            .eq('id', request.team_id)
            .single();

          return {
            ...request,
            status: request.status as 'pending' | 'approved' | 'rejected',
            user_profile: profileData || { display_name: 'Unknown User', profile_type: 'User' },
            team: teamData || { name: 'Unknown Team' }
          } as TeamJoinRequest;
        })
      );

      console.log('Join requests loaded:', requestsWithProfiles);
      setRequests(requestsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching join requests:', error);
      toast.error('Failed to load join requests');
    } finally {
      setLoading(false);
    }
  };

  const createJoinRequest = async (teamId: string, message?: string) => {
    if (!user) {
      toast.error('You must be logged in to join a team');
      return false;
    }

    try {
      console.log('Creating join request for team:', teamId);

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast.error('You are already a member of this team');
        return false;
      }

      // Check if there's already a pending request
      const { data: existingRequest } = await supabase
        .from('team_join_requests')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single();

      if (existingRequest) {
        toast.error('You already have a pending request for this team');
        return false;
      }

      const { error } = await supabase
        .from('team_join_requests')
        .insert({
          team_id: teamId,
          user_id: user.id,
          message: message || null,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating join request:', error);
        throw error;
      }

      toast.success('Join request sent successfully!');
      await fetchJoinRequests();
      return true;
    } catch (error: any) {
      console.error('Error creating join request:', error);
      toast.error(error.message || 'Failed to send join request');
      return false;
    }
  };

  const processJoinRequest = async (requestId: string, action: 'approved' | 'rejected') => {
    if (!user) {
      toast.error('You must be logged in to process requests');
      return false;
    }

    try {
      console.log('Processing join request:', requestId, action);

      // Get the request details first
      const { data: request, error: requestError } = await supabase
        .from('team_join_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError || !request) {
        console.error('Error fetching request:', requestError);
        throw new Error('Request not found');
      }

      // Update the request status
      const { error: updateError } = await supabase
        .from('team_join_requests')
        .update({
          status: action,
          processed_at: new Date().toISOString(),
          processed_by: user.id
        })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error updating request:', updateError);
        throw updateError;
      }

      // If approved, add user as team member
      if (action === 'approved') {
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_id: request.team_id,
            user_id: request.user_id,
            role: 'member'
          });

        if (memberError) {
          console.error('Error adding team member:', memberError);
          throw memberError;
        }
      }

      toast.success(`Join request ${action} successfully!`);
      await fetchJoinRequests();
      return true;
    } catch (error: any) {
      console.error('Error processing join request:', error);
      toast.error(error.message || 'Failed to process join request');
      return false;
    }
  };

  useEffect(() => {
    if (teamId && user) {
      fetchJoinRequests();
    }
  }, [teamId, user]);

  return {
    requests,
    loading,
    createJoinRequest,
    processJoinRequest,
    refetch: fetchJoinRequests
  };
};
