
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const saveTournamentToDatabase = async (tournamentData: any) => {
  console.log("Step 4: Attempting database insert...");
  console.log("Sending query to Supabase...");
  
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .insert(tournamentData)
    .select()
    .single();
    
  console.log("Supabase response received:");
  console.log("- Data:", tournament);
  console.log("- Error:", error);
  
  if (error) {
    console.error("❌ Database insert failed:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    
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
    return { success: false };
  }
  
  if (!tournament) {
    console.error("❌ No tournament data returned after successful insert");
    toast({
      title: "Error",
      description: "Tournament was created but no data was returned. Please refresh the page.",
      variant: "destructive",
    });
    return { success: false };
  }
  
  console.log("✅ Tournament creation process completed successfully!");
  console.log("Final tournament object:", tournament);
  
  return { success: true, tournament };
};
