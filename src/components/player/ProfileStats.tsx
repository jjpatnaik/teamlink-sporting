
import React from 'react';
import { PlayerData } from '@/hooks/usePlayerData';

type ProfileStatsProps = {
  playerData: PlayerData | null;
};

const ProfileStats = ({ playerData }: ProfileStatsProps) => {
  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-sport-gray">Position</p>
        <p className="text-lg font-semibold">{playerData?.position}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-sport-gray">Height</p>
        <p className="text-lg font-semibold">6'2" (188 cm)</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-sport-gray">Weight</p>
        <p className="text-lg font-semibold">185 lbs (84 kg)</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-sport-gray">Age</p>
        <p className="text-lg font-semibold">27</p>
      </div>
    </div>
  );
};

export default ProfileStats;
