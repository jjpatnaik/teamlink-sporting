
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useUnifiedProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, refreshProfile } = useAuth();

  const updateProfile = async (profileData: any, specificData: any) => {
    if (!user) {
      console.error('No user found for profile update');
      return { success: false, error: 'You must be logged in to update your profile' };
    }

    console.log('useUnifiedProfile: Starting update process');
    console.log('Profile data:', profileData);
    console.log('Specific data:', specificData);

    try {
      setIsLoading(true);

      // Start a transaction-like approach by handling base profile first
      console.log('Updating base profile...');
      
      const baseProfileUpdate = {
        display_name: profileData.display_name,
        bio: profileData.bio || '',
        city: profileData.city || '',
        country: profileData.country || '',
        profile_type: profileData.profile_type,
        updated_at: new Date().toISOString()
      };

      // Handle existing profile ID if provided (for team creation from existing profile)
      let profileId = profileData.existingProfileId;
      
      if (profileId) {
        // Update existing profile to new type
        console.log('Updating existing profile ID:', profileId);
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update(baseProfileUpdate)
          .eq('id', profileId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating existing profile:', updateError);
          throw updateError;
        }
        console.log('Updated existing profile:', updatedProfile);
      } else {
        // Check if profile exists for this user
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError) {
          console.error('Error checking existing profile:', fetchError);
          throw fetchError;
        }

        if (existingProfile) {
          // Update existing profile
          console.log('Updating existing user profile:', existingProfile.id);
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update(baseProfileUpdate)
            .eq('id', existingProfile.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating profile:', updateError);
            throw updateError;
          }
          profileId = existingProfile.id;
          console.log('Updated profile:', updatedProfile);
        } else {
          // Create new profile
          console.log('Creating new profile for user:', user.id);
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              ...baseProfileUpdate
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            throw createError;
          }
          profileId = newProfile.id;
          console.log('Created new profile:', newProfile);
        }
      }

      // Now handle specific profile data if provided
      if (specificData && Object.keys(specificData).length > 0) {
        console.log('Updating specific profile data for type:', profileData.profile_type);
        
        const specificProfileData = {
          profile_id: profileId,
          ...specificData
        };

        let specificTableName = '';
        switch (profileData.profile_type) {
          case 'player':
            specificTableName = 'player_profiles';
            break;
          case 'team_captain':
            specificTableName = 'team_profiles';
            break;
          case 'sponsor':
            specificTableName = 'sponsor_profiles';
            break;
          default:
            console.log('No specific profile table for type:', profileData.profile_type);
        }

        if (specificTableName) {
          // Check if specific profile exists
          const { data: existingSpecific, error: specificFetchError } = await supabase
            .from(specificTableName)
            .select('id')
            .eq('profile_id', profileId)
            .maybeSingle();

          if (specificFetchError) {
            console.error('Error checking existing specific profile:', specificFetchError);
            throw specificFetchError;
          }

          if (existingSpecific) {
            // Update existing specific profile
            console.log('Updating existing specific profile:', existingSpecific.id);
            const { error: specificUpdateError } = await supabase
              .from(specificTableName)
              .update(specificData)
              .eq('id', existingSpecific.id);

            if (specificUpdateError) {
              console.error('Error updating specific profile:', specificUpdateError);
              throw specificUpdateError;
            }
            console.log('Updated specific profile successfully');
          } else {
            // Create new specific profile
            console.log('Creating new specific profile');
            const { error: specificCreateError } = await supabase
              .from(specificTableName)
              .insert(specificProfileData);

            if (specificCreateError) {
              console.error('Error creating specific profile:', specificCreateError);
              throw specificCreateError;
            }
            console.log('Created specific profile successfully');
          }
        }
      }

      console.log('Profile update completed successfully');
      await refreshProfile();
      return { success: true };

    } catch (error: any) {
      console.error('Profile update failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update profile. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading
  };
};
