
import { FormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleSignup = async (data: FormValues): Promise<boolean> => {
  try {
    console.log("Starting signup process for:", data.email);
    
    // Get the current URL for redirect
    const redirectUrl = `${window.location.origin}/createprofile`;
    
    // Sign up the user with proper email redirect configuration
    const { data: signupData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      console.error("Signup error:", error);
      
      // Handle specific error cases with user-friendly messages
      if (error.message.includes("User already registered") || error.message.includes("already exists")) {
        toast.error("An account with this email already exists. Please sign in instead or use a different email address.");
        return false;
      } else if (error.message.includes("Invalid email")) {
        toast.error("Please enter a valid email address.");
        return false;
      } else if (error.message.includes("Password")) {
        toast.error("Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.");
        return false;
      } else {
        toast.error(error.message || "Failed to create account. Please try again.");
        return false;
      }
    }

    // Check if user was created successfully
    if (signupData.user) {
      console.log("User created successfully:", signupData.user.id);
      
      // Show appropriate success message based on email confirmation requirement
      if (signupData.user.email_confirmed_at) {
        toast.success("Account created successfully! Redirecting to profile setup...");
      } else {
        toast.success("Account created! Please check your email to confirm your account, then you'll be redirected to complete your profile.");
      }
      
      return true;
    } else {
      console.error("No user data returned from signup");
      toast.error("Account creation failed. Please try again.");
      return false;
    }
  } catch (error: any) {
    console.error("Unexpected signup error:", error);
    toast.error("An unexpected error occurred. Please try again.");
    return false;
  }
};

export const createTestUser = async (): Promise<boolean> => {
  try {
    console.log("Creating test user...");
    
    const redirectUrl = `${window.location.origin}/createprofile`;
    
    // Create test user with predefined credentials
    const { data: signupData, error } = await supabase.auth.signUp({
      email: "jjpatnaik.12@gmail.com",
      password: "testprofile",
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      console.error("Test user creation error:", error);
      
      if (error.message.includes("User already registered") || error.message.includes("already exists")) {
        toast.error("Test user already exists. Please sign in with jjpatnaik.12@gmail.com instead.");
      } else {
        toast.error(error.message || "Failed to create test user");
      }
      return false;
    }

    if (signupData.user) {
      console.log("Test user created successfully:", signupData.user.id);
      toast.success("Test user created successfully!");
      return true;
    } else {
      toast.error("Failed to create test user");
      return false;
    }
  } catch (error: any) {
    console.error("Unexpected test user creation error:", error);
    toast.error("Failed to create test user");
    return false;
  }
};
