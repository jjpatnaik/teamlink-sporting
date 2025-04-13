
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PersonalInfoSection from "./components/PersonalInfoSection";
import SportInfoSection from "./components/SportInfoSection";
import SocialMediaSection from "./components/SocialMediaSection";
import MediaUploadSection from "./components/MediaUploadSection";
import { useSignupForm } from "./hooks/useSignupForm";
import { handleSignup } from "./utils";

interface PlayerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const PlayerSignupForm: React.FC<PlayerSignupFormProps> = ({ setIsLoading, isLoading }) => {
  const {
    form,
    selectedSport,
    setSelectedSport,
    profilePreview,
    backgroundPreview,
    handleFileChange,
    onSubmit
  } = useSignupForm(setIsLoading, handleSignup);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload Section */}
        <MediaUploadSection
          form={form}
          profilePreview={profilePreview}
          backgroundPreview={backgroundPreview}
          handleFileChange={handleFileChange}
        />

        {/* Personal Information */}
        <PersonalInfoSection form={form} />

        {/* Sport Information */}
        <SportInfoSection 
          form={form} 
          selectedSport={selectedSport} 
          setSelectedSport={setSelectedSport} 
        />

        {/* Social Media Fields */}
        <SocialMediaSection form={form} />

        {/* Required Fields Notice */}
        <div className="text-sm text-gray-500">
          * Required fields
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};

export default PlayerSignupForm;
