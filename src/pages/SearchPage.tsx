
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<string>("Player");
  const [selectedSport, setSelectedSport] = useState<string>("any_sport");
  const [selectedArea, setSelectedArea] = useState<string>("any_area");
  const [nameSearch, setNameSearch] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  // Update results whenever filters change
  useEffect(() => {
    let results: any[] = [];
    
    switch (searchType) {
      case "Player":
        results = MOCK_PLAYERS.filter(player => 
          (selectedSport === "any_sport" || player.sport === selectedSport) &&
          (selectedArea === "any_area" || player.area === selectedArea) &&
          (nameSearch === "" || player.name.toLowerCase().includes(nameSearch.toLowerCase()))
        );
        break;
      case "Team":
        results = MOCK_TEAMS.filter(team => 
          (selectedSport === "any_sport" || team.sport === selectedSport) &&
          (selectedArea === "any_area" || team.area === selectedArea) &&
          (nameSearch === "" || team.name.toLowerCase().includes(nameSearch.toLowerCase()))
        );
        break;
      case "Tournament":
        results = MOCK_TOURNAMENTS.filter(tournament => 
          (selectedSport === "any_sport" || tournament.sport === selectedSport) &&
          (selectedArea === "any_area" || tournament.area === selectedArea) &&
          (nameSearch === "" || tournament.name.toLowerCase().includes(nameSearch.toLowerCase()))
        );
        break;
      case "Sponsorship":
        results = MOCK_SPONSORSHIPS.filter(sponsorship => 
          (selectedSport === "any_sport" || sponsorship.sport === selectedSport) &&
          (selectedArea === "any_area" || sponsorship.area === selectedArea) &&
          (nameSearch === "" || sponsorship.name.toLowerCase().includes(nameSearch.toLowerCase()))
        );
        break;
    }
    
    setFilteredResults(results);
  }, [searchType, selectedSport, selectedArea, nameSearch]);

  // Reset filters when search type changes
  useEffect(() => {
    setSelectedSport("any_sport");
    setSelectedArea("any_area");
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
