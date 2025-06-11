
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useTournamentData } from "@/hooks/useTournamentData";
import TeamApprovalCard from "@/components/tournament/TeamApprovalCard";
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

interface TeamWithApproval {
  id: string;
  tournament_id: string;
  team_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  captain_name: string | null;
  status: string;
  approval_status: string;
  rejection_reason: string | null;
  created_at: string;
  registered_by: string | null;
  social_media_links: any;
}

const TeamApprovalPanel = () => {
  const { tournament, isOrganizer, loading } = useTournamentData();
  const [teams, setTeams] = useState<TeamWithApproval[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);

  const fetchTeamsWithApproval = async () => {
    if (!tournament?.id) return;

    try {
      setTeamsLoading(true);
      
      const { data, error } = await supabase
        .from('tournament_teams')
        .select('*')
        .eq('tournament_id', tournament.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teams:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch team registrations"
        });
        return;
      }

      setTeams(data || []);
    } catch (error) {
      console.error('Error in fetchTeamsWithApproval:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setTeamsLoading(false);
    }
  };

  useEffect(() => {
    if (tournament?.id) {
      fetchTeamsWithApproval();
    }
  }, [tournament?.id]);

  const handleStatusUpdate = () => {
    fetchTeamsWithApproval();
  };

  if (loading || teamsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sport-purple"></div>
      </div>
    );
  }

  if (!isOrganizer) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Only the tournament organizer can manage team approvals.</p>
      </div>
    );
  }

  const pendingTeams = teams.filter(team => team.approval_status === 'pending');
  const approvedTeams = teams.filter(team => team.approval_status === 'approved');
  const rejectedTeams = teams.filter(team => team.approval_status === 'rejected');

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Team Approval Management</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-2xl font-bold">{teams.length}</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div className="ml-2">
                <p className="text-2xl font-bold">{pendingTeams.length}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-2xl font-bold">{approvedTeams.length}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-red-600" />
              <div className="ml-2">
                <p className="text-2xl font-bold">{rejectedTeams.length}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Pending ({pendingTeams.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approved ({approvedTeams.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center">
            <XCircle className="w-4 h-4 mr-2" />
            Rejected ({rejectedTeams.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingTeams.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingTeams.map((team) => (
                <TeamApprovalCard 
                  key={team.id} 
                  team={team} 
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-600">
                  No pending team registrations to review.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedTeams.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {approvedTeams.map((team) => (
                <TeamApprovalCard 
                  key={team.id} 
                  team={team} 
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-600">
                  No approved teams yet.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedTeams.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {rejectedTeams.map((team) => (
                <TeamApprovalCard 
                  key={team.id} 
                  team={team} 
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-600">
                  No rejected teams.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamApprovalPanel;
