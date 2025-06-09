
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTournamentFormSubmission } from "./form/useTournamentFormSubmission";
import { FormValues } from "./form/tournamentFormSchema";

const rulesSchema = z.object({
  generalRules: z.string().min(10, "General rules should be at least 10 characters"),
  tiebreakers: z.string().optional(),
  pointSystem: z.string().optional(),
  termsConditions: z.string().min(10, "Terms & conditions should be at least 10 characters"),
});

type RulesFormValues = z.infer<typeof rulesSchema>;

interface TournamentRulesSectionProps {
  onRulesComplete?: () => void;
  showFinalSubmit?: boolean;
  tournamentFormData?: FormValues | null;
}

const TournamentRulesSection = ({ onRulesComplete, showFinalSubmit = false, tournamentFormData }: TournamentRulesSectionProps) => {
  const { onSubmit: submitTournament } = useTournamentFormSubmission();
  
  const form = useForm<RulesFormValues>({
    resolver: zodResolver(rulesSchema),
    defaultValues: {
      generalRules: "",
      tiebreakers: "",
      pointSystem: "",
      termsConditions: "",
    },
  });

  const onSaveRules = async (data: RulesFormValues) => {
    console.log("Rules data:", data);
    
    toast({
      title: "Rules Saved",
      description: "Tournament rules have been updated successfully",
    });
    
    if (onRulesComplete) {
      onRulesComplete();
    }
  };

  const handleCreateTournament = () => {
    console.log("Creating tournament with data:", tournamentFormData);
    
    if (!tournamentFormData) {
      toast({
        title: "Error",
        description: "Tournament form data is missing. Please go back and complete the form.",
        variant: "destructive",
      });
      return;
    }
    
    // Get rules data
    const rulesData = form.getValues();
    
    // Combine all tournament data
    const fullTournamentData = {
      ...tournamentFormData,
      rules: {
        generalRules: rulesData.generalRules,
        tiebreakers: rulesData.tiebreakers,
        pointSystem: rulesData.pointSystem,
        termsConditions: rulesData.termsConditions,
      }
    };
    
    console.log("Submitting complete tournament data:", fullTournamentData);
    submitTournament(fullTournamentData);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Tournament Rules</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSaveRules)} className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="generalRules">
              <AccordionTrigger className="text-lg font-medium">General Rules</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="generalRules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>General Tournament Rules</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the general rules for your tournament..." 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="tiebreakers">
              <AccordionTrigger className="text-lg font-medium">Tie-Breakers</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="tiebreakers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tie-Breaker Rules</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe how ties will be resolved..." 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="pointSystem">
              <AccordionTrigger className="text-lg font-medium">Point System</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="pointSystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Point System</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the point system for your tournament..." 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="termsConditions">
              <AccordionTrigger className="text-lg font-medium">Terms & Conditions</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="termsConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the terms and conditions for participation..." 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline">Preview</Button>
            <Button type="submit" className="bg-sport-purple hover:bg-sport-dark-purple">Save Rules</Button>
            {showFinalSubmit && (
              <Button 
                type="button" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleCreateTournament}
              >
                Create Tournament
              </Button>
            )}
          </div>
        </form>
      </Form>
      
      {/* Debug information */}
      <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <p>Debug: showFinalSubmit = {showFinalSubmit.toString()}</p>
        <p>Debug: tournamentFormData = {tournamentFormData ? "Available" : "Not available"}</p>
      </div>
    </div>
  );
};

export default TournamentRulesSection;
