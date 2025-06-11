
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "./tournamentFormSchema";

export const useTournamentFormSubmission = () => {
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    console.log("=== TOURNAMENT CREATION PROCESS STARTED ===");
    console.log("Raw form data received:", JSON.stringify(data, null, 2));
    
    try {
      // Check for authenticated user
      console.log("Step 1: Checking authentication...");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("❌ Session error:", sessionError);
        toast({
          title: "Authentication Error",
          description: `Failed to get session: ${sessionError.message}`,
          variant: "destructive",
        });
        return;
      }
      
      if (!sessionData.session?.user) {
        console.error("❌ No authenticated user found");
        toast({
          title: "Authentication Required",
          description: "You need to be logged in to create a tournament",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const organizerId = sessionData.session.user.id;
      console.log("✅ User authenticated successfully. Organizer ID:", organizerId);
      
      // Log form data processing
      console.log("Step 2: Processing form data...");
      console.log("Original startDate:", data.startDate);
      console.log("Original endDate:", data.endDate);
      console.log("Original registrationDeadline:", data.registrationDeadline);
      console.log("Original teamsAllowed (string):", data.teamsAllowed, "Type:", typeof data.teamsAllowed);
      console.log("Original entryFee (string):", data.entryFee, "Type:", typeof data.entryFee);
      console.log("Original teamSize (string):", data.teamSize, "Type:", typeof data.teamSize);
      
      // Convert string numbers to integers with validation
      const teamsAllowed = parseInt(data.teamsAllowed);
      const entryFee = data.entryFee ? parseFloat(data.entryFee) : 0;
      const teamSize = data.teamSize ? parseInt(data.teamSize) : null;
      
      console.log("Converted teamsAllowed (number):", teamsAllowed, "Type:", typeof teamsAllowed);
      console.log("Converted entryFee (number):", entryFee, "Type:", typeof entryFee);
      console.log("Converted teamSize (number):", teamSize, "Type:", typeof teamSize);
      
      if (isNaN(teamsAllowed) || teamsAllowed < 1) {
        console.error("❌ Invalid teamsAllowed value:", teamsAllowed);
        toast({
          title: "Validation Error",
          description: "Please enter a valid number of teams allowed",
          variant: "destructive",
        });
        return;
      }
      
      console.log("✅ Data validation passed");
      
      // Log tournament data preparation
      console.log("Step 3: Preparing tournament data for database...");
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
      
      console.log("Final tournament data object:", JSON.stringify(tournamentData, null, 2));
      console.log("Tournament data types check:");
      console.log("- name:", typeof tournamentData.name, "Value:", tournamentData.name);
      console.log("- sport:", typeof tournamentData.sport, "Value:", tournamentData.sport);
      console.log("- format:", typeof tournamentData.format, "Value:", tournamentData.format);
      console.log("- teams_allowed:", typeof tournamentData.teams_allowed, "Value:", tournamentData.teams_allowed);
      console.log("- organizer_id:", typeof tournamentData.organizer_id, "Value:", tournamentData.organizer_id);
      console.log("- start_date:", typeof tournamentData.start_date, "Value:", tournamentData.start_date);
      console.log("- end_date:", typeof tournamentData.end_date, "Value:", tournamentData.end_date);
      
      console.log("Step 4: Attempting database insert...");
      
      // Save tournament to database with retry logic
      let tournament;
      let error;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`Database insert attempt ${retryCount + 1}/${maxRetries}`);
          console.log("Sending query to Supabase...");
          
          const result = await supabase
            .from('tournaments')
            .insert(tournamentData)
            .select()
            .single();
            
          tournament = result.data;
          error = result.error;
          
          console.log("Supabase response received:");
          console.log("- Data:", tournament);
          console.log("- Error:", error);
          
          if (!error) {
            console.log("✅ Tournament created successfully in database!");
            console.log("Created tournament details:", JSON.stringify(tournament, null, 2));
            break;
          } else {
            console.error(`❌ Insert attempt ${retryCount + 1} failed:`, error);
            console.error("Error details:", {
              message: error.message,
              code: error.code,
              details: error.details,
              hint: error.hint
            });
            throw error;
          }
        } catch (insertError) {
          console.error(`❌ Insert attempt ${retryCount + 1} failed with exception:`, insertError);
          error = insertError;
          retryCount++;
          
          if (retryCount < maxRetries) {
            console.log(`Retrying in 1 second... (attempt ${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
        
      if (error) {
        console.error("❌ Final error after all retries:", error);
        console.error("Error analysis:");
        console.error("- Type:", typeof error);
        console.error("- Constructor:", error.constructor?.name);
        console.error("- Message:", error.message);
        console.error("- Code:", error.code);
        console.error("- Details:", error.details);
        console.error("- Stack:", error.stack);
        
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
        console.error("❌ No tournament data returned after successful insert");
        toast({
          title: "Error",
          description: "Tournament was created but no data was returned. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("✅ Tournament creation process completed successfully!");
      console.log("Final tournament object:", tournament);
      
      toast({
        title: "Success",
        description: "Tournament created successfully! Registration is now open.",
      });
      
      // Navigate to the tournament profile page
      console.log("Step 5: Navigating to tournament profile page...");
      console.log("Tournament ID for navigation:", tournament.id);
      navigate(`/tournament/${tournament.id}`);
      console.log("=== TOURNAMENT CREATION PROCESS COMPLETED ===");
      
    } catch (error: any) {
      console.error("❌ Unexpected error in form submission:", error);
      console.error("Error analysis:");
      console.error("- Stack:", error.stack);
      console.error("- Type:", typeof error);
      console.error("- Constructor:", error.constructor?.name);
      console.error("- Message:", error.message);
      console.error("- Full error object:", error);
      
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
