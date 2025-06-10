
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SearchProfile {
  id: string; // This will be the user_id for proper routing
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

export interface SearchTournament {
  id: string;
  name: string;
  sport: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  tournament_status: string | null;
  organizer_name?: string;
}

export interface UnifiedSearchResults {
  profiles: SearchProfile[];
  tournaments: SearchTournament[];
}

export const useUnifiedSearch = () => {
  const [profiles, setProfiles] = useState<SearchProfile[]>([]);
  const [tournaments, setTournaments] = useState<SearchTournament[]>([]);
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
      console.log('=== UNIFIED SEARCH QUERY ===');
      console.log('Search filters:', filters);
      console.log('Current user ID:', currentUserId);

      // Search profiles
      let profileQuery = supabase
        .from('profiles')
        .select(`
          id,
          user_id,
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
        profileQuery = profileQuery.neq('user_id', currentUserId);
      }

      // Apply filters to profiles
      if (filters.searchTerm) {
        profileQuery = profileQuery.ilike('display_name', `%${filters.searchTerm}%`);
      }

      if (filters.profileType && filters.profileType !== 'all') {
        const validProfileTypes = ['player', 'team_captain', 'tournament_organizer', 'sponsor'];
        if (validProfileTypes.includes(filters.profileType)) {
          profileQuery = profileQuery.eq('profile_type', filters.profileType as 'player' | 'team_captain' | 'tournament_organizer' | 'sponsor');
        }
      }

      if (filters.city) {
        profileQuery = profileQuery.ilike('city', `%${filters.city}%`);
      }

      const { data: profileData, error: profileError } = await profileQuery;

      if (profileError) {
        console.error('Profile search error:', profileError);
        toast.error('Error searching profiles');
        return;
      }

      // Search tournaments
      let tournamentQuery = supabase
        .from('tournaments')
        .select(`
          id,
          name,
          sport,
          location,
          start_date,
          end_date,
          description,
          tournament_status,
          organizer_id,
          profiles!tournaments_organizer_id_fkey (
            display_name
          )
        `)
        .neq('tournament_status', 'cancelled'); // Only show active tournaments

      // Apply filters to tournaments
      if (filters.searchTerm) {
        tournamentQuery = tournamentQuery.ilike('name', `%${filters.searchTerm}%`);
      }

      if (filters.sport && filters.sport !== 'any_sport') {
        tournamentQuery = tournamentQuery.ilike('sport', `%${filters.sport}%`);
      }

      if (filters.city) {
        tournamentQuery = tournamentQuery.ilike('location', `%${filters.city}%`);
      }

      const { data: tournamentData, error: tournamentError } = await tournamentQuery;

      if (tournamentError) {
        console.error('Tournament search error:', tournamentError);
        // Don't fail the entire search if tournaments fail
        console.log('Tournament search failed, continuing with profiles only');
      }

      console.log('Profile search result:', { data: profileData, error: profileError });
      console.log('Tournament search result:', { data: tournamentData, error: tournamentError });

      // Transform profile data
      const transformedProfiles: SearchProfile[] = (profileData || []).map((profile: any) => ({
        id: profile.user_id,
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

      // Transform tournament data
      const transformedTournaments: SearchTournament[] = (tournamentData || []).map((tournament: any) => ({
        id: tournament.id,
        name: tournament.name,
        sport: tournament.sport,
        location: tournament.location,
        start_date: tournament.start_date,
        end_date: tournament.end_date,
        description: tournament.description,
        tournament_status: tournament.tournament_status,
        organizer_name: tournament.profiles?.display_name || 'Unknown Organizer',
      }));

      // Additional sport filter for profiles
      let filteredProfiles = transformedProfiles;
      if (filters.sport && filters.sport !== 'any_sport') {
        filteredProfiles = transformedProfiles.filter(profile => 
          profile.sport?.toLowerCase() === filters.sport?.toLowerCase()
        );
      }

      console.log('Final filtered profiles:', filteredProfiles);
      console.log('Final filtered tournaments:', transformedTournaments);
      
      setProfiles(filteredProfiles);
      setTournaments(transformedTournaments);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error searching profiles and tournaments');
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
    tournaments,
    loading,
    searchProfiles,
    getAllProfiles
  };
};
