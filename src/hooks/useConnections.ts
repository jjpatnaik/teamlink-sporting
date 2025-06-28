
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export type ConnectionType = {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  user: {
    full_name: string;
    sport: string;
    position: string;
    profile_picture_url: string | null;
  };
};

export type TeamJoinRequestType = {
  id: string;
  team_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  message?: string;
  team: {
    name: string;
    sport?: string;
  };
  user: {
    full_name: string;
    sport: string;
    position: string;
    profile_picture_url: string | null;
  };
};

export const useConnections = () => {
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionType[]>([]);
  const [teamJoinRequests, setTeamJoinRequests] = useState<TeamJoinRequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError("You must be logged in to view connections");
          setLoading(false);
          return;
        }

        console.log('Fetching connections for user:', user.id);

        // Fetch accepted connections where the user is the requester
        const { data: sentConnections, error: sentError } = await supabase
          .from('connections')
          .select('*')
          .eq('requester_id', user.id)
          .eq('status', 'accepted');

        if (sentError) {
          console.error('Error fetching sent connections:', sentError);
        }

        // Fetch accepted connections where the user is the receiver
        const { data: receivedConnections, error: receivedError } = await supabase
          .from('connections')
          .select('*')
          .eq('receiver_id', user.id)
          .eq('status', 'accepted');

        if (receivedError) {
          console.error('Error fetching received connections:', receivedError);
        }

        // Fetch pending connection requests (where current user is the receiver)
        const { data: pendingReqs, error: pendingError } = await supabase
          .from('connections')
          .select('*')
          .eq('receiver_id', user.id)
          .eq('status', 'pending');

        if (pendingError) {
          console.error('Error fetching pending requests:', pendingError);
        }

        // First, get the team IDs where the current user is owner or captain
        const { data: teamMemberships, error: teamMembershipError } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id)
          .in('role', ['owner', 'captain']);

        if (teamMembershipError) {
          console.error('Error fetching team memberships:', teamMembershipError);
        }

        const teamIds = teamMemberships?.map(tm => tm.team_id) || [];

        // Fetch team join requests for teams owned by the current user
        let teamJoinReqs: any[] = [];
        if (teamIds.length > 0) {
          const { data: requests, error: teamJoinError } = await supabase
            .from('team_join_requests')
            .select(`
              id,
              team_id,
              user_id,
              status,
              requested_at,
              message,
              teams!team_join_requests_team_id_fkey (
                name,
                sport
              )
            `)
            .eq('status', 'pending')
            .in('team_id', teamIds);

          if (teamJoinError) {
            console.error('Error fetching team join requests:', teamJoinError);
          } else {
            teamJoinReqs = requests || [];
          }
        }

        console.log('Raw pending requests:', pendingReqs);
        console.log('Raw sent connections:', sentConnections);
        console.log('Raw received connections:', receivedConnections);
        console.log('Raw team join requests:', teamJoinReqs);

        // Get unique user IDs we need to fetch details for
        const userIds = new Set<string>();
        
        (sentConnections || []).forEach(conn => userIds.add(conn.receiver_id));
        (receivedConnections || []).forEach(conn => userIds.add(conn.requester_id));
        (pendingReqs || []).forEach(req => userIds.add(req.requester_id));
        (teamJoinReqs || []).forEach(req => userIds.add(req.user_id));

        console.log('User IDs to fetch details for:', Array.from(userIds));

        // Fetch user details from the new unified profile system
        const { data: userProfiles, error: userProfilesError } = await supabase
          .from('profiles')
          .select(`
            user_id,
            display_name,
            profile_picture_url,
            player_profiles (
              sport,
              position
            )
          `)
          .in('user_id', Array.from(userIds));

        if (userProfilesError) {
          console.error('Error fetching user profiles:', userProfilesError);
        }

        console.log('Fetched user profiles:', userProfiles);

        // Create a map of user details
        const userDetailsMap = new Map();
        (userProfiles || []).forEach(profile => {
          const playerProfile = profile.player_profiles;
          userDetailsMap.set(profile.user_id, {
            full_name: profile.display_name || 'Unknown User',
            sport: playerProfile?.sport || 'Unknown Sport',
            position: playerProfile?.position || 'Unknown Position',
            profile_picture_url: profile.profile_picture_url
          });
        });

        // Process connections with user details
        const processConnections = (connections: any[], isRequester: boolean) => {
          return connections.map(conn => {
            const targetUserId = isRequester ? conn.receiver_id : conn.requester_id;
            const userDetail = userDetailsMap.get(targetUserId);
            
            return {
              ...conn,
              status: conn.status as 'pending' | 'accepted' | 'rejected',
              user: userDetail || {
                full_name: 'Unknown User',
                sport: 'Unknown Sport',
                position: 'Unknown Position',
                profile_picture_url: null
              }
            };
          });
        };

        // Process team join requests
        const processedTeamJoinRequests: TeamJoinRequestType[] = (teamJoinReqs || []).map(req => ({
          id: req.id,
          team_id: req.team_id,
          user_id: req.user_id,
          status: req.status as 'pending' | 'approved' | 'rejected',
          requested_at: req.requested_at,
          message: req.message,
          team: {
            name: req.teams?.name || 'Unknown Team',
            sport: req.teams?.sport
          },
          user: userDetailsMap.get(req.user_id) || {
            full_name: 'Unknown User',
            sport: 'Unknown Sport',
            position: 'Unknown Position',
            profile_picture_url: null
          }
        }));

        const processedSentConnections = processConnections(sentConnections || [], true);
        const processedReceivedConnections = processConnections(receivedConnections || [], false);
        const processedPendingRequests = processConnections(pendingReqs || [], false);

        console.log('Processed pending requests:', processedPendingRequests);
        console.log('Processed team join requests:', processedTeamJoinRequests);
        console.log('Processed accepted connections:', [...processedSentConnections, ...processedReceivedConnections]);

        // Combine accepted connections
        const allConnections = [...processedSentConnections, ...processedReceivedConnections];
        setConnections(allConnections);
        setPendingRequests(processedPendingRequests);
        setTeamJoinRequests(processedTeamJoinRequests);
        
      } catch (error: any) {
        console.error("Error fetching connections:", error);
        setError(error.message || "Failed to fetch connections");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handleConnectionResponse = async (connectionId: string, action: 'accepted' | 'rejected') => {
    try {
      console.log(`${action} connection:`, connectionId);
      
      const { error } = await supabase
        .from('connections')
        .update({ status: action })
        .eq('id', connectionId);

      if (error) throw error;

      // Update the local state
      setPendingRequests(prevRequests => 
        prevRequests.filter(request => request.id !== connectionId)
      );

      if (action === 'accepted') {
        // Move the connection from pending to accepted
        const acceptedRequest = pendingRequests.find(request => request.id === connectionId);
        if (acceptedRequest) {
          setConnections(prev => [...prev, {...acceptedRequest, status: 'accepted'}]);
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error(`Error ${action} connection:`, error);
      return { success: false, error: error.message };
    }
  };

  const handleTeamJoinRequestResponse = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      console.log(`${action} team join request:`, requestId);
      
      const { error } = await supabase
        .from('team_join_requests')
        .update({ 
          status: action,
          processed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // If approved, add user to team_members
      if (action === 'approved') {
        const request = teamJoinRequests.find(req => req.id === requestId);
        if (request) {
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
      }

      // Update the local state
      setTeamJoinRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );

      return { success: true };
    } catch (error: any) {
      console.error(`Error ${action} team join request:`, error);
      return { success: false, error: error.message };
    }
  };

  return { 
    connections, 
    pendingRequests, 
    teamJoinRequests,
    loading, 
    error,
    handleConnectionResponse,
    handleTeamJoinRequestResponse
  };
};
