
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface TournamentData {
  id: string;
  name: string;
  sport: string;
  area: string;
  startDate: string;
  endDate: string;
  image: string;
  location: string;
  description: string;
  format: string;
  organizer_id: string;
  isOwned: boolean;
  tournament_status: string;
}

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching tournaments:", error);
          return;
        }

        if (data) {
          // Transform the data to match the expected format
          const transformedData = data.map((tournament) => ({
            id: tournament.id,
            name: tournament.name,
            sport: tournament.sport,
            area: tournament.location || "Unknown",
            startDate: tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : "TBD",
            endDate: tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : "TBD",
            image: "https://via.placeholder.com/300x200?text=Tournament",
            location: tournament.location || "Unknown",
            description: tournament.description || "",
            format: tournament.format,
            organizer_id: tournament.organizer_id,
            isOwned: user ? tournament.organizer_id === user.id : false,
            tournament_status: tournament.tournament_status || 'registration_open'
          }));
          
          setTournaments(transformedData);
        }
      } catch (error) {
        console.error("Error in fetchTournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [user]);

  return { tournaments, loading };
};
