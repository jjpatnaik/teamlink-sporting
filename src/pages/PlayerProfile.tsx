
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

const PlayerProfile = () => {
  const { playerData, loading } = usePlayerData();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Check if redirected after profile creation
    const checkProfileCreated = () => {
      const profileCreated = localStorage.getItem('profileCreated');
      if (profileCreated === 'true') {
        toast.success("Profile created successfully! Welcome to your profile page.");
        localStorage.removeItem('profileCreated');
      }
    };
    
    checkProfileCreated();
    
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      
      if (!session && event === 'SIGNED_OUT') {
        navigate("/");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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

  if (!isAuthenticated && !id) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center p-8">
            <p className="text-xl text-sport-gray mb-4">You need to be logged in to view your profile</p>
            <button 
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-sport-purple text-white rounded-md hover:bg-sport-purple/90 transition-colors"
            >
              Sign Up or Login
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!playerData && !id) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center p-8">
            <p className="text-xl text-sport-gray mb-4">You haven't created your profile yet</p>
            <button 
              onClick={() => navigate("/createprofile")}
              className="px-6 py-3 bg-sport-purple text-white rounded-md hover:bg-sport-purple/90 transition-colors"
            >
              Create Your Profile
            </button>
          </div>
        </div>
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
