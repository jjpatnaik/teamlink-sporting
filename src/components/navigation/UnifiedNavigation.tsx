
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, User, Users, Calendar, LogOut, Settings, Plus, Search, Home, Menu } from 'lucide-react';

const UnifiedNavigation = () => {
  const { user, profile, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/auth")} className="hidden sm:flex">
          Sign In
        </Button>
        <Button onClick={() => navigate("/auth")} className="hidden sm:flex">
          Sign Up
        </Button>
        
        {/* Mobile menu for unauthenticated users */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="sm:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/auth")}>
              Sign In
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/auth")}>
              Sign Up
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  const handleMyProfile = () => {
    if (profile) {
      navigate(`/player/${user.id}`);
    } else {
      navigate('/createprofile');
    }
  };

  const canAccessTeams = hasRole('player') || hasRole('team_admin');
  const canCreateTeams = hasRole('team_admin') || hasRole('player');

  return (
    <div className="flex items-center space-x-2">
      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center space-x-1">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>

        <Button variant="ghost" onClick={() => navigate("/search")} className="flex items-center space-x-1">
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Button>

        {canAccessTeams && (
          <Button variant="ghost" onClick={() => navigate("/teams")} className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Teams</span>
          </Button>
        )}

        {(hasRole('organiser') || hasRole('tournament_organizer')) && (
          <Button variant="ghost" onClick={() => navigate("/organiser/tournament")} className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Tournaments</span>
          </Button>
        )}

        {/* Create Button - Prominent CTA */}
        {canCreateTeams && (
          <Button onClick={() => navigate("/teams")} className="bg-primary hover:bg-primary/90 flex items-center space-x-1">
            <Plus className="h-4 w-4" />
            <span>Create Team</span>
          </Button>
        )}
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="hidden lg:inline">{profile?.display_name || user.email?.split('@')[0] || 'User'}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
          <DropdownMenuItem onClick={handleMyProfile} className="flex items-center space-x-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigate("/edit-profile")} className="flex items-center space-x-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          
          {/* Mobile-only navigation items */}
          <div className="md:hidden">
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/")} className="flex items-center space-x-2 cursor-pointer">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/search")} className="flex items-center space-x-2 cursor-pointer">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </DropdownMenuItem>
            {canAccessTeams && (
              <DropdownMenuItem onClick={() => navigate("/teams")} className="flex items-center space-x-2 cursor-pointer">
                <Users className="h-4 w-4" />
                <span>My Teams</span>
              </DropdownMenuItem>
            )}
            {(hasRole('organiser') || hasRole('tournament_organizer')) && (
              <DropdownMenuItem onClick={() => navigate("/organiser/tournament")} className="flex items-center space-x-2 cursor-pointer">
                <Calendar className="h-4 w-4" />
                <span>My Tournaments</span>
              </DropdownMenuItem>
            )}
            {canCreateTeams && (
              <DropdownMenuItem onClick={() => navigate("/teams")} className="flex items-center space-x-2 cursor-pointer text-primary">
                <Plus className="h-4 w-4" />
                <span>Create Team</span>
              </DropdownMenuItem>
            )}
          </div>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={signOut} className="flex items-center space-x-2 cursor-pointer text-red-600">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UnifiedNavigation;
