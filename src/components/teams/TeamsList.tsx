
import React from 'react';
import TeamCard from '@/components/team/TeamCard';
import { Card, CardContent } from '@/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';
import { Team } from '@/hooks/useTeams';

interface TeamsListProps {
  teams: Team[];
  loading: boolean;
  error: string | null;
  onViewTeam?: (teamId: string) => void;
}

const TeamsList: React.FC<TeamsListProps> = ({ teams, loading, error, onViewTeam }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="flex items-center gap-3 p-6">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <h3 className="font-medium text-red-900">Error Loading Teams</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (teams.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Found</h3>
          <p className="text-gray-600 text-center">
            There are no teams to display at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={{
            ...team,
            // Map the useTeams Team interface to what TeamCard expects
            userRole: team.user_role,
            memberCount: team.member_count,
            owner_id: team.created_by,
            updated_at: team.created_at
          }}
          onViewTeam={onViewTeam}
          showJoinButton={!team.isMember}
        />
      ))}
    </div>
  );
};

export default TeamsList;
