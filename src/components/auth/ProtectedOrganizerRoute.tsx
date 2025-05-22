
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
        
        // First, check if user is in the organisers table
        const { data: organiserData, error: organiserError } = await supabase
          .from('organisers')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .limit(1);
          
        if (organiserData && organiserData.length > 0) {
          // User is in the organisers table
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }
        
        // If not in organisers table, check if they've created tournaments
        // This is for backward compatibility with existing tournament creators
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('organizer_id', sessionData.session.user.id)
          .limit(1);
        
        if ((organiserError && tournamentError) || 
            (!organiserData?.length && !tournamentData?.length)) {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "You don't have tournament organizer privileges"
          });
          setIsAuthorized(false);
        } else {
          // If they have created tournaments but aren't in the organisers table,
          // add them to the organisers table for future checks
          if (tournamentData && tournamentData.length > 0) {
            const { error: insertError } = await supabase
              .from('organisers')
              .insert({
                user_id: sessionData.session.user.id,
                email: sessionData.session.user.email
              });
              
            if (insertError) {
              console.error("Error adding user to organisers table:", insertError);
            }
          }
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
