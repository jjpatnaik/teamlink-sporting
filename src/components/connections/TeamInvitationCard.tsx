
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserCircle, Users } from 'lucide-react';
import { TeamInvitationType } from '@/hooks/useConnections';

type TeamInvitationCardProps = {
  invitation: TeamInvitationType;
  onAccept?: (id: string) => Promise<{ success: boolean, error?: string }>;
  onReject?: (id: string) => Promise<{ success: boolean, error?: string }>;
};

const TeamInvitationCard = ({ 
  invitation, 
  onAccept,
  onReject
}: TeamInvitationCardProps) => {
  const [acceptLoading, setAcceptLoading] = React.useState(false);
  const [rejectLoading, setRejectLoading] = React.useState(false);

  // Format date
  const formattedDate = new Date(invitation.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleAccept = async () => {
    if (!onAccept) return;
    
    setAcceptLoading(true);
    const result = await onAccept(invitation.id);
    setAcceptLoading(false);
    
    if (!result.success) {
      console.error("Error accepting team invitation:", result.error);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    
    setRejectLoading(true);
    const result = await onReject(invitation.id);
    setRejectLoading(false);
    
    if (!result.success) {
      console.error("Error rejecting team invitation:", result.error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12 border border-gray-200">
          {invitation.sender?.profile_picture_url ? (
            <AvatarImage 
              src={invitation.sender.profile_picture_url} 
              alt={invitation.sender.full_name} 
            />
          ) : (
            <AvatarFallback className="bg-sport-light-purple text-sport-purple">
              <UserCircle className="h-6 w-6" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <h3 className="font-semibold">{invitation.sender?.full_name}</h3>
          <div className="flex items-center space-x-2 text-sm text-sport-gray">
            <span>{invitation.sender?.sport}</span>
            <span>•</span>
            <span>{invitation.sender?.position}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-sport-blue mt-1">
            <Users className="h-3 w-3" />
            <span>invited you to join <strong>{invitation.team.name}</strong></span>
          </div>
          <div className="text-xs text-sport-gray mt-1">
            Invited on {formattedDate}
          </div>
          {invitation.message && (
            <div className="text-sm text-gray-600 mt-2 italic">
              "{invitation.message}"
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center space-x-2">
        <Button 
          variant="default" 
          size="sm" 
          className="bg-sport-purple hover:bg-sport-purple/90"
          onClick={handleAccept}
          disabled={acceptLoading}
        >
          <Check className="mr-1 h-4 w-4" />
          Accept
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleReject}
          disabled={rejectLoading}
        >
          <X className="mr-1 h-4 w-4" />
          Decline
        </Button>
      </div>
    </div>
  );
};

export default TeamInvitationCard;
