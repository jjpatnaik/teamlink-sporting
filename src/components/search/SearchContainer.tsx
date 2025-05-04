
import React, { useState, useEffect } from 'react';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useTournamentData } from '@/hooks/useTournamentData';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';

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
  const [searchType, setSearchType] = useState<string>('tournaments');
  const [selectedSport, setSelectedSport] = useState<string>('any_sport');
  const [selectedArea, setSelectedArea] = useState<string>('any_area');
  const [nameSearch, setNameSearch] = useState<string>('');
  const [nearMeOnly, setNearMeOnly] = useState<boolean>(false);
  
  const { playerProfiles, loading: playersLoading } = usePlayerData(true); // Use fetchAll=true to get all players
  const { tournaments, loading: tournamentsLoading } = useTournamentData();
  const { userCity, userPostcode } = useUserLocation();

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
    switch (searchType) {
      case 'Player':
        return playerProfiles;
      case 'Tournament':
        return tournaments;
      case 'Team':
        return teams;
      case 'Sponsorship':
        return sponsors;
      default:
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
    console.log(`Clicked item with id: ${id}, type: ${searchType}`);
    // Navigation logic would go here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find {searchType}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
        
        <div className="lg:col-span-3">
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
