
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import { useSearchData } from '@/hooks/useSearchData';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  const navigate = useNavigate();
  const { filteredResults, isLoading, sports, areas, refreshData } = useSearchData({
    searchType,
    selectedSport,
    selectedArea,
    nameSearch,
    nearMeOnly
  });

  // Add use effect to refresh data when search type changes
  useEffect(() => {
    refreshData();
  }, [searchType, refreshData]);

  const handleItemClick = (id: number | string) => {
    try {
      console.log(`Clicked item with id: ${id}, type: ${searchType}`);
      
      // Navigation logic based on search type
      switch (searchType) {
        case 'Player':
          navigate(`/player/${id}`);
          break;
        case 'Team':
          navigate(`/team/${id}`);
          break;
        case 'Tournament':
          navigate(`/tournament-profile/${id}`);
          break;
        case 'Sponsorship':
          navigate(`/sponsor/${id}`);
          break;
        default:
          console.log(`No navigation defined for type: ${searchType}`);
      }
      
      toast({
        title: `Viewing ${searchType} Details`,
        description: `Loading details for selected ${searchType.toLowerCase()}`
      });
    } catch (error) {
      console.error("Error handling item click:", error);
      toast({
        title: "Navigation Error",
        description: `Unable to view ${searchType.toLowerCase()} details.`,
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Refreshing results",
      description: `Updating ${searchType.toLowerCase()} data`
    });
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{searchType} Results</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-1"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
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
