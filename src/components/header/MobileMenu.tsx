
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { User, Users, Trophy, Award, Search, LogOut, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePlayerData } from '@/hooks/usePlayerData';

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
}

const MobileMenu = ({ isOpen, isAuthenticated }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { playerData } = usePlayerData();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navigateToSearch = (type: string) => {
    navigate(`/search?type=${type}`);
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (playerData?.full_name) {
      const nameParts = playerData.full_name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    return 'U';
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="md:hidden pt-4 pb-3 space-y-3">
      <div className="grid grid-cols-5 gap-4 px-2 py-3 border-b border-gray-100">
        <button 
          onClick={() => navigateToSearch('Player')} 
          className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Players</span>
        </button>
        <button 
          onClick={() => navigateToSearch('Team')} 
          className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
        >
          <Users className="w-5 h-5" />
          <span className="text-xs mt-1">Teams</span>
        </button>
        <button 
          onClick={() => navigateToSearch('Tournament')} 
          className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-xs mt-1">Tournaments</span>
        </button>
        <button 
          onClick={() => navigateToSearch('Sponsorship')} 
          className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
        >
          <Award className="w-5 h-5" />
          <span className="text-xs mt-1">Sponsors</span>
        </button>
        <Link to="/search" className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors">
          <Search className="w-5 h-5" />
          <span className="text-xs mt-1">Search</span>
        </Link>
      </div>
      
      <div className="px-2">
        <Link to="/how-it-works" className="nav-link block py-2">
          How It Works
        </Link>
      </div>
      
      <div className="flex flex-col space-y-2 px-2 pt-2">
        {isAuthenticated ? (
          <>
            {playerData && (
              <div className="flex items-center space-x-2 py-2 mb-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage 
                    src={playerData.profile_picture_url || ''} 
                    alt={playerData.full_name || 'User'} 
                  />
                  <AvatarFallback className="bg-sport-purple text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{playerData.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{playerData.sport || 'Athlete'}</p>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="border-sport-purple text-sport-purple hover:bg-sport-light-purple w-full justify-start"
              onClick={() => navigate('/players')}
            >
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Button>
            
            <Button 
              variant="outline" 
              className="border-sport-purple text-sport-purple hover:bg-sport-light-purple w-full justify-start"
              onClick={() => navigate('/createprofile')}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-sport-gray hover:text-sport-purple hover:bg-sport-light-purple/20 w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" asChild className="border-sport-purple text-sport-purple hover:bg-sport-light-purple w-full">
              <Link to="/login">Log In</Link>
            </Button>
            <Button className="btn-primary w-full" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
