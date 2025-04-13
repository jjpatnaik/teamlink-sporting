
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PersonalInfoSection from "./components/PersonalInfoSection";
import { useSignupForm } from "./hooks/useSignupForm";
import { handleSignup } from "./utils";

interface PlayerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const PlayerSignupForm: React.FC<PlayerSignupFormProps> = ({ setIsLoading, isLoading }) => {
  const {
    form,
    onSubmit
  } = useSignupForm(setIsLoading, handleSignup);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email and Password fields only */}
        <PersonalInfoSection form={form} />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};

export default PlayerSignupForm;
