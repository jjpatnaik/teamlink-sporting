
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface CreateTeamData {
  name: string;
  sport: string;
  location: string;
  description: string;
}

export const useTeamCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const createTeam = async (teamData: CreateTeamData) => {
    if (!user) {
      toast.error('You must be logged in to create a team');
      return false;
    }

    try {
      setIsCreating(true);
      
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          ...teamData,
          created_by: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as team admin
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'admin',
          status: 'accepted'
        });

      if (memberError) throw memberError;

      toast.success('Team created successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createTeam,
    isCreating
  };
};
