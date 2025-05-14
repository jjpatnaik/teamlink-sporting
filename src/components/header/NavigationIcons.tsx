
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { User, Users, Trophy, Award, Search, MapPin } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MOCK_SPORTS } from '@/data/mockData';

interface NavigationIconsProps {
  handleQuickSearch: (searchType: string) => void;
}

const NavigationIcons = ({ handleQuickSearch }: NavigationIconsProps) => {
  const navigate = useNavigate();

  const navigateToSearch = (type: string) => {
    // Reset any existing search parameters and set the new type
    if (type) {
      // Always include the type parameter when navigating
      navigate(`/search?type=${type}`);
      console.log(`Navigating to search with type: ${type}`);
    } else {
      // If no type specified, just go to search page without parameters
      navigate('/search');
      console.log('Navigating to search with no type specified');
    }
  };

  return (
    <div className="flex items-center space-x-6 mr-6">
      <button 
        onClick={() => navigateToSearch('Player')} 
        className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
        type="button"
      >
        <User className="w-5 h-5" />
        <span className="text-xs mt-1">Players</span>
      </button>
      <button 
        onClick={() => navigateToSearch('Team')} 
        className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
        type="button"
      >
        <Users className="w-5 h-5" />
        <span className="text-xs mt-1">Teams</span>
      </button>
      <button 
        onClick={() => navigateToSearch('Tournament')} 
        className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
        type="button"
      >
        <Trophy className="w-5 h-5" />
        <span className="text-xs mt-1">Tournaments</span>
      </button>
      <button 
        onClick={() => navigateToSearch('Sponsorship')} 
        className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
        type="button"
      >
        <Award className="w-5 h-5" />
        <span className="text-xs mt-1">Sponsors</span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
            type="button"
          >
            <Search className="w-5 h-5" />
            <span className="text-xs mt-1">Search</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2">
          <div className="text-sm font-medium text-sport-gray px-2 py-1.5 mb-1">Quick Search By Sport</div>
          {MOCK_SPORTS.slice(0, 5).map((sport) => (
            <DropdownMenuItem key={sport} onClick={() => handleQuickSearch(sport)}>
              <MapPin className="mr-2 h-4 w-4" />
              <span>{sport} near me</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={() => navigateToSearch('')}>
            <Search className="mr-2 h-4 w-4" />
            <span>Advanced Search</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavigationIcons;
