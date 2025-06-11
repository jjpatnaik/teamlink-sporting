
import { FormValues } from "./tournamentFormSchema";
import { useTournamentSubmission } from "./hooks/useTournamentSubmission";

export const useTournamentFormSubmission = () => {
  const { submitTournament } = useTournamentSubmission();

  const onSubmit = async (data: FormValues) => {
    await submitTournament(data);
  };

  return { onSubmit };
};
