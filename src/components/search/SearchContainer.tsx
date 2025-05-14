
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useTournamentData } from '@/hooks/useTournamentData';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import { toast } from "sonner";

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

const SearchContainer: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFromURL = searchParams.get('type');
  
  const [searchType, setSearchType] = useState<string>(typeFromURL || 'Tournament');
  const [selectedSport, setSelectedSport] = useState<string>('any_sport');
  const [selectedArea, setSelectedArea] = useState<string>('any_area');
  const [nameSearch, setNameSearch] = useState<string>('');
  const [nearMeOnly, setNearMeOnly] = useState<boolean>(false);
  
  // Pass false to fetchAll to prevent authentication errors
  const { playerProfiles, loading: playersLoading } = usePlayerData(false);
  const { tournaments, loading: tournamentsLoading } = useTournamentData();
  const { userCity, userPostcode } = useUserLocation();

  // Update search type when URL parameter changes
  useEffect(() => {
    if (typeFromURL) {
      setSearchType(typeFromURL);
    }
  }, [typeFromURL]);

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
  
  // Mock data for teams and sponsors
  const teams: TeamProfile[] = [];
  const sponsors: SponsorProfile[] = [];
  
  // Get the current data based on searchType
  const getCurrentData = () => {
    try {
      switch (searchType) {
        case 'Player':
          return playerProfiles || [];
        case 'Tournament':
          return tournaments || [];
        case 'Team':
          return teams || [];
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
  
  // Apply filters with a more generic type
  const filteredResults = useSearchFilters(
    getCurrentData() as any[], // Use type assertion to any[] since we know it'll have the required properties
    searchType,
    selectedSport,
    selectedArea,
    nameSearch,
    nearMeOnly,
    userCity
  );

  const isLoading = playersLoading || tournamentsLoading;

  const handleItemClick = (id: number | string) => {
    try {
      console.log(`Clicked item with id: ${id}, type: ${searchType}`);
      // Navigation logic would go here
      if (searchType === 'Tournament') {
        console.log(`View details clicked for tournament: ${id}`);
      }
    } catch (error) {
      console.error("Error handling item click:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find {searchType}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 w-full">
          <SearchFilters 
            searchType={searchType}
            setSearchType={setSearchType}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            nameSearch={nameSearch}
            setNameSearch={setNameSearch}
            sports={sports}
            areas={areas}
            nearMeOnly={nearMeOnly}
            setNearMeOnly={setNearMeOnly}
          />
        </div>
        
        <div className="lg:col-span-9">
          <SearchResults 
            searchType={searchType}
            filteredResults={filteredResults}
            selectedSport={selectedSport}
            selectedArea={selectedArea}
            handleItemClick={handleItemClick}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchContainer;
