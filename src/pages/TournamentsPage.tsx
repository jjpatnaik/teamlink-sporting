import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTournaments } from '@/hooks/useTournaments';
import { sportsOptions } from '@/constants/sportOptions';

const TournamentsPage = () => {
  const navigate = useNavigate();
  const { tournaments, loading } = useTournaments();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'all' || tournament.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
            <p className="text-sport-gray">Loading tournaments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sport-blue to-sport-purple bg-clip-text text-transparent">
          Discover Tournaments
        </h1>
        <p className="text-sport-gray text-lg">
          Find and join exciting sports tournaments in your area
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-sport-light-purple/20 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sport-gray h-4 w-4" />
              <Input
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
              />
            </div>
          </div>
          
          <div>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">All Sports</SelectItem>
                {sportsOptions.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value}>
                    {sport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="registration_open">Open for Registration</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-sport-gray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-sport-gray mb-2">No tournaments found</h3>
          <p className="text-sport-gray">
            {searchTerm || selectedSport !== 'all' ? 
              'Try adjusting your search criteria to find more tournaments.' :
              'No tournaments are currently available. Check back soon!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <Card key={tournament.id} className="hover:shadow-lg transition-shadow cursor-pointer border border-sport-light-purple/20">
              <div className="relative h-48 bg-gradient-to-r from-sport-blue to-sport-purple rounded-t-lg">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-sport-purple">
                    {tournament.sport}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Trophy className="h-8 w-8" />
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{tournament.name}</CardTitle>
                <div className="flex items-center text-sport-gray text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{tournament.location}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-sport-gray">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{tournament.startDate}</span>
                    </div>
                    <Badge variant="outline" className="border-green-200 text-green-700">
                      Open
                    </Badge>
                  </div>
                  
                  <p className="text-sport-gray text-sm line-clamp-2">
                    {tournament.description || 'Join this exciting tournament and compete with teams from around the region.'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-sport-gray text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Format: {tournament.format}</span>
                    </div>
                    <Button 
                      onClick={() => navigate(`/tournament/${tournament.id}`)}
                      className="bg-sport-purple hover:bg-sport-purple/90 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentsPage;