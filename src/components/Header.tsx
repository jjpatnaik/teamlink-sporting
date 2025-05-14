
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

// Import our new components
import Logo from './header/Logo';
import NavigationIcons from './header/NavigationIcons';
import AuthButtons from './header/AuthButtons';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleQuickSearch = (searchType: string) => {
    try {
      // Navigate to search page with type parameter and area=local parameter
      navigate(`/search?type=${searchType}&area=local`);
    } catch (error) {
      console.error("Error navigating to search:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavigationIcons handleQuickSearch={handleQuickSearch} />
            
            <a href="/how-it-works" className="nav-link">
              How It Works
            </a>
            
            <AuthButtons isAuthenticated={isAuthenticated} />
          </div>

          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              type="button"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        <MobileMenu isOpen={mobileMenuOpen} isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
};

export default Header;
