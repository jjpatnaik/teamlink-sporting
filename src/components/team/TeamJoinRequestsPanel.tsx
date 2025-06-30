
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, Users, Clock } from 'lucide-react';
import { useTeamJoinRequests } from '@/hooks/useTeamJoinRequests';

interface TeamJoinRequestsPanelProps {
  teamId: string;
  teamName: string;
}

const TeamJoinRequestsPanel: React.FC<TeamJoinRequestsPanelProps> = ({
  teamId,
  teamName
}) => {
  const { requests, loading, processJoinRequest } = useTeamJoinRequests(teamId);

  const pendingRequests = requests.filter(request => request.status === 'pending');
  const processedRequests = requests.filter(request => request.status !== 'pending');

  const handleApproveRequest = async (requestId: string) => {
    await processJoinRequest(requestId, 'approved');
  };

  const handleRejectRequest = async (requestId: string) => {
    await processJoinRequest(requestId, 'rejected');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Join Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Join Requests ({pendingRequests.length} pending)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingRequests.length === 0 && processedRequests.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No join requests yet</p>
          </div>
        ) : (
          <>
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending Requests
                </h4>
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {request.user_profile?.display_name || 'Unknown User'}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {request.user_profile?.profile_type || 'User'}
                        </Badge>
                      </div>
                      {request.message && (
                        <p className="text-sm text-gray-600 mb-2">"{request.message}"</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Requested on {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectRequest(request.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Processed Requests */}
            {processedRequests.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">Recent Decisions</h4>
                {processedRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">
                          {request.user_profile?.display_name || 'Unknown User'}
                        </p>
                        <Badge 
                          variant={request.status === 'approved' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {request.status === 'approved' ? 'Approved' : 'Rejected'} on{' '}
                        {request.processed_at ? new Date(request.processed_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamJoinRequestsPanel;
