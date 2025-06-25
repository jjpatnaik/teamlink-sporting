
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, UserPlus } from 'lucide-react';
import { Team } from '@/hooks/useTeams';

interface TeamCardProps {
  team: Team;
  onJoinTeam?: (teamId: string) => void;
  onViewTeam?: (teamId: string) => void;
  showJoinButton?: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ 
  team, 
  onJoinTeam, 
  onViewTeam,
  showJoinButton = true 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {team.description && (
          <p className="text-gray-600 text-sm">{team.description}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{team.member_count || 0} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDate(team.created_at)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewTeam?.(team.id)}
            className="flex-1"
          >
            View Details
          </Button>
          {showJoinButton && (
            <Button 
              size="sm" 
              onClick={() => onJoinTeam?.(team.id)}
              className="flex items-center gap-1"
            >
              <UserPlus className="w-4 h-4" />
              Join
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
