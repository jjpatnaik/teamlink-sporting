
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown, User, Users, Calendar, LogOut } from 'lucide-react';

const UserActionsDropdown = () => {
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

  const handleMyProfile = async () => {
    if (!user) {
      toast.error("Unable to access profile");
      return;
    }

    try {
      // Check if user has a profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        // User has a profile, navigate to it
        navigate(`/player/${user.id}`);
      } else {
        // No profile found, redirect to create profile
        navigate('/createprofile');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      // Default to create profile page if there's an error
      navigate('/createprofile');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <span className="hidden sm:inline">{profile?.display_name || user.email?.split('@')[0] || 'User'}</span>
          <span className="sm:hidden">Menu</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg">
        <DropdownMenuItem onClick={handleMyProfile} className="flex items-center space-x-2 cursor-pointer">
          <User className="h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        
        {hasRole('player') && (
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

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={signOut} className="flex items-center space-x-2 cursor-pointer text-red-600">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionsDropdown;
