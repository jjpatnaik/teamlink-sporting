
import React from 'react';
import { Facebook, Instagram, ExternalLink } from 'lucide-react';
import { PlayerData } from '@/hooks/usePlayerData';

type SocialConnectProps = {
  playerData: PlayerData | null;
};

const SocialConnect = ({ playerData }: SocialConnectProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Connect</h2>
      
      <div className="flex space-x-4">
        {playerData?.facebook_id && (
          <a href={playerData.facebook_id} target="_blank" rel="noopener noreferrer" className="text-sport-gray hover:text-[#1877F2] transition-colors">
            <Facebook className="w-6 h-6" />
          </a>
        )}
        {playerData?.instagram_id && (
          <a href={playerData.instagram_id} target="_blank" rel="noopener noreferrer" className="text-sport-gray hover:text-[#E4405F] transition-colors">
            <Instagram className="w-6 h-6" />
          </a>
        )}
        <a href="#" className="text-sport-gray hover:text-sport-blue transition-colors">
          <ExternalLink className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default SocialConnect;
