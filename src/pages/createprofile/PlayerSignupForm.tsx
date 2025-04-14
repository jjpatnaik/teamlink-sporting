
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import MediaUploader from "@/components/player/profile/MediaUploader";
import PersonalInfoSection from "@/components/player/profile/PersonalInfoSection";
import CareerSection from "@/components/player/profile/CareerSection";
import SocialMediaSection from "@/components/player/profile/SocialMediaSection";
import LocationInput from "@/components/LocationInput";
import { PlayerData } from "@/hooks/usePlayerData";
import { usePlayerForm } from "@/hooks/usePlayerForm";
import AchievementsSection from "@/components/player/profile/AchievementsSection";

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
  const {
    form,
    onSubmit,
    selectedSport,
    setSelectedSport,
    careerEntries,
    setCareerEntries,
    profilePreview,
    backgroundPreview,
    handleFileChange
  } = usePlayerForm({ 
    setIsLoading, 
    isEditing, 
    existingData 
  });

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
              <AchievementsSection form={form} />
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
