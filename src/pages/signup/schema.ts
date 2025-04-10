
import { z } from "zod";

export const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  sport: z.string().min(1, "Please select a sport"),
  position: z.string().min(1, "Please select a position"),
  clubs: z.string().optional(),
  achievements: z.string().optional(),
  profilePicture: z.instanceof(FileList).optional(),
  backgroundPicture: z.instanceof(FileList).optional(),
  facebookId: z.string().optional(),
  whatsappId: z.string().optional(),
  instagramId: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
