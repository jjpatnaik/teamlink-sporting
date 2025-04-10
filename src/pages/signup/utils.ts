
import { FormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Helper function to upload an image to Supabase storage
const uploadImage = async (file: File, userId: string, type: 'profile' | 'background'): Promise<string | null> => {
  if (!file) return null;
  
  try {
    // Create a unique file path with user ID and timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${type}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Upload the file to the 'images' bucket
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error: any) {
    console.error(`Error uploading ${type} image:`, error);
    return null;
  }
};

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
    
    // 2. Upload profile picture if provided
    let profilePictureUrl = null;
    if (data.profilePicture && data.profilePicture.length > 0) {
      profilePictureUrl = await uploadImage(data.profilePicture[0], authData.user.id, 'profile');
    }
    
    // 3. Upload background picture if provided
    let backgroundPictureUrl = null;
    if (data.backgroundPicture && data.backgroundPicture.length > 0) {
      backgroundPictureUrl = await uploadImage(data.backgroundPicture[0], authData.user.id, 'background');
    }
    
    // 4. Create the player profile with the remaining data
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
      profile_picture_url: profilePictureUrl,
      background_picture_url: backgroundPictureUrl,
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
