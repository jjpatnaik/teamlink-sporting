
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown, User, LogOut, Settings, Users, Calendar } from 'lucide-react';

interface AuthButtonsProps {
  isAuthenticated: boolean;
}

const AuthButtons = ({ isAuthenticated }: AuthButtonsProps) => {
  const navigate = useNavigate();
  const [userDisplayName, setUserDisplayName] = useState<string>('User');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showTeamDialog, setShowTeamDialog] = useState(false);

  useEffect(() => {
    const fetchUserDisplayName = async () => {
      if (isAuthenticated) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setCurrentUserId(user.id);
            
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
    if (currentUserId) {
      navigate(`/player/${currentUserId}`);
    } else {
      // Fallback to the general profile route that will determine the user
      navigate("/player/profile");
    }
  };

  const handleEditProfile = () => {
    navigate("/createprofile");
  };

  const handleMyTeam = async () => {
    if (!currentUserId) {
      toast.error("Unable to access team profile");
      return;
    }

    try {
      // Check if user has a team profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, profile_type')
        .eq('user_id', currentUserId)
        .eq('profile_type', 'team_captain')
        .maybeSingle();

      if (profileData) {
        // User has a team profile, navigate to it
        navigate(`/team/${profileData.id}`);
      } else {
        // No team profile found, show dialog
        setShowTeamDialog(true);
      }
    } catch (error) {
      console.error('Error checking team profile:', error);
      toast.error('Error accessing team profile');
    }
  };

  const handleCreateTeamProfile = () => {
    setShowTeamDialog(false);
    navigate("/createprofile?type=team");
  };

  const handleOrganizeTournament = () => {
    navigate("/organiser/tournament?tab=create");
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
    <>
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
          <DropdownMenuItem onClick={handleMyTeam} className="flex items-center space-x-2 cursor-pointer">
            <Users className="h-4 w-4" />
            <span>My Team</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOrganizeTournament} className="flex items-center space-x-2 cursor-pointer">
            <Calendar className="h-4 w-4" />
            <span>Organize Tournament</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 cursor-pointer text-red-600">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Team Profile Dialog */}
      {showTeamDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">No Team Profile Available</h3>
            <p className="text-gray-600 mb-6">
              You don't have a team profile yet. Would you like to create your team profile?
            </p>
            <div className="flex space-x-4">
              <Button onClick={handleCreateTeamProfile} className="flex-1">
                Yes, Create Team Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowTeamDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthButtons;
