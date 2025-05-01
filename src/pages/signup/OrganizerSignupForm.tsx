
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PersonalInfoSection from "./components/PersonalInfoSection";
import { useSignupForm } from "./hooks/useSignupForm";
import { handleSignup } from "./utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OrganizerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const OrganizerSignupForm: React.FC<OrganizerSignupFormProps> = ({ setIsLoading, isLoading }) => {
  const navigate = useNavigate();
  const [signupCompleted, setSignupCompleted] = useState(false);
  
  const onSuccessfulSignup = () => {
    setSignupCompleted(true);
    toast.success("Account created! You can now create tournaments.");
    navigate("/create-tournament");
  };
  
  const { form, onSubmit } = useSignupForm(setIsLoading, handleSignup);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data, onSuccessfulSignup))} className="space-y-6">
        {/* Email and Password fields */}
        <PersonalInfoSection form={form} />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
        
        <p className="text-center text-sm text-gray-500">
          Creating an organizer account will allow you to create and manage tournaments.
        </p>
      </form>
    </Form>
  );
};

export default OrganizerSignupForm;
