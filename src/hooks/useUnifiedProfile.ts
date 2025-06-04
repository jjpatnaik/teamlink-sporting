
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UnifiedProfile {
  id: string;
  user_id: string;
  profile_type: 'player' | 'team_captain' | 'tournament_organizer' | 'sponsor';
  display_name: string;
  bio?: string;
  city?: string;
  country?: string;
  profile_picture_url?: string;
  background_picture_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerProfile {
  id: string;
  profile_id: string;
  sport: string;
  position: string;
  age?: number;
  height?: string;
  weight?: string;
  clubs?: string;
  achievements?: string;
  facebook_id?: string;
  instagram_id?: string;
  whatsapp_id?: string;
}

export interface TeamProfile {
  id: string;
  profile_id: string;
  team_name: string;
  sport: string;
  founded_year?: number;
  team_size?: number;
  league_division?: string;
  home_ground?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  social_media_links?: any;
}

export interface SponsorProfile {
  id: string;
  profile_id: string;
  company_name: string;
  industry?: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  website_url?: string;
  sponsorship_budget_range?: string;
  preferred_sports?: string[];
  sponsorship_types?: string[];
}

export const useUnifiedProfile = () => {
  const [profile, setProfile] = useState<UnifiedProfile | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null);
  const [sponsorProfile, setSponsorProfile] = useState<SponsorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch main profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setLoading(false);
        return;
      }

      if (profileData) {
        setProfile(profileData);

        // Fetch specific profile data based on type
        switch (profileData.profile_type) {
          case 'player':
            const { data: playerData } = await supabase
              .from('player_profiles')
              .select('*')
              .eq('profile_id', profileData.id)
              .maybeSingle();
            setPlayerProfile(playerData);
            break;
          case 'team_captain':
            const { data: teamData } = await supabase
              .from('team_profiles')
              .select('*')
              .eq('profile_id', profileData.id)
              .maybeSingle();
            setTeamProfile(teamData);
            break;
          case 'sponsor':
            const { data: sponsorData } = await supabase
              .from('sponsor_profiles')
              .select('*')
              .eq('profile_id', profileData.id)
              .maybeSingle();
            setSponsorProfile(sponsorData);
            break;
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Partial<UnifiedProfile>, specificData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create main profile
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          ...profileData
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create specific profile data
      let specificTable = '';
      switch (profileData.profile_type) {
        case 'player':
          specificTable = 'player_profiles';
          break;
        case 'team_captain':
          specificTable = 'team_profiles';
          break;
        case 'sponsor':
          specificTable = 'sponsor_profiles';
          break;
        default:
          throw new Error('Invalid profile type');
      }

      const { error: specificError } = await supabase
        .from(specificTable)
        .insert({
          profile_id: newProfile.id,
          ...specificData
        });

      if (specificError) throw specificError;

      toast.success('Profile created successfully!');
      await fetchProfile();
      return { success: true };
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.message || 'Error creating profile');
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (profileData: Partial<UnifiedProfile>, specificData: any) => {
    try {
      if (!profile) throw new Error('No profile to update');

      // Update main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Update specific profile data
      let specificTable = '';
      switch (profile.profile_type) {
        case 'player':
          specificTable = 'player_profiles';
          break;
        case 'team_captain':
          specificTable = 'team_profiles';
          break;
        case 'sponsor':
          specificTable = 'sponsor_profiles';
          break;
      }

      const { error: specificError } = await supabase
        .from(specificTable)
        .update(specificData)
        .eq('profile_id', profile.id);

      if (specificError) throw specificError;

      toast.success('Profile updated successfully!');
      await fetchProfile();
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error updating profile');
      return { success: false, error: error.message };
    }
  };

  return {
    profile,
    playerProfile,
    teamProfile,
    sponsorProfile,
    loading,
    createProfile,
    updateProfile,
    refetch: fetchProfile
  };
};
