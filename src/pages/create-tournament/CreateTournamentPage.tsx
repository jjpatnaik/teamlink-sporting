import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { sportsOptions } from '@/constants/sportOptions';

// Form schema for tournament creation
const tournamentSchema = z.object({
  name: z.string().min(3, { message: 'Tournament name must be at least 3 characters' }),
  description: z.string().optional(),
  sport: z.string().min(1, { message: 'Please select a sport' }),
  format: z.string().min(1, { message: 'Please select a tournament format' }),
  teams_allowed: z.coerce.number().int().positive({ message: 'Must allow at least 1 team' }),
  location: z.string().optional(),
  rules: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type TournamentFormValues = z.infer<typeof tournamentSchema>;

const CreateTournamentPage = () => {
  const [loading, setLoading] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: '',
      description: '',
      sport: '',
      format: 'knockout',
      teams_allowed: 8,
      location: '',
      rules: '',
      start_date: '',
      end_date: '',
    },
  });
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      setUserLoggedIn(!!data.session);
      
      if (!data.session) {
        toast.error('You must be logged in to create a tournament');
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const onSubmit = async (values: TournamentFormValues) => {
    try {
      setLoading(true);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        toast.error('You must be logged in to create a tournament');
        navigate('/login');
        return;
      }
      
      // Insert tournament into database
      const { data: tournament, error } = await supabase
        .from('tournaments')
        .insert({
          name: values.name,
          description: values.description,
          sport: values.sport,
          format: values.format,
          teams_allowed: values.teams_allowed,
          location: values.location,
          rules: values.rules,
          start_date: values.start_date,
          end_date: values.end_date,
          organizer_id: sessionData.session.user.id,
        })
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
  
  // Show loading state while checking auth
  if (userLoggedIn === null) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create Tournament</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Summer Basketball Cup 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your tournament" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sport</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sportsOptions.map((sport) => (
                            <SelectItem key={sport.value} value={sport.value}>
                              {sport.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tournament format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="knockout">Knockout</SelectItem>
                          <SelectItem value="roundrobin">Round Robin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="teams_allowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Teams</FormLabel>
                      <FormControl>
                        <Input type="number" min="2" {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum number of teams allowed to participate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. City Sports Center" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="rules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rules & Regulations</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter tournament rules" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-sport-purple hover:bg-sport-purple/90" disabled={loading}>
                {loading ? 'Creating Tournament...' : 'Create Tournament'}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
};

export default CreateTournamentPage;
