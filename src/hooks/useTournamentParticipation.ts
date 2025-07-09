import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ParticipatedTournament {
  id: string;
  name: string;
  sport: string;
  location: string;
  start_date: string;
  end_date: string;
  tournament_status: string;
  description: string;
  format: string;
  registration_type: 'individual' | 'team';
  team_name?: string;
  team_id?: string;
  status: 'active' | 'withdrawn';
}

export interface TournamentUpdate {
  id: string;
  title: string;
  content: string;
  update_type: string;
  is_important: boolean;
  created_at: string;
  tournament_id: string;
  tournament_name: string;
}

export const useTournamentParticipation = () => {
  const { user } = useAuth();
  const [participatedTournaments, setParticipatedTournaments] = useState<ParticipatedTournament[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<TournamentUpdate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchParticipatedTournaments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch tournaments the user is participating in
      const { data: participantData, error: participantError } = await supabase
        .from('tournament_participants')
        .select(`
          id,
          registration_type,
          status,
          team_id,
          tournaments!inner (
            id,
            name,
            sport,
            location,
            start_date,
            end_date,
            tournament_status,
            description,
            format
          ),
          teams (
            name
          )
        `)
        .eq('user_id', user.id);

      if (participantError) {
        console.error('Error fetching participated tournaments:', participantError);
        return;
      }

      // Also fetch tournaments where user's team is registered
      const { data: teamTournaments, error: teamError } = await supabase
        .from('tournament_teams')
        .select(`
          id,
          team_name,
          tournaments!inner (
            id,
            name,
            sport,
            location,
            start_date,
            end_date,
            tournament_status,
            description,
            format
          )
        `)
        .eq('registered_by', user.id);

      if (teamError) {
        console.error('Error fetching team tournaments:', teamError);
      }

      // Combine and format the data
      const allTournaments: ParticipatedTournament[] = [];

      if (participantData) {
        participantData.forEach((participant: any) => {
          allTournaments.push({
            id: participant.tournaments.id,
            name: participant.tournaments.name,
            sport: participant.tournaments.sport,
            location: participant.tournaments.location || 'TBD',
            start_date: participant.tournaments.start_date,
            end_date: participant.tournaments.end_date,
            tournament_status: participant.tournaments.tournament_status,
            description: participant.tournaments.description,
            format: participant.tournaments.format,
            registration_type: participant.registration_type,
            team_name: participant.teams?.name,
            team_id: participant.team_id,
            status: participant.status
          });
        });
      }

      if (teamTournaments) {
        teamTournaments.forEach((teamTournament: any) => {
          // Avoid duplicates
          if (!allTournaments.find(t => t.id === teamTournament.tournaments.id)) {
            allTournaments.push({
              id: teamTournament.tournaments.id,
              name: teamTournament.tournaments.name,
              sport: teamTournament.tournaments.sport,
              location: teamTournament.tournaments.location || 'TBD',
              start_date: teamTournament.tournaments.start_date,
              end_date: teamTournament.tournaments.end_date,
              tournament_status: teamTournament.tournaments.tournament_status,
              description: teamTournament.tournaments.description,
              format: teamTournament.tournaments.format,
              registration_type: 'team',
              team_name: teamTournament.team_name,
              status: 'active'
            });
          }
        });
      }

      setParticipatedTournaments(allTournaments);
    } catch (error) {
      console.error('Error in fetchParticipatedTournaments:', error);
      toast.error('Failed to load your tournaments');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUpdates = async () => {
    if (!user) return;

    try {
      // Get tournament IDs the user is participating in
      const tournamentIds = participatedTournaments.map(t => t.id);
      
      if (tournamentIds.length === 0) return;

      const { data: updatesData, error: updatesError } = await supabase
        .from('tournament_updates')
        .select(`
          id,
          title,
          content,
          update_type,
          is_important,
          created_at,
          tournament_id,
          tournaments!inner (name)
        `)
        .in('tournament_id', tournamentIds)
        .order('created_at', { ascending: false })
        .limit(10);

      if (updatesError) {
        console.error('Error fetching tournament updates:', updatesError);
        return;
      }

      if (updatesData) {
        const formattedUpdates: TournamentUpdate[] = updatesData.map((update: any) => ({
          id: update.id,
          title: update.title,
          content: update.content,
          update_type: update.update_type,
          is_important: update.is_important,
          created_at: update.created_at,
          tournament_id: update.tournament_id,
          tournament_name: update.tournaments.name
        }));

        setRecentUpdates(formattedUpdates);
      }
    } catch (error) {
      console.error('Error in fetchRecentUpdates:', error);
    }
  };

  const withdrawFromTournament = async (tournamentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tournament_participants')
        .update({ status: 'withdrawn' })
        .eq('tournament_id', tournamentId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Successfully withdrawn from tournament');
      await fetchParticipatedTournaments();
    } catch (error) {
      console.error('Error withdrawing from tournament:', error);
      toast.error('Failed to withdraw from tournament');
    }
  };

  useEffect(() => {
    if (user) {
      fetchParticipatedTournaments();
    }
  }, [user]);

  useEffect(() => {
    if (participatedTournaments.length > 0) {
      fetchRecentUpdates();
    }
  }, [participatedTournaments]);

  return {
    participatedTournaments,
    recentUpdates,
    loading,
    refreshData: fetchParticipatedTournaments,
    withdrawFromTournament
  };
};