
import { useState, useEffect } from 'react';

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
      setFilteredResults([]);
      return;
    }

    // Start with the provided items
    let results = [...items];
    
    // Apply sport filter
    if (selectedSport !== "any_sport") {
      results = results.filter(item => 
        item.sport && item.sport.toLowerCase() === selectedSport.toLowerCase()
      );
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
    
    console.log(`Search type: ${searchType}`);
    console.log(`Results count: ${results.length}`);
    console.log(`First few results:`, results.slice(0, 3));
    console.log(`Sport filter: ${selectedSport}`);
    console.log(`Area filter: ${selectedArea}`);

    setFilteredResults(results);
  }, [items, searchType, selectedSport, selectedArea, nameSearch, nearMeOnly, userCity]);

  return filteredResults;
};
