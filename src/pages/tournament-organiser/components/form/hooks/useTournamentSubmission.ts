
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { FormValues } from "../tournamentFormSchema";
import { createTournament } from "../services/tournamentCreationService";

export const useTournamentSubmission = () => {
  const navigate = useNavigate();

  const submitTournament = async (data: FormValues) => {
    const result = await createTournament(data);
    
    if (!result.success) {
      if (result.shouldRedirectToLogin) {
        navigate("/login");
      }
      return;
    }

    // Success - show toast and navigate
    toast({
      title: "Success",
      description: "Tournament created successfully! Registration is now open.",
    });
    
    console.log("Step 5: Navigating to tournament profile page...");
    console.log("Tournament ID for navigation:", result.tournament.id);
    navigate(`/tournament/${result.tournament.id}`);
  };

  return { submitTournament };
};
