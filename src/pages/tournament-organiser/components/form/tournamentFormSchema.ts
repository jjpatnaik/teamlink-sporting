
import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  description: z.string().optional(),
  sport: z.string().min(1, "Please select a sport"),
  format: z.string().min(1, "Please select a tournament format"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  location: z.string().optional(),
  entryFee: z.string().optional(),
  teamsAllowed: z.string().min(1, "Please enter max number of teams/players"),
  teamSize: z.string().optional(),
  registrationDeadline: z.date({
    required_error: "Registration deadline is required",
  }),
  organizerEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  organizerPhone: z.string().optional(),
  organizerWebsite: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  organizerFacebook: z.string().optional(),
  organizerTwitter: z.string().optional(),
  organizerInstagram: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const tournamentFormats = [
  { value: "knockout", label: "Knockout" },
  { value: "round_robin", label: "Round Robin" },
  { value: "league", label: "League" },
  { value: "swiss", label: "Swiss System" }
];
