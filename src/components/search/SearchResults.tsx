
import React from 'react';
import { Search } from "lucide-react";
import PlayerCard from './PlayerCard';
import TeamCard from './TeamCard';
import TournamentCard from './TournamentCard';
import SponsorshipCard from './SponsorshipCard';

interface SearchResultsProps {
  searchType: string;
  filteredResults: any[];
  selectedSport: string;
  selectedArea: string;
  handleItemClick: (id: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchType,
  filteredResults,
  selectedSport,
  selectedArea,
  handleItemClick
}) => {
  return (
    <div>
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
            <PlayerCard key={player.id} player={player} onClick={handleItemClick} />
          ))}
          
          {searchType === "Team" && filteredResults.map((team) => (
            <TeamCard key={team.id} team={team} onClick={handleItemClick} />
          ))}
          
          {searchType === "Tournament" && filteredResults.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} onClick={handleItemClick} />
          ))}
          
          {searchType === "Sponsorship" && filteredResults.map((sponsorship) => (
            <SponsorshipCard key={sponsorship.id} sponsorship={sponsorship} onClick={handleItemClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
