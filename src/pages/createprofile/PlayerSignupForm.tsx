
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import MediaUploader from "@/components/player/profile/MediaUploader";
import PersonalInfoSection from "@/components/player/profile/PersonalInfoSection";
import CareerSection from "@/components/player/profile/CareerSection";
import SocialMediaSection from "@/components/player/profile/SocialMediaSection";
import { playerFormSchema, PlayerFormValues } from "@/components/player/profile/types";

interface PlayerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const PlayerSignupForm: React.FC<PlayerSignupFormProps> = ({ setIsLoading, isLoading }) => {
  const [selectedSport, setSelectedSport] = React.useState<string>("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
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
      careerHistory: [{ club: "", position: "", startDate: "", endDate: "Present" }],
      achievements: "",
      facebookId: "",
      whatsappId: "",
      instagramId: "",
    },
  });

  const onSubmit = async (data: PlayerFormValues) => {
    setIsLoading(true);
    
    data.careerHistory = careerEntries;
    
    setTimeout(() => {
      navigate("/");
      setIsLoading(false);
    }, 1500);
  };

  const handleFileChange = (files: FileList | null, type: 'profile' | 'background') => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileReader = new FileReader();
      
      fileReader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'profile') {
          setProfilePreview(result);
        } else {
          setBackgroundPreview(result);
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
