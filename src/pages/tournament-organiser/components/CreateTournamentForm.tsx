
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema, FormValues } from "./form/tournamentFormSchema";
import TournamentBasicFields from "./form/TournamentBasicFields";
import TournamentDateFields from "./form/TournamentDateFields";
import TournamentTeamFields from "./form/TournamentTeamFields";

interface CreateTournamentFormProps {
  onFormComplete?: () => void;
  showSubmitButton?: boolean;
}

const CreateTournamentForm = ({ onFormComplete, showSubmitButton = true }: CreateTournamentFormProps) => {
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

  const handleContinue = () => {
    // Validate the form first
    form.trigger().then((isValid) => {
      if (isValid && onFormComplete) {
        onFormComplete();
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Create a New Tournament</h2>
      
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TournamentBasicFields form={form} />
            <TournamentDateFields form={form} />
            <TournamentTeamFields form={form} />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline">Save Draft</Button>
            {showSubmitButton ? (
              <Button type="submit" className="bg-sport-purple hover:bg-sport-dark-purple">Create Tournament</Button>
            ) : (
              <Button 
                type="button" 
                className="bg-sport-purple hover:bg-sport-dark-purple"
                onClick={handleContinue}
              >
                Continue to Rules
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateTournamentForm;
