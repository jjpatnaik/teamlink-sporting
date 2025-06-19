
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import CreateTeamModal from '@/components/team/CreateTeamModal';
import TeamCard from '@/components/team/TeamCard';
import TeamMembersList from '@/components/team/TeamMembersList';
import JoinRequestModal from '@/components/team/JoinRequestModal';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { useAuth } from '@/hooks/useAuth';
import { Users, UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react';

const TeamsManagement = () => {
  const { hasRole } = useAuth();
  const {
    teams,
    userTeams,
    teamMembers,
    joinRequests,
    loading,
    joinTeam,
    processJoinRequest,
    updateMemberRole,
    removeMember,
    fetchTeamMembers,
    fetchJoinRequests,
    refetch
  } = useTeamManagement();

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedTeamForJoin, setSelectedTeamForJoin] = useState<{ id: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam);
      fetchJoinRequests(selectedTeam);
    }
  }, [selectedTeam]);

  const handleJoinTeam = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setSelectedTeamForJoin({ id: team.id, name: team.name });
      setJoinModalOpen(true);
    }
  };

  const handleJoinRequest = async (message?: string) => {
    if (selectedTeamForJoin) {
      await joinTeam(selectedTeamForJoin.id, message);
      refetch();
    }
  };

  const handleViewTeam = (teamId: string) => {
    setSelectedTeam(teamId);
    setActiveTab('manage');
  };

  const currentUserRole = selectedTeam 
    ? userTeams.find(t => t.id === selectedTeam)?.userRole 
    : null;

  const pendingRequests = joinRequests.filter(r => r.status === 'pending');

  const handleDiscoverTeamsClick = () => {
    setActiveTab('discover');
  };

  // Show different tabs based on user roles
  const showManageTab = hasRole('team_admin') || hasRole('player');
  const showRequestsTab = hasRole('team_admin');

  return (
    <ProtectedRoute requiredRole="player">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Team Management</h1>
              <p className="text-gray-600 mt-2">
                {hasRole('team_admin') ? 'Create, join, and manage teams' : 'Discover and join teams'}
              </p>
            </div>
            {hasRole('team_admin') && <CreateTeamModal onTeamCreated={refetch} />}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="discover">Discover Teams</TabsTrigger>
              <TabsTrigger value="my-teams">My Teams ({userTeams.length})</TabsTrigger>
              <TabsTrigger value="manage" disabled={!selectedTeam || !showManageTab}>
                Manage Team
              </TabsTrigger>
              <TabsTrigger value="requests" disabled={!showRequestsTab}>
                Requests {pendingRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    All Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading teams...</p>
                  ) : teams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teams.map((team) => (
                        <TeamCard
                          key={team.id}
                          team={team}
                          onJoinTeam={handleJoinTeam}
                          onViewTeam={handleViewTeam}
                          showJoinButton={!userTeams.some(ut => ut.id === team.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No teams found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-teams" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Your Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userTeams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userTeams.map((team) => (
                        <TeamCard
                          key={team.id}
                          team={team}
                          onViewTeam={handleViewTeam}
                          showJoinButton={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't joined any teams yet</p>
                      <Button onClick={handleDiscoverTeamsClick}>
                        Discover Teams
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              {selectedTeam && teamMembers[selectedTeam] ? (
                <TeamMembersList
                  members={teamMembers[selectedTeam]}
                  currentUserRole={currentUserRole}
                  onUpdateRole={(userId, newRole) => updateMemberRole(selectedTeam, userId, newRole)}
                  onRemoveMember={(userId) => removeMember(selectedTeam, userId)}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">Select a team to manage its members</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Join Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {joinRequests.length > 0 ? (
                    <div className="space-y-3">
                      {joinRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">
                                {request.profile?.display_name || 'Unknown User'}
                              </p>
                              <Badge variant={
                                request.status === 'pending' ? 'default' :
                                request.status === 'approved' ? 'secondary' : 'destructive'
                              }>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              {request.profile?.profile_type} • Requested {new Date(request.requested_at).toLocaleDateString()}
                            </p>
                            {request.message && (
                              <p className="text-sm text-gray-600 mt-2 italic">"{request.message}"</p>
                            )}
                          </div>
                          
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => processJoinRequest(request.id, 'approve')}
                                className="flex items-center gap-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => processJoinRequest(request.id, 'reject')}
                                className="flex items-center gap-1"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </Button>
                            </div>
                          )}
                          
                          {request.status !== 'pending' && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              {request.status === 'approved' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              {request.processed_at && new Date(request.processed_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No join requests found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <JoinRequestModal
        isOpen={joinModalOpen}
        onClose={() => {
          setJoinModalOpen(false);
          setSelectedTeamForJoin(null);
        }}
        teamName={selectedTeamForJoin?.name || ''}
        onSubmit={handleJoinRequest}
      />
    </ProtectedRoute>
  );
};

export default TeamsManagement;
