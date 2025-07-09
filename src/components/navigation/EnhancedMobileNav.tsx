import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  Users, 
  Calendar,
  User, 
  Plus, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const EnhancedMobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, hasRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show mobile nav if user is not authenticated
  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/teams', icon: Users, label: 'Teams' },
    { path: '/tournaments', icon: Calendar, label: 'Tournaments' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {/* Main Navigation Items */}
          {mainNavItems.slice(0, 4).map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 h-auto transition-all duration-200 ${
                isActive(item.path) 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}

          {/* Profile/Create Button */}
          <Button
            onClick={() => {
              if (profile) {
                navigate(`/player/${user.id}`);
              } else {
                navigate('/createprofile');
              }
            }}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 px-3 py-2 h-auto transition-all duration-200 ${
              location.pathname.includes('/player/') || location.pathname === '/createprofile'
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-primary hover:bg-accent'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Profile</span>
          </Button>

          {/* More Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center space-y-1 px-3 py-2 h-auto text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-200 relative"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs font-medium">More</span>
                {/* Notification indicator */}
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-destructive text-destructive-foreground">
                  3
                </Badge>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[400px] rounded-t-lg">
              <SheetHeader>
                <SheetTitle className="text-left">Quick Actions</SheetTitle>
              </SheetHeader>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* Notifications */}
                <Button
                  variant="outline"
                  onClick={() => handleNavigation('/notifications')}
                  className="h-20 flex flex-col items-center justify-center space-y-2 relative"
                >
                  <Bell className="h-6 w-6" />
                  <span className="text-sm">Notifications</span>
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground">
                    3
                  </Badge>
                </Button>

                {/* Connections */}
                <Button
                  variant="outline"
                  onClick={() => handleNavigation('/connections')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Connections</span>
                </Button>

                {/* Create Team (if eligible) */}
                {(hasRole('player') || hasRole('team_admin')) && (
                  <Button
                    onClick={() => handleNavigation('/teams')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-6 w-6" />
                    <span className="text-sm">Create Team</span>
                  </Button>
                )}

                {/* Create Tournament (if eligible) */}
                {(hasRole('organiser') || hasRole('tournament_organizer')) && (
                  <Button
                    onClick={() => handleNavigation('/organiser/tournament')}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-secondary hover:bg-secondary/90"
                  >
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Create Tournament</span>
                  </Button>
                )}

                {/* Settings */}
                <Button
                  variant="outline"
                  onClick={() => handleNavigation('/edit-profile')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <User className="h-6 w-6" />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default EnhancedMobileNav;