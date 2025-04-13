
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MediaUploader from "@/components/player/profile/MediaUploader";
import { formSchema, FormValues } from "./schema";
import { sports, sportPositions, clubs } from "./constants";
import { handleSignup } from "./utils";
import { toast } from "sonner";

interface PlayerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const PlayerSignupForm: React.FC<PlayerSignupFormProps> = ({ setIsLoading, isLoading }) => {
  const [selectedSport, setSelectedSport] = React.useState<string>("");
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload Section */}
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <MediaUploader
              backgroundPreview={backgroundPreview}
              profilePreview={profilePreview}
              onFileChange={handleFileChange}
              fieldProps={field}
            />
          )}
        />

        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Address */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password*</FormLabel>
              <FormControl>
                <Input placeholder="Create a password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sport */}
        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport*</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedSport(value);
                  form.setValue("position", ""); // Reset position when sport changes
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Position/Role - Dynamic based on Sport */}
        {selectedSport && (
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position/Role*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sportPositions[selectedSport]?.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Clubs Played For */}
        <FormField
          control={form.control}
          name="clubs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clubs Played For</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your current or previous club names" 
                  list="clubs-list"
                  {...field} 
                />
              </FormControl>
              <datalist id="clubs-list">
                {clubs.map((club) => (
                  <option key={club} value={club} />
                ))}
              </datalist>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Achievements */}
        <FormField
          control={form.control}
          name="achievements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achievements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List your key achievements (e.g., MVP, All-Star selections)"
                  {...field}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Social Media Fields */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Facebook ID */}
          <FormField
            control={form.control}
            name="facebookId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Facebook profile link (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* WhatsApp ID */}
          <FormField
            control={form.control}
            name="whatsappId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your WhatsApp number (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Instagram ID */}
          <FormField
            control={form.control}
            name="instagramId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Instagram handle (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Required Fields Notice */}
        <div className="text-sm text-gray-500">
          * Required fields
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};

export default PlayerSignupForm;
