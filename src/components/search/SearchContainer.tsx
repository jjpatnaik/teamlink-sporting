
import React from 'react';
import SearchStateManager from './SearchStateManager';
import SearchResultsManager from './SearchResultsManager';

const SearchContainer: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <SearchStateManager>
        {({ 
          searchType, 
          selectedSport, 
          selectedArea, 
          nameSearch, 
          nearMeOnly,
          handleSearchTypeChange, 
          setSelectedSport, 
          setSelectedArea, 
          setNameSearch, 
          setNearMeOnly 
        }) => (
          <>
            <h1 className="text-3xl font-bold mb-6">Find {searchType}</h1>
            
            <SearchResultsManager
              searchType={searchType}
              handleSearchTypeChange={handleSearchTypeChange}
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
              nameSearch={nameSearch}
              setNameSearch={setNameSearch}
              nearMeOnly={nearMeOnly}
              setNearMeOnly={setNearMeOnly}
            />
          </>
        )}
      </SearchStateManager>
    </div>
  );
};

export default SearchContainer;
