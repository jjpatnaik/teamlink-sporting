
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useTournamentData, Tournament } from '@/hooks/useTournamentData';
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

// Define a union type for all possible result types
type SearchResult = PlayerProfile | TeamProfile | Tournament | SponsorProfile;

const SearchContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const typeFromURL = searchParams.get('type');
  
  const [searchType, setSearchType] = useState<string>(typeFromURL || 'Tournament');
  const [selectedSport, setSelectedSport] = useState<string>('any_sport');
  const [selectedArea, setSelectedArea] = useState<string>('any_area');
  const [nameSearch, setNameSearch] = useState<string>('');
  const [nearMeOnly, setNearMeOnly] = useState<boolean>(false);
  
  // Pass false to fetchAll to prevent authentication errors
  const { playerProfiles, loading: playersLoading } = usePlayerData(true);
  const { tournaments, loading: tournamentsLoading } = useTournamentData();
  const { userCity, userPostcode } = useUserLocation();

  // Handle search type changes both from URL and from the UI
  useEffect(() => {
    if (typeFromURL && typeFromURL !== searchType) {
      console.log(`URL search type changed to: ${typeFromURL}`);
      setSearchType(typeFromURL);
    }
  }, [typeFromURL, searchType]);

  // Update URL when search type changes from the UI
  const handleSearchTypeChange = (newType: string) => {
    setSearchType(newType);
    // Update URL to reflect the new search type
    navigate(`/search?type=${newType}`, { replace: true });
  };

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
  
  // Get the current data based on searchType
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
            setSearchType={handleSearchTypeChange}
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
