import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/search/SearchFilters';
import UnifiedSearchResults from '@/components/search/UnifiedSearchResults';
import { 
  MOCK_SPORTS, 
  MOCK_AREAS, 
  MOCK_TEAMS, 
  MOCK_SPONSORSHIPS 
} from '@/data/mockData';
import { supabase } from "@/integrations/supabase/client";
import { useTournaments } from '@/hooks/useTournaments';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedSport, setSelectedSport] = useState<string>("any_sport");
  const [selectedArea, setSelectedArea] = useState<string>("any_area");
  const [nameSearch, setNameSearch] = useState<string>("");
  const [nearMeOnly, setNearMeOnly] = useState<boolean>(false);
  const [selectedContentType, setSelectedContentType] = useState<string>("all");
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<any[]>([]);
  const [filteredSponsorships, setFilteredSponsorships] = useState<any[]>([]);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [userPostcode, setUserPostcode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [playerProfiles, setPlayerProfiles] = useState<any[]>([]);
  
  // Use the new tournaments hook
  const { tournaments, loading: tournamentsLoading } = useTournaments();

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
  useEffect(() => {
    const fetchPlayerProfiles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('player_details')
          .select('*');

        if (error) {
          console.error("Error fetching player profiles:", error);
          return;
        }

        if (data) {
          // Transform the data to match the expected format
          const transformedData = data.map((player, index) => ({
            id: index + 1,
            userId: player.id,
            name: player.full_name,
            sport: player.sport,
            area: player.city || "Unknown",
            image: player.profile_picture_url || "https://via.placeholder.com/300x200?text=No+Image"
          }));
          
          setPlayerProfiles(transformedData);
        }
      } catch (error) {
        console.error("Error in fetchPlayerProfiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerProfiles();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const sportParam = searchParams.get('sport');
    const areaParam = searchParams.get('area');
    
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

  // Filter function for applying filters to any result set
  const applyFilters = (results: any[]) => {
    let filtered = [...results];
    
    // Apply sport filter
    if (selectedSport !== "any_sport") {
      filtered = filtered.filter(item => item.sport === selectedSport);
    }
    
    // Apply area filter
    if (selectedArea !== "any_area") {
      filtered = filtered.filter(item => item.area === selectedArea);
    }
    
    // Apply name search filter
    if (nameSearch) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }
    
    // Apply near me filter if enabled and we know user's location
    if (nearMeOnly && userCity) {
      filtered = filtered.filter(item => {
        // This is a simplification - in a real app, you'd use more sophisticated
        // location matching based on city/postcode proximity
        return item.area.toLowerCase().includes(userCity.toLowerCase());
      });
    }
    
    return filtered;
  };

  // Update results whenever filters change
  useEffect(() => {
    const baseFilters = () => {
      const players = applyFilters(playerProfiles);
      const teams = applyFilters(MOCK_TEAMS);
      const tournamentResults = applyFilters(tournaments); // Use real tournaments data
      const sponsorships = applyFilters(MOCK_SPONSORSHIPS);
      
      // Apply content type filter
      switch (selectedContentType) {
        case "players":
          setFilteredPlayers(players);
          setFilteredTeams([]);
          setFilteredTournaments([]);
          setFilteredSponsorships([]);
          break;
        case "teams":
          setFilteredPlayers([]);
          setFilteredTeams(teams);
          setFilteredTournaments([]);
          setFilteredSponsorships([]);
          break;
        case "tournaments":
          setFilteredPlayers([]);
          setFilteredTeams([]);
          setFilteredTournaments(tournamentResults);
          setFilteredSponsorships([]);
          break;
        case "sponsorships":
          setFilteredPlayers([]);
          setFilteredTeams([]);
          setFilteredTournaments([]);
          setFilteredSponsorships(sponsorships);
          break;
        default: // "all"
          setFilteredPlayers(players);
          setFilteredTeams(teams);
          setFilteredTournaments(tournamentResults);
          setFilteredSponsorships(sponsorships);
          break;
      }
    };
    
    baseFilters();
  }, [selectedSport, selectedArea, nameSearch, nearMeOnly, selectedContentType, userCity, playerProfiles, tournaments]);

  const handleItemClick = (id: number, type: string) => {
    switch (type) {
      case "Player": {
        const player = playerProfiles.find(p => p.id === id);
        if (player && player.userId) {
          navigate(`/player/${player.userId}`);
        } else {
          navigate(`/player/${id}`);
        }
        break;
      }
      case "Team":
        navigate(`/team/${id}`);
        break;
      case "Tournament":
        // For tournaments, use the string ID directly
        navigate(`/tournament/${id}`);
        break;
      case "Sponsorship":
        navigate(`/sponsor/${id}`);
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
            selectedContentType={selectedContentType}
            setSelectedContentType={setSelectedContentType}
          />
          
          <div className="mb-4">
            <UnifiedSearchResults 
              players={filteredPlayers}
              teams={filteredTeams}
              tournaments={filteredTournaments}
              sponsorships={filteredSponsorships}
              handleItemClick={handleItemClick}
              loading={loading || tournamentsLoading}
              searchFilters={{
                selectedSport,
                selectedArea,
                nameSearch
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
