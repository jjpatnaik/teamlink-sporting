
import React, { useState } from 'react';
import { Search, User, Users, Trophy, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SearchDropdown = () => {
  const navigate = useNavigate();

  const handleSearch = (searchType: string) => {
    navigate(`/search?type=${searchType}&area=local`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 bg-white border border-gray-200 shadow-lg">
        <DropdownMenuItem onClick={() => handleSearch('players')} className="flex items-center space-x-2 cursor-pointer">
          <User className="h-4 w-4" />
          <span>Find Players</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/teams')} className="flex items-center space-x-2 cursor-pointer">
          <Users className="h-4 w-4" />
          <span>Browse Teams</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSearch('tournaments')} className="flex items-center space-x-2 cursor-pointer">
          <Trophy className="h-4 w-4" />
          <span>Find Tournaments</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSearch('sponsors')} className="flex items-center space-x-2 cursor-pointer">
          <Building2 className="h-4 w-4" />
          <span>Find Sponsors</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchDropdown;
