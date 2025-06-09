
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "./tournamentFormSchema";

export const useTournamentFormSubmission = () => {
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    console.log("Starting tournament creation process...");
    
    try {
      // Check for authenticated user
      console.log("Checking authentication...");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast({
          title: "Authentication Error",
          description: `Failed to get session: ${sessionError.message}`,
          variant: "destructive",
        });
        return;
      }
      
      if (!sessionData.session?.user) {
        console.error("No authenticated user found");
        toast({
          title: "Authentication Required",
          description: "You need to be logged in to create a tournament",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const organizerId = sessionData.session.user.id;
      console.log("User authenticated, organizer ID:", organizerId);
      
      // Convert string numbers to integers with validation
      const teamsAllowed = parseInt(data.teamsAllowed);
      const entryFee = data.entryFee ? parseFloat(data.entryFee) : 0;
      const teamSize = data.teamSize ? parseInt(data.teamSize) : null;
      
      if (isNaN(teamsAllowed) || teamsAllowed < 1) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid number of teams allowed",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Submitting tournament with data:", {
        name: data.name,
        format: data.format,
        sport: data.sport,
        teamsAllowed,
        organizerId
      });
      
      // Prepare tournament data
      const tournamentData = {
        name: data.name,
        description: data.description || null,
        sport: data.sport,
        format: data.format,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate.toISOString(),
        location: data.location || null,
        teams_allowed: teamsAllowed,
        entry_fee: entryFee,
        team_size: teamSize,
        registration_deadline: data.registrationDeadline.toISOString(),
        organizer_id: organizerId,
        tournament_status: 'registration_open',
        fixture_generation_status: 'pending',
        rules: null,
      };
      
      console.log("Attempting to insert tournament:", tournamentData);
      
      // Save tournament to database with retry logic
      let tournament;
      let error;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`Database insert attempt ${retryCount + 1}/${maxRetries}`);
          
          const result = await supabase
            .from('tournaments')
            .insert(tournamentData)
            .select()
            .single();
            
          tournament = result.data;
          error = result.error;
          
          if (!error) {
            console.log("Tournament created successfully:", tournament);
            break;
          } else {
            console.error(`Insert attempt ${retryCount + 1} failed:`, error);
            throw error;
          }
        } catch (insertError) {
          console.error(`Insert attempt ${retryCount + 1} failed with error:`, insertError);
          error = insertError;
          retryCount++;
          
          if (retryCount < maxRetries) {
            console.log(`Retrying in 1 second... (attempt ${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
        
      if (error) {
        console.error("Final error after all retries:", error);
        let errorMessage = "Failed to create tournament";
        
        if (error.message) {
          errorMessage += `: ${error.message}`;
        }
        
        if (error.code) {
          errorMessage += ` (Code: ${error.code})`;
        }
        
        if (error.details) {
          errorMessage += ` - ${error.details}`;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      if (!tournament) {
        console.error("No tournament data returned after successful insert");
        toast({
          title: "Error",
          description: "Tournament was created but no data was returned. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Tournament created successfully! Registration is now open.",
      });
      
      // Navigate to the tournament profile page
      console.log("Navigating to tournament profile:", tournament.id);
      navigate(`/tournament/${tournament.id}`);
      
    } catch (error: any) {
      console.error("Unexpected error in form submission:", error);
      console.error("Error stack:", error.stack);
      console.error("Error type:", typeof error);
      console.error("Error constructor:", error.constructor.name);
      
      let errorMessage = "An unexpected error occurred";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return { onSubmit };
};
