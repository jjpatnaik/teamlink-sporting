
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
  const { user, refreshProfile } = useAuth();

  const createTeam = async (teamData: CreateTeamData) => {
    if (!user) {
      toast.error('You must be logged in to create a team');
      return false;
    }

    try {
      setIsCreating(true);
      
      // Create the team
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

      // Update user profile to include team_admin role if they don't have it
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('roles')
        .eq('user_id', user.id)
        .single();

      if (currentProfile && !currentProfile.roles.includes('team_admin')) {
        const updatedRoles = [...currentProfile.roles, 'team_admin'];
        
        const { error: roleError } = await supabase
          .from('profiles')
          .update({ roles: updatedRoles })
          .eq('user_id', user.id);

        if (roleError) {
          console.error('Error updating user roles:', roleError);
        } else {
          // Refresh the profile to get updated roles
          await refreshProfile();
        }
      }

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
