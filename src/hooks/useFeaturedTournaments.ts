
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tournament } from "@/hooks/useTournamentData";
import { toast } from "@/components/ui/use-toast";

export const useFeaturedTournaments = (limit = 3) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const fetchFeaturedTournaments = async () => {
    try {
      setLoading(true);
      // Fetch tournaments with better error handling
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .limit(limit);

      if (error) {
        console.error("Error fetching featured tournaments:", error);
        toast({
          title: "Error fetching featured tournaments",
          description: error.message,
          variant: "destructive"
        });
        setTournaments([]);
        return [];
      }

      if (data) {
        console.log("Fetched featured tournaments:", data.length);
        // Transform the data to match the expected format
        const transformedData = data.map(tournament => ({
          id: tournament.id,
          name: tournament.name || "Unknown Tournament",
          sport: tournament.sport || "Unknown Sport",
          area: tournament.location || "Unknown Location",
          location: tournament.location,
          startDate: tournament.start_date,
          endDate: tournament.end_date,
          start_date: tournament.start_date,
          end_date: tournament.end_date,
          teams_allowed: tournament.teams_allowed || 0,
          image: "https://via.placeholder.com/300x200?text=Tournament"
        }));
        
        setTournaments(transformedData);
        return transformedData;
      }
      return [];
    } catch (error) {
      console.error("Error in fetchFeaturedTournaments:", error);
      setTournaments([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedTournaments();
  }, [limit]);

  return { tournaments, loading, fetchFeaturedTournaments };
};
