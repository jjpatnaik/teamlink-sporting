
import { useState, useCallback } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from "@/integrations/supabase/client";
import { Tournament } from "@/hooks/useTournamentData";
import { toast } from "sonner";

export const useAllTournamentsData = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchTournaments = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Attempting to fetch tournaments...");
      console.log("Supabase client state:", !!supabase);
      
      // Test network connectivity with raw fetch to see if there are any CORS or network issues
      try {
        const testResponse = await fetch(`${supabaseUrl}/rest/v1/tournaments?select=count`, {
          method: 'HEAD',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        });
        console.log("Network test status:", testResponse.status, testResponse.statusText);
      } catch (networkError) {
        console.error("Raw fetch network error:", networkError);
      }

      // Fetch all tournaments
      const { data, error } = await supabase
        .from('tournaments')
        .select('*');
      
      if (error) {
        console.error("Error fetching tournaments:", error);
        throw error;
      }
      
      console.log(`Loaded ${data?.length || 0} tournaments`);
      setTournaments(data || []);
      return data || [];
    } catch (error: any) {
      console.error("Error in fetchTournaments:", error);
      toast.error("Failed to load tournaments data");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { tournaments, loading, fetchTournaments };
};
