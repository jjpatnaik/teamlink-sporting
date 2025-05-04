
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
  id: string; // Added id property
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
        console.log("Fetched player profiles:", data.length);
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
          const { data, error } = await supabase
            .from('player_details')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
          if (error) throw error;
          setPlayerData(data);
        } else if (!fetchAll) {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Fetch player details for the current user
            const { data, error } = await supabase
              .from('player_details')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
              
            if (error) throw error;
            setPlayerData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, fetchAll]);

  return { playerData, playerProfiles, loading, fetchPlayerProfiles };
};
