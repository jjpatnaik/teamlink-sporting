import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, MapPin, ExternalLink, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTeamTournaments } from '@/hooks/useTeamTournaments';
import { format } from 'date-fns';

interface TeamTournamentsProps {
  teamId: string;
  teamName: string;
  userRole?: string;
}

const TeamTournaments: React.FC<TeamTournamentsProps> = ({ teamId, teamName, userRole }) => {
  const navigate = useNavigate();
  const { tournaments, loading } = useTeamTournaments(teamId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTournamentStatusColor = (status: string) => {
    switch (status) {
      case 'registration_open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Tournament Participation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sport-purple mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Tournament Participation
          </CardTitle>
          {(userRole === 'owner' || userRole === 'captain') && (
            <Button 
              onClick={() => navigate('/tournaments')}
              className="bg-sport-purple hover:bg-sport-purple/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Register for Tournament
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {tournaments.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-sport-gray mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sport-gray mb-2">No Tournament Registrations</h3>
            <p className="text-sport-gray mb-4">
              This team hasn't registered for any tournaments yet.
            </p>
            {(userRole === 'owner' || userRole === 'captain') && (
              <Button 
                onClick={() => navigate('/tournaments')}
                className="bg-sport-purple hover:bg-sport-purple/90"
              >
                Browse Tournaments
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tournaments.map((registration) => (
              <Card key={registration.id} className="border border-sport-light-purple/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{registration.tournament.name}</h4>
                      <div className="flex items-center text-sport-gray text-sm mt-1">
                        <Trophy className="h-4 w-4 mr-1" />
                        <span>{registration.tournament.sport}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{registration.tournament.location || 'TBD'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(registration.approval_status)}>
                        {registration.approval_status}
                      </Badge>
                      <Badge className={getTournamentStatusColor(registration.tournament.tournament_status)}>
                        {registration.tournament.tournament_status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center text-sport-gray text-sm mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {registration.tournament.start_date ? 
                        format(new Date(registration.tournament.start_date), 'MMM dd, yyyy') : 
                        'TBD'
                      }
                      {registration.tournament.end_date && 
                        ` - ${format(new Date(registration.tournament.end_date), 'MMM dd, yyyy')}`
                      }
                    </span>
                  </div>

                  <p className="text-sport-gray text-sm mb-4 line-clamp-2">
                    {registration.tournament.description || 'Tournament description not available.'}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-sport-gray">
                      Registered on {format(new Date(registration.created_at), 'MMM dd, yyyy')}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/tournament/${registration.tournament.id}`)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Tournament
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamTournaments;