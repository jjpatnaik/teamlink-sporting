
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "@/components/player/ProfileHeader";
import ProfileInfo from "@/components/player/ProfileInfo";
import ProfileBio from "@/components/player/ProfileBio";
import ProfileStats from "@/components/player/ProfileStats";
import CareerHistory from "@/components/player/CareerHistory";
import Achievements from "@/components/player/Achievements";
import SocialConnect from "@/components/player/SocialConnect";

const PlayerProfile = () => {
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch player details
          const { data, error } = await supabase
            .from('player_details')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          setPlayerData(data);
        } else {
          // For demo, use sample data
          setPlayerData({
            full_name: "John Smith",
            sport: "Basketball",
            position: "Point Guard",
            clubs: "Chicago Breeze",
            achievements: "Regional League MVP (2022), All-Star Selection (2021, 2022, 2023)",
            profile_picture_url: null,
            background_picture_url: null
          });
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  }

  return (
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
  );
};

export default PlayerProfile;
