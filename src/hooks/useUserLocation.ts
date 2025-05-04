
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useUserLocation = () => {
  const [userCity, setUserCity] = useState<string | null>(null);
  const [userPostcode, setUserPostcode] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('player_details')
            .select('city, postcode')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) {
            console.error("Error fetching user location:", error);
            return;
          }
          
          if (data) {
            setUserCity(data.city);
            setUserPostcode(data.postcode);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserLocation:", error);
      }
    };
    
    fetchUserLocation();
  }, []);

  return { userCity, userPostcode };
};
