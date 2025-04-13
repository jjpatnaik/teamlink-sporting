
import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { UserCircle } from "lucide-react";

interface MediaUploaderProps {
  backgroundPreview: string | null;
  profilePreview: string | null;
  onFileChange: (files: FileList | null, type: 'profile' | 'background') => void;
  fieldProps?: any;
}

const MediaUploader = ({ 
  backgroundPreview, 
  profilePreview, 
  onFileChange,
  fieldProps 
}: MediaUploaderProps) => {
  return (
    <FormItem className="space-y-0 relative">
      <div className="relative">
        <AspectRatio ratio={3/1} className="bg-gradient-to-r from-sport-blue/20 to-sport-purple/20 relative">
          {backgroundPreview ? (
            <img
              src={backgroundPreview}
              alt="Background preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <ImageIcon className="w-12 h-12 text-sport-purple/40" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            <label htmlFor="bg-upload" className="cursor-pointer px-4 py-2 bg-white/80 backdrop-blur-sm rounded-md text-sm font-medium text-sport-dark-purple hover:bg-white/90 transition-colors">
              Upload Cover Photo
            </label>
            <Input
              id="bg-upload"
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files, 'background')}
              className="hidden"
            />
          </div>
        </AspectRatio>
      </div>

      <div className="w-32 h-32 rounded-full overflow-hidden bg-white mx-auto border-4 border-white relative -mt-16 shadow-lg">
        {profilePreview ? (
          <img
            src={profilePreview}
            alt="Profile preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-sport-light-purple">
            <UserCircle className="w-16 h-16 text-sport-purple" />
            <span className="text-xs text-sport-purple mt-1">Add your profile pic</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
          <label 
            htmlFor="profile-upload" 
            className="cursor-pointer rounded-full p-2 bg-white/80 text-sport-dark-purple hover:bg-white/90"
          >
            <ImageIcon className="w-5 h-5" />
          </label>
          <Input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files, 'profile')}
            className="hidden"
          />
        </div>
      </div>
    </FormItem>
  );
};

export default MediaUploader;
