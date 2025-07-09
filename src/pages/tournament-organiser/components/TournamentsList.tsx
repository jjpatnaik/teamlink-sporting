
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import TournamentCard from "./TournamentCard";
import TournamentCardActions from "./TournamentCardActions";
import TournamentsLoadingState from "./TournamentsLoadingState";
import TournamentsEmptyState from "./TournamentsEmptyState";
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

  const handleManageTournament = (tournamentId: string) => {
    navigate(`/organiser/tournament/${tournamentId}?tab=fixtures`);
  };

  const handleCancelTournament = (tournamentId: string, tournamentName: string) => {
    setCancellationDialog({
      isOpen: true,
      tournamentId,
      tournamentName
    });
  };

  const handleCancellationComplete = () => {
    fetchOrganizerTournaments();
  };

  if (loading) {
    return <TournamentsLoadingState />;
  }

  if (tournaments.length === 0) {
    return <TournamentsEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Tournaments</h2>
          <p className="text-muted-foreground">Manage and track all your tournaments</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''} total
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <TournamentCard
            key={tournament.id}
            tournament={tournament}
            onViewTournament={handleViewTournament}
            onManageTournament={handleManageTournament}
            onCancelTournament={handleCancelTournament}
          />
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
