
import { FormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleSignup = async (data: FormValues): Promise<boolean> => {
  try {
    // Sign up the user
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    
    toast.success("Account created successfully!");
    return true;
  } catch (error: any) {
    console.error("Signup error:", error);
    toast.error(error.message || "Failed to create account");
    return false;
  }
};

export const createTestUser = async (): Promise<boolean> => {
  try {
    // Create test user with predefined credentials
    const { error } = await supabase.auth.signUp({
      email: "jjpatnaik.12@gmail.com",
      password: "testprofile",
    });

    if (error) throw error;
    
    toast.success("Test user created successfully!");
    return true;
  } catch (error: any) {
    console.error("Test user creation error:", error);
    toast.error(error.message || "Failed to create test user");
    return false;
  }
};
