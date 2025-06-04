
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Search, MessageCircle } from 'lucide-react';

interface NavigationIconsProps {
  handleQuickSearch: (searchType: string) => void;
  onChatToggle: () => void;
}

const NavigationIcons = ({ handleQuickSearch, onChatToggle }: NavigationIconsProps) => {
  const navigate = useNavigate();

  const navigateToSearch = () => {
    navigate('/search');
  };

  return (
    <div className="flex items-center space-x-6 mr-6">
      <button 
        onClick={navigateToSearch}
        className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
      >
        <Search className="w-5 h-5" />
        <span className="text-xs mt-1">Search</span>
      </button>
      <button 
        onClick={onChatToggle}
        className="flex flex-col items-center text-sport-gray hover:text-sport-purple transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs mt-1">Chat</span>
      </button>
    </div>
  );
};

export default NavigationIcons;
