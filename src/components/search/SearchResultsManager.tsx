
import React from 'react';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import { useSearchData } from '@/hooks/useSearchData';

interface SearchResultsManagerProps {
  searchType: string;
  handleSearchTypeChange: (type: string) => void;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  nameSearch: string;
  setNameSearch: (name: string) => void;
  nearMeOnly: boolean;
  setNearMeOnly: (nearMe: boolean) => void;
}

const SearchResultsManager: React.FC<SearchResultsManagerProps> = ({
  searchType,
  handleSearchTypeChange,
  selectedSport,
  setSelectedSport,
  selectedArea,
  setSelectedArea,
  nameSearch,
  setNameSearch,
  nearMeOnly,
  setNearMeOnly,
}) => {
  const { filteredResults, isLoading, sports, areas } = useSearchData({
    searchType,
    selectedSport,
    selectedArea,
    nameSearch,
    nearMeOnly
  });

  const handleItemClick = (id: number | string) => {
    try {
      console.log(`Clicked item with id: ${id}, type: ${searchType}`);
      // Navigation logic would go here
      if (searchType === 'Tournament') {
        console.log(`View details clicked for tournament: ${id}`);
      }
    } catch (error) {
      console.error("Error handling item click:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3 w-full">
        <SearchFilters 
          searchType={searchType}
          setSearchType={handleSearchTypeChange}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          nameSearch={nameSearch}
          setNameSearch={setNameSearch}
          sports={sports}
          areas={areas}
          nearMeOnly={nearMeOnly}
          setNearMeOnly={setNearMeOnly}
        />
      </div>
      
      <div className="lg:col-span-9">
        <SearchResults 
          searchType={searchType}
          filteredResults={filteredResults}
          selectedSport={selectedSport}
          selectedArea={selectedArea}
          handleItemClick={handleItemClick}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default SearchResultsManager;
