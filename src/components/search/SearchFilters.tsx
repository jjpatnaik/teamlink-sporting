
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
  MapPin,
  Dumbbell,
  Filter
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SearchFiltersProps {
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
  selectedContentType: string;
  setSelectedContentType: (value: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedSport,
  setSelectedSport,
  selectedArea,
  setSelectedArea,
  nameSearch,
  setNameSearch,
  sports,
  areas,
  nearMeOnly,
  setNearMeOnly,
  selectedContentType,
  setSelectedContentType
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Content Type</label>
          <Select value={selectedContentType} onValueChange={setSelectedContentType}>
            <SelectTrigger>
              <SelectValue placeholder="All content" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All content</SelectItem>
              <SelectItem value="players">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Players</span>
                </div>
              </SelectItem>
              <SelectItem value="teams">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Teams</span>
                </div>
              </SelectItem>
              <SelectItem value="tournaments">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Tournaments</span>
                </div>
              </SelectItem>
              <SelectItem value="sponsorships">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Sponsorships</span>
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
          placeholder="Search by name..."
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
