
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import { 
  MOCK_SPORTS, 
  MOCK_AREAS, 
  MOCK_PLAYERS, 
  MOCK_TEAMS, 
  MOCK_TOURNAMENTS, 
  MOCK_SPONSORSHIPS 
} from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState<string>("Player");
  const [selectedSport, setSelectedSport] = useState<string>("any_sport");
  const [selectedArea, setSelectedArea] = useState<string>("any_area");
  const [nameSearch, setNameSearch] = useState<string>("");
  const [nearMeOnly, setNearMeOnly] = useState<boolean>(false);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [userPostcode, setUserPostcode] = useState<string | null>(null);

  // Get user location data if they're logged in
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('player_details')
            .select('city, postcode')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) {
            console.error("Error fetching user location:", error);
            return;
          }
          
          if (data) {
            setUserCity(data.city);
            setUserPostcode(data.postcode);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserLocation:", error);
      }
    };
    
    fetchUserLocation();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const sportParam = searchParams.get('sport');
    const areaParam = searchParams.get('area');
    const typeParam = searchParams.get('type');
    
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
    
    if (typeParam) {
      setSearchType(typeParam);
    }
  }, [searchParams, userCity]);

  // Update results whenever filters change
  useEffect(() => {
    let results: any[] = [];
    
    // Filter by search type
    switch (searchType) {
      case "Player":
        results = MOCK_PLAYERS;
        break;
      case "Team":
        results = MOCK_TEAMS;
        break;
      case "Tournament":
        results = MOCK_TOURNAMENTS;
        break;
      case "Sponsorship":
        results = MOCK_SPONSORSHIPS;
        break;
    }
    
    // Apply sport filter
    if (selectedSport !== "any_sport") {
      results = results.filter(item => item.sport === selectedSport);
    }
    
    // Apply area filter
    if (selectedArea !== "any_area") {
      results = results.filter(item => item.area === selectedArea);
    }
    
    // Apply name search filter
    if (nameSearch) {
      results = results.filter(item => 
        item.name.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }
    
    // Apply near me filter if enabled and we know user's location
    if (nearMeOnly && userCity) {
      results = results.filter(item => {
        // This is a simplification - in a real app, you'd use more sophisticated
        // location matching based on city/postcode proximity
        return item.area.toLowerCase().includes(userCity.toLowerCase());
      });
    }
    
    setFilteredResults(results);
  }, [searchType, selectedSport, selectedArea, nameSearch, nearMeOnly, userCity]);

  // Reset certain filters when search type changes
  useEffect(() => {
    setNameSearch("");
  }, [searchType]);

  const handleItemClick = (id: number) => {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
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
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
