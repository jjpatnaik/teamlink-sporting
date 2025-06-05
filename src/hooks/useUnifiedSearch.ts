
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SearchProfile {
  id: string;
  display_name: string;
  profile_type: 'player' | 'team_captain' | 'tournament_organizer' | 'sponsor';
  bio?: string;
  city?: string;
  profile_picture_url?: string;
  sport?: string;
  position?: string;
  team_name?: string;
  company_name?: string;
}

export const useUnifiedSearch = () => {
  const [profiles, setProfiles] = useState<SearchProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    
    getCurrentUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUserId(session?.user?.id || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const searchProfiles = async (filters: {
    searchTerm?: string;
    profileType?: string;
    sport?: string;
    city?: string;
  }) => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          profile_type,
          bio,
          city,
          profile_picture_url,
          player_profiles (
            sport,
            position
          ),
          team_profiles (
            team_name,
            sport
          ),
          sponsor_profiles (
            company_name
          )
        `);

      // Exclude current user's profile
      if (currentUserId) {
        query = query.neq('id', currentUserId);
      }

      // Apply filters
      if (filters.searchTerm) {
        query = query.ilike('display_name', `%${filters.searchTerm}%`);
      }

      if (filters.profileType && filters.profileType !== 'all') {
        // Ensure the profile type is one of the valid enum values
        const validProfileTypes = ['player', 'team_captain', 'tournament_organizer', 'sponsor'];
        if (validProfileTypes.includes(filters.profileType)) {
          query = query.eq('profile_type', filters.profileType as 'player' | 'team_captain' | 'tournament_organizer' | 'sponsor');
        }
      }

      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Search error:', error);
        toast.error('Error searching profiles');
        return;
      }

      // Transform data to flatten the related profile information
      const transformedProfiles: SearchProfile[] = (data || []).map((profile: any) => ({
        id: profile.id,
        display_name: profile.display_name,
        profile_type: profile.profile_type,
        bio: profile.bio,
        city: profile.city,
        profile_picture_url: profile.profile_picture_url,
        sport: profile.player_profiles?.[0]?.sport || profile.team_profiles?.[0]?.sport,
        position: profile.player_profiles?.[0]?.position,
        team_name: profile.team_profiles?.[0]?.team_name,
        company_name: profile.sponsor_profiles?.[0]?.company_name,
      }));

      // Additional sport filter for player and team profiles
      let filteredProfiles = transformedProfiles;
      if (filters.sport && filters.sport !== 'any_sport') {
        filteredProfiles = transformedProfiles.filter(profile => 
          profile.sport?.toLowerCase() === filters.sport?.toLowerCase()
        );
      }

      setProfiles(filteredProfiles);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error searching profiles');
    } finally {
      setLoading(false);
    }
  };

  const getAllProfiles = async () => {
    await searchProfiles({});
  };

  useEffect(() => {
    // Only search when we have determined the current user ID (even if it's null)
    if (currentUserId !== undefined) {
      getAllProfiles();
    }
  }, [currentUserId]);

  return {
    profiles,
    loading,
    searchProfiles,
    getAllProfiles
  };
};
