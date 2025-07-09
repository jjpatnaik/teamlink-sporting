
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, UserPlus, Crown, Shield } from 'lucide-react';
import { Team } from '@/hooks/useTeams';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface TeamCardProps {
  team: Team;
  onJoinTeam?: (teamId: string) => void;
  showJoinButton?: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ 
  team, 
  onJoinTeam,
  showJoinButton = true 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewDetails = () => {
    console.log('TeamCard: View Details clicked for team:', {
      id: team.id,
      name: team.name,
      fullTeamObject: team
    });
    navigate(`/team/${team.id}`);
  };

  // Show join button only if user is not owner, not a member, and showJoinButton is true
  const shouldShowJoinButton = showJoinButton && !team.isOwned && !team.isMember && user;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
          <div className="flex gap-2 flex-wrap">
            {team.isOwned && (
              <Badge className="bg-yellow-500 text-white flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Owner
              </Badge>
            )}
            {team.isMember && !team.isOwned && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {team.membershipRole || 'Member'}
              </Badge>
            )}
          </div>
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
            onClick={handleViewDetails}
            className="flex-1"
          >
            View Details
          </Button>
          {shouldShowJoinButton && (
            <Button 
              size="sm" 
              onClick={() => onJoinTeam?.(team.id)}
              className="flex items-center gap-1"
            >
              <UserPlus className="w-4 h-4" />
              Join
            </Button>
          )}
          {team.isOwned && (
            <Button 
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="border-sport-purple text-sport-purple hover:bg-sport-purple/10"
            >
              Manage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
