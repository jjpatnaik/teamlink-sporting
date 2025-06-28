
import React, { useState } from 'react';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useConnections } from '@/hooks/useConnections';
import ConnectionCard from '@/components/connections/ConnectionCard';
import TeamJoinRequestCard from '@/components/connections/TeamJoinRequestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, UserPlus, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ConnectionsPage = () => {
  const navigate = useNavigate();
  const { 
    connections, 
    pendingRequests, 
    teamJoinRequests,
    loading, 
    error, 
    handleConnectionResponse,
    handleTeamJoinRequestResponse
  } = useConnections();
  const [activeTab, setActiveTab] = useState("connections");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Force a page refresh
    window.location.reload();
  };

  const handleAccept = async (id: string) => {
    const result = await handleConnectionResponse(id, 'accepted');
    if (result.success) {
      toast.success("Connection request accepted");
    } else {
      toast.error(result.error || "Failed to accept connection");
    }
    return result;
  };

  const handleReject = async (id: string) => {
    const result = await handleConnectionResponse(id, 'rejected');
    if (result.success) {
      toast.success("Connection request declined");
    } else {
      toast.error(result.error || "Failed to decline connection");
    }
    return result;
  };

  const handleApproveTeamRequest = async (id: string) => {
    const result = await handleTeamJoinRequestResponse(id, 'approved');
    if (result.success) {
      toast.success("Team join request approved");
    } else {
      toast.error(result.error || "Failed to approve request");
    }
    return result;
  };

  const handleRejectTeamRequest = async (id: string) => {
    const result = await handleTeamJoinRequestResponse(id, 'rejected');
    if (result.success) {
      toast.success("Team join request declined");
    } else {
      toast.error(result.error || "Failed to decline request");
    }
    return result;
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Connections</h1>
            <div className="bg-red-50 text-red-800 p-4 rounded-md">
              <p>{error}</p>
              <Button 
                onClick={() => navigate("/login")}
                className="mt-4 bg-sport-purple hover:bg-sport-purple/90"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Calculate total pending requests (connection requests + team join requests)
  const totalPendingRequests = pendingRequests.length + teamJoinRequests.length;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Connections</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Tabs defaultValue="connections" onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="connections" className="flex-1">
                <UserCircle className="mr-2 h-4 w-4" />
                Connections
                {connections.length > 0 && (
                  <span className="ml-2 bg-sport-purple text-white text-xs rounded-full px-2 py-0.5">
                    {connections.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex-1">
                <UserPlus className="mr-2 h-4 w-4" />
                Pending Requests
                {totalPendingRequests > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {totalPendingRequests}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="connections" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
                  <p className="text-sport-gray">Loading your connections...</p>
                </div>
              ) : connections.length > 0 ? (
                connections.map(connection => (
                  <ConnectionCard 
                    key={connection.id} 
                    connection={connection} 
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <UserCircle className="h-16 w-16 text-sport-gray mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No connections yet</h3>
                  <p className="text-sport-gray mb-4">Start connecting with other players from the player search</p>
                  <Button 
                    onClick={() => navigate("/search?type=Player")}
                    className="bg-sport-purple hover:bg-sport-purple/90"
                  >
                    Find Players
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
                  <p className="text-sport-gray">Loading requests...</p>
                </div>
              ) : (
                <>
                  {/* Connection Requests */}
                  {pendingRequests.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Connection Requests</h3>
                      {pendingRequests.map(request => (
                        <ConnectionCard 
                          key={request.id} 
                          connection={request} 
                          isPending={true}
                          onAccept={handleAccept}
                          onReject={handleReject}
                        />
                      ))}
                    </div>
                  )}

                  {/* Team Join Requests */}
                  {teamJoinRequests.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Team Join Requests</h3>
                      {teamJoinRequests.map(request => (
                        <TeamJoinRequestCard 
                          key={request.id} 
                          request={request} 
                          onApprove={handleApproveTeamRequest}
                          onReject={handleRejectTeamRequest}
                        />
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {pendingRequests.length === 0 && teamJoinRequests.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <UserPlus className="h-16 w-16 text-sport-gray mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No pending requests</h3>
                      <p className="text-sport-gray">When someone sends you a connection request or wants to join your team, it will appear here</p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ConnectionsPage;
