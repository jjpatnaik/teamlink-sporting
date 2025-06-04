
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CareerEntry {
  club: string;
  position: string;
  startDate: string;
  endDate: string;
}

export interface PlayerData {
  id: string;
  full_name: string;
  sport: string;
  position: string;
  city?: string;
  postcode?: string;
  age?: string;
  height?: string;
  weight?: string;
  bio?: string;
  clubs?: string;
  achievements?: string;
  facebook_id?: string;
  whatsapp_id?: string;
  instagram_id?: string;
  profile_picture_url?: string;
  background_picture_url?: string;
  careerHistory?: CareerEntry[];
}

export const usePlayerData = (playerId?: string) => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase.from('player_details').select('*');
        
        if (playerId) {
          query = query.eq('id', playerId);
        } else {
          // If no playerId provided, get current user's data
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            setPlayerData(null);
            return;
          }
          query = query.eq('id', user.id);
        }

        const { data, error: fetchError } = await query.maybeSingle();

        if (fetchError) {
          console.error('Error fetching player data:', fetchError);
          setError(fetchError.message);
          return;
        }

        if (data) {
          // Parse career history from clubs string
          const careerHistory = parseCareerHistoryFromClubs(data.clubs);
          setPlayerData({
            ...data,
            careerHistory
          });
        } else {
          setPlayerData(null);
        }
      } catch (error: any) {
        console.error('Error in fetchPlayerData:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  // Helper function to parse career history from clubs string
  const parseCareerHistoryFromClubs = (clubsString?: string): CareerEntry[] => {
    if (!clubsString) return [];
    
    try {
      const entries = clubsString.split('; ').map(entry => {
        const clubMatch = entry.match(/(.*?)\s\((.*?),\s(.*?)\s-\s(.*?)\)/);
        if (clubMatch && clubMatch.length >= 5) {
          return {
            club: clubMatch[1],
            position: clubMatch[2],
            startDate: clubMatch[3],
            endDate: clubMatch[4]
          };
        }
        return null;
      }).filter(Boolean) as CareerEntry[];
      
      return entries;
    } catch (error) {
      console.error("Error parsing career history:", error);
      return [];
    }
  };

  return { playerData, isLoading, error, refetch: () => window.location.reload() };
};
