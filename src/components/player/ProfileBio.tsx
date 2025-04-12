
import React from 'react';
import { PlayerData } from '@/hooks/usePlayerData';

type ProfileBioProps = {
  playerData: PlayerData | null;
};

const ProfileBio = ({ playerData }: ProfileBioProps) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">About</h2>
      <p className="text-sport-gray">
        Professional {playerData?.sport} player with 5+ years of experience playing at collegiate and semi-professional levels. 
        {playerData?.position} with strong leadership skills, court vision, and defensive abilities.
        Looking for opportunities with professional teams in Europe or Asia.
      </p>
    </div>
  );
};

export default ProfileBio;
