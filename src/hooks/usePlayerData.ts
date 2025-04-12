
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export type PlayerData = {
  full_name: string;
  sport: string;
  position: string;
  clubs: string;
  achievements: string;
  profile_picture_url: string | null;
  background_picture_url: string | null;
  facebook_id?: string;
  instagram_id?: string;
  whatsapp_id?: string;
};

export const usePlayerData = () => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch player details
          const { data, error } = await supabase
            .from('player_details')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          setPlayerData(data);
        } else {
          // For demo, use sample data
          setPlayerData({
            full_name: "John Smith",
            sport: "Basketball",
            position: "Point Guard",
            clubs: "Chicago Breeze",
            achievements: "Regional League MVP (2022), All-Star Selection (2021, 2022, 2023)",
            profile_picture_url: null,
            background_picture_url: null
          });
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, []);

  return { playerData, loading };
};
