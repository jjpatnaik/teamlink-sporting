
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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
}

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*');

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
            format: tournament.format
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
  }, []);

  return { tournaments, loading };
};
