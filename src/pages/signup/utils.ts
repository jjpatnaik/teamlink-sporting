
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

// Function to create a test user account
export const createTestUser = async (): Promise<boolean> => {
  try {
    const testEmail = "jjpatnaik.12@gmail.com";
    const testPassword = "testprofile";
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    // If user exists and login successful, return true
    if (existingUser.user) {
      console.log("Test user already exists, logging in");
      toast.success("Test user logged in successfully!");
      return true;
    }
    
    // Create new test user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (authError) {
      throw authError;
    }
    
    if (!authData.user) {
      throw new Error("Test user creation failed");
    }
    
    console.log("Test user created successfully", authData.user);
    toast.success("Test user created successfully!");
    
    // Create player profile for test user
    const testProfile = {
      id: authData.user.id,
      full_name: "Test Player",
      sport: "Football",
      position: "Forward",
      city: "London",
      postcode: "SW1A 1AA",
      age: "25",
      height: "180cm",
      weight: "75kg",
      clubs: "London FC (Forward, 2020 - 2023); City United (Forward, 2018 - 2020)",
      achievements: "Regional Champion 2022, Top Scorer 2021",
      facebook_id: "testplayer",
      instagram_id: "test.player",
      whatsapp_id: "+447123456789",
      profile_picture_url: "https://nawpawkxvijcaccxrcuv.supabase.co/storage/v1/object/public/images/default-profile.jpg",
      background_picture_url: "https://nawpawkxvijcaccxrcuv.supabase.co/storage/v1/object/public/images/default-background.jpg",
    };
    
    const { error: profileError } = await supabase
      .from('player_details')
      .insert(testProfile);
    
    if (profileError) {
      throw profileError;
    }
    
    toast.success("Test profile created successfully!");
    return true;
  } catch (error: any) {
    console.error("Test user creation error:", error);
    toast.error(error.message || "Test user creation failed. Please try again.");
    return false;
  }
};
