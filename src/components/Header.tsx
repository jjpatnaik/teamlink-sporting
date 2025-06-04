
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
import ChatWindow from './chat/ChatWindow';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
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
    navigate(`/search?type=${searchType}&area=local`);
  };

  const handleChatToggle = () => {
    if (isAuthenticated) {
      setIsChatOpen(!isChatOpen);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Logo />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <NavigationIcons 
                handleQuickSearch={handleQuickSearch} 
                onChatToggle={handleChatToggle}
              />
              
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
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          <MobileMenu 
            isOpen={mobileMenuOpen} 
            isAuthenticated={isAuthenticated}
          />
        </div>
      </header>

      {/* Chat Window */}
      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default Header;
