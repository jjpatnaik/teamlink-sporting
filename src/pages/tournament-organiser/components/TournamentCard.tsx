
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Calendar, MapPin, Users, Settings } from "lucide-react";
import TournamentCardActions from './TournamentCardActions';

interface Tournament {
  id: string;
  name: string;
  sport: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  teams_allowed: number;
  tournament_status: string | null;
  description: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
}

interface TournamentCardProps {
  tournament: Tournament;
  onViewTournament: (tournamentId: string) => void;
  onCancelTournament: (tournamentId: string, tournamentName: string) => void;
  onManageTournament?: (tournamentId: string) => void;
}

const TournamentCard = ({ tournament, onViewTournament, onCancelTournament, onManageTournament }: TournamentCardProps) => {
  const getStatusBadge = (tournament: Tournament) => {
    if (tournament.tournament_status === 'cancelled') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        tournament.tournament_status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {tournament.tournament_status || 'Draft'}
      </span>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-sport-purple" />
              {tournament.name}
            </CardTitle>
            <p className="text-sm text-gray-600">{tournament.sport}</p>
          </div>
          
          {tournament.tournament_status !== 'cancelled' && (
            <TournamentCardActions 
              onCancelTournament={() => onCancelTournament(tournament.id, tournament.name)}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {tournament.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {tournament.location}
            </div>
          )}
          
          {tournament.start_date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              {new Date(tournament.start_date).toLocaleDateString()}
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            Up to {tournament.teams_allowed} teams
          </div>
          
          {tournament.tournament_status === 'cancelled' && tournament.cancellation_reason && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
              <p className="font-medium text-red-800">Cancellation Reason:</p>
              <p className="text-red-700">{tournament.cancellation_reason}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          {getStatusBadge(tournament)}
          
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewTournament(tournament.id)}
            >
              View Details
            </Button>
            
            {onManageTournament && tournament.tournament_status !== 'cancelled' && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => onManageTournament(tournament.id)}
                className="bg-sport-purple hover:bg-sport-purple/90"
              >
                <Settings className="h-4 w-4 mr-1" />
                Manage
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
