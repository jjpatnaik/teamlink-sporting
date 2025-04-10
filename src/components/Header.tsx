
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from 'lucide-react';

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
            <Link to="/how-it-works" className="nav-link">
              How It Works
            </Link>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple">
                Log In
              </Button>
              <Button className="btn-primary">
                Sign Up
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
            <div className="px-2">
              <Link to="/how-it-works" className="nav-link block py-2">
                How It Works
              </Link>
            </div>
            
            <div className="flex flex-col space-y-2 px-2 pt-2">
              <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple w-full">
                Log In
              </Button>
              <Button className="btn-primary w-full">
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
