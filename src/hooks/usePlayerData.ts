
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
          console.log('No playerId provided, fetching current user...');
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('Error getting current user:', userError);
            setError('Authentication error: ' + userError.message);
            setPlayerData(null);
            setIsLoading(false);
            return;
          }
          
          if (!user) {
            console.log('No user authenticated and no playerId provided');
            setPlayerData(null);
            setIsLoading(false);
            return;
          }
          
          console.log('Current authenticated user:', user.id);
          targetUserId = user.id;
        }

        console.log('=== FETCHING PLAYER DATA ===');
        console.log('Target User ID:', targetUserId);
        console.log('Provided Player ID:', playerId);
        console.log('Current URL route:', window.location.pathname);

        // First, let's check if the user exists in auth.users (for debugging)
        console.log('Checking if user exists in authentication...');
        
        const { data, error: fetchError } = await supabase
          .from('player_details')
          .select('*')
          .eq('id', targetUserId);

        console.log('Database query result:', { data, error: fetchError });
        console.log('Number of records found:', data?.length || 0);

        if (fetchError) {
          console.error('Error fetching player data:', fetchError);
          console.error('Error details:', {
            code: fetchError.code,
            message: fetchError.message,
            details: fetchError.details,
            hint: fetchError.hint
          });
          setError(fetchError.message);
          setPlayerData(null);
          return;
        }

        // Check if we got any data
        if (!data || data.length === 0) {
          console.log('=== NO PLAYER PROFILE FOUND ===');
          console.log('This means the user exists but has not created a player profile yet');
          console.log('User should be redirected to create profile page');
          setPlayerData(null);
          return;
        }

        const playerRecord = data[0];
        console.log('=== PLAYER PROFILE FOUND ===');
        console.log('Raw player data from database:', playerRecord);

        // Parse career history from clubs string
        const careerHistory = parseCareerHistoryFromClubs(playerRecord.clubs);
        const playerDataWithCareer = {
          ...playerRecord,
          careerHistory
        };
        
        console.log('=== PROCESSED PLAYER DATA ===');
        console.log('Final player data with career history:', playerDataWithCareer);
        setPlayerData(playerDataWithCareer);

      } catch (error: any) {
        console.error('=== UNEXPECTED ERROR ===');
        console.error('Error in fetchPlayerData:', error);
        console.error('Error type:', typeof error);
        console.error('Error stack:', error?.stack);
        setError(error.message || 'An unexpected error occurred');
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
      const entries = clubsString.split('; ').map((entry, index) => {
        console.log(`Parsing entry ${index}:`, entry);
        const clubMatch = entry.match(/(.*?)\s\((.*?),\s(.*?)\s-\s(.*?)\)/);
        if (clubMatch && clubMatch.length >= 5) {
          const parsed = {
            club: clubMatch[1],
            position: clubMatch[2],
            startDate: clubMatch[3],
            endDate: clubMatch[4]
          };
          console.log(`Parsed entry ${index}:`, parsed);
          return parsed;
        }
        console.log(`Failed to parse entry ${index}:`, entry);
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
