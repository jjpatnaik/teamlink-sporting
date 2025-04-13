
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Users, Trophy, Award, Search, MapPin } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_SPORTS } from '@/data/mockData';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleQuickSearch = (sport: string) => {
    // Navigate to search page with default filters
    navigate(`/search?sport=${sport}&area=local`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-sport-purple to-sport-blue bg-clip-text text-transparent">
                Sportshive
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6 mr-6">
              <Link to="/players" className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors">
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
                  <DropdownMenuItem onClick={() => navigate('/search')}>
                    <Search className="mr-2 h-4 w-4" />
                    <span>Advanced Search</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Link to="/how-it-works" className="nav-link">
              How It Works
            </Link>
            
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="outline" 
                    className="border-sport-purple text-sport-purple hover:bg-sport-light-purple"
                    onClick={() => navigate('/players')}
                  >
                    My Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-sport-gray hover:text-sport-purple hover:bg-sport-light-purple/20"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple">
                    Log In
                  </Button>
                  <Button className="btn-primary" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3">
            <div className="grid grid-cols-5 gap-4 px-2 py-3 border-b border-gray-100">
              <Link to="/players" className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors">
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
        )}
      </div>
    </header>
  );
};

export default Header;
