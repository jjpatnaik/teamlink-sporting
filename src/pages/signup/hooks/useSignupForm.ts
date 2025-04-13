
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, formSchema } from "../schema";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { sports } from "../constants";

export const useSignupForm = (
  setIsLoading: (loading: boolean) => void,
  submitHandler: (data: FormValues) => Promise<boolean>
) => {
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      sport: "",
      position: "",
      clubs: "",
      achievements: "",
      facebookId: "",
      whatsappId: "",
      instagramId: "",
    },
  });

  const handleFileChange = (files: FileList | null, type: 'profile' | 'background') => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileReader = new FileReader();
      
      fileReader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'profile') {
          setProfilePreview(result);
          form.setValue('profilePicture', files);
        } else {
          setBackgroundPreview(result);
          form.setValue('backgroundPicture', files);
        }
      };
      
      fileReader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (selectedSport) {
      form.setValue("sport", selectedSport);
    }
  }, [selectedSport, form]);

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
    selectedSport,
    setSelectedSport,
    profilePreview,
    backgroundPreview,
    handleFileChange,
    onSubmit,
  };
};
