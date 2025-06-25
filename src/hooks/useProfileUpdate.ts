
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface ProfileUpdateData {
  display_name: string;
  bio?: string;
  city?: string;
  country?: string;
  profile_type: 'player' | 'team' | 'sponsor' | 'organizer';
  roles?: string[];
}

export const useProfileUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, refreshProfile } = useAuth();

  const updateProfile = async (profileData: ProfileUpdateData) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return false;
    }

    try {
      setIsUpdating(true);

      // Map our profile types to database profile types
      const dbProfileType = profileData.profile_type === 'team' ? 'team_captain' : 
                           profileData.profile_type === 'organizer' ? 'tournament_organizer' : 
                           profileData.profile_type;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profileData,
          profile_type: dbProfileType,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      await refreshProfile();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProfile,
    isUpdating
  };
};
