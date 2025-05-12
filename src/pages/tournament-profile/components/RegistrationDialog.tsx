
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
  Form, FormField, FormItem, FormLabel, FormControl,
  FormDescription, FormMessage
} from "@/components/ui/form";
import { Tournament } from '../hooks/useTournamentData';

const registrationSchema = z.object({
  teamName: z.string().min(2, { message: "Team name is required" }),
  contactEmail: z.string().email({ message: "Valid email is required" }),
  playerNames: z.string().optional()
});

type RegistrationValues = z.infer<typeof registrationSchema>;

interface RegistrationDialogProps {
  tournament: Tournament;
  isTournamentFull: boolean;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({ tournament, isTournamentFull }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      teamName: '',
      contactEmail: '',
      playerNames: ''
    }
  });

  const handleRegistration = async (values: RegistrationValues) => {
    if (!tournament) return;
    
    // Check if tournament is already full
    if (isTournamentFull) {
      toast.error("Tournament is full. No more teams can be registered");
      setIsDialogOpen(false);
      return;
    }
    
    // Check if user is logged in
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      toast.error("You must be logged in to register a team");
      return;
    }
    
    setIsRegistrationLoading(true);
    
    try {
      console.log("Registering team:", {
        tournament_id: tournament.id,
        team_name: values.teamName,
        contact_email: values.contactEmail,
        status: 'registered'
      });
      
      const { data, error } = await supabase
        .from('tournament_teams')
        .insert({
          tournament_id: tournament.id,
          team_name: values.teamName,
          contact_email: values.contactEmail,
          status: 'registered'
        })
        .select();
        
      if (error) {
        console.error("Registration error:", error);
        throw error;
      }
      
      console.log("Registration successful:", data);
      toast.success("Team registered successfully");
      setIsDialogOpen(false);
      
      // Reset form
      form.reset();
      
      // Refresh the page to show updated teams
      window.location.reload();
    } catch (error: any) {
      console.error("Error registering team:", error.message);
      toast.error("Failed to register team: " + error.message);
    } finally {
      setIsRegistrationLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-sport-purple hover:bg-sport-purple/90"
          disabled={isTournamentFull}
        >
          {isTournamentFull ? 'Tournament Full' : 'Register Your Team'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for {tournament.name}</DialogTitle>
          <DialogDescription>
            Enter your team information to participate in this tournament.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-4">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@team.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="playerNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Names (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter player names, one per line" 
                      className="resize-y min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter one player name per line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-sport-purple hover:bg-sport-purple/90"
                disabled={isRegistrationLoading}
              >
                {isRegistrationLoading ? 'Registering...' : 'Register Team'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;
