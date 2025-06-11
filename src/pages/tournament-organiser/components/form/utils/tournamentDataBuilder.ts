
import { FormValues } from "../tournamentFormSchema";

interface ProcessedData {
  teamsAllowed: number;
  entryFee: number;
  teamSize: number | null;
}

export const buildTournamentData = (data: FormValues, processedData: ProcessedData, organizerId: string) => {
  console.log("Step 3: Preparing tournament data for database...");
  
  const tournamentData = {
    name: data.name,
    description: data.description || null,
    sport: data.sport,
    format: data.format,
    start_date: data.startDate.toISOString(),
    end_date: data.endDate.toISOString(),
    location: data.location || null,
    teams_allowed: processedData.teamsAllowed,
    entry_fee: processedData.entryFee,
    team_size: processedData.teamSize,
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
  
  return tournamentData;
};
