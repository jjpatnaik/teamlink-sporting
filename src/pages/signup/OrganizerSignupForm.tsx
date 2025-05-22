
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
      // Sign up the user
      const { error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (signupError) throw signupError;
      
      // Get the newly created user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Failed to create user account");
      
      // Create a tournament to mark them as an organizer
      // This will satisfy the tournament check in ProtectedOrganizerRoute
      const { error: tournamentError } = await supabase.from('tournaments').insert({
        name: "First Tournament (Setup)",
        organizer_id: userData.user.id,
        teams_allowed: 8,
        format: "knockout",
        sport: "Other"
      });
      
      if (tournamentError) {
        console.error("Error creating initial tournament:", tournamentError);
        toast.error("Account created but couldn't set organizer status");
        return false;
      }

      toast.success("Tournament organizer account created successfully!");
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
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
