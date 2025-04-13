
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
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const success = await submitHandler(data);
      
      if (success) {
        // Authentication successful, redirect to profile page handled in SignupPage.tsx
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
  };
};
