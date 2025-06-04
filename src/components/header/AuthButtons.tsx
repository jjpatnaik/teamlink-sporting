
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown, User, LogOut, Settings } from 'lucide-react';

interface AuthButtonsProps {
  isAuthenticated: boolean;
}

const AuthButtons = ({ isAuthenticated }: AuthButtonsProps) => {
  const navigate = useNavigate();
  const [userDisplayName, setUserDisplayName] = useState<string>('User');

  useEffect(() => {
    const fetchUserDisplayName = async () => {
      if (isAuthenticated) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // First try to get display name from profiles table
            const { data: profileData } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', user.id)
              .maybeSingle();

            if (profileData?.display_name) {
              setUserDisplayName(profileData.display_name);
            } else {
              // Fall back to player_details table
              const { data: playerData } = await supabase
                .from('player_details')
                .select('full_name')
                .eq('id', user.id)
                .maybeSingle();

              if (playerData?.full_name) {
                setUserDisplayName(playerData.full_name);
              } else {
                // Fall back to email
                setUserDisplayName(user.email?.split('@')[0] || 'User');
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user display name:', error);
        }
      }
    };

    fetchUserDisplayName();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      } else {
        toast.success("Signed out successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error signing out");
    }
  };

  const handleMyProfile = () => {
    navigate("/profile");
  };

  const handleEditProfile = () => {
    navigate("/createprofile");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate("/login")}>
          Sign In
        </Button>
        <Button onClick={() => navigate("/signup")}>
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <span>{userDisplayName}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg">
        <DropdownMenuItem onClick={handleMyProfile} className="flex items-center space-x-2 cursor-pointer">
          <User className="h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditProfile} className="flex items-center space-x-2 cursor-pointer">
          <Settings className="h-4 w-4" />
          <span>Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 cursor-pointer text-red-600">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButtons;
