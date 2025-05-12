
import { z } from 'zod';

// Form schema for tournament creation
export const tournamentSchema = z.object({
  name: z.string().min(3, { message: 'Tournament name must be at least 3 characters' }),
  description: z.string().optional(),
  sport: z.string().min(1, { message: 'Please select a sport' }),
  format: z.string().min(1, { message: 'Please select a tournament format' }),
  teams_allowed: z.coerce.number().int().positive({ message: 'Must allow at least 1 team' }),
  location: z.string().optional(),
  rules: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type TournamentFormValues = z.infer<typeof tournamentSchema>;
