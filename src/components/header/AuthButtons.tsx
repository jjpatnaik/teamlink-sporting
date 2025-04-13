
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthButtonsProps {
  isAuthenticated: boolean;
}

const AuthButtons = ({ isAuthenticated }: AuthButtonsProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          className="border-sport-purple text-sport-purple hover:bg-sport-light-purple"
          onClick={() => navigate('/players')}
        >
          My Profile
        </Button>
        <Button 
          variant="ghost" 
          className="text-sport-gray hover:text-sport-purple hover:bg-sport-light-purple/20"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple">
        Log In
      </Button>
      <Button className="btn-primary" asChild>
        <Link to="/signup">Sign Up</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
