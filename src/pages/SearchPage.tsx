
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  User, 
  Users, 
  Trophy, 
  Award,
  MapPin,
  Calendar,
  Dumbbell,
  ArrowRight
} from "lucide-react";

// Mock data - in a real app this would come from an API/database
const MOCK_SPORTS = ["Cricket", "Football", "Basketball", "Tennis", "Badminton", "Hockey", "Rugby", "Volleyball"];
const MOCK_AREAS = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"];

const MOCK_PLAYERS = [
  { id: 1, name: "Virat Kohli", sport: "Cricket", area: "Delhi", image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80" },
  { id: 2, name: "Sunil Chhetri", sport: "Football", area: "Bangalore", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80" },
  { id: 3, name: "PV Sindhu", sport: "Badminton", area: "Hyderabad", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80" },
  { id: 4, name: "Sania Mirza", sport: "Tennis", area: "Hyderabad", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80" },
  { id: 5, name: "Jasprit Bumrah", sport: "Cricket", area: "Mumbai", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80" },
  { id: 6, name: "Saina Nehwal", sport: "Badminton", area: "Hyderabad", image: "https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?auto=format&fit=crop&q=80" },
];

const MOCK_TEAMS = [
  { id: 1, name: "Mumbai Indians", sport: "Cricket", area: "Mumbai", logo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80" },
  { id: 2, name: "Bengaluru FC", sport: "Football", area: "Bangalore", logo: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80" },
  { id: 3, name: "Chennai Super Kings", sport: "Cricket", area: "Chennai", logo: "https://images.unsplash.com/photo-1580639810245-fd01062e9676?auto=format&fit=crop&q=80" },
  { id: 4, name: "Delhi Capitals", sport: "Cricket", area: "Delhi", logo: "https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?auto=format&fit=crop&q=80" },
  { id: 5, name: "Mumbai City FC", sport: "Football", area: "Mumbai", logo: "https://images.unsplash.com/photo-1511886929837-354d654a3ac0?auto=format&fit=crop&q=80" },
];

const MOCK_TOURNAMENTS = [
  { id: 1, name: "Premier Cricket League", sport: "Cricket", area: "Mumbai", startDate: "2024-10-15", endDate: "2024-11-30", image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80" },
  { id: 2, name: "Indian Super League", sport: "Football", area: "Multiple", startDate: "2024-09-01", endDate: "2024-12-15", image: "https://images.unsplash.com/photo-1570498839593-e565b39455fc?auto=format&fit=crop&q=80" },
  { id: 3, name: "All India Badminton Championship", sport: "Badminton", area: "Delhi", startDate: "2024-08-10", endDate: "2024-08-20", image: "https://images.unsplash.com/photo-1626133099711-ff466fa4d7fe?auto=format&fit=crop&q=80" },
  { id: 4, name: "South India Tennis Open", sport: "Tennis", area: "Chennai", startDate: "2024-11-05", endDate: "2024-11-15", image: "https://images.unsplash.com/photo-1622279457486-28f27bfd527e?auto=format&fit=crop&q=80" },
];

const MOCK_SPONSORSHIPS = [
  { id: 1, name: "Nike Sports Sponsorship", sport: "Multiple", area: "National", amount: "₹5,00,000 - ₹50,00,000", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80" },
  { id: 2, name: "Adidas Rising Stars Program", sport: "Football", area: "National", amount: "₹2,00,000 - ₹10,00,000", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80" },
  { id: 3, name: "Puma Cricket Excellence", sport: "Cricket", area: "Multiple", amount: "₹3,00,000 - ₹25,00,000", image: "https://images.unsplash.com/photo-1551126025-c8a090ea2632?auto=format&fit=crop&q=80" },
  { id: 4, name: "MRF Sports Talent Hunt", sport: "Cricket", area: "South India", amount: "₹1,00,000 - ₹15,00,000", image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80" },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<string>("Player");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [nameSearch, setNameSearch] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  // Update results whenever filters change
  useEffect(() => {
    let results: any[] = [];
    
    switch (searchType) {
      case "Player":
        results = MOCK_PLAYERS.filter(player => 
          (selectedSport === "" || player.sport === selectedSport) &&
          (selectedArea === "" || player.area === selectedArea) &&
          (nameSearch === "" || player.name.toLowerCase().includes(nameSearch.toLowerCase()))
        );
        break;
      case "Team":
        results = MOCK_TEAMS.filter(team => 
          (selectedSport === "" || team.sport === selectedSport) &&
          (selectedArea === "" || team.area === selectedArea) &&
          (nameSearch === "" || team.name.toLowerCase().includes(nameSearch.toLowerCase()))
        );
        break;
      case "Tournament":
        results = MOCK_TOURNAMENTS.filter(tournament => 
          (selectedSport === "" || tournament.sport === selectedSport) &&
          (selectedArea === "" || tournament.area === selectedArea) &&
          (nameSearch === "" || tournament.name.toLowerCase().includes(nameSearch.toLowerCase()))
        );
        break;
      case "Sponsorship":
        results = MOCK_SPONSORSHIPS.filter(sponsorship => 
          (selectedSport === "" || sponsorship.sport === selectedSport) &&
          (selectedArea === "" || sponsorship.area === selectedArea) &&
          (nameSearch === "" || sponsorship.name.toLowerCase().includes(nameSearch.toLowerCase()))
        );
        break;
    }
    
    setFilteredResults(results);
  }, [searchType, selectedSport, selectedArea, nameSearch]);

  // Reset filters when search type changes
  useEffect(() => {
    setSelectedSport("");
    setSelectedArea("");
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
          
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">I'm looking for</label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Player">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Player</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Team">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Team</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Tournament">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        <span>Tournament</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Sponsorship">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>Sponsorship</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sport</label>
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_sport">Any sport</SelectItem>
                    {MOCK_SPORTS.map(sport => (
                      <SelectItem key={sport} value={sport}>
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4" />
                          <span>{sport}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Area</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_area">Any area</SelectItem>
                    {MOCK_AREAS.map(area => (
                      <SelectItem key={area} value={area}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{area}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={`Search ${searchType.toLowerCase()} by name...`}
                className="pl-10"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Results</h2>
            <p className="text-sport-gray mb-4">
              {filteredResults.length} {searchType.toLowerCase()}
              {filteredResults.length !== 1 ? 's' : ''} found
              {selectedSport && selectedSport !== "any_sport" ? ` for ${selectedSport}` : ''}
              {selectedArea && selectedArea !== "any_area" ? ` in ${selectedArea}` : ''}
            </p>
            
            {filteredResults.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <h3 className="text-lg font-medium">No results found</h3>
                <p className="text-gray-500">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchType === "Player" && filteredResults.map((player) => (
                  <Card key={player.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleItemClick(player.id)}>
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={player.image} 
                        alt={player.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{player.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Dumbbell className="h-4 w-4 text-sport-purple" />
                        <span className="text-sm text-gray-600">{player.sport}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-sport-purple" />
                        <span className="text-sm text-gray-600">{player.area}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-3 flex justify-between">
                      <Badge className="bg-sport-light-purple text-sport-purple">{player.sport}</Badge>
                      <Button variant="ghost" size="sm" className="text-sport-purple">
                        View Profile <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {searchType === "Team" && filteredResults.map((team) => (
                  <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleItemClick(team.id)}>
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={team.logo} 
                        alt={team.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{team.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Dumbbell className="h-4 w-4 text-sport-purple" />
                        <span className="text-sm text-gray-600">{team.sport}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-sport-purple" />
                        <span className="text-sm text-gray-600">{team.area}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-3 flex justify-between">
                      <Badge className="bg-sport-light-purple text-sport-purple">{team.sport}</Badge>
                      <Button variant="ghost" size="sm" className="text-sport-purple">
                        View Team <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {searchType === "Tournament" && filteredResults.map((tournament) => (
                  <Card key={tournament.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleItemClick(tournament.id)}>
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={tournament.image} 
                        alt={tournament.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{tournament.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Dumbbell className="h-4 w-4 text-sport-purple" />
                        <span className="text-sm text-gray-600">{tournament.sport}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-sport-purple" />
                        <span className="text-sm text-gray-600">{tournament.area}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-sport-purple" />
                        <span className="text-sm text-gray-600">{tournament.startDate} to {tournament.endDate}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-3 flex justify-between">
                      <Badge className="bg-sport-light-purple text-sport-purple">{tournament.sport}</Badge>
                      <Button variant="ghost" size="sm" className="text-sport-purple">
                        View Details <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {searchType === "Sponsorship" && filteredResults.map((sponsorship) => (
                  <Card key={sponsorship.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleItemClick(sponsorship.id)}>
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={sponsorship.image} 
                        alt={sponsorship.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{sponsorship.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Dumbbell className="h-4 w-4 text-sport-purple" />
                        <span className="text-sm text-gray-600">{sponsorship.sport}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-sport-purple" />
                        <span className="text-sm text-gray-600">{sponsorship.area}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Award className="h-4 w-4 text-sport-purple" />
                        <span className="text-sm text-gray-600">{sponsorship.amount}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-3 flex justify-between">
                      <Badge className="bg-sport-light-purple text-sport-purple">{sponsorship.sport}</Badge>
                      <Button variant="ghost" size="sm" className="text-sport-purple">
                        View Opportunity <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
