
import React from 'react';
import { Team } from '@/hooks/useTeams';
import TeamCard from './TeamCard';
import { Loader2 } from 'lucide-react';
import { useTeamMembership } from '@/hooks/useTeamMembership';
import { toast } from 'sonner';

interface TeamsListProps {
  teams: Team[];
  loading: boolean;
  error: string | null;
}

const TeamsList: React.FC<TeamsListProps> = ({ teams, loading, error }) => {
  const { sendInvitation } = useTeamMembership();

  const handleJoinTeam = async (teamId: string) => {
    // For now, we'll show a message that users need to be invited
    // In a real implementation, this could send a join request
    toast.info('To join this team, you need to be invited by a team member. Contact the team directly for an invitation.');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading teams: {error}</p>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
        <p className="text-gray-600 mb-4">Create your first team or join an existing one</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard 
          key={team.id} 
          team={team} 
          onJoinTeam={handleJoinTeam}
        />
      ))}
    </div>
  );
};

export default TeamsList;
