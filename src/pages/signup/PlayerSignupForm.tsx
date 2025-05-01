
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PersonalInfoSection from "./components/PersonalInfoSection";
import { useSignupForm } from "./hooks/useSignupForm";
import { handleSignup } from "./utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PlayerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const PlayerSignupForm: React.FC<PlayerSignupFormProps> = ({ setIsLoading, isLoading }) => {
  const navigate = useNavigate();
  
  const onSuccessfulSignup = () => {
    toast.success("Account created! Complete your profile to connect with others.");
    navigate("/createprofile");
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
          Creating a player account will allow you to join tournaments and connect with teams.
        </p>
      </form>
    </Form>
  );
};

export default PlayerSignupForm;
