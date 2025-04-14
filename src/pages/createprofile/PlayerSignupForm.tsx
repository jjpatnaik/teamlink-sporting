
import React, { useState, useEffect } from "react";
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
import { PlayerData } from "@/hooks/usePlayerData";

interface PlayerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  existingData?: PlayerData | null;
  isEditing?: boolean;
}

const PlayerSignupForm: React.FC<PlayerSignupFormProps> = ({ 
  setIsLoading, 
  isLoading, 
  existingData, 
  isEditing = false 
}) => {
  const [selectedSport, setSelectedSport] = React.useState<string>(existingData?.sport || "");
  const [profilePreview, setProfilePreview] = useState<string | null>(existingData?.profile_picture_url || null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(existingData?.background_picture_url || null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  
  // Parse career history from string to array for form
  const parseCareerHistory = () => {
    if (existingData?.clubs) {
      try {
        const entries = existingData.clubs.split('; ').map(entry => {
          const clubMatch = entry.match(/(.*?)\s\((.*?),\s(.*?)\s-\s(.*?)\)/);
          if (clubMatch && clubMatch.length >= 5) {
            return {
              club: clubMatch[1],
              position: clubMatch[2],
              startDate: clubMatch[3],
              endDate: clubMatch[4]
            };
          }
          return { club: "", position: "", startDate: "", endDate: "Present" };
        });
        return entries.length > 0 ? entries : [{ club: "", position: "", startDate: "", endDate: "Present" }];
      } catch (error) {
        console.error("Error parsing career history:", error);
        return [{ club: "", position: "", startDate: "", endDate: "Present" }];
      }
    }
    return [{ club: "", position: "", startDate: "", endDate: "Present" }];
  };
  
  const [careerEntries, setCareerEntries] = useState(parseCareerHistory());
  
  const navigate = useNavigate();
  
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      fullName: existingData?.full_name || "",
      sport: existingData?.sport || "",
      position: existingData?.position || "",
      city: existingData?.city || "",
      postcode: existingData?.postcode || "",
      careerHistory: parseCareerHistory(),
      achievements: existingData?.achievements || "",
      facebookId: existingData?.facebook_id || "",
      whatsappId: existingData?.whatsapp_id || "",
      instagramId: existingData?.instagram_id || "",
    },
  });

  // Update form when existingData changes
  useEffect(() => {
    if (existingData) {
      form.reset({
        fullName: existingData.full_name || "",
        sport: existingData.sport || "",
        position: existingData.position || "",
        city: existingData.city || "",
        postcode: existingData.postcode || "",
        careerHistory: parseCareerHistory(),
        achievements: existingData.achievements || "",
        facebookId: existingData.facebook_id || "",
        whatsappId: existingData.whatsapp_id || "",
        instagramId: existingData.instagram_id || "",
      });
      setSelectedSport(existingData.sport || "");
    }
  }, [existingData, form]);

  const uploadImage = async (file: File, userId: string, type: 'profile' | 'background'): Promise<string | null> => {
    if (!file) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${type}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
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
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create or update a profile.");
        navigate("/signup");
        return;
      }
      
      console.log(`${isEditing ? "Updating" : "Creating"} profile for user:`, user.id);
      
      let profilePictureUrl = existingData?.profile_picture_url || null;
      if (profileFile) {
        profilePictureUrl = await uploadImage(profileFile, user.id, 'profile');
        console.log("Profile picture uploaded:", profilePictureUrl);
      }
      
      let backgroundPictureUrl = existingData?.background_picture_url || null;
      if (backgroundFile) {
        backgroundPictureUrl = await uploadImage(backgroundFile, user.id, 'background');
        console.log("Background picture uploaded:", backgroundPictureUrl);
      }
      
      const clubsString = careerEntries
        .map(entry => `${entry.club} (${entry.position}, ${entry.startDate} - ${entry.endDate})`)
        .join('; ');
      
      console.log("Career history prepared:", clubsString);
      
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
        console.log("Updating existing profile");
        const { error } = await supabase
          .from('player_details')
          .update(playerProfile)
          .eq('id', user.id);
        profileError = error;
      } else {
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
      
      localStorage.setItem('profileCreated', 'true');
      
      setTimeout(() => navigate("/players"), 1500);
      
      toast.success(`Profile ${isEditing ? "updated" : "created"} successfully!`);
    } catch (error: any) {
      console.error("Profile creation/update error:", error);
      toast.error(error.message || `Failed to ${isEditing ? "update" : "create"} profile. Please try again.`);
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
          <MediaUploader
            backgroundPreview={backgroundPreview}
            profilePreview={profilePreview}
            onFileChange={handleFileChange}
          />

          <div className="p-6 pt-4">
            <PersonalInfoSection 
              form={form} 
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
            />

            <Separator className="my-6 bg-sport-light-purple/30" />

            <LocationInput 
              form={form} 
              cityFieldName="city" 
              postcodeFieldName="postcode" 
            />

            <Separator className="my-6 bg-sport-light-purple/30" />

            <div className="mb-6">
              <CareerSection
                form={form}
                careerEntries={careerEntries}
                setCareerEntries={setCareerEntries}
              />
            </div>

            <Separator className="my-6 bg-sport-light-purple/30" />

            <div className="mb-6">
              <SocialMediaSection form={form} />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-sport-blue to-sport-purple hover:from-sport-purple hover:to-sport-blue text-white font-medium py-2.5 mt-4" 
              disabled={isLoading}
            >
              {isLoading ? (isEditing ? "Updating Profile..." : "Creating Profile...") : (isEditing ? "Update My Profile" : "Create My Profile")}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default PlayerSignupForm;
