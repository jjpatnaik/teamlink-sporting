
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { FormValues, formSchema } from "../schema";
import { handleSignup } from "../utils";
import { toast } from "sonner";

export const useSignupForm = (setIsLoading: (loading: boolean) => void) => {
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
    mode: "onChange", // Validate on change for better user feedback
  });

  const handleFileChange = (files: FileList | null, type: 'profile' | 'background') => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileReader = new FileReader();
      
      fileReader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'profile') {
          setProfilePreview(result);
        } else {
          setBackgroundPreview(result);
        }
      };
      
      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const success = await handleSignup(data);
      if (success) {
        toast.success("Profile created successfully!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error("Failed to create profile. Please try again.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "An unexpected error occurred");
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
    onSubmit
  };
};
