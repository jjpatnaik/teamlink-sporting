
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import MediaUploader from "@/components/player/profile/MediaUploader";
import PersonalInfoSection from "@/components/player/profile/PersonalInfoSection";
import CareerSection from "@/components/player/profile/CareerSection";
import SocialMediaSection from "@/components/player/profile/SocialMediaSection";
import LocationInput from "@/components/LocationInput";
import { playerFormSchema, PlayerFormValues } from "@/components/player/profile/types";
import { supabase } from "@/integrations/supabase/client";

interface PlayerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const PlayerSignupForm: React.FC<PlayerSignupFormProps> = ({ setIsLoading, isLoading }) => {
  const [selectedSport, setSelectedSport] = React.useState<string>("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [careerEntries, setCareerEntries] = useState([
    { club: "", position: "", startDate: "", endDate: "Present" }
  ]);
  const navigate = useNavigate();
  
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      fullName: "",
      sport: "",
      position: "",
      city: "",
      postcode: "",
      careerHistory: [{ club: "", position: "", startDate: "", endDate: "Present" }],
      achievements: "",
      facebookId: "",
      whatsappId: "",
      instagramId: "",
    },
  });

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

  const onSubmit = async (data: PlayerFormValues) => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a profile.");
        navigate("/signup");
        return;
      }
      
      console.log("Creating profile for user:", user.id);
      
      // 1. Upload profile picture if provided
      let profilePictureUrl = null;
      if (profileFile) {
        profilePictureUrl = await uploadImage(profileFile, user.id, 'profile');
        console.log("Profile picture uploaded:", profilePictureUrl);
      }
      
      // 2. Upload background picture if provided
      let backgroundPictureUrl = null;
      if (backgroundFile) {
        backgroundPictureUrl = await uploadImage(backgroundFile, user.id, 'background');
        console.log("Background picture uploaded:", backgroundPictureUrl);
      }
      
      // Prepare career history as a string
      const clubsString = careerEntries
        .map(entry => `${entry.club} (${entry.position}, ${entry.startDate} - ${entry.endDate})`)
        .join('; ');
      
      console.log("Career history prepared:", clubsString);
      
      // 3. Create or update the player profile with the submitted data
      const playerProfile = {
        id: user.id,
        full_name: data.fullName,
        sport: data.sport,
        position: data.position,
        city: data.city,
        postcode: data.postcode,
        clubs: clubsString,
        achievements: data.achievements || null,
        facebook_id: data.facebookId || null,
        whatsapp_id: data.whatsappId || null,
        instagram_id: data.instagramId || null,
        profile_picture_url: profilePictureUrl,
        background_picture_url: backgroundPictureUrl,
      };
      
      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('player_details')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error("Error checking if profile exists:", fetchError);
        throw new Error("Failed to check if profile exists: " + fetchError.message);
      }
      
      console.log("Existing profile check:", existingProfile);
      
      let profileError;
      
      if (existingProfile) {
        // Update existing profile
        console.log("Updating existing profile");
        const { error } = await supabase
          .from('player_details')
          .update(playerProfile)
          .eq('id', user.id);
        profileError = error;
      } else {
        // Create new profile
        console.log("Creating new profile");
        const { error } = await supabase
          .from('player_details')
          .insert(playerProfile);
        profileError = error;
      }
      
      if (profileError) {
        console.error("Profile creation/update error:", profileError);
        throw new Error("Failed to create/update player profile: " + profileError.message);
      }
      
      console.log("Profile created/updated successfully");
      
      // Set flag for success message
      localStorage.setItem('profileCreated', 'true');
      
      // Navigate to player profile page after a short delay
      setTimeout(() => navigate("/players"), 1500);
      
      toast.success("Profile created successfully!");
    } catch (error: any) {
      console.error("Profile creation error:", error);
      toast.error(error.message || "Failed to create profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (files: FileList | null, type: 'profile' | 'background') => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileReader = new FileReader();
      
      fileReader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'profile') {
          setProfilePreview(result);
          setProfileFile(file);
        } else {
          setBackgroundPreview(result);
          setBackgroundFile(file);
        }
      };
      
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="overflow-hidden bg-white border-none shadow-md">
          {/* Media Upload Section */}
          <FormField
            control={form.control}
            name="backgroundPicture"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <MediaUploader
                backgroundPreview={backgroundPreview}
                profilePreview={profilePreview}
                onFileChange={handleFileChange}
                fieldProps={fieldProps}
              />
            )}
          />

          <div className="p-6 pt-4">
            {/* Personal Information Section */}
            <PersonalInfoSection 
              form={form} 
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
            />

            <Separator className="my-6 bg-sport-light-purple/30" />

            {/* Location Information Section */}
            <LocationInput 
              form={form} 
              cityFieldName="city" 
              postcodeFieldName="postcode" 
            />

            <Separator className="my-6 bg-sport-light-purple/30" />

            {/* Career Information Section */}
            <div className="mb-6">
              <CareerSection
                form={form}
                careerEntries={careerEntries}
                setCareerEntries={setCareerEntries}
              />
            </div>

            <Separator className="my-6 bg-sport-light-purple/30" />

            {/* Social Media Section */}
            <div className="mb-6">
              <SocialMediaSection form={form} />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-sport-blue to-sport-purple hover:from-sport-purple hover:to-sport-blue text-white font-medium py-2.5 mt-4" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Profile..." : "Create My Profile"}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default PlayerSignupForm;
