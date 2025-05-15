
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Users, Plus } from 'lucide-react';
import { Tournament, Team } from '../hooks/useTournamentData';
import RegistrationDialog from './RegistrationDialog';

export interface TournamentTeamsSectionProps {
  tournament: Tournament;
  teams: Team[];
}

const TournamentTeamsSection = ({ tournament, teams }: TournamentTeamsSectionProps) => {
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const isFull = teams.length >= tournament.teams_allowed;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Users className="mr-2 h-5 w-5 text-sport-purple" />
          Teams
        </h2>
        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
          {teams.length}/{tournament.teams_allowed}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {teams.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No teams have registered yet</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {teams.map((team) => (
              <li 
                key={team.id} 
                className="border-b border-gray-100 last:border-b-0 py-2 flex justify-between items-center"
              >
                <span>{team.team_name}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {team.status}
                </span>
              </li>
            ))}
          </ul>
        )}

        {!isFull && (
          <div className="mt-4">
            <RegistrationDialog 
              tournament={tournament}
              isTournamentFull={isFull}
            />
          </div>
        )}

        {isFull && (
          <div className="mt-4 text-center py-2 bg-yellow-50 text-yellow-800 rounded-md text-sm">
            This tournament is now full
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentTeamsSection;
