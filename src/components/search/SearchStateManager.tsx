
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SearchStateManagerProps {
  children: (state: {
    searchType: string;
    selectedSport: string;
    selectedArea: string;
    nameSearch: string;
    nearMeOnly: boolean;
    handleSearchTypeChange: (newType: string) => void;
    setSelectedSport: (sport: string) => void;
    setSelectedArea: (area: string) => void;
    setNameSearch: (name: string) => void;
    setNearMeOnly: (nearMe: boolean) => void;
  }) => React.ReactNode;
}

const SearchStateManager: React.FC<SearchStateManagerProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const typeFromURL = searchParams.get('type');
  
  // Default to Tournament if no type specified
  const [searchType, setSearchType] = useState<string>(typeFromURL || 'Tournament');
  const [selectedSport, setSelectedSport] = useState<string>('any_sport');
  const [selectedArea, setSelectedArea] = useState<string>('any_area');
  const [nameSearch, setNameSearch] = useState<string>('');
  const [nearMeOnly, setNearMeOnly] = useState<boolean>(false);

  // Handle search type changes from URL only - preserve current search type if no type in URL
  useEffect(() => {
    if (typeFromURL) {
      console.log(`URL search type changed to: ${typeFromURL}`);
      setSearchType(typeFromURL);
    }
    // Don't add searchType as a dependency to prevent cyclical updates
  }, [typeFromURL]);

  // Update URL when search type changes from the UI
  const handleSearchTypeChange = (newType: string) => {
    if (newType && newType !== searchType) {
      setSearchType(newType);
      
      // Update URL to reflect the new search type but preserve other params
      const params = new URLSearchParams(location.search);
      params.set('type', newType);
      
      // Use replace to avoid accumulating history entries
      navigate(`/search?${params.toString()}`, { replace: true });
      console.log(`Search type changed to: ${newType} via UI`);
    }
  };

  return (
    <>
      {children({
        searchType,
        selectedSport,
        selectedArea,
        nameSearch,
        nearMeOnly,
        handleSearchTypeChange,
        setSelectedSport,
        setSelectedArea,
        setNameSearch,
        setNearMeOnly,
      })}
    </>
  );
};

export default SearchStateManager;
