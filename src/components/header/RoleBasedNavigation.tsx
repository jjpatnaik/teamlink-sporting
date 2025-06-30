
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, Home, LogOut, Users, Settings, Calendar, DollarSign, Plus } from 'lucide-react';

const RoleBasedNavigation = () => {
  const { user, profile, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/auth")}>
          Sign In
        </Button>
        <Button onClick={() => navigate("/auth")}>
          Sign Up
        </Button>
      </div>
    );
  }

  const canAccessTeams = hasRole('player') || hasRole('team_admin');
  const canCreateTeams = hasRole('team_admin') || hasRole('player'); // Allow players to create teams too

  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center space-x-1">
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Button>

      {canAccessTeams && (
        <Button variant="ghost" onClick={() => navigate("/teams")} className="flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>My Teams</span>
        </Button>
      )}

      {canCreateTeams && (
        <Button onClick={() => navigate("/teams")} className="flex items-center space-x-1">
          <Plus className="h-4 w-4" />
          <span>Create Team</span>
        </Button>
      )}

      {hasRole('organiser') && (
        <Button variant="ghost" onClick={() => navigate("/organiser/tournament")} className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>Create Tournament</span>
        </Button>
      )}

      {hasRole('sponsor') && (
        <Button variant="ghost" onClick={() => navigate("/sponsor-dashboard")} className="flex items-center space-x-1">
          <DollarSign className="h-4 w-4" />
          <span>Sponsorship Dashboard</span>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2">
            <span>{profile?.display_name || user.email?.split('@')[0] || 'User'}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg">
          <DropdownMenuItem onClick={() => navigate('/createprofile')} className="flex items-center space-x-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut} className="flex items-center space-x-2 cursor-pointer text-red-600">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RoleBasedNavigation;
