
import React, { useState } from 'react';
import TeamsHeader from '@/components/teams/TeamsHeader';
import TeamsList from '@/components/teams/TeamsList';
import CreateTeamModal from '@/components/team/CreateTeamModal';
import { useTeams } from '@/hooks/useTeams';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Trophy, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeamsManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { teams, loading, error, refetch } = useTeams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleTeamCreated = () => {
    setShowCreateModal(false);
    refetch();
  };

  const handleViewTeam = (teamId: string) => {
    console.log('TeamsManagement: Navigating to team profile for ID:', teamId);
    navigate(`/team/${teamId}`);
  };

  // Show welcome section if user has no teams
  const userTeams = teams.filter(team => team.isMember);
  const showWelcomeSection = userTeams.length === 0 && !loading;

  return (
    <div className="container mx-auto px-4 py-8">
      <TeamsHeader onCreateTeam={() => setShowCreateModal(true)} />
      
      {showWelcomeSection && (
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Users className="h-5 w-5" />
                Welcome to Team Management!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-800">
                You haven't joined or created any teams yet. Here's how to get started:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-100">
                  <Plus className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Create Your Own Team</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Start your own team and invite players to join you.
                    </p>
                    <Button onClick={() => setShowCreateModal(true)} className="w-full">
                      Create Team
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-100">
                  <Trophy className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Join Existing Teams</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Browse and join teams that match your interests.
                    </p>
                    <Button variant="outline" className="w-full">
                      Browse Teams
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <Target className="h-5 w-5 text-amber-600" />
                <p className="text-sm text-amber-800">
                  <strong>Tip:</strong> Being part of a team helps you connect with other players, 
                  participate in tournaments, and grow your sports network!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <TeamsList 
        teams={userTeams.length > 0 ? userTeams : teams} 
        loading={loading} 
        error={error}
        onViewTeam={handleViewTeam}
      />

      <CreateTeamModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTeamCreated={handleTeamCreated}
      />
    </div>
  );
};

export default TeamsManagement;
