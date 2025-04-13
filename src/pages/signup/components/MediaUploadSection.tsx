
import React from "react";
import { FormField } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import MediaUploader from "@/components/player/profile/MediaUploader";

interface MediaUploadSectionProps {
  form: UseFormReturn<FormValues>;
  profilePreview: string | null;
  backgroundPreview: string | null;
  handleFileChange: (files: FileList | null, type: 'profile' | 'background') => void;
}

const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({ 
  form, 
  profilePreview, 
  backgroundPreview, 
  handleFileChange 
}) => {
  return (
    <FormField
      control={form.control}
      name="profilePicture"
      render={({ field }) => (
        <MediaUploader
          backgroundPreview={backgroundPreview}
          profilePreview={profilePreview}
          onFileChange={handleFileChange}
          fieldProps={field}
        />
      )}
    />
  );
};

export default MediaUploadSection;
