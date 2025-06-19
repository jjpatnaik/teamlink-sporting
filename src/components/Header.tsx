
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

// Import our components
import Logo from './header/Logo';
import NavigationIcons from './header/NavigationIcons';
import MobileMenu from './header/MobileMenu';
import ChatWindow from './chat/ChatWindow';
import RoleBasedNavigation from './header/RoleBasedNavigation';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleQuickSearch = (searchType: string) => {
    navigate(`/search?type=${searchType}&area=local`);
  };

  const handleChatToggle = () => {
    if (user) {
      setIsChatOpen(!isChatOpen);
    } else {
      navigate('/auth');
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
              
              <RoleBasedNavigation />
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
            isAuthenticated={!!user}
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
