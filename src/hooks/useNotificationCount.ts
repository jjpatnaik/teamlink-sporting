import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useNotificationCount = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setNotificationCount(0);
          setLoading(false);
          return;
        }

        let count = 0;

        // Count pending connection requests (where current user is the receiver)
        const { data: pendingConnections, error: connectionError } = await supabase
          .from('connections')
          .select('id')
          .eq('receiver_id', user.id)
          .eq('status', 'pending');

        if (!connectionError && pendingConnections) {
          count += pendingConnections.length;
        }

        // Get team IDs where the current user is owner or captain
        const { data: teamMemberships, error: teamMembershipError } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id)
          .in('role', ['owner', 'captain']);

        if (!teamMembershipError && teamMemberships) {
          const teamIds = teamMemberships.map(tm => tm.team_id);

          // Count pending team join requests for teams owned by the current user
          if (teamIds.length > 0) {
            const { data: teamJoinRequests, error: teamJoinError } = await supabase
              .from('team_join_requests')
              .select('id')
              .eq('status', 'pending')
              .in('team_id', teamIds);

            if (!teamJoinError && teamJoinRequests) {
              count += teamJoinRequests.length;
            }
          }
        }

        // Count pending team invitations where current user is the receiver
        const { data: teamInvitations, error: teamInvitesError } = await supabase
          .from('team_invitations')
          .select('id')
          .eq('receiver_id', user.id)
          .eq('status', 'pending');

        if (!teamInvitesError && teamInvitations) {
          count += teamInvitations.length;
        }

        setNotificationCount(count);
        
      } catch (error) {
        console.error("Error fetching notification count:", error);
        setNotificationCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationCount();
  }, []);

  return { notificationCount, loading };
};