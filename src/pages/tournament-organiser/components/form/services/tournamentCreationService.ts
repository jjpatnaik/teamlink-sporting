
import { FormValues } from "../tournamentFormSchema";
import { checkAuthentication } from "../utils/authUtils";
import { validateFormData } from "../utils/validationUtils";
import { buildTournamentData } from "../utils/tournamentDataBuilder";
import { saveTournamentToDatabase } from "../utils/databaseUtils";
import { handleUnexpectedError } from "../utils/errorUtils";

export interface TournamentCreationResult {
  success: boolean;
  tournament?: any;
  shouldRedirectToLogin?: boolean;
}

export const createTournament = async (data: FormValues): Promise<TournamentCreationResult> => {
  console.log("=== TOURNAMENT CREATION PROCESS STARTED ===");
  console.log("Raw form data received:", JSON.stringify(data, null, 2));
  
  try {
    // Check authentication
    const authResult = await checkAuthentication();
    if (!authResult.success) {
      return {
        success: false,
        shouldRedirectToLogin: authResult.redirectToLogin
      };
    }

    // Validate form data
    const validationResult = validateFormData(data);
    if (!validationResult.success) {
      return { success: false };
    }

    // Build tournament data
    const tournamentData = buildTournamentData(data, validationResult.processedData, authResult.organizerId);

    // Save to database
    const saveResult = await saveTournamentToDatabase(tournamentData);
    if (!saveResult.success) {
      return { success: false };
    }

    console.log("=== TOURNAMENT CREATION PROCESS COMPLETED ===");
    return {
      success: true,
      tournament: saveResult.tournament
    };
    
  } catch (error: any) {
    handleUnexpectedError(error);
    return { success: false };
  }
};
