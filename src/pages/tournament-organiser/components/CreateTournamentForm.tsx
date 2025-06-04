
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trophy, MapPin, DollarSign, Users, Clock } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { sportsOptions } from "@/constants/sportOptions";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const tournamentFormats = [
  { value: "knockout", label: "Knockout" },
  { value: "round_robin", label: "Round Robin" },
  { value: "league", label: "League" },
  { value: "swiss", label: "Swiss System" }
];

const formSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  description: z.string().optional(),
  sport: z.string().min(1, "Please select a sport"),
  format: z.string().min(1, "Please select a tournament format"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  location: z.string().optional(),
  entryFee: z.string().optional(),
  teamsAllowed: z.string().min(1, "Please enter max number of teams/players"),
  teamSize: z.string().optional(),
  registrationDeadline: z.date({
    required_error: "Registration deadline is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTournamentForm = () => {
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      sport: "",
      format: "",
      location: "",
      entryFee: "0",
      teamsAllowed: "8",
      teamSize: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log("Starting tournament creation process...");
    
    try {
      // Check for authenticated user
      console.log("Checking authentication...");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast({
          title: "Authentication Error",
          description: `Failed to get session: ${sessionError.message}`,
          variant: "destructive",
        });
        return;
      }
      
      if (!sessionData.session?.user) {
        console.error("No authenticated user found");
        toast({
          title: "Authentication Required",
          description: "You need to be logged in to create a tournament",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const organizerId = sessionData.session.user.id;
      console.log("User authenticated, organizer ID:", organizerId);
      
      // Convert string numbers to integers with validation
      const teamsAllowed = parseInt(data.teamsAllowed);
      const entryFee = data.entryFee ? parseFloat(data.entryFee) : 0;
      const teamSize = data.teamSize ? parseInt(data.teamSize) : null;
      
      if (isNaN(teamsAllowed) || teamsAllowed < 1) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid number of teams allowed",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Submitting tournament with data:", {
        name: data.name,
        format: data.format,
        sport: data.sport,
        teamsAllowed,
        organizerId
      });
      
      // Prepare tournament data
      const tournamentData = {
        name: data.name,
        description: data.description || null,
        sport: data.sport,
        format: data.format,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate.toISOString(),
        location: data.location || null,
        teams_allowed: teamsAllowed,
        entry_fee: entryFee,
        team_size: teamSize,
        registration_deadline: data.registrationDeadline.toISOString(),
        organizer_id: organizerId,
        tournament_status: 'registration_open',
        fixture_generation_status: 'pending',
        rules: null,
      };
      
      console.log("Attempting to insert tournament:", tournamentData);
      
      // Save tournament to database with retry logic
      let tournament;
      let error;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`Database insert attempt ${retryCount + 1}/${maxRetries}`);
          
          const result = await supabase
            .from('tournaments')
            .insert(tournamentData)
            .select()
            .single();
            
          tournament = result.data;
          error = result.error;
          
          if (!error) {
            console.log("Tournament created successfully:", tournament);
            break;
          } else {
            console.error(`Insert attempt ${retryCount + 1} failed:`, error);
            throw error;
          }
        } catch (insertError) {
          console.error(`Insert attempt ${retryCount + 1} failed with error:`, insertError);
          error = insertError;
          retryCount++;
          
          if (retryCount < maxRetries) {
            console.log(`Retrying in 1 second... (attempt ${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
        
      if (error) {
        console.error("Final error after all retries:", error);
        let errorMessage = "Failed to create tournament";
        
        if (error.message) {
          errorMessage += `: ${error.message}`;
        }
        
        if (error.code) {
          errorMessage += ` (Code: ${error.code})`;
        }
        
        if (error.details) {
          errorMessage += ` - ${error.details}`;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      if (!tournament) {
        console.error("No tournament data returned after successful insert");
        toast({
          title: "Error",
          description: "Tournament was created but no data was returned. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Tournament created successfully! Registration is now open.",
      });
      
      // Navigate to the tournament profile page
      console.log("Navigating to tournament profile:", tournament.id);
      navigate(`/tournament/${tournament.id}`);
      
    } catch (error: any) {
      console.error("Unexpected error in form submission:", error);
      console.error("Error stack:", error.stack);
      console.error("Error type:", typeof error);
      console.error("Error constructor:", error.constructor.name);
      
      let errorMessage = "An unexpected error occurred";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Create a New Tournament</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tournament Name */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Trophy className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="e.g. Midwest Championship 2025" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Description */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide details about your tournament..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Sport Type */}
            <FormField
              control={form.control}
              name="sport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sportsOptions.map(sport => (
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
            
            {/* Tournament Format */}
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tournamentFormats.map(format => (
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
            
            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
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
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="registrationDeadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Registration Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
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
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="e.g. Chicago Sports Complex" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="entryFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Fee (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01"
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="teamsAllowed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Teams/Players</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        type="number" 
                        placeholder="8" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Size / Player Limit (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        type="number" 
                        placeholder="11" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline">Save Draft</Button>
            <Button type="submit" className="bg-sport-purple hover:bg-sport-dark-purple">Create Tournament</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateTournamentForm;
