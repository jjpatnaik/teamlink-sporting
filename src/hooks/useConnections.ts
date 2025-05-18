
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

        // Fetch accepted connections where the user is the requester
        const { data: sentConnections, error: sentError } = await supabase
          .from('connections')
          .select(`
            id,
            requester_id,
            receiver_id,
            status,
            created_at,
            user:player_details!receiver_id(
              full_name,
              sport,
              position,
              profile_picture_url
            )
          `)
          .eq('requester_id', user.id)
          .eq('status', 'accepted');

        if (sentError) throw sentError;

        // Fetch accepted connections where the user is the receiver
        const { data: receivedConnections, error: receivedError } = await supabase
          .from('connections')
          .select(`
            id,
            requester_id,
            receiver_id,
            status,
            created_at,
            user:player_details!requester_id(
              full_name,
              sport,
              position,
              profile_picture_url
            )
          `)
          .eq('receiver_id', user.id)
          .eq('status', 'accepted');

        if (receivedError) throw receivedError;

        // Fetch pending connection requests
        const { data: pendingReqs, error: pendingError } = await supabase
          .from('connections')
          .select(`
            id,
            requester_id,
            receiver_id,
            status,
            created_at,
            user:player_details!requester_id(
              full_name,
              sport,
              position,
              profile_picture_url
            )
          `)
          .eq('receiver_id', user.id)
          .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Manually validate and cast the data
        const typedSentConnections = sentConnections?.map(conn => ({
          ...conn,
          status: conn.status as 'pending' | 'accepted' | 'rejected'
        })) || [];
        
        const typedReceivedConnections = receivedConnections?.map(conn => ({
          ...conn,
          status: conn.status as 'pending' | 'accepted' | 'rejected'
        })) || [];
        
        const typedPendingRequests = pendingReqs?.map(req => ({
          ...req,
          status: req.status as 'pending' | 'accepted' | 'rejected'
        })) || [];

        // Combine accepted connections
        const allConnections = [...typedSentConnections, ...typedReceivedConnections];
        setConnections(allConnections);
        setPendingRequests(typedPendingRequests);
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
