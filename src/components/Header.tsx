
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, X, MessageCircle } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

// Import our components
import Logo from './header/Logo';
import MobileMenu from './header/MobileMenu';
import ChatWindow from './chat/ChatWindow';
import SearchDropdown from './header/SearchDropdown';
import UserActionsDropdown from './header/UserActionsDropdown';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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

            <div className="hidden md:flex items-center space-x-6">
              <SearchDropdown />
              
              <a href="/how-it-works" className="nav-link">
                How It Works
              </a>
              
              <Button 
                variant="ghost" 
                onClick={handleChatToggle}
                className="flex items-center space-x-1"
                aria-label="Chat"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">Chat</span>
              </Button>
              
              <UserActionsDropdown />
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
