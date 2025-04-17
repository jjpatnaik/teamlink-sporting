
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ConnectionType } from '@/hooks/useConnections';

type ConnectionCardProps = {
  connection: ConnectionType;
  isPending?: boolean;
  onAccept?: (id: string) => Promise<{ success: boolean, error?: string }>;
  onReject?: (id: string) => Promise<{ success: boolean, error?: string }>;
};

const ConnectionCard = ({ 
  connection, 
  isPending = false,
  onAccept,
  onReject
}: ConnectionCardProps) => {
  const navigate = useNavigate();
  const [acceptLoading, setAcceptLoading] = React.useState(false);
  const [rejectLoading, setRejectLoading] = React.useState(false);

  // Get user data
  const userData = connection.user;
  const userId = isPending ? connection.requester_id : 
    (connection.requester_id === connection.user.full_name ? connection.receiver_id : connection.requester_id);

  // Format date
  const formattedDate = new Date(connection.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleAccept = async () => {
    if (!onAccept) return;
    
    setAcceptLoading(true);
    const result = await onAccept(connection.id);
    setAcceptLoading(false);
    
    if (!result.success) {
      console.error("Error accepting connection:", result.error);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    
    setRejectLoading(true);
    const result = await onReject(connection.id);
    setRejectLoading(false);
    
    if (!result.success) {
      console.error("Error rejecting connection:", result.error);
    }
  };

  const handleViewProfile = () => {
    navigate(`/players/${userId}`);
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!userData?.full_name) return 'U';
    
    const nameParts = userData.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12 border border-gray-200">
          {userData?.profile_picture_url ? (
            <AvatarImage 
              src={userData.profile_picture_url} 
              alt={userData.full_name} 
            />
          ) : (
            <AvatarFallback className="bg-sport-light-purple text-sport-purple">
              <UserCircle className="h-6 w-6" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <h3 className="font-semibold">{userData?.full_name}</h3>
          <div className="flex items-center space-x-2 text-sm text-sport-gray">
            <span>{userData?.sport}</span>
            <span>•</span>
            <span>{userData?.position}</span>
          </div>
          <div className="text-xs text-sport-gray mt-1">
            {isPending ? 'Requested' : 'Connected'} on {formattedDate}
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center space-x-2">
        {isPending ? (
          <>
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
          </>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;
