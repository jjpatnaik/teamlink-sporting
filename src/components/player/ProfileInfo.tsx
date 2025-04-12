
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import { PlayerData } from '@/hooks/usePlayerData';

type ProfileInfoProps = {
  playerData: PlayerData | null;
};

const ProfileInfo = ({ playerData }: ProfileInfoProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between">
      <div>
        <h1 className="text-3xl font-bold">{playerData?.full_name}</h1>
        <p className="text-xl text-sport-purple">{playerData?.sport} Player</p>
        <div className="flex items-center mt-2 text-sport-gray">
          <MapPin className="w-4 h-4 mr-1" />
          <span>Chicago, IL, USA</span>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex space-x-2">
        <Button className="btn-primary">Connect</Button>
        <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple">
          Message
        </Button>
      </div>
    </div>
  );
};

export default ProfileInfo;
