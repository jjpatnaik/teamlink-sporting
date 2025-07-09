import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, MapPin, Users, AlertCircle, Bell, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTournamentParticipation } from '@/hooks/useTournamentParticipation';
import { format } from 'date-fns';

const MyTournamentsPage = () => {
  const navigate = useNavigate();
  const { participatedTournaments, recentUpdates, loading, withdrawFromTournament } = useTournamentParticipation();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
            <p className="text-sport-gray">Loading your tournaments...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration_open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registration_open':
        return 'Registration Open';
      case 'ongoing':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Tournaments</h1>
        <p className="text-sport-gray">Track your tournament participation and stay updated</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Tournament List */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Participated Tournaments</h2>
            
            {participatedTournaments.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Trophy className="h-16 w-16 text-sport-gray mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-sport-gray mb-2">No tournaments yet</h3>
                  <p className="text-sport-gray mb-4">
                    You haven't participated in any tournaments yet. Discover and join exciting tournaments!
                  </p>
                  <Button onClick={() => navigate('/tournaments')} className="bg-sport-purple hover:bg-sport-purple/90">
                    Browse Tournaments
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {participatedTournaments.map((tournament) => (
                  <Card key={tournament.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{tournament.name}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-sport-gray">
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 mr-1" />
                              <span>{tournament.sport}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{tournament.location}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(tournament.tournament_status)}>
                          {getStatusText(tournament.tournament_status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-sport-gray">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {tournament.start_date ? format(new Date(tournament.start_date), 'MMM dd, yyyy') : 'TBD'}
                              {tournament.end_date && ` - ${format(new Date(tournament.end_date), 'MMM dd, yyyy')}`}
                            </span>
                          </div>
                          <div className="flex items-center text-sport-gray">
                            <Users className="h-4 w-4 mr-1" />
                            <span>
                              {tournament.registration_type === 'team' ? 
                                `Team: ${tournament.team_name}` : 
                                'Individual'
                              }
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sport-gray text-sm">
                          {tournament.description || 'Tournament description not available.'}
                        </p>
                        
                        <div className="flex justify-between items-center pt-2">
                          <Badge variant="outline" className="text-xs">
                            Format: {tournament.format}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/tournament/${tournament.id}`)}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {tournament.status === 'active' && tournament.tournament_status !== 'completed' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => withdrawFromTournament(tournament.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Withdraw
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Recent Updates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentUpdates.length === 0 ? (
                <div className="text-center py-6">
                  <AlertCircle className="h-12 w-12 text-sport-gray mx-auto mb-2" />
                  <p className="text-sport-gray text-sm">No recent updates</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentUpdates.map((update) => (
                    <div key={update.id} className="border-l-4 border-sport-purple pl-4 pb-3">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm">{update.title}</h4>
                        {update.is_important && (
                          <Badge variant="destructive" className="text-xs ml-2">
                            Important
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-sport-gray mb-1">{update.tournament_name}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{update.content}</p>
                      <p className="text-xs text-sport-gray mt-1">
                        {format(new Date(update.created_at), 'MMM dd, hh:mm a')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => navigate('/tournaments')}
              >
                Browse Tournaments
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/teams')}
              >
                Manage Teams
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyTournamentsPage;