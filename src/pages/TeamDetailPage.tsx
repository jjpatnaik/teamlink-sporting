
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, Trophy, MapPin, User, UserPlus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamManagementPanel from '@/components/team/TeamManagementPanel';
import JoinRequestModal from '@/components/team/JoinRequestModal';
import { useAuth } from '@/hooks/useAuth';
import { useTeamJoinRequests } from '@/hooks/useTeamJoinRequests';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamDetails {
  id: string;
  name: string;
  description?: string;
  introduction?: string;
  sport?: string;
  established_year?: number;
  achievements?: string;
  owner_id: string;
  created_at: string;
  member_count: number;
  user_role?: string;
  has_pending_request?: boolean;
}

const TeamDetailPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { createJoinRequest } = useTeamJoinRequests();

  useEffect(() => {
    console.log('TeamDetailPage: teamId from params:', teamId);
    
    if (!teamId) {
      console.log('TeamDetailPage: No teamId provided, navigating to teams');
      navigate('/teams');
      return;
    }

    fetchTeamDetails();
  }, [teamId, user]);

  const fetchTeamDetails = async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      console.log('TeamDetailPage: Fetching team details for ID:', teamId);

      // Fetch team details with explicit ID filter
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      console.log('TeamDetailPage: Team query result:', { teamData, teamError });

      if (teamError) {
        console.error('TeamDetailPage: Error fetching team:', teamError);
        throw teamError;
      }

      if (!teamData) {
        console.error('TeamDetailPage: No team found with ID:', teamId);
        toast.error('Team not found');
        navigate('/teams');
        return;
      }

      // Get member count
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId);

      let memberCount = 0;
      if (membersError) {
        console.error('Error fetching member count:', membersError);
      } else {
        memberCount = membersData?.length || 0;
      }

      // Get user's role in the team if authenticated
      let userRole = undefined;
      let hasPendingRequest = false;
      if (user) {
        const { data: memberData } = await supabase
          .from('team_members')
          .select('role')
          .eq('team_id', teamId)
          .eq('user_id', user.id)
          .single();

        userRole = memberData?.role;

        // Check if user has a pending join request
        if (!userRole) {
          const { data: requestData } = await supabase
            .from('team_join_requests')
            .select('status')
            .eq('team_id', teamId)
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .single();

          hasPendingRequest = !!requestData;
        }
      }

      const teamDetails: TeamDetails = {
        id: teamData.id,
        name: teamData.name,
        description: teamData.description,
        introduction: teamData.introduction,
        sport: teamData.sport,
        established_year: teamData.established_year,
        achievements: teamData.achievements,
        owner_id: teamData.owner_id,
        created_at: teamData.created_at,
        member_count: memberCount,
        user_role: userRole,
        has_pending_request: hasPendingRequest
      };

      console.log('TeamDetailPage: Final team details:', teamDetails);
      setTeam(teamDetails);
    } catch (error: any) {
      console.error('Error fetching team details:', error);
      toast.error('Failed to load team details');
      navigate('/teams');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (message?: string) => {
    if (!teamId) return;
    
    const success = await createJoinRequest(teamId, message);
    if (success) {
      setShowJoinModal(false);
      // Refresh team details to update pending request status
      fetchTeamDetails();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading team details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Not Found</h2>
            <p className="text-gray-600 mb-4">The team you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/teams')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teams
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isMember = !!team.user_role;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/teams')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{team.name}</CardTitle>
                  {team.user_role && (
                    <Badge variant={team.user_role === 'owner' ? 'default' : 'secondary'}>
                      {team.user_role}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.sport && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{team.sport}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{team.member_count} members</span>
                </div>

                {team.established_year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Established {team.established_year}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Created {new Date(team.created_at).toLocaleDateString()}
                  </span>
                </div>

                {team.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{team.description}</p>
                  </div>
                )}

                {team.introduction && (
                  <div>
                    <h4 className="font-medium mb-2">About Us</h4>
                    <p className="text-sm text-gray-600">{team.introduction}</p>
                  </div>
                )}

                {team.achievements && (
                  <div>
                    <h4 className="font-medium mb-2">Achievements</h4>
                    <p className="text-sm text-gray-600">{team.achievements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Team Management */}
          <div className="lg:col-span-2">
            {isMember ? (
              <TeamManagementPanel 
                teamId={team.id}
                teamName={team.name}
                userRole={team.user_role}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Join this team to access management features
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Team management features are available to team members only.
                  </p>
                  {user ? (
                    <div className="space-y-4">
                      {team.has_pending_request ? (
                        <div className="space-y-2">
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Request Pending
                          </Badge>
                          <p className="text-sm text-gray-500">
                            Your join request is pending approval from the team.
                          </p>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setShowJoinModal(true)}
                          className="flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Request to Join Team
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button onClick={() => navigate('/auth')}>
                      Sign In to Join Teams
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
      
      <JoinRequestModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        teamName={team?.name || ''}
        onSubmit={handleJoinRequest}
      />
    </div>
  );
};

export default TeamDetailPage;
