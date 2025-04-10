
import { FormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleSignup = async (data: FormValues): Promise<boolean> => {
  try {
    // 1. Create the user account with email and password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    
    if (authError) {
      throw authError;
    }
    
    if (!authData.user) {
      throw new Error("User registration failed");
    }
    
    // 2. Create the player profile with the remaining data
    const playerProfile = {
      id: authData.user.id,
      full_name: data.fullName,
      sport: data.sport,
      position: data.position,
      clubs: data.clubs || null,
      achievements: data.achievements || null,
      facebook_id: data.facebookId || null,
      whatsapp_id: data.whatsappId || null,
      instagram_id: data.instagramId || null,
    };
    
    const { error: profileError } = await supabase
      .from('player_details')
      .insert(playerProfile);
    
    if (profileError) {
      console.error("Profile insertion error:", profileError);
      throw new Error("Failed to create player profile: " + profileError.message);
    }
    
    toast.success("Signup successful! Check your email to verify your account.");
    return true;
  } catch (error: any) {
    console.error("Signup error:", error);
    toast.error(error.message || "Signup failed. Please try again.");
    return false;
  }
};
