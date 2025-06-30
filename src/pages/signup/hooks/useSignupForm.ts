
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, formSchema } from "../schema";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useSignupForm = (
  setIsLoading: (loading: boolean) => void,
  submitHandler: (data: FormValues) => Promise<boolean>
) => {
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Form submission started for:", data.email);
      
      const success = await submitHandler(data);
      
      if (success) {
        console.log("Signup successful, auth state change will handle redirect");
        // Note: Redirect is handled by auth state change in SignupPage.tsx
        // This ensures proper timing with authentication
      } else {
        console.log("Signup failed, staying on signup page");
        // Error messages are already shown by the submitHandler
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      
      // Provide user-friendly error messages
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create account. Please check your information and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
  };
};
