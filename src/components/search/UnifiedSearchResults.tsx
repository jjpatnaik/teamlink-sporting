
import React from 'react';
import { Search } from "lucide-react";
import UnifiedProfileCard from './UnifiedProfileCard';
import { SearchProfile } from '@/hooks/useUnifiedSearch';

interface UnifiedSearchResultsProps {
  profiles: SearchProfile[];
  handleItemClick: (id: string) => void;
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
  handleItemClick,
  loading = false,
  searchFilters
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

  const getFilterDescription = () => {
    const filters = [];
    if (searchFilters.profileType && searchFilters.profileType !== 'all') {
      const typeLabels = {
        'player': 'Sports Enthusiasts',
        'team_captain': 'Team Captains',
        'tournament_organizer': 'Tournament Organizers',
        'sponsor': 'Sponsors'
      };
      filters.push(typeLabels[searchFilters.profileType as keyof typeof typeLabels] || searchFilters.profileType);
    }
    if (searchFilters.selectedSport && searchFilters.selectedSport !== "any_sport") {
      filters.push(`in ${searchFilters.selectedSport}`);
    }
    if (searchFilters.selectedArea && searchFilters.selectedArea !== "any_area") {
      filters.push(`from ${searchFilters.selectedArea}`);
    }
    return filters.length > 0 ? ` ${filters.join(' ')}` : '';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Sports Community</h2>
      <p className="text-sport-gray mb-4">
        {profiles.length} profile{profiles.length !== 1 ? 's' : ''} found{getFilterDescription()}
      </p>
      
      {profiles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-lg font-medium">No profiles found</h3>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <UnifiedProfileCard 
              key={profile.id} 
              profile={profile} 
              onClick={handleItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UnifiedSearchResults;
