
import { useState, useEffect } from 'react';

export const useSearchFilters = <T extends { name?: string; sport?: string; area?: string; }>(
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
    // Start with the provided items
    let results = [...items];
    
    // Apply sport filter
    if (selectedSport !== "any_sport") {
      results = results.filter(item => item.sport === selectedSport);
    }
    
    // Apply area filter
    if (selectedArea !== "any_area") {
      results = results.filter(item => 
        item.area && item.area.toLowerCase().includes(selectedArea.toLowerCase())
      );
    }
    
    // Apply name search filter
    if (nameSearch) {
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
    
    console.log(`Filtered ${items.length} items to ${results.length} results`);
    setFilteredResults(results);
  }, [items, searchType, selectedSport, selectedArea, nameSearch, nearMeOnly, userCity]);

  return filteredResults;
};
