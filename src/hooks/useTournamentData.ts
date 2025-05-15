
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
      console.log(`Tournament fetch attempt ${attempt + 1} starting`);
      const result = await fetchFunction();
      console.log(`Tournament fetch attempt ${attempt + 1} succeeded`);
      return result;
    } catch (error) {
      console.error(`Tournament fetch attempt ${attempt + 1} failed:`, error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error(`Error name: ${error.name}, message: ${error.message}, stack: ${error.stack}`);
      }
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

// Hook for fetching all tournaments
export const useTournamentData = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchTournaments = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      setError(null);
      
      const fetchData = async () => {
        console.log("Attempting to fetch tournaments...");
        console.log("Supabase client state:", !!supabase);
        
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
      setError(error instanceof Error ? error : new Error('Unknown error fetching tournaments'));
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

  return { tournaments, loading, connectionError, error, fetchTournaments };
};

// Hook for fetching a single tournament by ID
export const useTournamentFetch = (tournamentId?: string) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | string | null>(null);

  useEffect(() => {
    const fetchSingleTournament = async () => {
      if (!tournamentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching tournament with ID: ${tournamentId}`);
        console.log("Supabase client state:", !!supabase);
        
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching tournament:", error);
          console.error("Error details:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }
        
        console.log("Tournament data received:", data);
        
        if (data) {
          setTournament({
            id: data.id,
            name: data.name || "Unknown Tournament",
            sport: data.sport || "Unknown Sport",
            area: data.location || "Unknown Location",
            location: data.location,
            start_date: data.start_date,
            end_date: data.end_date,
            teams_allowed: data.teams_allowed,
            image: "https://via.placeholder.com/300x200?text=Tournament"
          });
        } else {
          console.log(`No tournament found with ID: ${tournamentId}`);
          setTournament(null);
        }
      } catch (err) {
        console.error("Error in useTournamentFetch:", err);
        setError(err instanceof Error ? err : `Failed to fetch tournament (ID: ${tournamentId})`);
        toast({
          title: "Error fetching tournament details",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSingleTournament();
  }, [tournamentId]);

  return { tournament, loading, error };
};
