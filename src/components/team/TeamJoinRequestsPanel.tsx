
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useTeamJoinRequests } from '@/hooks/useTeamJoinRequests';

interface TeamJoinRequestsPanelProps {
  teamId: string;
  teamName: string;
  onRequestProcessed?: () => void;
}

const TeamJoinRequestsPanel: React.FC<TeamJoinRequestsPanelProps> = ({
  teamId,
  teamName,
  onRequestProcessed
}) => {
  const {
    requests,
    loading,
    processJoinRequest
  } = useTeamJoinRequests(teamId, onRequestProcessed);

  const pendingRequests = requests.filter(request => request.status === 'pending');

  const handleProcessRequest = async (requestId: string, action: 'approved' | 'rejected') => {
    await processJoinRequest(requestId, action);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading join requests...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Join Requests ({pendingRequests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {request.user_profile?.display_name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {request.user_profile?.profile_type || 'User'}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                  
                  {request.message && (
                    <div className="bg-gray-50 p-3 rounded-md mb-2">
                      <p className="text-sm text-gray-700">"{request.message}"</p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400">
                    Requested on {new Date(request.requested_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleProcessRequest(request.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleProcessRequest(request.id, 'rejected')}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {pendingRequests.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Pending Requests
              </h3>
              <p className="text-gray-600">
                There are no join requests waiting for approval.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamJoinRequestsPanel;
