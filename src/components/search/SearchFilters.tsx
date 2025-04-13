
import React from 'react';
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
  areas
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">I'm looking for</label>
          <Select value={searchType} onValueChange={setSearchType}>
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
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={`Search ${searchType.toLowerCase()} by name...`}
          className="pl-10"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchFilters;
