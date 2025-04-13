
import { z } from "zod";

export const careerEntrySchema = z.object({
  club: z.string().min(1, "Club name is required"),
  position: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
});

export const playerFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  sport: z.string().min(1, "Please select a sport"),
  position: z.string().optional(),
  careerHistory: z.array(careerEntrySchema).optional().default([]),
  achievements: z.string().optional(),
  facebookId: z.string().optional(),
  whatsappId: z.string().optional(),
  instagramId: z.string().optional(),
  profilePicture: z.any().optional(),
  backgroundPicture: z.any().optional(),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;
