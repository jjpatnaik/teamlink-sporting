
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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { UserCircle, Image as ImageIcon } from "lucide-react";
import { formSchema, FormValues } from "./schema";
import { sports, sportPositions, clubs } from "./constants";
import { handleSignup } from "./utils";

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
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const success = await handleSignup(data);
    if (success) {
      setTimeout(() => navigate("/"), 2000);
    }
    setIsLoading(false);
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Images</h3>
          
          {/* Background Image Upload */}
          <FormField
            control={form.control}
            name="backgroundPicture"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={3/1} className="bg-muted">
                        {backgroundPreview ? (
                          <img
                            src={backgroundPreview}
                            alt="Background preview"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-muted">
                            <ImageIcon className="w-10 h-10 text-muted-foreground" />
                          </div>
                        )}
                      </AspectRatio>
                    </Card>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleFileChange(e.target.files, 'background');
                      }}
                      {...fieldProps}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Profile Picture Upload */}
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-muted mx-auto border-4 border-background relative -mt-16 shadow-lg">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile preview"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <UserCircle className="w-full h-full text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleFileChange(e.target.files, 'profile');
                      }}
                      {...fieldProps}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
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
              <FormLabel>Email Address</FormLabel>
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
              <FormLabel>Password</FormLabel>
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
              <FormLabel>Sport</FormLabel>
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
                <FormLabel>Position/Role</FormLabel>
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

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};

export default PlayerSignupForm;
