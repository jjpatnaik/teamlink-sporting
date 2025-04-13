
import { FormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleSignup = async (data: FormValues): Promise<boolean> => {
  try {
    // Create the user account with email and password
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
    
    toast.success("Signup successful! Now let's create your profile.");
    return true;
  } catch (error: any) {
    console.error("Signup error:", error);
    toast.error(error.message || "Signup failed. Please try again.");
    return false;
  }
};
