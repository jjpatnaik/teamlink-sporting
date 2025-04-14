
import { z } from "zod";

export const playerFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  sport: z.string().min(1, { message: "Sport is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  age: z.string().min(1, { message: "Age is required" }),
  height: z.string().optional(),
  weight: z.string().optional(),
  careerHistory: z.array(
    z.object({
      club: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string()
    })
  ),
  achievements: z.string().optional(),
  facebookId: z.string().optional(),
  whatsappId: z.string().optional(),
  instagramId: z.string().optional(),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;
