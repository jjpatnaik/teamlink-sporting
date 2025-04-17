
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle } from 'lucide-react';

type ProfileAvatarProps = {
  imageUrl?: string | null;
  name?: string;
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ imageUrl, name }) => {
  return (
    <div className="absolute -top-16 left-6">
      <Avatar className="w-32 h-32 border-4 border-white bg-sport-light-purple">
        {imageUrl ? (
          <AvatarImage src={imageUrl} alt={name || 'User'} className="object-cover" />
        ) : (
          <AvatarFallback>
            <UserCircle className="w-24 h-24 text-sport-purple" />
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
