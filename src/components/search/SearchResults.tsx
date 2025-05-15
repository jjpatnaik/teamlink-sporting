
import React from 'react';
import { Search, AlertCircle, RefreshCcw } from "lucide-react";
import PlayerCard from './PlayerCard';
import TeamCard from './TeamCard';
import TournamentCard from './TournamentCard';
import SponsorshipCard from './SponsorshipCard';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  searchType: string;
  filteredResults: any[]; // Using any[] since it could be different types based on searchType
  selectedSport: string;
  selectedArea: string;
  handleItemClick: (id: number | string) => void;
  loading?: boolean;
  connectionError?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchType,
  filteredResults,
  selectedSport,
  selectedArea,
  handleItemClick,
  loading = false,
  connectionError = false
}) => {
  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
        <h3 className="text-lg font-medium">Loading results...</h3>
        <p className="text-gray-500">Please wait while we fetch the data</p>
      </div>
    );
  }

  // Connection error state
  if (connectionError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection issues detected</AlertTitle>
        <AlertDescription>
          We're having trouble connecting to our database. Please try refreshing the page or try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Debug output to help identify issues
  console.log(`SearchResults - Type: ${searchType}, Count: ${filteredResults?.length || 0}`);
  console.log("Results data:", filteredResults?.slice(0, 2));

  // No results state (but connection is good)
  if (!filteredResults || filteredResults.length === 0) {
    return (
      <div>
        <p className="text-sport-gray mb-4">
          0 {searchType.toLowerCase()}s found
          {selectedSport && selectedSport !== "any_sport" ? ` for ${selectedSport}` : ''}
          {selectedArea && selectedArea !== "any_area" ? ` in ${selectedArea}` : ''}
        </p>
        
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-lg font-medium">No {searchType.toLowerCase()}s found</h3>
          
          {searchType === "Player" && (
            <p className="text-gray-500">No players registered yet. Check back later or try different search filters.</p>
          )}
          
          {searchType === "Team" && (
            <p className="text-gray-500">No teams registered yet. Check back later or try different search filters.</p>
          )}
          
          {searchType === "Tournament" && (
            <p className="text-gray-500">No tournaments registered yet. Check back later or try different search filters.</p>
          )}
          
          {searchType === "Sponsorship" && (
            <p className="text-gray-500">No sponsorships registered yet. Check back later or try different search filters.</p>
          )}
        </div>
      </div>
    );
  }

  // Results found state
  return (
    <div>
      <p className="text-sport-gray mb-4">
        {filteredResults.length} {searchType.toLowerCase()}
        {filteredResults.length !== 1 ? 's' : ''} found
        {selectedSport && selectedSport !== "any_sport" ? ` for ${selectedSport}` : ''}
        {selectedArea && selectedArea !== "any_area" ? ` in ${selectedArea}` : ''}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchType === "Player" && filteredResults.map((player) => (
          <PlayerCard 
            key={player.id} 
            player={player} 
            onClick={() => handleItemClick(player.id)} 
          />
        ))}
        
        {searchType === "Team" && filteredResults.map((team) => (
          <TeamCard 
            key={team.id} 
            team={team} 
            onClick={() => handleItemClick(team.id)} 
          />
        ))}
        
        {searchType === "Tournament" && filteredResults.map((tournament) => (
          <TournamentCard 
            key={tournament.id} 
            tournament={tournament} 
            onClick={() => handleItemClick(tournament.id)} 
          />
        ))}
        
        {searchType === "Sponsorship" && filteredResults.map((sponsorship) => (
          <SponsorshipCard 
            key={sponsorship.id} 
            sponsorship={sponsorship} 
            onClick={() => handleItemClick(sponsorship.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
