
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
  
  const { players, loading: playersLoading } = usePlayerData();
  const { tournaments, loading: tournamentsLoading } = useTournamentData();
  const { userCity, userPostcode } = useUserLocation();

  // Mock data for teams and sponsors
  const teams: TeamProfile[] = [];
  const sponsors: SponsorProfile[] = [];
  
  // Get the current data based on searchType
  const getCurrentData = () => {
    switch (searchType) {
      case 'players':
        return players;
      case 'tournaments':
        return tournaments;
      case 'teams':
        return teams;
      case 'sponsors':
        return sponsors;
      default:
        return [];
    }
  };
  
  // Apply filters
  const filteredResults = useSearchFilters(
    getCurrentData(),
    searchType,
    selectedSport,
    selectedArea,
    nameSearch,
    nearMeOnly,
    userCity
  );

  const isLoading = playersLoading || tournamentsLoading;

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
          nearMeOnly={nearMeOnly}
          setNearMeOnly={setNearMeOnly}
          userCity={userCity}
        />
        
        <div className="lg:col-span-3">
          <SearchResults 
            searchType={searchType}
            results={filteredResults as any}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchContainer;
