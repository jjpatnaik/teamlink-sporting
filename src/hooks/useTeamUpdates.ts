
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface TeamUpdate {
  id: string;
  team_id: string;
  author_id: string;
  title: string;
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
    if (!teamId) return;

    try {
      setLoading(true);
      
      const { data: updatesData, error: updatesError } = await supabase
        .from('team_updates')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (updatesError) throw updatesError;

      if (!updatesData || updatesData.length === 0) {
        setUpdates([]);
        return;
      }

      // Fetch author profiles
      const authorIds = updatesData.map(update => update.author_id).filter(Boolean);
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
          title: update.title,
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
      toast.error('Failed to fetch team updates');
    } finally {
      setLoading(false);
    }
  };

  const createUpdate = async (title: string, content: string) => {
    if (!user || !teamId) return false;

    try {
      const { error } = await supabase
        .from('team_updates')
        .insert({
          team_id: teamId,
          author_id: user.id,
          title,
          content
        });

      if (error) throw error;

      toast.success('Team update posted successfully!');
      await fetchUpdates();
      return true;
    } catch (error: any) {
      console.error('Error creating team update:', error);
      toast.error('Failed to post team update');
      return false;
    }
  };

  const updateTeamUpdate = async (updateId: string, title: string, content: string) => {
    try {
      const { error } = await supabase
        .from('team_updates')
        .update({ title, content })
        .eq('id', updateId);

      if (error) throw error;

      toast.success('Team update updated successfully!');
      await fetchUpdates();
      return true;
    } catch (error: any) {
      console.error('Error updating team update:', error);
      toast.error('Failed to update team update');
      return false;
    }
  };

  const deleteUpdate = async (updateId: string) => {
    try {
      const { error } = await supabase
        .from('team_updates')
        .delete()
        .eq('id', updateId);

      if (error) throw error;

      toast.success('Team update deleted successfully!');
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
  }, [teamId]);

  return {
    updates,
    loading,
    createUpdate,
    updateTeamUpdate,
    deleteUpdate,
    refetch: fetchUpdates
  };
};
