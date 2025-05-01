
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlayerData } from '@/hooks/usePlayerData';
import Header from "@/components/Header";
import ProfileHeader from "@/components/player/ProfileHeader";
import ProfileInfo from "@/components/player/ProfileInfo";
import ProfileBio from "@/components/player/ProfileBio";
import ProfileStats from "@/components/player/ProfileStats";
import CareerHistory from "@/components/player/CareerHistory";
import Achievements from "@/components/player/Achievements";
import SocialConnect from "@/components/player/SocialConnect";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TestUserCreator from "@/components/TestUserCreator";

const PlayerProfile = () => {
  const { playerData, loading } = usePlayerData();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const checkProfileCreated = () => {
      const profileCreated = localStorage.getItem('profileCreated');
      if (profileCreated === 'true') {
        toast.success("Profile created successfully! Welcome to your profile page.");
        localStorage.removeItem('profileCreated');
      }
    };
    
    checkProfileCreated();
    
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      if (data.session?.user && !id) {
        setIsCurrentUser(true);
      } else if (data.session?.user && id === data.session.user.id) {
        setIsCurrentUser(true);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, id]);

  const handleEditProfile = () => {
    navigate('/createprofile');
  };

  const handleConnections = () => {
    navigate('/connections');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
            <p className="text-sport-gray">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  // Removed authentication check to allow access for testing

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {process.env.NODE_ENV === 'development' && (
          <div className="max-w-4xl mx-auto mb-6">
            <TestUserCreator />
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <ProfileHeader playerData={playerData} />
            
            <div className="relative px-6 pb-6">
              <ProfileInfo playerData={playerData} isCurrentUser={isCurrentUser} />
              
              {/* Show edit buttons for all users to enable testing */}
              <div className="mt-4 flex justify-end space-x-2">
                <Button 
                  onClick={handleConnections}
                  variant="outline"
                  className="bg-sport-purple/10 hover:bg-sport-purple/20 text-sport-purple"
                >
                  My Connections
                </Button>
                <Button 
                  onClick={handleEditProfile}
                  className="bg-sport-purple hover:bg-sport-purple/90 text-white"
                >
                  Edit My Profile
                </Button>
              </div>
              
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
