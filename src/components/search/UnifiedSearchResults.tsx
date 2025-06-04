
import React from 'react';
import { Search } from "lucide-react";
import PlayerCard from './PlayerCard';
import TeamCard from './TeamCard';
import TournamentCard from './TournamentCard';
import SponsorshipCard from './SponsorshipCard';

interface UnifiedSearchResultsProps {
  players: any[];
  teams: any[];
  tournaments: any[];
  sponsorships: any[];
  handleItemClick: (id: number, type: string) => void;
  loading?: boolean;
  searchFilters: {
    selectedSport: string;
    selectedArea: string;
    nameSearch: string;
  };
}

const UnifiedSearchResults: React.FC<UnifiedSearchResultsProps> = ({
  players,
  teams,
  tournaments,
  sponsorships,
  handleItemClick,
  loading = false,
  searchFilters
}) => {
  const totalResults = players.length + teams.length + tournaments.length + sponsorships.length;

  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
        <h3 className="text-lg font-medium">Loading results...</h3>
        <p className="text-gray-500">Please wait while we fetch the data</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Search Results</h2>
      <p className="text-sport-gray mb-4">
        {totalResults} results found
        {searchFilters.selectedSport && searchFilters.selectedSport !== "any_sport" ? ` for ${searchFilters.selectedSport}` : ''}
        {searchFilters.selectedArea && searchFilters.selectedArea !== "any_area" ? ` in ${searchFilters.selectedArea}` : ''}
      </p>
      
      {totalResults === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="space-y-8">
          {players.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sport-purple">Players ({players.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map((player) => (
                  <PlayerCard 
                    key={`player-${player.id}`} 
                    player={player} 
                    onClick={(id) => handleItemClick(id, 'Player')} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {teams.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sport-purple">Teams ({teams.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <TeamCard 
                    key={`team-${team.id}`} 
                    team={team} 
                    onClick={(id) => handleItemClick(id, 'Team')} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {tournaments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sport-purple">Tournaments ({tournaments.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament) => (
                  <TournamentCard 
                    key={`tournament-${tournament.id}`} 
                    tournament={tournament} 
                    onClick={(id) => handleItemClick(id, 'Tournament')} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {sponsorships.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sport-purple">Sponsorships ({sponsorships.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sponsorships.map((sponsorship) => (
                  <SponsorshipCard 
                    key={`sponsorship-${sponsorship.id}`} 
                    sponsorship={sponsorship} 
                    onClick={(id) => handleItemClick(id, 'Sponsorship')} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedSearchResults;
