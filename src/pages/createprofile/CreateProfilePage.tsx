
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UnifiedProfileForm from "@/components/unified-profile/UnifiedProfileForm";
import { useUnifiedProfile } from "@/hooks/useUnifiedProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { profile, playerProfile, teamProfile, sponsorProfile, createProfile, updateProfile } = useUnifiedProfile();
  const navigate = useNavigate();
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("You must be logged in to create or edit a profile");
        navigate("/signup");
        return;
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  // Check if user has existing profile
  useEffect(() => {
    if (profile) {
      setIsEditing(true);
    }
  }, [profile]);

  const handleSubmit = async (profileData: any, specificData: any) => {
    try {
      let result;
      
      if (isEditing && profile) {
        result = await updateProfile(profileData, specificData);
      } else {
        result = await createProfile(profileData, specificData);
      }

      if (result.success) {
        toast.success(`Profile ${isEditing ? 'updated' : 'created'} successfully!`);
        // Navigate to the user's profile page after creation/update
        navigate("/profile");
      }

      return result;
    } catch (error: any) {
      console.error('Profile submission error:', error);
      return { success: false, error: error.message };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-sport-light-purple/10">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getInitialData = () => {
    if (!profile) return null;

    return {
      ...profile,
      playerProfile,
      teamProfile,
      sponsorProfile
    };
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-sport-light-purple/10">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-sport-blue to-sport-purple bg-clip-text text-transparent">
              {isEditing ? "Edit Your Profile" : "Create Your Profile"}
            </h1>
            <p className="text-sport-gray text-lg">Join the sports community and showcase your passion</p>
          </div>

          <UnifiedProfileForm 
            onSubmit={handleSubmit}
            initialData={getInitialData()}
            isEditing={isEditing}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateProfilePage;
