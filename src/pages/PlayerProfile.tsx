
import React from 'react';
import { usePlayerData } from '@/hooks/usePlayerData';
import Header from "@/components/Header";
import ProfileHeader from "@/components/player/ProfileHeader";
import ProfileInfo from "@/components/player/ProfileInfo";
import ProfileBio from "@/components/player/ProfileBio";
import ProfileStats from "@/components/player/ProfileStats";
import CareerHistory from "@/components/player/CareerHistory";
import Achievements from "@/components/player/Achievements";
import SocialConnect from "@/components/player/SocialConnect";

const PlayerProfile = () => {
  const { playerData, loading } = usePlayerData();

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <ProfileHeader playerData={playerData} />
            
            <div className="relative px-6 pb-6">
              <ProfileInfo playerData={playerData} />
              <ProfileBio playerData={playerData} />
              <ProfileStats playerData={playerData} />
              <CareerHistory playerData={playerData} />
              <Achievements playerData={playerData} />
              <SocialConnect playerData={playerData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerProfile;
