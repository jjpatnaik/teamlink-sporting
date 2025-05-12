
import React from 'react';
import { Button } from "@/components/ui/button";
import { Users, Trophy, MapPin, Calendar, Clipboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tournament, Team } from '../hooks/useTournamentData';
import RegistrationDialog from './RegistrationDialog';

interface TournamentDetailsProps {
  tournament: Tournament;
  teams: Team[];
  isOrganizer: boolean;
  currentUserId: string | null;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ 
  tournament, 
  teams, 
  isOrganizer, 
  currentUserId 
}) => {
  const navigate = useNavigate();
  const isTournamentFull = teams.length >= tournament.teams_allowed;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Tournament Details</h2>
        
        {tournament.description && (
          <p className="text-gray-700 mb-4">{tournament.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Users className="text-sport-purple h-5 w-5 mr-2" />
            <span>Teams: {teams.length}/{tournament.teams_allowed} {isTournamentFull && '(Full)'}</span>
          </div>
          
          <div className="flex items-center">
            <Trophy className="text-sport-purple h-5 w-5 mr-2" />
            <span>Format: {tournament.format === 'knockout' ? 'Knockout' : 'Round Robin'}</span>
          </div>
          
          {tournament.location && (
            <div className="flex items-center">
              <MapPin className="text-sport-purple h-5 w-5 mr-2" />
              <span>Location: {tournament.location}</span>
            </div>
          )}
          
          {(tournament.start_date || tournament.end_date) && (
            <div className="flex items-center">
              <Calendar className="text-sport-purple h-5 w-5 mr-2" />
              <span>
                {tournament.start_date && new Date(tournament.start_date).toLocaleDateString()}
                {tournament.start_date && tournament.end_date && ' - '}
                {tournament.end_date && new Date(tournament.end_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        
        {!isOrganizer && currentUserId && (
          <div className="mt-6">
            <RegistrationDialog 
              tournament={tournament} 
              isTournamentFull={isTournamentFull}
            />
          </div>
        )}
      </div>
      
      {tournament.rules && (
        <div>
          <h2 className="flex items-center text-xl font-semibold mb-4">
            <Clipboard className="h-5 w-5 mr-2" />
            Rules and Regulations
          </h2>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700 whitespace-pre-line">{tournament.rules}</p>
          </div>
        </div>
      )}
      
      {/* Edit button for organizer */}
      {isOrganizer && (
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => navigate('/create-tournament')}
            className="bg-sport-purple hover:bg-sport-purple/90"
          >
            Create Another Tournament
          </Button>
        </div>
      )}
    </div>
  );
};

export default TournamentDetails;
