
import React, { useState, useEffect, useCallback } from 'react';
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
  
  // Get parameters from URL or use defaults
  const typeFromURL = searchParams.get('type');
  const sportFromURL = searchParams.get('sport');
  const areaFromURL = searchParams.get('area');
  const nameFromURL = searchParams.get('name');
  const nearMeFromURL = searchParams.get('nearMe');
  
  // Log URL parameters for debugging
  useEffect(() => {
    console.log("Search URL parameters:", {
      type: typeFromURL,
      sport: sportFromURL,
      area: areaFromURL,
      name: nameFromURL,
      nearMe: nearMeFromURL
    });
  }, [typeFromURL, sportFromURL, areaFromURL, nameFromURL, nearMeFromURL]);
  
  // Initialize state with URL parameters or defaults
  const [searchType, setSearchType] = useState<string>(typeFromURL || 'Tournament');
  const [selectedSport, setSelectedSport] = useState<string>(sportFromURL || 'any_sport');
  const [selectedArea, setSelectedArea] = useState<string>(areaFromURL || 'any_area');
  const [nameSearch, setNameSearch] = useState<string>(nameFromURL || '');
  const [nearMeOnly, setNearMeOnly] = useState<boolean>(nearMeFromURL === 'true');

  // Update URL when search parameters change
  const updateURLParams = useCallback((params: {[key: string]: string | null}) => {
    const currentParams = new URLSearchParams(location.search);
    
    // Preserve forceHideBadge parameter if it exists
    const preserveHideBadge = currentParams.get('forceHideBadge');
    
    // Update each parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'any_sport' || value === 'any_area' || value === 'false') {
        currentParams.delete(key);
      } else {
        currentParams.set(key, value);
      }
    });
    
    // Always preserve the type parameter
    if (!currentParams.has('type') && searchType) {
      currentParams.set('type', searchType);
    }
    
    // Preserve forceHideBadge if it existed
    if (preserveHideBadge) {
      currentParams.set('forceHideBadge', preserveHideBadge);
    }
    
    // Replace current URL with updated parameters
    navigate(`/search?${currentParams.toString()}`, { replace: true });
    console.log('Updated URL parameters:', currentParams.toString());
  }, [location.search, navigate, searchType]);

  // Handle search type changes from URL
  useEffect(() => {
    if (typeFromURL && typeFromURL !== searchType) {
      console.log(`URL search type changed to: ${typeFromURL}`);
      setSearchType(typeFromURL);
    }
  }, [typeFromURL, searchType]);

  // Update URL when filters change
  useEffect(() => {
    updateURLParams({
      'type': searchType,
      'sport': selectedSport !== 'any_sport' ? selectedSport : null,
      'area': selectedArea !== 'any_area' ? selectedArea : null,
      'name': nameSearch || null,
      'nearMe': nearMeOnly ? 'true' : null
    });
  }, [searchType, selectedSport, selectedArea, nameSearch, nearMeOnly, updateURLParams]);

  // Handle search type change from the UI
  const handleSearchTypeChange = (newType: string) => {
    if (newType && newType !== searchType) {
      setSearchType(newType);
      updateURLParams({'type': newType});
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
