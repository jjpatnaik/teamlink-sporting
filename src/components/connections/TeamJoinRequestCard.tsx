
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserCircle, Users } from 'lucide-react';
import { TeamJoinRequestType } from '@/hooks/useConnections';

type TeamJoinRequestCardProps = {
  request: TeamJoinRequestType;
  onApprove?: (id: string) => Promise<{ success: boolean, error?: string }>;
  onReject?: (id: string) => Promise<{ success: boolean, error?: string }>;
};

const TeamJoinRequestCard = ({ 
  request, 
  onApprove,
  onReject
}: TeamJoinRequestCardProps) => {
  const [approveLoading, setApproveLoading] = React.useState(false);
  const [rejectLoading, setRejectLoading] = React.useState(false);

  // Format date
  const formattedDate = new Date(request.requested_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleApprove = async () => {
    if (!onApprove) return;
    
    setApproveLoading(true);
    const result = await onApprove(request.id);
    setApproveLoading(false);
    
    if (!result.success) {
      console.error("Error approving team join request:", result.error);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    
    setRejectLoading(true);
    const result = await onReject(request.id);
    setRejectLoading(false);
    
    if (!result.success) {
      console.error("Error rejecting team join request:", result.error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12 border border-gray-200">
          {request.user?.profile_picture_url ? (
            <AvatarImage 
              src={request.user.profile_picture_url} 
              alt={request.user.full_name} 
            />
          ) : (
            <AvatarFallback className="bg-sport-light-purple text-sport-purple">
              <UserCircle className="h-6 w-6" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <h3 className="font-semibold">{request.user?.full_name}</h3>
          <div className="flex items-center space-x-2 text-sm text-sport-gray">
            <span>{request.user?.sport}</span>
            <span>•</span>
            <span>{request.user?.position}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-sport-blue mt-1">
            <Users className="h-3 w-3" />
            <span>wants to join <strong>{request.team.name}</strong></span>
          </div>
          <div className="text-xs text-sport-gray mt-1">
            Requested on {formattedDate}
          </div>
          {request.message && (
            <div className="text-sm text-gray-600 mt-2 italic">
              "{request.message}"
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center space-x-2">
        <Button 
          variant="default" 
          size="sm" 
          className="bg-sport-purple hover:bg-sport-purple/90"
          onClick={handleApprove}
          disabled={approveLoading}
        >
          <Check className="mr-1 h-4 w-4" />
          Approve
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

export default TeamJoinRequestCard;
