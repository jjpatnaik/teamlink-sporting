
import React, { useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  User, 
  Users, 
  Trophy, 
  Award,
  MapPin,
  Dumbbell
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface SearchFiltersProps {
  searchType: string;
  setSearchType: (value: string) => void;
  selectedSport: string;
  setSelectedSport: (value: string) => void;
  selectedArea: string;
  setSelectedArea: (value: string) => void;
  nameSearch: string;
  setNameSearch: (value: string) => void;
  sports: string[];
  areas: string[];
  nearMeOnly: boolean;
  setNearMeOnly: (value: boolean) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchType,
  setSearchType,
  selectedSport,
  setSelectedSport,
  selectedArea,
  setSelectedArea,
  nameSearch,
  setNameSearch,
  sports,
  areas,
  nearMeOnly,
  setNearMeOnly
}) => {
  // Only reset filters when search type changes
  useEffect(() => {
    // Clear filters when search type changes
    setSelectedSport("any_sport");
    setSelectedArea("any_area");
    setNameSearch("");
    
    // Show toast notification to indicate search type change
    const suffix = searchType !== 'Sponsorship' ? 's' : '';
    toast({
      title: `Search Type Changed`,
      description: `Now searching for ${searchType.toLowerCase()}${suffix}`
    });
    
    console.log(`Search type changed to: ${searchType}`);
  }, [searchType, setSelectedSport, setSelectedArea, setNameSearch]);
  
  // Handle search type change - only trigger if actually different
  const handleSearchTypeChange = (value: string) => {
    if (value && value !== searchType) {
      setSearchType(value);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8 w-full lg:min-w-[280px]">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">I'm looking for</label>
          <Select value={searchType} onValueChange={handleSearchTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Player">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Player</span>
                </div>
              </SelectItem>
              <SelectItem value="Team">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Team</span>
                </div>
              </SelectItem>
              <SelectItem value="Tournament">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Tournament</span>
                </div>
              </SelectItem>
              <SelectItem value="Sponsorship">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Sponsorship</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
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
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    <span>{sport}</span>
                  </div>
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
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{area}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={`Search ${searchType.toLowerCase()} by name...`}
          className="pl-10"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="nearMe" 
          checked={nearMeOnly}
          onCheckedChange={(checked) => setNearMeOnly(checked as boolean)}
        />
        <Label 
          htmlFor="nearMe"
          className="text-sm text-sport-gray cursor-pointer"
        >
          Only show results in my area
        </Label>
      </div>
    </div>
  );
};

export default SearchFilters;
