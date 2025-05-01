
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users, Clipboard, Trophy, CalendarDays } from "lucide-react";

interface Tournament {
  id: string;
  name: string;
  description: string;
  sport: string;
  teams_allowed: number;
  format: string;
  rules: string;
  location: string;
  start_date: string;
  end_date: string;
  organizer_id: string;
}

interface Team {
  id: string;
  team_name: string;
  contact_email: string;
  status: string;
}

const TournamentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [addingTeam, setAddingTeam] = useState(false);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData?.session?.user?.id;
        
        if (!id) {
          toast.error("No tournament ID provided");
          return;
        }

        // Fetch tournament details
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', id)
          .single();
          
        if (tournamentError) {
          throw tournamentError;
        }
        
        if (!tournamentData) {
          toast.error("Tournament not found");
          return;
        }
        
        setTournament(tournamentData);
        
        // Check if current user is the organizer
        if (currentUserId && tournamentData.organizer_id === currentUserId) {
          setIsOrganizer(true);
        }
        
        // Fetch teams for this tournament
        const { data: teamsData, error: teamsError } = await supabase
          .from('tournament_teams')
          .select('*')
          .eq('tournament_id', id);
          
        if (teamsError) {
          throw teamsError;
        }
        
        setTeams(teamsData || []);
      } catch (error: any) {
        console.error("Error fetching tournament data:", error.message);
        toast.error("Failed to load tournament details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTournamentData();
  }, [id, navigate]);
  
  const handleAddTeam = async () => {
    try {
      if (!newTeamName.trim()) {
        toast.error("Team name is required");
        return;
      }
      
      setAddingTeam(true);
      
      const { data, error } = await supabase
        .from('tournament_teams')
        .insert({
          tournament_id: id!,
          team_name: newTeamName.trim(),
          contact_email: newTeamEmail.trim() || null,
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Team added successfully");
      setTeams([...(data || []), ...teams]);
      setNewTeamName('');
      setNewTeamEmail('');
    } catch (error: any) {
      console.error("Error adding team:", error.message);
      toast.error("Failed to add team");
    } finally {
      setAddingTeam(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
            <p className="text-sport-gray">Loading tournament details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!tournament) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Tournament not found</h2>
            <p className="mt-2 text-gray-600">The tournament you're looking for doesn't exist or has been removed.</p>
            <Button 
              className="mt-4 bg-sport-purple hover:bg-sport-purple/90" 
              onClick={() => navigate('/search')}
            >
              Browse Tournaments
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Tournament Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-sport-purple to-sport-purple/70 text-white p-8">
            <h1 className="text-3xl font-bold">{tournament.name}</h1>
            <div className="mt-2 flex items-center">
              <Trophy className="h-5 w-5 mr-1" />
              <span>{tournament.sport}</span>
            </div>
          </div>
          
          <div className="p-6">
            {/* Tournament Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Tournament Details</h2>
                
                {tournament.description && (
                  <p className="text-gray-700 mb-4">{tournament.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Users className="text-sport-purple h-5 w-5 mr-2" />
                    <span>Teams: {tournament.teams_allowed}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Trophy className="text-sport-purple h-5 w-5 mr-2" />
                    <span>Format: {tournament.format === 'knockout' ? 'Knockout' : 'Round Robin'}</span>
                  </div>
                  
                  {tournament.location && (
                    <div className="flex items-center">
                      <MapPin className="text-sport-purple h-5 w-5 mr-2" />
                      <span>Location: {tournament.location}</span>
                    </div>
                  )}
                  
                  {(tournament.start_date || tournament.end_date) && (
                    <div className="flex items-center">
                      <Calendar className="text-sport-purple h-5 w-5 mr-2" />
                      <span>
                        {tournament.start_date && new Date(tournament.start_date).toLocaleDateString()}
                        {tournament.start_date && tournament.end_date && ' - '}
                        {tournament.end_date && new Date(tournament.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {tournament.rules && (
                <div>
                  <h2 className="flex items-center text-xl font-semibold mb-4">
                    <Clipboard className="h-5 w-5 mr-2" />
                    Rules and Regulations
                  </h2>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700 whitespace-pre-line">{tournament.rules}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Edit button for organizer */}
            {isOrganizer && (
              <div className="mb-6 flex justify-end">
                <Button
                  onClick={() => navigate('/create-tournament')}
                  className="bg-sport-purple hover:bg-sport-purple/90"
                >
                  Create Another Tournament
                </Button>
              </div>
            )}
            
            {/* Teams Section */}
            <div>
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Users className="h-5 w-5 mr-2" />
                Participating Teams ({teams.length}/{tournament.teams_allowed})
              </h2>
              
              {teams.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                  <p className="text-gray-600">No teams have registered yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Status</TableHead>
                      {isOrganizer && <TableHead>Contact</TableHead>}
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.team_name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {team.status}
                          </span>
                        </TableCell>
                        {isOrganizer && (
                          <TableCell>{team.contact_email || 'Not provided'}</TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {/* We'd normally display a date here if we had a created_at */}
                              Recently
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {/* Add team form - only for organizer */}
              {isOrganizer && teams.length < tournament.teams_allowed && (
                <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-md">
                  <h3 className="text-lg font-medium mb-3">Add Team</h3>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      placeholder="Team Name"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="max-w-xs"
                    />
                    <Input
                      placeholder="Contact Email (optional)"
                      value={newTeamEmail}
                      onChange={(e) => setNewTeamEmail(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button 
                      onClick={handleAddTeam} 
                      disabled={addingTeam || !newTeamName.trim()} 
                      className="bg-sport-purple hover:bg-sport-purple/90"
                    >
                      {addingTeam ? "Adding..." : "Add Team"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TournamentProfile;
