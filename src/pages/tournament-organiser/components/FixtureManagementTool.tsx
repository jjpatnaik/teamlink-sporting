import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Rocket, Calendar, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTournamentData } from "@/hooks/useTournamentData";

const FixtureManagementTool = () => {
  const { tournament, teams, isOrganizer, loading, refreshData } = useTournamentData();
  const [isGenerating, setIsGenerating] = useState(false);

  // Set up real-time subscription specifically for this component
  useEffect(() => {
    if (!tournament?.id) return;

    const channel = supabase
      .channel('fixture-management-teams')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournament_teams',
          filter: `tournament_id=eq.${tournament.id}`
        },
        (payload) => {
          console.log('Team approval status changed in fixture management:', payload);
          // Force refresh the data when team approval status changes
          refreshData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournament?.id, refreshData]);

  const handleManualFixtures = () => {
    // In a real app, this would navigate to the fixture builder page
    toast({
      title: "Manual Fixture Builder",
      description: "This would navigate to the manual fixture builder page",
    });
  };

  const generateRoundRobinFixtures = async () => {
    if (!tournament || !tournament.id) return;
    
    try {
      setIsGenerating(true);
      
      // Create all possible pairings for round robin
      const fixtures = [];
      let matchNumber = 1;
      
      for (let i = 0; i < approvedTeams.length; i++) {
        for (let j = i + 1; j < approvedTeams.length; j++) {
          fixtures.push({
            tournament_id: tournament.id,
            round_number: 1, // Round robin has only one round with multiple matches
            match_number: matchNumber++,
            team_1_id: approvedTeams[i].id,
            team_2_id: approvedTeams[j].id,
            status: 'scheduled',
          });
        }
      }
      
      const { error } = await supabase
        .from('fixtures')
        .insert(fixtures);
        
      if (error) throw error;
      
      // Update tournament status
      await supabase
        .from('tournaments')
        .update({
          fixture_generation_status: 'completed',
          tournament_status: 'fixtures_generated'
        })
        .eq('id', tournament.id);
      
      toast({
        title: "Fixtures Generated",
        description: `Successfully generated ${fixtures.length} fixtures for round robin format`,
      });
      
    } catch (error: any) {
      console.error("Error generating fixtures:", error);
      toast({
        title: "Error",
        description: `Failed to generate fixtures: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateKnockoutFixtures = async () => {
    if (!tournament || !tournament.id) return;
    
    try {
      setIsGenerating(true);
      
      // For knockout, we need to create the first round
      // Number of teams must be a power of 2 for perfect bracket
      const teamCount = approvedTeams.length;
      const fixtures = [];
      let matchNumber = 1;
      
      // First round pairings
      for (let i = 0; i < teamCount; i += 2) {
        if (i + 1 < teamCount) {
          fixtures.push({
            tournament_id: tournament.id,
            round_number: 1,
            match_number: matchNumber++,
            team_1_id: approvedTeams[i].id,
            team_2_id: approvedTeams[i + 1].id,
            status: 'scheduled',
          });
        }
      }
      
      const { error } = await supabase
        .from('fixtures')
        .insert(fixtures);
        
      if (error) throw error;
      
      // Update tournament status
      await supabase
        .from('tournaments')
        .update({
          fixture_generation_status: 'completed',
          tournament_status: 'fixtures_generated'
        })
        .eq('id', tournament.id);
      
      toast({
        title: "Fixtures Generated",
        description: `Successfully generated ${fixtures.length} first round fixtures for knockout format`,
      });
      
    } catch (error: any) {
      console.error("Error generating fixtures:", error);
      toast({
        title: "Error",
        description: `Failed to generate fixtures: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIFixtures = async () => {
    if (!tournament || approvedTeams.length < 2) {
      toast({
        title: "Insufficient Teams",
        description: "You need at least 2 approved teams to generate fixtures",
        variant: "destructive",
      });
      return;
    }

    // Check if registration is closed
    const now = new Date();
    const registrationDeadline = tournament.registration_deadline ? new Date(tournament.registration_deadline) : null;
    
    if (registrationDeadline && now < registrationDeadline) {
      toast({
        title: "Registration Still Open",
        description: "Wait until registration closes to generate fixtures",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate fixtures based on tournament format
      switch (tournament.format) {
        case 'round-robin':
          await generateRoundRobinFixtures();
          break;
        case 'knockout':
          await generateKnockoutFixtures();
          break;
        case 'group-knockout':
          // For now, treat as round robin (groups) - could be enhanced later
          await generateRoundRobinFixtures();
          break;
        case 'league':
          // Treat as round robin
          await generateRoundRobinFixtures();
          break;
        default:
          toast({
            title: "Unsupported Format",
            description: "This tournament format is not yet supported for automatic fixture generation",
            variant: "destructive",
          });
      }
    } catch (error: any) {
      console.error("Error in AI fixture generation:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sport-purple"></div>
      </div>
    );
  }

  if (!isOrganizer) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Only the tournament organizer can manage fixtures.</p>
      </div>
    );
  }

  // Filter to only show approved teams - this will now update in real-time
  const approvedTeams = teams.filter(team => team.approval_status === 'approved');
  
  const canGenerateFixtures = tournament?.fixture_generation_status === 'pending' && approvedTeams.length >= 2;
  const fixturesGenerated = tournament?.fixture_generation_status === 'completed';

  console.log('Approved teams in fixture management:', approvedTeams);
  console.log('All teams in fixture management:', teams);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Fixture Management</h2>
      
      {/* Tournament Status Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Tournament Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-sport-purple">{approvedTeams.length}</div>
              <div className="text-sm text-gray-600">Approved Teams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sport-blue">{tournament?.teams_allowed || 0}</div>
              <div className="text-sm text-gray-600">Max Teams</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium capitalize">
                {tournament?.tournament_status?.replace('_', ' ') || 'Unknown'}
              </div>
              <div className="text-sm text-gray-600">Current Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approved Teams Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Approved Teams ({approvedTeams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedTeams.map((team, index) => (
                <div key={team.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-sport-purple text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{team.team_name}</h4>
                      {team.contact_email && (
                        <p className="text-sm text-gray-600">{team.contact_email}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No approved teams yet. Teams need to be approved before fixtures can be generated.
            </div>
          )}
        </CardContent>
      </Card>
      
      {fixturesGenerated && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center text-green-700">
              <Calendar className="mr-2 h-5 w-5" />
              <span className="font-medium">Fixtures have been generated successfully!</span>
            </div>
            <p className="text-green-600 text-sm mt-2">
              Your tournament fixtures are ready. You can now manage match schedules and update results.
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowRight className="mr-2 h-5 w-5 text-sport-purple" />
              Manual Fixture Builder
            </CardTitle>
            <CardDescription>
              Create your tournament fixtures manually with full control over matchups and schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Perfect for custom tournament structures or when you want specific team matchups.
              You'll be able to set:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Team pairings</li>
              <li>Match dates and times</li>
              <li>Venue assignments</li>
              <li>Match officials</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={handleManualFixtures} className="w-full" disabled={fixturesGenerated}>
              {fixturesGenerated ? "Fixtures Already Generated" : "Start Manual Builder"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Rocket className="mr-2 h-5 w-5 text-sport-blue" />
              AI-Powered Fixture Generator
            </CardTitle>
            <CardDescription>
              Let our AI create balanced fixtures automatically based on your tournament format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Our AI will analyze your tournament parameters and generate optimal fixtures that:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Balance competitive fairness</li>
              <li>Optimize for venue availability</li>
              <li>Minimize travel time between matches</li>
              <li>Create the most exciting matchups</li>
            </ul>
            
            {!canGenerateFixtures && !fixturesGenerated && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-700 text-sm">
                  {approvedTeams.length < 2 
                    ? "Need at least 2 approved teams to generate fixtures" 
                    : "Wait for registration to close before generating fixtures"}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleAIFixtures} 
              variant="secondary"
              className="w-full bg-sport-blue text-white hover:bg-sport-bright-blue"
              disabled={!canGenerateFixtures || isGenerating}
            >
              {isGenerating ? "Generating..." : fixturesGenerated ? "Fixtures Already Generated" : "Generate With AI"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FixtureManagementTool;
