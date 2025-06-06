
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

        // First, let's check the current session for debugging
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Current session:', sessionData.session?.user?.id);
        
        // First, try to get data from the old player_details table
        console.log('Checking old player_details table...');
        const { data: oldPlayerData, error: oldFetchError } = await supabase
          .from('player_details')
          .select('*')
          .eq('id', targetUserId);

        console.log('Old player_details query result:', { data: oldPlayerData, error: oldFetchError });

        if (oldPlayerData && oldPlayerData.length > 0) {
          console.log('=== FOUND DATA IN OLD PLAYER_DETAILS TABLE ===');
          const playerRecord = oldPlayerData[0];
          const careerHistory = parseCareerHistoryFromClubs(playerRecord.clubs);
          const playerDataWithCareer = {
            ...playerRecord,
            careerHistory
          };
          
          console.log('Final player data with career history:', playerDataWithCareer);
          setPlayerData(playerDataWithCareer);
          return;
        }

        // If no data in old table, check the new unified profile system
        console.log('No data in old table, checking new unified profile system...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            player_profiles (*)
          `)
          .eq('user_id', targetUserId)
          .eq('profile_type', 'player')
          .maybeSingle();

        console.log('Unified profile query result:', { data: profileData, error: profileError });

        if (profileError) {
          console.error('Error fetching unified profile:', profileError);
          setError(`Database error: ${profileError.message}`);
          setPlayerData(null);
          return;
        }

        if (profileData && profileData.player_profiles && profileData.player_profiles.length > 0) {
          console.log('=== FOUND DATA IN NEW UNIFIED PROFILE SYSTEM ===');
          const profile = profileData;
          const playerProfile = profileData.player_profiles[0];
          
          // Convert unified profile format to PlayerData format
          const convertedPlayerData: PlayerData = {
            id: profile.user_id,
            full_name: profile.display_name,
            sport: playerProfile.sport,
            position: playerProfile.position,
            city: profile.city || '',
            postcode: '', // Not available in new system
            age: playerProfile.age?.toString() || '',
            height: playerProfile.height || '',
            weight: playerProfile.weight || '',
            bio: profile.bio || '',
            clubs: playerProfile.clubs || '',
            achievements: playerProfile.achievements || '',
            facebook_id: playerProfile.facebook_id || '',
            whatsapp_id: playerProfile.whatsapp_id || '',
            instagram_id: playerProfile.instagram_id || '',
            profile_picture_url: profile.profile_picture_url || '',
            background_picture_url: profile.background_picture_url || '',
            careerHistory: parseCareerHistoryFromClubs(playerProfile.clubs)
          };
          
          console.log('Converted unified profile to PlayerData format:', convertedPlayerData);
          setPlayerData(convertedPlayerData);
          return;
        }

        // If no data found in either system
        console.log('=== NO PLAYER PROFILE FOUND IN EITHER SYSTEM ===');
        console.log('This means the user exists but has not created a player profile yet');
        console.log('User should be redirected to create profile page');
        setPlayerData(null);

      } catch (error: any) {
        console.error('=== UNEXPECTED ERROR ===');
        console.error('Error in fetchPlayerData:', error);
        console.error('Error type:', typeof error);
        console.error('Error stack:', error?.stack);
        setError(`Unexpected error: ${error.message || 'An unexpected error occurred'}`);
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
