
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
  const { id } = useParams();
  const { playerData, isLoading, error } = usePlayerData(id); // Pass the ID parameter to the hook
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const navigate = useNavigate();

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
      
      if (data.session?.user) {
        setCurrentUserId(data.session.user.id);
        
        // If no ID in URL, or the ID matches current user, it's their profile
        if (!id || id === data.session.user.id) {
          setIsCurrentUser(true);
        } else {
          setIsCurrentUser(false);
        }
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        setCurrentUserId(session.user.id);
        if (!id || id === session.user.id) {
          setIsCurrentUser(true);
        } else {
          setIsCurrentUser(false);
        }
      } else {
        setCurrentUserId(null);
        setIsCurrentUser(false);
      }
      
      if (!session && event === 'SIGNED_OUT') {
        navigate("/");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, id]);

  // Update isCurrentUser when playerData changes
  useEffect(() => {
    if (playerData && currentUserId) {
      setIsCurrentUser(playerData.id === currentUserId);
    }
  }, [playerData, currentUserId]);

  const handleEditProfile = () => {
    navigate('/createprofile');
  };

  const handleConnections = () => {
    navigate('/connections');
  };

  // Add comprehensive debugging for the data
  console.log('=== PLAYER PROFILE COMPONENT DEBUG ===');
  console.log('URL ID parameter:', id);
  console.log('Current User ID:', currentUserId);
  console.log('Is Current User:', isCurrentUser);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('Player Data:', playerData);
  console.log('Is Loading:', isLoading);
  console.log('Error:', error);
  console.log('Current URL:', window.location.href);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
            <p className="text-sport-gray">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center p-8">
            <p className="text-xl text-red-600 mb-4">Error loading profile</p>
            <p className="text-sport-gray mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-sport-purple text-white rounded-md hover:bg-sport-purple/90 transition-colors"
            >
              Try Again
            </button>
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

  if (!playerData && isCurrentUser) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center p-8">
            <p className="text-xl text-sport-gray mb-4">You haven't created your profile yet</p>
            <p className="text-sport-gray mb-6">Create your player profile to showcase your skills and connect with teams, scouts, and other players.</p>
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

  if (!playerData && !isCurrentUser) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center p-8">
            <p className="text-xl text-sport-gray mb-4">Player profile not found</p>
            <p className="text-sport-gray mb-4">This player hasn't created their profile yet or the profile doesn't exist.</p>
            <button 
              onClick={() => navigate("/search")}
              className="px-6 py-3 bg-sport-purple text-white rounded-md hover:bg-sport-purple/90 transition-colors"
            >
              Browse Other Players
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
              
              {isCurrentUser && (
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
              )}
              
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
