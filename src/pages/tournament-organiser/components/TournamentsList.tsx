import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Trophy, Calendar, MapPin, Users, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TournamentCancellationDialog from "./TournamentCancellationDialog";

interface Tournament {
  id: string;
  name: string;
  sport: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  teams_allowed: number;
  tournament_status: string | null;
  description: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
}

const TournamentsList = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellationDialog, setCancellationDialog] = useState<{
    isOpen: boolean;
    tournamentId: string;
    tournamentName: string;
  }>({
    isOpen: false,
    tournamentId: '',
    tournamentName: ''
  });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchOrganizerTournaments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to view your tournaments",
        });
        return;
      }

      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching tournaments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch your tournaments",
        });
        return;
      }

      setTournaments(data || []);
    } catch (error) {
      console.error("Error in fetchOrganizerTournaments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerTournaments();
  }, []);

  const handleViewTournament = (tournamentId: string) => {
    navigate(`/tournament/${tournamentId}`);
  };

  const handleCreateNewTournament = () => {
    console.log("Create New Tournament button clicked");
    console.log("Current search params:", searchParams.toString());
    
    const currentTab = searchParams.get('tab');
    console.log("Current tab:", currentTab);
    
    if (currentTab === 'create') {
      // If already on create tab, provide feedback and scroll to top
      toast({
        title: "Already on Create Tournament",
        description: "You're already on the tournament creation form below.",
      });
      
      // Scroll to the top of the page to show the form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to create tab
      setSearchParams({ tab: 'create' });
      toast({
        title: "Navigating to Create Tournament",
        description: "Opening the tournament creation form...",
      });
    }
  };

  const handleCancelTournament = (tournamentId: string, tournamentName: string) => {
    setCancellationDialog({
      isOpen: true,
      tournamentId,
      tournamentName
    });
  };

  const handleCancellationComplete = () => {
    // Refresh the tournaments list
    fetchOrganizerTournaments();
  };

  const getStatusBadge = (tournament: Tournament) => {
    if (tournament.tournament_status === 'cancelled') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        tournament.tournament_status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {tournament.tournament_status || 'Draft'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple"></div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No tournaments yet</h3>
        <p className="text-gray-600 mb-6">You haven't created any tournaments. Get started by creating your first tournament!</p>
        <Button className="btn-primary" onClick={handleCreateNewTournament}>
          Create Your First Tournament
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Tournaments</h2>
        <Button className="btn-primary" onClick={handleCreateNewTournament}>
          Create New Tournament
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-sport-purple" />
                    {tournament.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{tournament.sport}</p>
                </div>
                
                {tournament.tournament_status !== 'cancelled' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleCancelTournament(tournament.id, tournament.name)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancel Tournament
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {tournament.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {tournament.location}
                  </div>
                )}
                
                {tournament.start_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  Up to {tournament.teams_allowed} teams
                </div>
                
                {tournament.tournament_status === 'cancelled' && tournament.cancellation_reason && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <p className="font-medium text-red-800">Cancellation Reason:</p>
                    <p className="text-red-700">{tournament.cancellation_reason}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                {getStatusBadge(tournament)}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewTournament(tournament.id)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TournamentCancellationDialog
        isOpen={cancellationDialog.isOpen}
        onClose={() => setCancellationDialog({ isOpen: false, tournamentId: '', tournamentName: '' })}
        tournamentId={cancellationDialog.tournamentId}
        tournamentName={cancellationDialog.tournamentName}
        onCancellationComplete={handleCancellationComplete}
      />
    </div>
  );
};

export default TournamentsList;
