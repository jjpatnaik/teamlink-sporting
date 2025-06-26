
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface CreateTeamData {
  name: string;
  sport: string;
  location: string;
  description: string;
  introduction?: string;
  established_year?: number;
  achievements?: string;
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
          name: teamData.name,
          description: teamData.description,
          introduction: teamData.introduction,
          sport: teamData.sport,
          established_year: teamData.established_year,
          achievements: teamData.achievements,
          owner_id: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as team owner
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      toast.success('Team created successfully!');
      return { success: true, team };
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast.error(error.message || 'Failed to create team');
      return { success: false, error: error.message };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createTeam,
    isCreating
  };
};
