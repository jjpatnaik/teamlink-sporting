
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

        // Handle each profile type explicitly to avoid TypeScript issues
        switch (profileData.profile_type) {
          case 'player':
            console.log('Handling player profile');
            const { data: existingPlayer, error: playerFetchError } = await supabase
              .from('player_profiles')
              .select('id')
              .eq('profile_id', profileId)
              .maybeSingle();

            if (playerFetchError) {
              console.error('Error checking existing player profile:', playerFetchError);
              throw playerFetchError;
            }

            if (existingPlayer) {
              const { error: playerUpdateError } = await supabase
                .from('player_profiles')
                .update(specificData)
                .eq('id', existingPlayer.id);

              if (playerUpdateError) {
                console.error('Error updating player profile:', playerUpdateError);
                throw playerUpdateError;
              }
              console.log('Updated player profile successfully');
            } else {
              const { error: playerCreateError } = await supabase
                .from('player_profiles')
                .insert(specificProfileData);

              if (playerCreateError) {
                console.error('Error creating player profile:', playerCreateError);
                throw playerCreateError;
              }
              console.log('Created player profile successfully');
            }
            break;

          case 'team_captain':
            console.log('Handling team profile');
            const { data: existingTeam, error: teamFetchError } = await supabase
              .from('team_profiles')
              .select('id')
              .eq('profile_id', profileId)
              .maybeSingle();

            if (teamFetchError) {
              console.error('Error checking existing team profile:', teamFetchError);
              throw teamFetchError;
            }

            if (existingTeam) {
              const { error: teamUpdateError } = await supabase
                .from('team_profiles')
                .update(specificData)
                .eq('id', existingTeam.id);

              if (teamUpdateError) {
                console.error('Error updating team profile:', teamUpdateError);
                throw teamUpdateError;
              }
              console.log('Updated team profile successfully');
            } else {
              const { error: teamCreateError } = await supabase
                .from('team_profiles')
                .insert(specificProfileData);

              if (teamCreateError) {
                console.error('Error creating team profile:', teamCreateError);
                throw teamCreateError;
              }
              console.log('Created team profile successfully');
            }
            break;

          case 'sponsor':
            console.log('Handling sponsor profile');
            const { data: existingSponsor, error: sponsorFetchError } = await supabase
              .from('sponsor_profiles')
              .select('id')
              .eq('profile_id', profileId)
              .maybeSingle();

            if (sponsorFetchError) {
              console.error('Error checking existing sponsor profile:', sponsorFetchError);
              throw sponsorFetchError;
            }

            if (existingSponsor) {
              const { error: sponsorUpdateError } = await supabase
                .from('sponsor_profiles')
                .update(specificData)
                .eq('id', existingSponsor.id);

              if (sponsorUpdateError) {
                console.error('Error updating sponsor profile:', sponsorUpdateError);
                throw sponsorUpdateError;
              }
              console.log('Updated sponsor profile successfully');
            } else {
              const { error: sponsorCreateError } = await supabase
                .from('sponsor_profiles')
                .insert(specificProfileData);

              if (sponsorCreateError) {
                console.error('Error creating sponsor profile:', sponsorCreateError);
                throw sponsorCreateError;
              }
              console.log('Created sponsor profile successfully');
            }
            break;

          default:
            console.log('No specific profile table for type:', profileData.profile_type);
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
