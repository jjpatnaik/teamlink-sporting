
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { sportsOptions } from '@/constants/sportOptions';
import UnifiedSearchResults from '@/components/search/UnifiedSearchResults';
import { useUnifiedSearch, SearchProfile } from '@/hooks/useUnifiedSearch';

const SearchPage = () => {
  const [nameSearch, setNameSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState('any_sport');
  const [selectedArea, setSelectedArea] = useState('any_area');
  const [profileType, setProfileType] = useState('all');
  const navigate = useNavigate();
  
  const { profiles, loading, searchProfiles } = useUnifiedSearch();

  useEffect(() => {
    handleSearch();
  }, [selectedSport, selectedArea, profileType]);

  const handleSearch = async () => {
    await searchProfiles({
      searchTerm: nameSearch || undefined,
      profileType: profileType !== 'all' ? profileType : undefined,
      sport: selectedSport !== 'any_sport' ? selectedSport : undefined,
      city: selectedArea !== 'any_area' ? selectedArea : undefined,
    });
  };

  const handleItemClick = (profile: SearchProfile) => {
    console.log('=== PROFILE CLICK NAVIGATION ===');
    console.log('Clicked profile:', profile);
    console.log('Profile type:', profile.profile_type);
    console.log('Profile ID:', profile.id);
    
    // Navigate based on profile type using the user_id instead of profile.id
    switch (profile.profile_type) {
      case 'player':
        console.log('Navigating to player profile:', `/player/${profile.id}`);
        navigate(`/player/${profile.id}`);
        break;
      case 'team_captain':
        console.log('Navigating to team profile:', `/team/${profile.id}`);
        navigate(`/team/${profile.id}`);
        break;
      case 'tournament_organizer':
        console.log('Navigating to tournament profile:', `/tournament/${profile.id}`);
        navigate(`/tournament/${profile.id}`);
        break;
      case 'sponsor':
        console.log('Navigating to sponsor profile:', `/sponsor/${profile.id}`);
        navigate(`/sponsor/${profile.id}`);
        break;
      default:
        console.log('Unknown profile type, defaulting to player profile');
        navigate(`/player/${profile.id}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-sport-light-purple/10">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sport-blue to-sport-purple bg-clip-text text-transparent">
              Discover Sports Community
            </h1>
            <p className="text-sport-gray text-lg">
              Connect with players, teams, organizers, and sponsors
            </p>
          </div>

          {/* Search Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-sport-light-purple/20 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Name Search */}
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by name..."
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
                />
              </div>

              {/* Profile Type Filter */}
              <div>
                <Select value={profileType} onValueChange={setProfileType}>
                  <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                    <SelectValue placeholder="Profile Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="player">Sports Enthusiasts</SelectItem>
                    <SelectItem value="team_captain">Team Captains</SelectItem>
                    <SelectItem value="tournament_organizer">Tournament Organizers</SelectItem>
                    <SelectItem value="sponsor">Sponsors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sport Filter */}
              <div>
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                    <SelectValue placeholder="Sport" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="any_sport">Any Sport</SelectItem>
                    {sportsOptions.map((sport) => (
                      <SelectItem key={sport.value} value={sport.value}>
                        {sport.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div>
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-sport-blue to-sport-purple hover:opacity-90 text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <UnifiedSearchResults
            profiles={profiles}
            handleItemClick={handleItemClick}
            loading={loading}
            searchFilters={{
              selectedSport,
              selectedArea,
              nameSearch,
              profileType
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
