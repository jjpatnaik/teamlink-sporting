
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type OrganizerProfile = {
  id: string;
  user_id: string;
  organization_name: string;
  description: string | null;
  contact_person_name: string;
  contact_email: string;
  contact_phone: string | null;
  sports: string[];
  website_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  logo_url: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  established_year: number | null;
  created_at: string;
  updated_at: string;
};

export const useOrganizerData = () => {
  const [organizerData, setOrganizerData] = useState<OrganizerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('organizer_profiles')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching organizer data:", fetchError);
          setError(fetchError.message);
          return;
        }

        setOrganizerData(data);
      } catch (error: any) {
        console.error("Error in useOrganizerData:", error);
        setError(error.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerData();
  }, []);

  const createOrUpdateProfile = async (profileData: Partial<OrganizerProfile>) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("User not authenticated");
      }

      const dataWithUserId = {
        ...profileData,
        user_id: sessionData.session.user.id,
      };

      if (organizerData) {
        // Update existing profile
        const { data, error } = await supabase
          .from('organizer_profiles')
          .update(dataWithUserId)
          .eq('user_id', sessionData.session.user.id)
          .select()
          .single();

        if (error) throw error;
        setOrganizerData(data);
        toast.success("Organizer profile updated successfully!");
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('organizer_profiles')
          .insert(dataWithUserId)
          .select()
          .single();

        if (error) throw error;
        setOrganizerData(data);
        toast.success("Organizer profile created successfully!");
      }

      return true;
    } catch (error: any) {
      console.error("Error creating/updating organizer profile:", error);
      toast.error(`Failed to save profile: ${error.message}`);
      return false;
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("User not authenticated");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${sessionData.session.user.id}/logo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('organizer-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('organizer-logos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error(`Failed to upload logo: ${error.message}`);
      return null;
    }
  };

  return {
    organizerData,
    loading,
    error,
    createOrUpdateProfile,
    uploadLogo
  };
};
