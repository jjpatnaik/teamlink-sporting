import { useState, useEffect } from 'react';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useTournamentData, Tournament } from '@/hooks/useTournamentData';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { useUserLocation } from '@/hooks/useUserLocation';

type PlayerProfile = {
  id: string;
  name: string;
  sport: string;
  area?: string;
  image?: string;
  profile_picture_url?: string;
};

type TeamProfile = {
  id: number;
  name: string;
  sport: string;
  area: string;
  logo: string;
};

type SponsorProfile = {
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
  // Pass false to fetchAll to prevent authentication errors
  const { playerProfiles, loading: playersLoading } = usePlayerData(true);
  const { tournaments, loading: tournamentsLoading } = useTournamentData();
  const { userCity } = useUserLocation();

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

  // Get the current data based on searchType - handle error cases
  const getCurrentData = () => {
    try {
      switch (searchType) {
        case 'Player':
          return playerProfiles || [];
        case 'Team':
          return teams || [];
        case 'Tournament':
          return tournaments || [];
        case 'Sponsorship':
          return sponsors || [];
        default:
          return [];
      }
    } catch (error) {
      console.error("Error getting search data:", error);
      return [];
    }
  };
  
  // Get the current data
  const currentData = getCurrentData();
  
  // We need to cast the result to any[] to avoid TypeScript errors
  // since different search types return different data structures
  const filteredResults = useSearchFilters<any>(
    currentData,
    searchType,
    selectedSport,
    selectedArea,
    nameSearch,
    nearMeOnly,
    userCity
  );

  const isLoading = (searchType === 'Player' && playersLoading) || 
                   (searchType === 'Tournament' && tournamentsLoading);

  // Define available sports and areas
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
    isLoading,
    sports,
    areas
  };
};
