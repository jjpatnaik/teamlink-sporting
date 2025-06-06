
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

export const useConnections = () => {
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionType[]>([]);
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

        console.log('Raw pending requests:', pendingReqs);
        console.log('Raw sent connections:', sentConnections);
        console.log('Raw received connections:', receivedConnections);

        // Now we need to fetch user details for each connection
        const allConnectionsRaw = [
          ...(sentConnections || []),
          ...(receivedConnections || []),
          ...(pendingReqs || [])
        ];

        // Get unique user IDs we need to fetch details for
        const userIds = new Set<string>();
        
        (sentConnections || []).forEach(conn => userIds.add(conn.receiver_id));
        (receivedConnections || []).forEach(conn => userIds.add(conn.requester_id));
        (pendingReqs || []).forEach(req => userIds.add(req.requester_id));

        console.log('User IDs to fetch details for:', Array.from(userIds));

        // Fetch user details from player_details table
        const { data: userDetails, error: userDetailsError } = await supabase
          .from('player_details')
          .select('id, full_name, sport, position, profile_picture_url')
          .in('id', Array.from(userIds));

        if (userDetailsError) {
          console.error('Error fetching user details:', userDetailsError);
        }

        console.log('Fetched user details:', userDetails);

        // Create a map of user details
        const userDetailsMap = new Map();
        (userDetails || []).forEach(user => {
          userDetailsMap.set(user.id, {
            full_name: user.full_name || 'Unknown User',
            sport: user.sport || 'Unknown Sport',
            position: user.position || 'Unknown Position',
            profile_picture_url: user.profile_picture_url
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

        const processedSentConnections = processConnections(sentConnections || [], true);
        const processedReceivedConnections = processConnections(receivedConnections || [], false);
        const processedPendingRequests = processConnections(pendingReqs || [], false);

        console.log('Processed pending requests:', processedPendingRequests);
        console.log('Processed accepted connections:', [...processedSentConnections, ...processedReceivedConnections]);

        // Combine accepted connections
        const allConnections = [...processedSentConnections, ...processedReceivedConnections];
        setConnections(allConnections);
        setPendingRequests(processedPendingRequests);
        
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

  return { 
    connections, 
    pendingRequests, 
    loading, 
    error,
    handleConnectionResponse
  };
};
