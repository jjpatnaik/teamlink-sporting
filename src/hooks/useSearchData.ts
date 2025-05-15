
import { useState, useEffect, useCallback } from 'react';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useAllTournamentsData } from '@/hooks/useAllTournamentsData';
import { Tournament } from '@/hooks/useTournamentData';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { useUserLocation } from '@/hooks/useUserLocation';
import { toast } from "@/components/ui/use-toast";

// Define type interfaces for each search result type
export type PlayerProfile = {
  id: string;
  name: string;
  sport: string;
  area?: string;
  image?: string;
  profile_picture_url?: string;
};

export type TeamProfile = {
  id: number;
  name: string;
  sport: string;
  area: string;
  logo: string;
};

export type SponsorProfile = {
  id: number;
  name: string;
  sport: string;
  area: string;
  amount: string;
  image: string;
};

// Define a union type for all possible result types
export type SearchResult = PlayerProfile | TeamProfile | Tournament | SponsorProfile;

export interface SearchDataParams {
  searchType: string;
  selectedSport: string;
  selectedArea: string;
  nameSearch: string;
  nearMeOnly: boolean;
}

// Enhanced retry function with better error handling
const fetchWithRetry = async (fetchFunction: () => Promise<any>, retries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await fetchFunction();
      console.log(`Data fetch successful on attempt ${attempt + 1}`);
      return result;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      // If we still have retries left, wait before trying again
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1))); // Exponential backoff
      }
    }
  }
  
  throw lastError;
};

export const useSearchData = ({ searchType, selectedSport, selectedArea, nameSearch, nearMeOnly }: SearchDataParams) => {
  // Data state to track what we're showing
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const { userCity } = useUserLocation();
  
  // Fetch data sources with more robust error handling
  const { playerProfiles, loading: playersLoading, fetchPlayerProfiles } = usePlayerData(true);
  const { tournaments, loading: tournamentsLoading, fetchTournaments } = useAllTournamentsData();

  // Mock data for teams and sponsors
  const teams: TeamProfile[] = [
    {
      id: 1,
      name: "Manchester United FC",
      sport: "Football",
      area: "Manchester",
      logo: "https://via.placeholder.com/300x200?text=Team+Logo"
    },
    {
      id: 2,
      name: "London Tigers",
      sport: "Basketball",
      area: "London",
      logo: "https://via.placeholder.com/300x200?text=Team+Logo"
    }
  ];
  
  const sponsors: SponsorProfile[] = [
    {
      id: 1,
      name: "Global Sports Brand",
      sport: "Football",
      area: "London",
      amount: "£50,000",
      image: "https://via.placeholder.com/300x200?text=Sponsor"
    },
    {
      id: 2,
      name: "Local Energy Drinks",
      sport: "Basketball",
      area: "Manchester",
      amount: "£25,000",
      image: "https://via.placeholder.com/300x200?text=Sponsor"
    }
  ];

  // Refresh data with enhanced error handling
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setConnectionError(false);
    
    try {
      switch (searchType) {
        case 'Player':
          await fetchPlayerProfiles();
          break;
        case 'Tournament':
          await fetchTournaments();
          break;
        default:
          // For mock data types, just simulate a delay
          await new Promise(resolve => setTimeout(resolve, 500));
          break;
      }
    } catch (error) {
      console.error(`Error refreshing ${searchType} data:`, error);
      setConnectionError(true);
      toast({
        title: `Error loading ${searchType.toLowerCase()} data`,
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchType, fetchPlayerProfiles, fetchTournaments]);

  // Get the appropriate data based on search type
  useEffect(() => {
    setIsLoading(true);
    setConnectionError(false);
    
    try {
      let data: any[] = [];
      
      switch (searchType) {
        case 'Player':
          data = playerProfiles || [];
          console.log(`Loaded ${data.length} player profiles`);
          break;
        case 'Team':
          data = teams || [];
          console.log(`Loaded ${data.length} teams`);
          break;
        case 'Tournament':
          data = tournaments || [];
          console.log(`Loaded ${data.length} tournaments`);
          break;
        case 'Sponsorship':
          data = sponsors || [];
          console.log(`Loaded ${data.length} sponsorships`);
          break;
        default:
          console.log(`Unknown search type: ${searchType}`);
          data = [];
      }
      
      setCurrentData(data);
    } catch (error) {
      console.error("Error getting search data:", error);
      setConnectionError(true);
      setCurrentData([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchType, playerProfiles, tournaments]);
  
  // Apply filters to current data
  const filteredResults = useSearchFilters<any>(
    currentData,
    searchType,
    selectedSport,
    selectedArea,
    nameSearch,
    nearMeOnly,
    userCity
  );

  // Build available filter options based on actual data
  const sports = Array.from(new Set([
    'Football', 'Basketball', 'Tennis', 'Cricket',
    ...(playerProfiles ? playerProfiles.map(p => p.sport) : []),
    ...(tournaments ? tournaments.map(t => t.sport) : [])
  ])).filter(Boolean);
  
  const areas = Array.from(new Set([
    'London', 'Manchester', 'Birmingham', 'Glasgow',
    ...(playerProfiles ? playerProfiles.map(p => p.area).filter(Boolean) : []),
    ...(tournaments ? tournaments.map(t => t.area).filter(Boolean) : [])
  ])).filter(Boolean);

  return {
    filteredResults,
    isLoading: isLoading || (searchType === 'Player' && playersLoading) || (searchType === 'Tournament' && tournamentsLoading),
    connectionError,
    sports,
    areas,
    refreshData
  };
};
