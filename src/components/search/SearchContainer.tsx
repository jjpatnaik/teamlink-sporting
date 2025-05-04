
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePlayerData } from "@/hooks/usePlayerData";
import { useTournamentData } from "@/hooks/useTournamentData";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { MOCK_SPORTS, MOCK_AREAS, MOCK_TEAMS, MOCK_SPONSORSHIPS } from '@/data/mockData';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import { useState, useEffect } from 'react';

const SearchContainer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState<string>("Player");
  const [selectedSport, setSelectedSport] = useState<string>("any_sport");
  const [selectedArea, setSelectedArea] = useState<string>("any_area");
  const [nameSearch, setNameSearch] = useState<string>("");
  const [nearMeOnly, setNearMeOnly] = useState<boolean>(false);
  
  // Fetch data using custom hooks
  const { userCity, userPostcode } = useUserLocation();
  const { playerProfiles, loading: playersLoading } = usePlayerData();
  const { tournaments, loading: tournamentsLoading } = useTournamentData();
  
  // Determine which data set to filter based on search type
  const getDataToFilter = () => {
    switch (searchType) {
      case "Player":
        return playerProfiles;
      case "Team":
        return MOCK_TEAMS;
      case "Tournament":
        return tournaments;
      case "Sponsorship":
        return MOCK_SPONSORSHIPS;
      default:
        return [];
    }
  };

  const dataToFilter = getDataToFilter();
  const loading = playersLoading || tournamentsLoading;
  
  // Use the filter hook
  const filteredResults = useSearchFilters(
    dataToFilter,
    searchType,
    selectedSport,
    selectedArea,
    nameSearch,
    nearMeOnly,
    userCity
  );

  // Handle URL parameters
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const sportParam = searchParams.get('sport');
    const areaParam = searchParams.get('area');
    
    if (typeParam) {
      setSearchType(typeParam);
    }
    
    if (sportParam) {
      setSelectedSport(sportParam);
    }
    
    if (areaParam === 'local' && userCity) {
      // If we have the user's city, use it as the area
      const cityArea = MOCK_AREAS.find(area => area.toLowerCase().includes(userCity.toLowerCase()));
      if (cityArea) {
        setSelectedArea(cityArea);
      }
      setNearMeOnly(true);
    }
  }, [searchParams, userCity]);

  // Reset certain filters when search type changes
  useEffect(() => {
    setNameSearch("");
  }, [searchType]);

  const handleItemClick = (id: number | string) => {
    console.log(`Navigating to ${searchType.toLowerCase()}/${id}`);
    switch (searchType) {
      case "Player":
        navigate(`/players/${id}`);
        break;
      case "Team":
        navigate(`/teams/${id}`);
        break;
      case "Tournament":
        navigate(`/tournaments/${id}`);
        break;
      case "Sponsorship":
        navigate(`/sponsors/${id}`);
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Sports Network</h1>
        <p className="text-sport-gray">Search for players, teams, tournaments, and sponsorships across all levels</p>
      </div>
      
      <SearchFilters 
        searchType={searchType}
        setSearchType={setSearchType}
        selectedSport={selectedSport}
        setSelectedSport={setSelectedSport}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        nameSearch={nameSearch}
        setNameSearch={setNameSearch}
        sports={MOCK_SPORTS}
        areas={MOCK_AREAS}
        nearMeOnly={nearMeOnly}
        setNearMeOnly={setNearMeOnly}
      />
      
      <div className="mb-4">
        <SearchResults 
          searchType={searchType}
          filteredResults={filteredResults}
          selectedSport={selectedSport}
          selectedArea={selectedArea}
          handleItemClick={handleItemClick}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SearchContainer;
