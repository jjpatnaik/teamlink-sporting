
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, UserPlus } from 'lucide-react';
import { Team } from '@/hooks/useTeamManagement';
import JoinRequestModal from './JoinRequestModal';
import { useTeamJoinRequests } from '@/hooks/useTeamJoinRequests';

interface TeamCardProps {
  team: Team & { userRole?: string; memberCount?: number };
  onViewTeam?: (teamId: string) => void;
  showJoinButton?: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ 
  team, 
  onViewTeam,
  showJoinButton = true 
}) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { createJoinRequest } = useTeamJoinRequests();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewDetails = () => {
    console.log('Team/TeamCard: View Details clicked for team:', {
      id: team.id,
      name: team.name,
      fullTeamObject: team
    });
    onViewTeam?.(team.id);
  };

  const handleJoinRequest = async (message?: string) => {
    const success = await createJoinRequest(team.id, message);
    if (success) {
      setShowJoinModal(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
            {team.userRole && (
              <Badge variant={team.userRole === 'owner' ? 'default' : 'secondary'}>
                {team.userRole}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {team.description && (
            <p className="text-gray-600 text-sm">{team.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{team.memberCount || 0} members</span>
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
            {showJoinButton && !team.userRole && (
              <Button 
                size="sm" 
                onClick={() => setShowJoinModal(true)}
                className="flex items-center gap-1"
              >
                <UserPlus className="w-4 h-4" />
                Join
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <JoinRequestModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        teamName={team.name}
        onSubmit={handleJoinRequest}
      />
    </>
  );
};

export default TeamCard;
