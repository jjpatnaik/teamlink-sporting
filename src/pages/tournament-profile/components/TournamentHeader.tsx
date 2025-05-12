
import React from 'react';
import { Trophy } from 'lucide-react';
import { Tournament } from '../hooks/useTournamentData';

interface TournamentHeaderProps {
  tournament: Tournament;
}

const TournamentHeader: React.FC<TournamentHeaderProps> = ({ tournament }) => {
  return (
    <div className="bg-gradient-to-r from-sport-purple to-sport-purple/70 text-white p-8">
      <h1 className="text-3xl font-bold">{tournament.name}</h1>
      <div className="mt-2 flex items-center">
        <Trophy className="h-5 w-5 mr-1" />
        <span>{tournament.sport}</span>
      </div>
    </div>
  );
};

export default TournamentHeader;
