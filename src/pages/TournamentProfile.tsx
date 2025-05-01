
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users, Clipboard, Trophy, CalendarDays, Check } from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

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
  player_names?: string[];
}

const registrationSchema = z.object({
  teamName: z.string().min(2, { message: "Team name is required" }),
  contactEmail: z.string().email({ message: "Valid email is required" }),
  playerNames: z.string().optional()
});

type RegistrationValues = z.infer<typeof registrationSchema>;

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      teamName: '',
      contactEmail: '',
      playerNames: ''
    }
  });

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData?.session?.user?.id;
        setCurrentUserId(currentUserId || null);
        
        if (!id) {
          toast.error("No tournament ID provided");
          return;
        }

        console.log("Fetching tournament with ID:", id);

        // Fetch tournament details
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', id)
          .single();
          
        if (tournamentError) {
          console.error("Error fetching tournament:", tournamentError);
          throw tournamentError;
        }
        
        if (!tournamentData) {
          console.error("Tournament not found with ID:", id);
          toast.error("Tournament not found");
          return;
        }
        
        console.log("Tournament data:", tournamentData);
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
          console.error("Error fetching teams:", teamsError);
          throw teamsError;
        }
        
        console.log("Teams data:", teamsData);
        setTeams(teamsData || []);
      } catch (error: any) {
        console.error("Error fetching tournament data:", error.message);
        toast.error("Failed to load tournament details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id && id !== ":id") {
      fetchTournamentData();
    } else {
      console.error("Invalid tournament ID:", id);
      toast.error("Invalid tournament ID");
      setLoading(false);
    }
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

  const handleRegistration = async (values: RegistrationValues) => {
    if (!tournament) return;
    
    // Check if tournament is already full
    if (teams.length >= tournament.teams_allowed) {
      toast.error("Tournament is full. No more teams can be registered");
      setIsDialogOpen(false);
      return;
    }
    
    setIsRegistrationLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('tournament_teams')
        .insert({
          tournament_id: id!,
          team_name: values.teamName,
          contact_email: values.contactEmail,
          // Store player names as additional data if provided
          status: 'registered'
        })
        .select();
        
      if (error) throw error;
      
      toast.success("Team registered successfully");
      setIsDialogOpen(false);
      
      // Refresh team list
      setTeams(prevTeams => [...prevTeams, ...(data || [])]);
      
      // Reset form
      form.reset();
    } catch (error: any) {
      console.error("Error registering team:", error.message);
      toast.error("Failed to register team");
    } finally {
      setIsRegistrationLoading(false);
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
              onClick={() => navigate('/search?type=Tournament')}
            >
              Browse Tournaments
            </Button>
          </div>
        </div>
      </>
    );
  }

  const isTournamentFull = teams.length >= tournament.teams_allowed;

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
                    <span>Teams: {teams.length}/{tournament.teams_allowed} {isTournamentFull && '(Full)'}</span>
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
                
                {/* Registration button for non-organizers */}
                {!isOrganizer && currentUserId && (
                  <div className="mt-6">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-sport-purple hover:bg-sport-purple/90"
                          disabled={isTournamentFull}
                        >
                          {isTournamentFull ? 'Tournament Full' : 'Register Your Team'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Register for {tournament.name}</DialogTitle>
                          <DialogDescription>
                            Enter your team information to participate in this tournament.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="teamName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Team Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your team name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="contactEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="contact@team.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="playerNames"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Player Names (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Enter player names, one per line" 
                                      className="resize-y min-h-[100px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Enter one player name per line
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter>
                              <Button 
                                type="submit" 
                                className="bg-sport-purple hover:bg-sport-purple/90"
                                disabled={isRegistrationLoading}
                              >
                                {isRegistrationLoading ? 'Registering...' : 'Register Team'}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
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
