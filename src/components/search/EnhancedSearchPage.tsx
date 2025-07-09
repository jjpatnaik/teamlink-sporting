import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Grid, List, Users, Calendar, Trophy, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useUnifiedSearch } from '@/hooks/useUnifiedSearch';
import UnifiedProfileCard from './UnifiedProfileCard';
import TournamentCard from './TournamentCard';

const EnhancedSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Enhanced filters state
  const [selectedSport, setSelectedSport] = useState('any_sport');
  const [selectedArea, setSelectedArea] = useState('any_area');
  const [nameSearch, setNameSearch] = useState('');
  const [profileType, setProfileType] = useState('all');

  const {
    profiles,
    tournaments,
    loading,
    searchProfiles
  } = useUnifiedSearch();

  // Update search when URL params change
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    
    setSearchQuery(query);
    setActiveType(type);
    setNameSearch(query);
    
    if (query || type !== 'all') {
      handleSearch();
    }
  }, [searchParams]);

  // Perform search with current filters
  const handleSearch = () => {
    searchProfiles({
      searchTerm: nameSearch || searchQuery,
      profileType: profileType === 'all' ? undefined : profileType,
      sport: selectedSport === 'any_sport' ? undefined : selectedSport,
      city: selectedArea === 'any_area' ? undefined : selectedArea,
    });
  };

  const handleSearchSubmit = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    setNameSearch(query);
    setSearchParams(newParams);
    handleSearch();
  };

  const handleTypeChange = (type: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (type === 'all') {
      newParams.delete('type');
    } else {
      newParams.set('type', type);
    }
    setActiveType(type);
    setProfileType(type);
    setSearchParams(newParams);
    handleSearch();
  };

  const handleProfileClick = (profile: any) => {
    navigate(`/player/${profile.id}`);
  };

  const handleTournamentClick = (tournamentId: string) => {
    navigate(`/tournament/${tournamentId}`);
  };

  const searchTypes = [
    { value: 'all', label: 'All Results', icon: Search },
    { value: 'player', label: 'Players', icon: Users },
    { value: 'team_captain', label: 'Teams', icon: Users },
    { value: 'tournament_organizer', label: 'Tournaments', icon: Calendar },
    { value: 'sponsor', label: 'Sponsors', icon: Building2 }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const totalResults = profiles.length + tournaments.length;

  // Available sports and areas for filters
  const sports = ['Football', 'Basketball', 'Tennis', 'Swimming', 'Golf', 'Cricket', 'Rugby', 'Baseball', 'Volleyball', 'Athletics'];
  const areas = ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Glasgow', 'Edinburgh', 'Cardiff', 'Belfast', 'Newcastle'];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit(searchQuery);
            }}
            className="flex-1"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search players, teams, tournaments, sponsors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-12"
              />
            </div>
          </form>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>

            {/* Mobile Filters */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Search Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sport</label>
                    <Select value={selectedSport} onValueChange={setSelectedSport}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any sport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any_sport">Any sport</SelectItem>
                        {sports.map(sport => (
                          <SelectItem key={sport} value={sport}>
                            {sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area</label>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any_area">Any area</SelectItem>
                        {areas.map(area => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSearch} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Type Tabs */}
        <Tabs value={activeType} onValueChange={handleTypeChange}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="grid w-full grid-cols-5 sm:w-auto">
              {searchTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value} className="text-xs sm:text-sm flex items-center space-x-1">
                  <type.icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{type.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Sort and Results Count */}
            <div className="flex items-center space-x-4">
              {(searchQuery || activeType !== 'all') && (
                <span className="text-sm text-muted-foreground">
                  {totalResults} results found
                </span>
              )}
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Active Filters */}
      {(selectedSport !== 'any_sport' || selectedArea !== 'any_area') && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedSport !== 'any_sport' && (
            <Badge variant="secondary" className="cursor-pointer">
              {selectedSport}
              <button
                onClick={() => setSelectedSport('any_sport')}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedArea !== 'any_area' && (
            <Badge variant="secondary" className="cursor-pointer">
              {selectedArea}
              <button
                onClick={() => setSelectedArea('any_area')}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedSport('any_sport');
              setSelectedArea('any_area');
              handleSearch();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sport</label>
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_sport">Any sport</SelectItem>
                    {sports.map(sport => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Area</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_area">Any area</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} className="w-full">
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-medium">Loading results...</h3>
              <p className="text-muted-foreground">Please wait while we fetch the data</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters or search terms</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Results Summary */}
              <div className="bg-background rounded-lg shadow-sm border p-4">
                <h2 className="text-xl font-semibold mb-2">Search Results</h2>
                <p className="text-muted-foreground">
                  Found {profiles.length} profile{profiles.length !== 1 ? 's' : ''} and {tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''}
                  {selectedSport !== 'any_sport' ? ` for ${selectedSport}` : ''}
                  {selectedArea !== 'any_area' ? ` in ${selectedArea}` : ''}
                </p>
              </div>

              {/* Tournaments Section */}
              {tournaments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Tournaments ({tournaments.length})</h3>
                  </div>
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
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
                        onClick={handleTournamentClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Profiles Section */}
              {profiles.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">People ({profiles.length})</h3>
                  </div>
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {profiles.map((profile) => (
                      <UnifiedProfileCard
                        key={profile.id}
                        profile={profile}
                        onClick={() => handleProfileClick(profile)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchPage;