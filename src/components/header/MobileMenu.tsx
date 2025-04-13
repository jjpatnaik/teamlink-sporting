
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { User, Users, Trophy, Award, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
}

const MobileMenu = ({ isOpen, isAuthenticated }: MobileMenuProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="md:hidden pt-4 pb-3 space-y-3">
      <div className="grid grid-cols-5 gap-4 px-2 py-3 border-b border-gray-100">
        <Link 
          to="/search?type=Player" 
          className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Players</span>
        </Link>
        <Link to="/teams" className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors">
          <Users className="w-5 h-5" />
          <span className="text-xs mt-1">Teams</span>
        </Link>
        <Link to="/tournaments" className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors">
          <Trophy className="w-5 h-5" />
          <span className="text-xs mt-1">Tournaments</span>
        </Link>
        <Link to="/sponsors" className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors">
          <Award className="w-5 h-5" />
          <span className="text-xs mt-1">Sponsors</span>
        </Link>
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
            <Button 
              variant="outline" 
              className="border-sport-purple text-sport-purple hover:bg-sport-light-purple w-full"
              onClick={() => navigate('/players')}
            >
              My Profile
            </Button>
            <Button 
              variant="ghost" 
              className="text-sport-gray hover:text-sport-purple hover:bg-sport-light-purple/20 w-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple w-full">
              Log In
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
