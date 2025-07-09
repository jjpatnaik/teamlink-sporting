import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, TrendingUp, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'player' | 'team' | 'tournament' | 'sponsor';
  description?: string;
  url: string;
}

interface RecentSearch {
  query: string;
  timestamp: Date;
}

const QuickSearch = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentSearches(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Mock trending searches and suggestions
  const trendingSearches = [
    'Football tournaments',
    'Basketball teams London',
    'Swimming coaching',
    'Tennis partners',
    'Local sports clubs'
  ];

  const quickFilters = [
    { label: 'Players', icon: Users, type: 'players' },
    { label: 'Teams', icon: Users, type: 'teams' },
    { label: 'Tournaments', icon: Calendar, type: 'tournaments' },
    { label: 'Sponsors', icon: TrendingUp, type: 'sponsors' }
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Save to recent searches
      const newSearch: RecentSearch = {
        query: query.trim(),
        timestamp: new Date()
      };
      
      const updatedRecent = [newSearch, ...recentSearches.filter(s => s.query !== query.trim())]
        .slice(0, 5); // Keep only 5 recent searches
      
      setRecentSearches(updatedRecent);
      localStorage.setItem('recent_searches', JSON.stringify(updatedRecent));
      
      // Navigate to search results
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleQuickFilter = (type: string) => {
    navigate(`/search?type=${type}`);
    setIsOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full max-w-md justify-start text-muted-foreground"
        >
          <Search className="mr-2 h-4 w-4" />
          Search players, teams, tournaments...
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <form onSubmit={handleFormSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search players, teams, tournaments, sponsors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-12 text-base"
              autoFocus
            />
          </form>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6 overflow-y-auto">
          {/* Quick Filters */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Filters</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickFilters.map((filter) => (
                <Button
                  key={filter.type}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickFilter(filter.type)}
                  className="justify-start h-auto py-3"
                >
                  <filter.icon className="mr-2 h-4 w-4" />
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Recent Searches
              </h3>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearch(search.query)}
                    className="w-full justify-start text-left h-auto py-2"
                  >
                    <Search className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{search.query}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trending Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((trend, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-accent transition-colors duration-200"
                  onClick={() => handleSearch(trend)}
                >
                  {trend}
                </Badge>
              ))}
            </div>
          </div>

          {/* Search Tips */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-2">Search Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use quotes for exact phrases: "football coach"</li>
                <li>• Search by location: "teams in London"</li>
                <li>• Filter by sport: "basketball tournaments"</li>
                <li>• Find sponsors: "sponsorship opportunities"</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSearch;