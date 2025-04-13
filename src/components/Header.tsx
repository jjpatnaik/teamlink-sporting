
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, User, Users, Trophy, Award, Search } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <Link to="/search" className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors">
                <Search className="w-5 h-5" />
                <span className="text-xs mt-1">Search</span>
              </Link>
            </div>
            
            <Link to="/how-it-works" className="nav-link">
              How It Works
            </Link>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple">
                Log In
              </Button>
              <Button className="btn-primary" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
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
              <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple w-full">
                Log In
              </Button>
              <Button className="btn-primary w-full" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
