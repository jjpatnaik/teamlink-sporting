
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Trophy, Calendar, MapPin, Users } from "lucide-react";

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
}

const TournamentsList = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchOrganizerTournaments();
  }, []);

  const handleViewTournament = (tournamentId: string) => {
    navigate(`/tournament/${tournamentId}`);
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
        <Button className="btn-primary">
          Create Your First Tournament
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Tournaments</h2>
        <Button className="btn-primary">
          Create New Tournament
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-sport-purple" />
                {tournament.name}
              </CardTitle>
              <p className="text-sm text-gray-600">{tournament.sport}</p>
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
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tournament.tournament_status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {tournament.tournament_status || 'Draft'}
                </span>
                
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
    </div>
  );
};

export default TournamentsList;
