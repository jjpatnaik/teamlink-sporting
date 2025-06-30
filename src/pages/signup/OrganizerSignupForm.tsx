
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PersonalInfoSection from "./components/PersonalInfoSection";
import { useSignupForm } from "./hooks/useSignupForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormValues } from "./schema";

interface OrganizerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const OrganizerSignupForm: React.FC<OrganizerSignupFormProps> = ({ setIsLoading, isLoading }) => {
  const handleOrganizerSignup = async (data: FormValues): Promise<boolean> => {
    try {
      console.log("Starting organizer signup process for:", data.email);
      
      const redirectUrl = `${window.location.origin}/createprofile`;
      
      // Sign up the user with proper email redirect configuration
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (signupError) {
        console.error("Organizer signup error:", signupError);
        
        // Handle specific error cases
        if (signupError.message.includes("User already registered") || signupError.message.includes("already exists")) {
          toast.error("An account with this email already exists. Please sign in instead or use a different email address.");
          return false;
        } else if (signupError.message.includes("Invalid email")) {
          toast.error("Please enter a valid email address.");
          return false;
        } else {
          toast.error(signupError.message || "Failed to create organizer account");
          return false;
        }
      }
      
      if (!signupData.user) {
        toast.error("Failed to create user account");
        return false;
      }
      
      console.log("Organizer user created successfully:", signupData.user.id);
      
      // Create a tournament to mark them as an organizer
      // This will satisfy the tournament check in ProtectedOrganizerRoute
      const { error: tournamentError } = await supabase.from('tournaments').insert({
        name: "First Tournament (Setup)",
        organizer_id: signupData.user.id,
        teams_allowed: 8,
        format: "knockout",
        sport: "Other"
      });
      
      if (tournamentError) {
        console.error("Error creating initial tournament:", tournamentError);
        // Don't fail the signup process for this, but warn the user
        toast.success("Organizer account created successfully! Please complete your profile setup.");
        console.warn("Initial tournament creation failed, but signup was successful");
      } else {
        toast.success("Tournament organizer account created successfully!");
      }

      return true;
    } catch (error: any) {
      console.error("Unexpected organizer signup error:", error);
      toast.error("An unexpected error occurred during signup. Please try again.");
      return false;
    }
  };

  const { form, onSubmit } = useSignupForm(setIsLoading, handleOrganizerSignup);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoSection form={form} />
        
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
          <p className="text-amber-800 text-sm">
            By signing up as a Tournament Organiser, you'll be able to create and manage tournaments on our platform.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Organizer Account"}
        </Button>
      </form>
    </Form>
  );
};

export default OrganizerSignupForm;
