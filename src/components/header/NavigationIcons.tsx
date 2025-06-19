
import React from 'react';
import { Users, Trophy, Building2, MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavigationIconsProps {
  handleQuickSearch: (searchType: string) => void;
  onChatToggle: () => void;
}

const NavigationIcons: React.FC<NavigationIconsProps> = ({ handleQuickSearch, onChatToggle }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-4">
      <button 
        onClick={() => handleQuickSearch('players')}
        className="nav-link flex items-center space-x-1"
        aria-label="Find Players"
      >
        <User className="h-5 w-5" />
        <span className="hidden lg:inline">Players</span>
      </button>

      <button 
        onClick={() => navigate('/teams')}
        className="nav-link flex items-center space-x-1"
        aria-label="Teams"
      >
        <Users className="h-5 w-5" />
        <span className="hidden lg:inline">Teams</span>
      </button>

      <button 
        onClick={() => handleQuickSearch('tournaments')}
        className="nav-link flex items-center space-x-1"
        aria-label="Find Tournaments"
      >
        <Trophy className="h-5 w-5" />
        <span className="hidden lg:inline">Tournaments</span>
      </button>

      <button 
        onClick={() => handleQuickSearch('sponsors')}
        className="nav-link flex items-center space-x-1"
        aria-label="Find Sponsors"
      >
        <Building2 className="h-5 w-5" />
        <span className="hidden lg:inline">Sponsors</span>
      </button>

      <button 
        onClick={onChatToggle}
        className="nav-link flex items-center space-x-1"
        aria-label="Chat"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden lg:inline">Chat</span>
      </button>
    </div>
  );
};

export default NavigationIcons;
