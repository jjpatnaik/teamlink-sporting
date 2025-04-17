
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle, Link } from 'lucide-react';
import { PlayerData } from '@/hooks/usePlayerData';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

type ProfileHeaderProps = {
  playerData: PlayerData | null;
};

const ProfileHeader = ({ playerData }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  
  const handleConnections = () => {
    navigate('/connections');
  };
  
  return (
    <>
      {/* Cover Photo */}
      <div className="h-48 relative bg-gradient-to-r from-sport-purple to-sport-blue">
        {playerData?.background_picture_url && (
          <img 
            src={playerData.background_picture_url} 
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button 
            variant="ghost" 
            className="bg-white/20 hover:bg-white/30 text-white"
            onClick={handleConnections}
          >
            <Link className="mr-2 h-4 w-4" />
            Connections
          </Button>
        </div>
      </div>
      
      {/* Profile Image & Basic Info */}
      <div className="relative px-6 pt-16 pb-6">
        <div className="absolute -top-16 left-6">
          <Avatar className="w-32 h-32 border-4 border-white bg-sport-light-purple">
            {playerData?.profile_picture_url ? (
              <AvatarImage src={playerData.profile_picture_url} alt={playerData.full_name} className="object-cover" />
            ) : (
              <AvatarFallback>
                <UserCircle className="w-24 h-24 text-sport-purple" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;

