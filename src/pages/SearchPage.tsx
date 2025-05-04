
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import { 
  MOCK_SPORTS, 
  MOCK_AREAS, 
  MOCK_TEAMS, 
  MOCK_SPONSORSHIPS 
} from '@/data/mockData';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [playerProfiles, setPlayerProfiles] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);

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

  // Fetch player profiles from the database
  const fetchPlayerProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('player_details')
        .select('*');

      if (error) {
        console.error("Error fetching player profiles:", error);
        toast({
          title: "Error fetching profiles",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      if (data) {
        console.log("Fetched player profiles:", data.length);
        // Transform the data to match the expected format
        const transformedData = data.map(player => ({
          id: player.id,
          name: player.full_name || "Unknown Name",
          sport: player.sport || "Unknown Sport",
          area: player.city || "Unknown Area",
          image: player.profile_picture_url || "https://via.placeholder.com/300x200?text=No+Image"
        }));
        
        setPlayerProfiles(transformedData);
        return transformedData;
      }
      return [];
    } catch (error) {
      console.error("Error in fetchPlayerProfiles:", error);
      return [];
    }
  };

  // Fetch tournaments from the database
  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*');

      if (error) {
        console.error("Error fetching tournaments:", error);
        toast({
          title: "Error fetching tournaments",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      if (data) {
        console.log("Fetched tournaments:", data.length);
        // Transform the data to match the expected format
        const transformedData = data.map(tournament => ({
          id: tournament.id,
          name: tournament.name || "Unknown Tournament",
          sport: tournament.sport || "Unknown Sport",
          area: tournament.location || "Unknown Location",
          location: tournament.location,
          start_date: tournament.start_date,
          end_date: tournament.end_date,
          teams_allowed: tournament.teams_allowed,
          image: "https://via.placeholder.com/300x200?text=Tournament"
        }));
        
        setTournaments(transformedData);
        return transformedData;
      }
      return [];
    } catch (error) {
      console.error("Error in fetchTournaments:", error);
      return [];
    }
  };

  // Fetch all data when component mounts
  useEffect(() => {
    setLoading(true);
    
    // Use Promise.all to fetch both data types concurrently
    Promise.all([fetchPlayerProfiles(), fetchTournaments()])
      .then(([players, tourneys]) => {
        console.log("Fetched data counts:", {
          players: players.length,
          tournaments: tourneys.length
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  // Update results whenever filters or data change
  useEffect(() => {
    let results: any[] = [];
    console.log("Filtering results for searchType:", searchType);
    
    // Filter by search type
    switch (searchType) {
      case "Player":
        results = playerProfiles;
        break;
      case "Team":
        results = MOCK_TEAMS;
        break;
      case "Tournament":
        results = tournaments;
        break;
      case "Sponsorship":
        results = MOCK_SPONSORSHIPS;
        break;
    }
    
    console.log("Initial results for type:", results.length);
    
    // Apply sport filter
    if (selectedSport !== "any_sport") {
      results = results.filter(item => item.sport === selectedSport);
    }
    
    // Apply area filter
    if (selectedArea !== "any_area") {
      results = results.filter(item => 
        item.area && item.area.toLowerCase().includes(selectedArea.toLowerCase())
      );
    }
    
    // Apply name search filter
    if (nameSearch) {
      results = results.filter(item => 
        item.name && item.name.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }
    
    // Apply near me filter if enabled and we know user's location
    if (nearMeOnly && userCity) {
      results = results.filter(item => {
        // This is a simplification - in a real app, you'd use more sophisticated
        // location matching based on city/postcode proximity
        return item.area && item.area.toLowerCase().includes(userCity.toLowerCase());
      });
    }
    
    console.log("Filtered results:", results.length);
    setFilteredResults(results);
  }, [searchType, selectedSport, selectedArea, nameSearch, nearMeOnly, userCity, playerProfiles, tournaments]);

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
              loading={loading}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
