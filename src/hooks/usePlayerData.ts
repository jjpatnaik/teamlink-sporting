import { useState, useEffect, useCallback } from 'react';
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

// Enhanced retry function with exponential backoff
const fetchWithRetry = async (fetchFunction: () => Promise<any>, retries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await fetchFunction();
      return result;
    } catch (error) {
      console.error(`Player data fetch attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      // If we still have retries left, wait before trying again
      if (attempt < retries - 1) {
        const backoffTime = delay * Math.pow(1.5, attempt); // Exponential backoff
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }
  
  throw lastError;
};

export const usePlayerData = (fetchAll: boolean = false) => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [playerProfiles, setPlayerProfiles] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const { id } = useParams();

  // Fetch all player profiles
  const fetchPlayerProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      console.log("Fetching all player profiles...");
      
      const fetchProfiles = async () => {
        // Check for user session to ensure we're authenticated when needed
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session check for player profiles:", session ? "Active" : "None");
        
        const { data, error } = await supabase
          .from('player_details')
          .select('*');

        if (error) {
          console.error("Error fetching player profiles:", error);
          throw error;
        }
        
        return data;
      };
      
      // Use retry logic for fetching profiles
      const data = await fetchWithRetry(fetchProfiles);
      
      if (data && data.length > 0) {
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
      
      console.log("No player profiles found");
      return [];
    } catch (error) {
      console.error("Error in fetchPlayerProfiles:", error);
      setConnectionError(true);
      // Show a non-blocking toast for the user
      toast({
        title: "Could not load player profiles",
        description: "Please try again later",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single player data by ID
  const fetchSinglePlayer = async (playerId: string) => {
    try {
      console.log(`Fetching single player data for ID: ${playerId}`);
      
      const fetchPlayer = async () => {
        const { data, error } = await supabase
          .from('player_details')
          .select('*')
          .eq('id', playerId)
          .maybeSingle();
            
        if (error) {
          console.error("Error fetching player data:", error);
          throw error;
        }
        
        return data;
      };
      
      const data = await fetchWithRetry(fetchPlayer);
      
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
      setConnectionError(true);
      toast({
        title: "Error fetching player data",
        description: "Unable to load player profile",
        variant: "destructive"
      });
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
        
        const fetchUserData = async () => {
          const { data, error } = await supabase
            .from('player_details')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
              
          if (error) throw error;
          return data;
        };
        
        const data = await fetchWithRetry(fetchUserData);
        
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
      setConnectionError(true);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setConnectionError(false);
        
        // If fetchAll is true, fetch all player profiles
        if (fetchAll) {
          await fetchPlayerProfiles();
        }
        
        // If ID is provided in the URL, fetch that player's data
        else if (id) {
          await fetchSinglePlayer(id);
        } else {
          // Otherwise try to get current user's data
          await fetchCurrentUserData();
        }
      } catch (error) {
        console.error("Error in usePlayerData hook:", error);
        setConnectionError(true);
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
  }, [id, fetchAll, fetchPlayerProfiles]);

  return { 
    playerData, 
    playerProfiles, 
    loading,
    connectionError,
    fetchPlayerProfiles 
  };
};
