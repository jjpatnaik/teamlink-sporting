
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { tournamentSchema } from '../schema';
import TournamentBasicInfo from './TournamentBasicInfo';
import TournamentDetailsInfo from './TournamentDetailsInfo';
import TournamentDatesAndRules from './TournamentDatesAndRules';

type TournamentFormValues = z.infer<typeof tournamentSchema>;

const TournamentForm = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  
  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: '',
      description: '',
      sport: '',
      format: 'round_robin',
      teams_allowed: 8,
      location: '',
      rules: '',
      start_date: '',
      end_date: '',
    },
  });
  
  const onSubmit = async (values: TournamentFormValues) => {
    try {
      setLoading(true);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        toast.error('You must be logged in to create a tournament');
        navigate('/login');
        return;
      }
      
      // Prepare tournament data, ensuring dates are not empty strings
      const tournamentData = {
        name: values.name,
        description: values.description || null,
        sport: values.sport,
        format: values.format,
        teams_allowed: values.teams_allowed,
        location: values.location || null,
        rules: values.rules || null,
        start_date: values.start_date && values.start_date.trim() !== '' ? values.start_date : null,
        end_date: values.end_date && values.end_date.trim() !== '' ? values.end_date : null,
        organizer_id: sessionData.session.user.id,
      };
      
      console.log('Submitting tournament data:', tournamentData);
      
      // Insert tournament into database
      const { data: tournament, error } = await supabase
        .from('tournaments')
        .insert(tournamentData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Tournament created successfully');
      navigate(`/tournaments/${tournament.id}`);
    } catch (error: any) {
      console.error('Error creating tournament:', error);
      toast.error(error.message || 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <TournamentBasicInfo form={form} />
      <TournamentDetailsInfo form={form} />
      <TournamentDatesAndRules form={form} />
      
      <Button type="submit" className="w-full bg-sport-purple hover:bg-sport-purple/90" disabled={loading}>
        {loading ? 'Creating Tournament...' : 'Create Tournament'}
      </Button>
    </form>
  );
};

export default TournamentForm;
