import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationCount } from '@/hooks/useNotificationCount';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  User,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const EnhancedHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, hasRole } = useAuth();
  const { notificationCount } = useNotificationCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/teams', label: 'Teams', icon: Users },
    { path: '/tournaments', label: 'Tournaments', icon: Calendar },
  ];

  const getInitials = () => {
    if (profile?.display_name) {
      const nameParts = profile.display_name.split(' ');
      return nameParts.length >= 2 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : nameParts[0][0].toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-200"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SH</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Sportshive
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2 max-w-md flex-1 mx-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search players, teams, tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/search')}
              className="lg:hidden hover:bg-accent transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/connections')}
                  className="relative hover:bg-accent transition-colors duration-200"
                  title="View pending notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>

                {/* Create Actions */}
                {(hasRole('player') || hasRole('team_admin')) && (
                  <Button
                    onClick={() => navigate('/teams')}
                    size="sm"
                    className="hidden md:flex items-center space-x-1 bg-primary hover:bg-primary/90 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Team</span>
                  </Button>
                )}

                {(hasRole('organiser') || hasRole('tournament_organizer')) && (
                  <Button
                    onClick={() => navigate('/organiser/tournament')}
                    size="sm"
                    className="hidden md:flex items-center space-x-1 bg-secondary hover:bg-secondary/90 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Tournament</span>
                  </Button>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full hover:bg-accent transition-colors duration-200"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={profile?.profile_picture_url || ''} 
                          alt={profile?.display_name || 'User'} 
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{profile?.display_name || 'User'}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        if (profile) {
                          navigate(`/player/${user.id}`);
                        } else {
                          navigate('/createprofile');
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/connections')}
                      className="cursor-pointer"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Connections
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/edit-profile')}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    {(hasRole('organiser') || hasRole('tournament_organizer')) && (
                      <DropdownMenuItem 
                        onClick={() => navigate('/organiser/tournament')}
                        className="cursor-pointer"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Organizer Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={signOut}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="hidden sm:flex transition-colors duration-200"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="transition-colors duration-200"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover:bg-accent transition-colors duration-200"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
              
              {user && (
                <>
                  <div className="border-t border-border my-2"></div>
                  {(hasRole('player') || hasRole('team_admin')) && (
                    <Button
                      onClick={() => {
                        navigate('/teams');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start bg-primary hover:bg-primary/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Team
                    </Button>
                  )}
                  {(hasRole('organiser') || hasRole('tournament_organizer')) && (
                    <Button
                      onClick={() => {
                        navigate('/organiser/tournament');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start bg-secondary hover:bg-secondary/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Tournament
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default EnhancedHeader;