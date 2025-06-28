
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Crown, Shield, Star, Trash2, Users } from 'lucide-react';
import { TeamMember } from '@/hooks/useTeamMembership';

interface TeamMembersListProps {
  members: TeamMember[];
  currentUserRole?: string;
  onUpdateRole?: (userId: string, newRole: 'captain' | 'admin' | 'member') => void;
  onRemoveMember?: (userId: string) => void;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({
  members,
  currentUserRole,
  onUpdateRole,
  onRemoveMember
}) => {
  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'captain' || currentUserRole === 'admin';

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'captain':
        return <Star className="w-4 h-4 text-purple-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default' as const;
      case 'captain':
        return 'secondary' as const;
      case 'admin':
        return 'outline' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {getRoleIcon(member.role)}
                </div>
                <div>
                  <p className="font-medium">
                    {member.user_profile?.display_name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Member • Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(member.role)}>
                  {member.role}
                </Badge>
                
                {canManageMembers && member.role !== 'owner' && (
                  <div className="flex items-center gap-1">
                    <Select
                      value={member.role}
                      onValueChange={(value) => onUpdateRole?.(member.user_id, value as 'captain' | 'admin' | 'member')}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="captain">Captain</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveMember?.(member.user_id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {members.length === 0 && (
            <p className="text-center text-gray-500 py-8">No team members found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMembersList;
