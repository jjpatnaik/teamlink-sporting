
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlayerFormValues, playerFormSchema } from "@/components/player/profile/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PlayerData } from "@/hooks/usePlayerData";

interface UsePlayerFormProps {
  setIsLoading: (loading: boolean) => void;
  isEditing?: boolean;
  existingData?: PlayerData | null;
}

export const usePlayerForm = ({ setIsLoading, isEditing = false, existingData }: UsePlayerFormProps) => {
  const [profilePreview, setProfilePreview] = useState<string | null>(existingData?.profile_picture_url || null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(existingData?.background_picture_url || null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  
  const navigate = useNavigate();
  
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
          return { club: "", position: "", startDate: "", endDate: "" };
        });
        return entries.length > 0 ? entries : [{ club: "", position: "", startDate: "", endDate: "" }];
      } catch (error) {
        console.error("Error parsing career history:", error);
        return [{ club: "", position: "", startDate: "", endDate: "" }];
      }
    }
    return [{ club: "", position: "", startDate: "", endDate: "" }];
  };
  
  const [careerEntries, setCareerEntries] = useState(parseCareerHistory());
  const [selectedSport, setSelectedSport] = useState<string>(existingData?.sport || "");

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      fullName: existingData?.full_name || "",
      sport: existingData?.sport || "",
      position: existingData?.position || "",
      city: existingData?.city || "",
      postcode: existingData?.postcode || "",
      age: existingData?.age || "",
      height: existingData?.height || "",
      weight: existingData?.weight || "",
      bio: existingData?.bio || "",
      careerHistory: parseCareerHistory(),
      achievements: existingData?.achievements || "",
      facebookId: existingData?.facebook_id || "",
      whatsappId: existingData?.whatsapp_id || "",
      instagramId: existingData?.instagram_id || "",
    },
  });

  // Sync career entries with form whenever they change
  useEffect(() => {
    form.setValue('careerHistory', careerEntries);
  }, [careerEntries, form]);

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
      
      // Create clubs string from career entries, filtering out empty entries
      const validCareerEntries = careerEntries.filter(entry => 
        entry.club.trim() && entry.position.trim() && entry.startDate.trim()
      );
      
      const clubsString = validCareerEntries
        .map(entry => `${entry.club} (${entry.position}, ${entry.startDate} - ${entry.endDate || 'Present'})`)
        .join('; ');
      
      console.log("Career history prepared:", clubsString);
      
      const playerProfile = {
        id: user.id,
        full_name: data.fullName,
        sport: data.sport,
        position: data.position,
        city: data.city,
        postcode: data.postcode,
        age: data.age,
        height: data.height,
        weight: data.weight,
        bio: data.bio,
        clubs: clubsString,
        achievements: data.achievements,
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
      
      // Navigate to the user's profile page (without ID parameter to show their own profile)
      setTimeout(() => navigate("/profile"), 1500);
      
      toast.success(`Profile ${isEditing ? "updated" : "created"} successfully!`);
    } catch (error: any) {
      console.error("Profile creation/update error:", error);
      toast.error(error.message || `Failed to ${isEditing ? "update" : "create"} profile. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    selectedSport,
    setSelectedSport,
    careerEntries,
    setCareerEntries,
    profilePreview,
    backgroundPreview,
    handleFileChange
  };
};
