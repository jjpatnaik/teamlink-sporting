
import React from 'react';
import { PlayerData } from '@/hooks/usePlayerData';
import CoverPhoto from './CoverPhoto';
import ProfileAvatar from './ProfileAvatar';

type ProfileHeaderProps = {
  playerData: PlayerData | null;
};

const ProfileHeader = ({ playerData }: ProfileHeaderProps) => {
  return (
    <>
      <CoverPhoto backgroundUrl={playerData?.background_picture_url} />
      
      <div className="relative px-6 pt-16 pb-6">
        <ProfileAvatar 
          imageUrl={playerData?.profile_picture_url} 
          name={playerData?.full_name} 
        />
      </div>
    </>
  );
};

export default ProfileHeader;
