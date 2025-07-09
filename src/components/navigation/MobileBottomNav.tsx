
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Home, Search, Users, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, hasRole } = useAuth();

  // Don't show bottom nav if user is not authenticated
  if (!user) return null;

  const canCreateTeams = hasRole('team_admin') || hasRole('player');

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/teams', icon: Users, label: 'Teams' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="sm"
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center space-y-1 px-3 py-2 ${
              isActive(item.path) 
                ? 'text-primary bg-primary/10' 
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
        
        <Button
          onClick={() => {
            if (profile) {
              navigate(`/player/${user.id}`);
            } else {
              navigate('/createprofile');
            }
          }}
          className={`flex flex-col items-center space-y-1 px-3 py-2 ${
            location.pathname.includes('/player/') || location.pathname === '/createprofile'
              ? 'text-primary bg-primary/10' 
              : 'text-gray-600 hover:text-primary'
          }`}
          variant="ghost"
          size="sm"
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Button>
        
        {canCreateTeams && (
          <Button
            onClick={() => navigate('/teams')}
            className="flex flex-col items-center space-y-1 px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Create</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileBottomNav;
