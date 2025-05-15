
import { useState, useEffect } from 'react';

// Generic type that accepts any object with optional name, sport, and area properties
export const useSearchFilters = <T extends { name?: string; sport?: string; area?: string; id: string | number }>(
  items: T[],
  searchType: string,
  selectedSport: string,
  selectedArea: string,
  nameSearch: string,
  nearMeOnly: boolean,
  userCity: string | null
) => {
  const [filteredResults, setFilteredResults] = useState<T[]>([]);
  
  useEffect(() => {
    // Don't attempt to filter if items are empty
    if (!items || items.length === 0) {
      console.log(`No items to filter for ${searchType}`);
      setFilteredResults([]);
      return;
    }

    console.log(`Filtering ${items.length} ${searchType} items with:`, {
      sport: selectedSport,
      area: selectedArea,
      nameSearch,
      nearMeOnly
    });

    // Start with the provided items
    let results = [...items];
    
    // Apply sport filter if set to something other than "any_sport"
    if (selectedSport !== "any_sport") {
      results = results.filter(item => 
        item.sport && item.sport.toLowerCase() === selectedSport.toLowerCase()
      );
    }
    
    // Apply area filter if set to something other than "any_area"
    if (selectedArea !== "any_area") {
      results = results.filter(item => 
        item.area && item.area.toLowerCase().includes(selectedArea.toLowerCase())
      );
    }
    
    // Apply name search filter
    if (nameSearch && nameSearch.trim() !== '') {
      results = results.filter(item => 
        item.name && item.name.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }
    
    // Apply near me filter if enabled and we know user's location
    if (nearMeOnly && userCity) {
      results = results.filter(item => {
        return item.area && item.area.toLowerCase().includes(userCity.toLowerCase());
      });
    }
    
    console.log(`Filtered results for ${searchType}:`, {
      before: items.length,
      after: results.length
    });

    setFilteredResults(results);
  }, [items, searchType, selectedSport, selectedArea, nameSearch, nearMeOnly, userCity]);

  return filteredResults;
};
