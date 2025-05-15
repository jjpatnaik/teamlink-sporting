import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useParams } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

export type CareerEntry = {
  club: string;
  position: string;
  startDate: string;
  endDate: string | 'Present';
};

export type PlayerData = {
  id: string; 
  full_name: string;
  sport: string;
  position: string;
  clubs?: string;
  city?: string;
  postcode?: string;
  age?: string;
  height?: string;
  weight?: string;
  bio?: string;
  achievements: string;
  profile_picture_url: string | null;
  background_picture_url: string | null;
  facebook_id?: string;
  instagram_id?: string;
  whatsapp_id?: string;
  careerHistory?: CareerEntry[];
};

export type PlayerProfile = {
  id: string;
  name: string;
  sport: string;
  area: string;
  image: string;
};

export const usePlayerData = (fetchAll: boolean = false) => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [playerProfiles, setPlayerProfiles] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // Fetch all player profiles
  const fetchPlayerProfiles = async () => {
    try {
      setLoading(true);
      console.log("Fetching all player profiles...");
      
      const { data, error } = await supabase
        .from('player_details')
        .select('*');

      if (error) {
        console.error("Error fetching player profiles:", error);
        toast({
          title: "Error fetching profiles",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      if (data) {
        console.log(`Fetched ${data.length} player profiles`);
        
        // Transform the data to match the expected format
        const transformedData = data.map(player => ({
          id: player.id,
          name: player.full_name || "Unknown Name",
          sport: player.sport || "Unknown Sport",
          area: player.city || "Unknown Area",
          image: player.profile_picture_url || "https://via.placeholder.com/300x200?text=No+Image"
        }));
        
        setPlayerProfiles(transformedData);
        return transformedData;
      }
      return [];
    } catch (error) {
      console.error("Error in fetchPlayerProfiles:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single player data by ID
  const fetchSinglePlayer = async (playerId: string) => {
    try {
      console.log(`Fetching single player data for ID: ${playerId}`);
      
      const { data, error } = await supabase
        .from('player_details')
        .select('*')
        .eq('id', playerId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching player data:", error);
        throw error;
      }
      
      if (data) {
        console.log("Player data fetched successfully");
        setPlayerData(data);
        return data;
      } else {
        console.log("No player found with ID:", playerId);
        return null;
      }
    } catch (error) {
      console.error("Error in fetchSinglePlayer:", error);
      throw error;
    }
  };

  // Fetch current user's player data
  const fetchCurrentUserData = async () => {
    try {
      console.log("Fetching current user's player data");
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log("Current user found, fetching player details");
        
        const { data, error } = await supabase
          .from('player_details')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          console.log("Current user's player data found");
          setPlayerData(data);
          return data;
        } else {
          console.log("No player data found for current user");
          return null;
        }
      } else {
        console.log("No authenticated user found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching current user data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // If fetchAll is true, fetch all player profiles
        if (fetchAll) {
          await fetchPlayerProfiles();
        }
        
        // If ID is provided in the URL, fetch that player's data
        if (id) {
          await fetchSinglePlayer(id);
        } else if (!fetchAll) {
          // Otherwise try to get current user's data
          await fetchCurrentUserData();
        }
      } catch (error) {
        console.error("Error in usePlayerData hook:", error);
        toast({
          title: "Error loading player data",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, fetchAll]);

  return { 
    playerData, 
    playerProfiles, 
    loading,
    fetchPlayerProfiles 
  };
};
