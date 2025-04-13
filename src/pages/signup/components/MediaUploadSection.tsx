
import React from "react";
import { FormField } from "@/components/ui/form";
import MediaUploader from "@/components/player/profile/MediaUploader";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

interface MediaUploadSectionProps {
  form: UseFormReturn<FormValues>;
  profilePreview: string | null;
  backgroundPreview: string | null;
  handleFileChange: (files: FileList | null, type: 'profile' | 'background') => void;
}

const MediaUploadSection = ({
  form,
  profilePreview,
  backgroundPreview,
  handleFileChange,
}: MediaUploadSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-sport-dark-gray">Profile Images</h3>
      <p className="text-sm text-gray-500">
        Upload a profile picture and cover photo to personalize your profile.
      </p>

      <MediaUploader 
        profilePreview={profilePreview} 
        backgroundPreview={backgroundPreview}
        onFileChange={handleFileChange}
      />
    </div>
  );
};

export default MediaUploadSection;
