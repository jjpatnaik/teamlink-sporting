
import React from 'react';
import { Search, Trophy } from "lucide-react";
import UnifiedProfileCard from './UnifiedProfileCard';
import TournamentCard from './TournamentCard';
import { SearchProfile, SearchTournament } from '@/hooks/useUnifiedSearch';

interface UnifiedSearchResultsProps {
  profiles: SearchProfile[];
  tournaments: SearchTournament[];
  handleItemClick: (profile: SearchProfile) => void;
  handleTournamentClick?: (tournamentId: string) => void;
  loading?: boolean;
  searchFilters: {
    selectedSport: string;
    selectedArea: string;
    nameSearch: string;
    profileType: string;
  };
}

const UnifiedSearchResults: React.FC<UnifiedSearchResultsProps> = ({
  profiles,
  tournaments,
  handleItemClick,
  handleTournamentClick,
  loading = false,
  searchFilters
}) => {
  const totalResults = profiles.length + tournaments.length;

  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
        <h3 className="text-lg font-medium">Loading results...</h3>
        <p className="text-gray-500">Please wait while we fetch the data</p>
      </div>
    );
  }

  if (totalResults === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Search className="h-12 w-12 text-gray-300 mx-auto mb-2" />
        <h3 className="text-lg font-medium">No results found</h3>
        <p className="text-gray-500">Try adjusting your search filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-sport-light-purple/20 p-4">
        <h2 className="text-xl font-semibold mb-2">Search Results</h2>
        <p className="text-sport-gray">
          Found {profiles.length} profile{profiles.length !== 1 ? 's' : ''} and {tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''}
          {searchFilters.selectedSport && searchFilters.selectedSport !== "any_sport" ? ` for ${searchFilters.selectedSport}` : ''}
          {searchFilters.selectedArea && searchFilters.selectedArea !== "any_area" ? ` in ${searchFilters.selectedArea}` : ''}
        </p>
      </div>

      {/* Tournaments Section */}
      {tournaments.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-sport-purple" />
            <h3 className="text-lg font-semibold">Tournaments ({tournaments.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={{
                  id: tournament.id,
                  name: tournament.name,
                  sport: tournament.sport,
                  area: tournament.location || "TBD",
                  startDate: tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : "TBD",
                  endDate: tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : "TBD",
                  image: "https://via.placeholder.com/300x200?text=Tournament"
                }}
                onClick={handleTournamentClick || (() => {})}
              />
            ))}
          </div>
        </div>
      )}

      {/* Profiles Section */}
      {profiles.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-sport-purple" />
            <h3 className="text-lg font-semibold">People ({profiles.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <UnifiedProfileCard
                key={profile.id}
                profile={profile}
                onClick={() => handleItemClick(profile)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSearchResults;
