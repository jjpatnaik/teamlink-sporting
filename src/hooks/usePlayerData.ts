
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useParams } from 'react-router-dom';

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

export const usePlayerData = () => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // If ID is provided in the URL, fetch that player's data
        if (id) {
          const { data, error } = await supabase
            .from('player_details')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
          if (error) throw error;
          setPlayerData(data);
        } else {
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
    
    fetchPlayerData();
  }, [id]);

  return { playerData, loading };
};
