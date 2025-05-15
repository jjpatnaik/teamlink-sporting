
import { useState, useEffect } from 'react';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useTournamentData, Tournament } from '@/hooks/useTournamentData';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { useUserLocation } from '@/hooks/useUserLocation';

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

export const useSearchData = ({ searchType, selectedSport, selectedArea, nameSearch, nearMeOnly }: SearchDataParams) => {
  // Data state to track what we're showing
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userCity } = useUserLocation();
  
  // Fetch data sources - pass true to fetchAll to get all player profiles
  const { playerProfiles, loading: playersLoading } = usePlayerData(true);
  const { tournaments, loading: tournamentsLoading } = useTournamentData();

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

  // Get the appropriate data based on search type
  useEffect(() => {
    setIsLoading(true);
    
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
    sports,
    areas
  };
};
