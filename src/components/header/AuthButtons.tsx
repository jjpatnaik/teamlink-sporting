
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Pencil, UserPlus } from 'lucide-react';

interface AuthButtonsProps {
  isAuthenticated: boolean;
}

const AuthButtons = ({ isAuthenticated }: AuthButtonsProps) => {
  const navigate = useNavigate();
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  // Fetch the current logged-in user's data
  useEffect(() => {
    const fetchCurrentUserData = async () => {
      if (isAuthenticated) {
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Fetch player details for the current user
            const { data, error } = await supabase
              .from('player_details')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
              
            if (error) throw error;
            setCurrentUserData(data);
          }
        } catch (error) {
          console.error("Error fetching current user data:", error);
        }
      }
    };
    
    fetchCurrentUserData();
  }, [isAuthenticated]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/createprofile');
  };

  if (isAuthenticated) {
    // Get initials for avatar fallback
    const getInitials = () => {
      if (currentUserData?.full_name) {
        const nameParts = currentUserData.full_name.split(' ');
        if (nameParts.length >= 2) {
          return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return nameParts[0][0].toUpperCase();
      }
      return 'U';
    };

    return (
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-white cursor-pointer">
                <AvatarImage 
                  src={currentUserData?.profile_picture_url || ''} 
                  alt={currentUserData?.full_name || 'User'} 
                />
                <AvatarFallback className="bg-sport-purple text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{currentUserData?.full_name || 'User'}</p>
                <p className="text-sm text-muted-foreground">{currentUserData?.sport || 'Athlete'}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/players')}>
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/connections')}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Connections</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditProfile}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Button variant="outline" asChild className="border-sport-purple text-sport-purple hover:bg-sport-light-purple">
        <Link to="/login">Log In</Link>
      </Button>
      <Button className="btn-primary" asChild>
        <Link to="/signup">Sign Up</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
