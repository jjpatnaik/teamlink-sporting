
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProtectedOrganizerRouteProps {
  children: React.ReactNode;
}

const ProtectedOrganizerRoute: React.FC<ProtectedOrganizerRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkOrganizerStatus = async () => {
      try {
        // Check if user is authenticated
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
        
        // Check if user is an organizer by looking at tournaments they've created
        // This is a temporary solution until we create an organisers table
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('organizer_id', sessionData.session.user.id)
          .limit(1);
        
        if (tournamentError || !tournamentData || tournamentData.length === 0) {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "You don't have tournament organizer privileges"
          });
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error checking organizer status:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkOrganizerStatus();
  }, []);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedOrganizerRoute;
