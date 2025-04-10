
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  UserCircle,
  MapPin,
  Award,
  Calendar,
  Instagram,
  Facebook,
  ExternalLink
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

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
          {/* Cover Photo */}
          <div className="h-48 relative bg-gradient-to-r from-sport-purple to-sport-blue">
            {playerData?.background_picture_url && (
              <img 
                src={playerData.background_picture_url} 
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <Button variant="ghost" className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white">
              Edit Profile
            </Button>
          </div>
          
          {/* Profile Info */}
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
            
            {/* Bio */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-sport-gray">
                Professional {playerData?.sport} player with 5+ years of experience playing at collegiate and semi-professional levels. 
                {playerData?.position} with strong leadership skills, court vision, and defensive abilities.
                Looking for opportunities with professional teams in Europe or Asia.
              </p>
            </div>
            
            {/* Stats/Details */}
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
            
            {/* Career History */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Career History</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-sport-purple pl-4 pb-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-sport-purple mr-2" />
                    <span className="text-sm text-sport-gray">2020 - Present</span>
                  </div>
                  <h3 className="text-lg font-semibold mt-1">{playerData?.clubs || "Chicago Breeze"}</h3>
                  <p className="text-sport-gray">Starting {playerData?.position}</p>
                </div>
                
                <div className="border-l-4 border-sport-gray pl-4 pb-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-sport-gray mr-2" />
                    <span className="text-sm text-sport-gray">2018 - 2020</span>
                  </div>
                  <h3 className="text-lg font-semibold mt-1">Michigan Wolverines</h3>
                  <p className="text-sport-gray">Collegiate Athlete</p>
                </div>
              </div>
            </div>
            
            {/* Achievements */}
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
            
            {/* Social Media */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
