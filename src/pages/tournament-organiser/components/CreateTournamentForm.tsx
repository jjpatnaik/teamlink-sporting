
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema, FormValues } from "./form/tournamentFormSchema";
import { useTournamentFormSubmission } from "./form/useTournamentFormSubmission";
import TournamentBasicFields from "./form/TournamentBasicFields";
import TournamentDateFields from "./form/TournamentDateFields";
import TournamentTeamFields from "./form/TournamentTeamFields";

const CreateTournamentForm = () => {
  const { onSubmit } = useTournamentFormSubmission();
  
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Create a New Tournament</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TournamentBasicFields form={form} />
            <TournamentDateFields form={form} />
            <TournamentTeamFields form={form} />
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
