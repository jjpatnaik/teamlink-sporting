
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface TeamUpdate {
  id: string;
  team_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_profile?: {
    display_name: string;
    profile_picture_url?: string;
  };
}

export const useTeamUpdates = (teamId?: string) => {
  const [updates, setUpdates] = useState<TeamUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchUpdates = async () => {
    if (!teamId || !user) {
      setUpdates([]);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching team updates for team:', teamId);
      
      const { data: updatesData, error: updatesError } = await supabase
        .from('team_updates')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (updatesError) {
        console.error('Error fetching team updates:', updatesError);
        throw updatesError;
      }

      console.log('Fetched team updates:', updatesData);

      if (!updatesData || updatesData.length === 0) {
        setUpdates([]);
        return;
      }

      // Fetch author profiles
      const authorIds = [...new Set(updatesData.map(update => update.author_id).filter(Boolean))];
      let authorProfiles: any[] = [];

      if (authorIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, profile_picture_url')
          .in('user_id', authorIds);

        if (profilesError) {
          console.error('Error fetching author profiles:', profilesError);
        } else {
          authorProfiles = profiles || [];
        }
      }

      const formattedUpdates = updatesData.map(update => {
        const authorProfile = authorProfiles.find(p => p.user_id === update.author_id);

        return {
          id: update.id,
          team_id: update.team_id,
          author_id: update.author_id,
          content: update.content,
          created_at: update.created_at,
          updated_at: update.updated_at,
          author_profile: authorProfile ? {
            display_name: authorProfile.display_name || 'Unknown User',
            profile_picture_url: authorProfile.profile_picture_url
          } : {
            display_name: 'Unknown User'
          }
        };
      });

      setUpdates(formattedUpdates);
    } catch (error: any) {
      console.error('Error fetching team updates:', error);
      if (error.code === 'PGRST116' || error.message?.includes('permission denied')) {
        console.log('User does not have permission to view team updates - they may not be a team member');
        setUpdates([]);
      } else {
        toast.error('Failed to fetch team updates');
      }
    } finally {
      setLoading(false);
    }
  };

  const createUpdate = async (content: string) => {
    if (!user || !teamId) {
      toast.error('You must be logged in to post updates');
      return false;
    }

    try {
      console.log('Creating team update:', { teamId, content });
      
      const { error } = await supabase
        .from('team_updates')
        .insert({
          team_id: teamId,
          author_id: user.id,
          content
        });

      if (error) {
        console.error('Error creating team update:', error);
        if (error.code === 'PGRST116' || error.message?.includes('permission denied')) {
          toast.error('You do not have permission to post updates to this team');
        } else {
          toast.error('Failed to post team update: ' + error.message);
        }
        return false;
      }

      console.log('Team update created successfully');
      await fetchUpdates();
      return true;
    } catch (error: any) {
      console.error('Error creating team update:', error);
      toast.error('Failed to post team update');
      return false;
    }
  };

  const updateTeamUpdate = async (updateId: string, content: string) => {
    if (!user) {
      toast.error('You must be logged in to edit updates');
      return false;
    }

    try {
      console.log('Updating team update:', { updateId, content });
      
      const { error } = await supabase
        .from('team_updates')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', updateId);

      if (error) {
        console.error('Error updating team update:', error);
        if (error.code === 'PGRST116' || error.message?.includes('permission denied')) {
          toast.error('You do not have permission to edit this update');
        } else {
          toast.error('Failed to update team update: ' + error.message);
        }
        return false;
      }

      console.log('Team update updated successfully');
      await fetchUpdates();
      return true;
    } catch (error: any) {
      console.error('Error updating team update:', error);
      toast.error('Failed to update team update');
      return false;
    }
  };

  const deleteUpdate = async (updateId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete updates');
      return false;
    }

    try {
      console.log('Deleting team update:', updateId);
      
      const { error } = await supabase
        .from('team_updates')
        .delete()
        .eq('id', updateId);

      if (error) {
        console.error('Error deleting team update:', error);
        if (error.code === 'PGRST116' || error.message?.includes('permission denied')) {
          toast.error('You do not have permission to delete this update');
        } else {
          toast.error('Failed to delete team update: ' + error.message);
        }
        return false;
      }

      console.log('Team update deleted successfully');
      await fetchUpdates();
      return true;
    } catch (error: any) {
      console.error('Error deleting team update:', error);
      toast.error('Failed to delete team update');
      return false;
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [teamId, user]);

  return {
    updates,
    loading,
    createUpdate,
    updateTeamUpdate,
    deleteUpdate,
    refetch: fetchUpdates
  };
};
