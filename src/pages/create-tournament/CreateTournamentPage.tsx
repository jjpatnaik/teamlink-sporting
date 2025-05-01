
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { sports } from '@/pages/signup/constants';
import { tournamentFormats } from '@/pages/signup/constants';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

// Form schema
const tournamentFormSchema = z.object({
  name: z.string().min(3, { message: 'Tournament name is required' }),
  description: z.string().optional(),
  sport: z.string().min(1, { message: 'Sport is required' }),
  teamsAllowed: z.number().min(2, { message: 'At least 2 teams are required' }),
  format: z.string().min(1, { message: 'Format is required' }),
  rules: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional()
});

type FormValues = z.infer<typeof tournamentFormSchema>;

const CreateTournamentPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userTournaments, setUserTournaments] = useState([]);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      sport: '',
      teamsAllowed: 8,
      format: '',
      rules: '',
      location: '',
      startDate: undefined,
      endDate: undefined
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        toast.error("You must be logged in to create a tournament");
        navigate('/login');
        return;
      }
      
      // Insert tournament into database - Fix is here, we're now passing a single object instead of an array
      const { data: tournament, error } = await supabase
        .from('tournaments')
        .insert({
          name: values.name,
          description: values.description || null,
          sport: values.sport,
          teams_allowed: values.teamsAllowed,
          format: values.format,
          rules: values.rules || null,
          location: values.location || null,
          start_date: values.startDate || null,
          end_date: values.endDate || null,
          organizer_id: userId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating tournament:', error);
        toast.error('Failed to create tournament');
        return;
      }
      
      toast.success('Tournament created successfully');
      navigate(`/tournaments/${tournament.id}`);
    } catch (error) {
      console.error('Error in tournament creation:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch user's tournaments
  useEffect(() => {
    const fetchUserTournaments = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (userId) {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .eq('organizer_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching tournaments:', error);
          return;
        }
        
        if (data) {
          setUserTournaments(data);
        }
      }
    };
    
    fetchUserTournaments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 px-4 py-8">
        <div className="container mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Create Tournament</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tournament name" {...field} />
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter tournament description" 
                          {...field} 
                          rows={3}
                        />
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
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sport" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sports.map((sport) => (
                              <SelectItem key={sport} value={sport}>
                                {sport}
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
                    name="teamsAllowed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Teams</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={2} 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament Format</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tournamentFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                      <FormLabel>Rules & Regulations (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter tournament rules" 
                          {...field} 
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit" className="bg-sport-purple hover:bg-sport-purple/90" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Tournament'}
                  </Button>
                </div>
              </form>
            </Form>
            
            {userTournaments.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Your Tournaments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userTournaments.map((tournament: any) => (
                    <div 
                      key={tournament.id} 
                      className="border rounded-md p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/tournaments/${tournament.id}`)}
                    >
                      <h3 className="font-medium">{tournament.name}</h3>
                      <p className="text-sm text-gray-500">{tournament.sport}</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {tournament.format === 'round_robin' ? 'Round Robin' : 'Knockout'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(tournament.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateTournamentPage;
