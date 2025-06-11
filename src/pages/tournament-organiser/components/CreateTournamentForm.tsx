
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema, FormValues } from "./form/tournamentFormSchema";
import TournamentBasicFields from "./form/TournamentBasicFields";
import TournamentDateFields from "./form/TournamentDateFields";
import TournamentTeamFields from "./form/TournamentTeamFields";
import TournamentOrganizerFields from "./form/TournamentOrganizerFields";
import { useTournamentFormSubmission } from "./form/useTournamentFormSubmission";

interface CreateTournamentFormProps {
  onFormComplete?: (formData: FormValues) => void;
  showSubmitButton?: boolean;
}

const CreateTournamentForm = ({ onFormComplete, showSubmitButton = true }: CreateTournamentFormProps) => {
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
      organizerEmail: "",
      organizerPhone: "",
      organizerWebsite: "",
      organizerFacebook: "",
      organizerTwitter: "",
      organizerInstagram: "",
    },
  });

  const handleContinue = async () => {
    console.log("=== FORM CONTINUE BUTTON CLICKED ===");
    console.log("Continue button clicked, validating form...");
    
    // Trigger validation for all fields
    const isValid = await form.trigger();
    console.log("Form validation result:", isValid);
    
    if (!isValid) {
      console.log("❌ Form validation failed, errors:", form.formState.errors);
      console.log("Form errors detail:");
      Object.entries(form.formState.errors).forEach(([field, error]) => {
        console.log(`- ${field}:`, error?.message);
      });
      return;
    }
    
    const formData = form.getValues();
    console.log("✅ Form validation passed!");
    console.log("Raw form data from getValues():", JSON.stringify(formData, null, 2));
    
    if (onFormComplete) {
      console.log("Calling onFormComplete with form data...");
      onFormComplete(formData);
    } else {
      console.log("No onFormComplete handler, proceeding with direct submission...");
    }
    console.log("=== FORM CONTINUE PROCESS COMPLETED ===");
  };

  const handleSubmit = async (data: FormValues) => {
    console.log("=== FORM SUBMIT BUTTON CLICKED ===");
    console.log("Form submitted with data:", JSON.stringify(data, null, 2));
    console.log("Calling onSubmit handler...");
    await onSubmit(data);
    console.log("=== FORM SUBMIT COMPLETED ===");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Create a New Tournament</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TournamentBasicFields form={form} />
            <TournamentDateFields form={form} />
            <TournamentTeamFields form={form} />
          </div>
          
          <TournamentOrganizerFields form={form} />
          
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
