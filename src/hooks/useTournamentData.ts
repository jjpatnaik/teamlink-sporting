
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type Tournament = {
  id: string | number;
  name: string;
  sport: string;
  area?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  start_date?: string;
  end_date?: string;
  teams_allowed: number;
  image?: string;
};

// Enhanced retry function with exponential backoff
const fetchWithRetry = async (fetchFunction: () => Promise<any>, retries = 3, initialDelay = 1000) => {
  let lastError;
  let delay = initialDelay;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fetchFunction();
    } catch (error) {
      console.error(`Tournament fetch attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      if (attempt < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for next attempt with exponential backoff
        delay = delay * 1.5;
      }
    }
  }
  
  throw lastError;
};

export const useTournamentData = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  
  const fetchTournaments = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      const fetchData = async () => {
        console.log("Attempting to fetch tournaments...");
        
        // Check for user session to ensure we're authenticated when needed
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session check for tournaments:", session ? "Active" : "None");
        
        const { data, error } = await supabase
          .from('tournaments')
          .select('*');

        if (error) {
          console.error("Error fetching tournaments:", error);
          throw error;
        }

        return data;
      };
      
      // Use retry logic for fetching tournaments
      const data = await fetchWithRetry(fetchData);

      if (data) {
        console.log(`Fetched ${data.length} tournaments`);
        // Transform the data to match the expected format
        const transformedData = data.map(tournament => ({
          id: tournament.id,
          name: tournament.name || "Unknown Tournament",
          sport: tournament.sport || "Unknown Sport",
          area: tournament.location || "Unknown Location",
          location: tournament.location,
          start_date: tournament.start_date,
          end_date: tournament.end_date,
          teams_allowed: tournament.teams_allowed,
          image: "https://via.placeholder.com/300x200?text=Tournament"
        }));
        
        setTournaments(transformedData);
        return transformedData;
      }
      
      console.log("No tournaments found");
      return [];
    } catch (error) {
      console.error("Error in fetchTournaments:", error);
      setConnectionError(true);
      toast({
        title: "Error fetching tournaments",
        description: "Please try again later",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return { tournaments, loading, connectionError, fetchTournaments };
};
