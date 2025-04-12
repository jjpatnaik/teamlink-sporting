
import React from 'react';
import { Award } from 'lucide-react';
import { PlayerData } from '@/hooks/usePlayerData';

type AchievementsProps = {
  playerData: PlayerData | null;
};

const Achievements = ({ playerData }: AchievementsProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
      
      {playerData?.achievements ? (
        <div className="space-y-3">
          {playerData.achievements.split(',').map((achievement: string, index: number) => (
            <div key={index} className="flex items-start">
              <Award className="w-5 h-5 text-sport-purple mr-2 mt-0.5" />
              <div>
                <h3 className="font-semibold">{achievement.trim()}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start">
            <Award className="w-5 h-5 text-sport-purple mr-2 mt-0.5" />
            <div>
              <h3 className="font-semibold">Regional League MVP</h3>
              <p className="text-sm text-sport-gray">2022 Season</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Award className="w-5 h-5 text-sport-purple mr-2 mt-0.5" />
            <div>
              <h3 className="font-semibold">All-Star Selection</h3>
              <p className="text-sm text-sport-gray">2021, 2022, 2023</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
