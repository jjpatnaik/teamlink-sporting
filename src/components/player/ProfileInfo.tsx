
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, UserPlus, Check, X } from 'lucide-react';
import { PlayerData } from '@/hooks/usePlayerData';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ProfileInfoProps = {
  playerData: PlayerData | null;
  isCurrentUser?: boolean;
};

const ProfileInfo = ({ playerData, isCurrentUser = false }: ProfileInfoProps) => {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine location display
  const locationDisplay = playerData?.city 
    ? `${playerData.city}${playerData.postcode ? `, ${playerData.postcode}` : ''}`
    : 'Location not specified';

  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (!playerData || isCurrentUser) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Check if there's already a connection request between users
        const { data, error } = await supabase
          .from('connections')
          .select('status')
          .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .or(`requester_id.eq.${playerData.id},receiver_id.eq.${playerData.id}`)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setConnectionStatus(data.status);
        }
      } catch (error) {
        console.error('Error checking connection status:', error);
      }
    };
    
    checkConnectionStatus();
  }, [playerData, isCurrentUser]);

  const handleConnect = async () => {
    if (!playerData) return;
    
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to connect with other players");
        return;
      }
      
      // Prevent connecting to yourself
      if (user.id === playerData.id) {
        toast.error("You cannot connect with yourself");
        return;
      }
      
      // Create connection request
      const { error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          receiver_id: playerData.id,
          status: 'pending'
        });
        
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error("You already have a connection with this player");
        } else {
          throw error;
        }
        return;
      }
      
      setConnectionStatus('pending');
      toast.success("Connection request sent!");
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      toast.error(error.message || "Failed to send connection request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespondToRequest = async (response: 'accepted' | 'rejected') => {
    if (!playerData) return;
    
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to respond to connection requests");
        return;
      }
      
      // Update connection request
      const { error } = await supabase
        .from('connections')
        .update({ status: response })
        .match({ 
          requester_id: playerData.id,
          receiver_id: user.id,
          status: 'pending'
        });
        
      if (error) throw error;
      
      setConnectionStatus(response);
      toast.success(`Connection request ${response}`);
    } catch (error: any) {
      console.error(`Error ${response} connection request:`, error);
      toast.error(error.message || `Failed to ${response} connection request`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderConnectionButton = () => {
    if (isCurrentUser) return null;
    
    switch (connectionStatus) {
      case 'pending':
        return (
          <Button 
            variant="outline"
            className="border-sport-purple text-sport-purple hover:bg-sport-light-purple"
            disabled={true}
          >
            Request Pending
          </Button>
        );
      case 'accepted':
        return (
          <Button 
            variant="outline"
            className="border-sport-purple text-sport-purple hover:bg-sport-light-purple"
            disabled={true}
          >
            <Check className="mr-2 h-4 w-4" />
            Connected
          </Button>
        );
      case 'rejected':
        return (
          <Button
            variant="outline"
            className="border-sport-purple text-sport-purple hover:bg-sport-light-purple"
            disabled={true}
          >
            Connection Declined
          </Button>
        );
      default:
        return (
          <Button 
            className="btn-primary"
            onClick={handleConnect}
            disabled={isLoading}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Connect
          </Button>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between">
      <div>
        <h1 className="text-3xl font-bold">{playerData?.full_name}</h1>
        <p className="text-xl text-sport-purple">{playerData?.sport} Player</p>
        <div className="flex items-center mt-2 text-sport-gray">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{locationDisplay}</span>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex space-x-2">
        {!isCurrentUser ? (
          <>
            {renderConnectionButton()}
            <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple">
              Message
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileInfo;
