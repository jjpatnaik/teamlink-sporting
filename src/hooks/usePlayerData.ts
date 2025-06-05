
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

        let targetUserId = playerId;
        
        // If no playerId provided, get current user's data
        if (!playerId) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.log('No user authenticated and no playerId provided');
            setPlayerData(null);
            setIsLoading(false);
            return;
          }
          targetUserId = user.id;
        }

        console.log('Fetching player data for ID:', targetUserId);

        const { data, error: fetchError } = await supabase
          .from('player_details')
          .select('*')
          .eq('id', targetUserId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching player data:', fetchError);
          setError(fetchError.message);
          setPlayerData(null);
          return;
        }

        console.log('Raw player data from database:', data);

        if (data) {
          // Parse career history from clubs string
          const careerHistory = parseCareerHistoryFromClubs(data.clubs);
          const playerDataWithCareer = {
            ...data,
            careerHistory
          };
          console.log('Processed player data with career history:', playerDataWithCareer);
          setPlayerData(playerDataWithCareer);
        } else {
          console.log('No player data found for ID:', targetUserId);
          setPlayerData(null);
        }
      } catch (error: any) {
        console.error('Error in fetchPlayerData:', error);
        setError(error.message);
        setPlayerData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  // Helper function to parse career history from clubs string
  const parseCareerHistoryFromClubs = (clubsString?: string): CareerEntry[] => {
    if (!clubsString) {
      console.log('No clubs string to parse');
      return [];
    }
    
    try {
      console.log('Parsing clubs string:', clubsString);
      const entries = clubsString.split('; ').map(entry => {
        const clubMatch = entry.match(/(.*?)\s\((.*?),\s(.*?)\s-\s(.*?)\)/);
        if (clubMatch && clubMatch.length >= 5) {
          const parsed = {
            club: clubMatch[1],
            position: clubMatch[2],
            startDate: clubMatch[3],
            endDate: clubMatch[4]
          };
          console.log('Parsed career entry:', parsed);
          return parsed;
        }
        console.log('Failed to parse entry:', entry);
        return null;
      }).filter(Boolean) as CareerEntry[];
      
      console.log('All parsed career entries:', entries);
      return entries;
    } catch (error) {
      console.error("Error parsing career history:", error);
      return [];
    }
  };

  return { playerData, isLoading, error, refetch: () => window.location.reload() };
};
