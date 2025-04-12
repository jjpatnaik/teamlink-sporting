
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
import { Separator } from "@/components/ui/separator";
import { UserCircle, Image as ImageIcon, Trophy, Medal } from "lucide-react";
import { sports, sportPositions, clubs } from "../signup/constants";
import { handleSignup } from "../signup/utils";
import * as z from "zod";

interface PlayerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

// Create a simplified form schema without email and password
const playerFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  sport: z.string().min(1, "Please select a sport"),
  position: z.string().optional(),
  clubs: z.string().optional(),
  achievements: z.string().optional(),
  facebookId: z.string().optional(),
  whatsappId: z.string().optional(),
  instagramId: z.string().optional(),
  profilePicture: z.any().optional(),
  backgroundPicture: z.any().optional(),
});

type PlayerFormValues = z.infer<typeof playerFormSchema>;

const PlayerSignupForm: React.FC<PlayerSignupFormProps> = ({ setIsLoading, isLoading }) => {
  const [selectedSport, setSelectedSport] = React.useState<string>("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      fullName: "",
      sport: "",
      position: "",
      clubs: "",
      achievements: "",
      facebookId: "",
      whatsappId: "",
      instagramId: "",
    },
  });

  const onSubmit = async (data: PlayerFormValues) => {
    setIsLoading(true);
    
    // We'd need to adapt the signup handler to work without email/password
    // For now, we'll simulate success after a short delay
    setTimeout(() => {
      navigate("/");
      setIsLoading(false);
    }, 1500);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Image Upload Section - Modern Card Design */}
        <Card className="overflow-hidden bg-white border-none shadow-md">
          {/* Background Image Upload */}
          <FormField
            control={form.control}
            name="backgroundPicture"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem className="space-y-0">
                <div className="relative">
                  <AspectRatio ratio={3/1} className="bg-gradient-to-r from-sport-blue/20 to-sport-purple/20">
                    {backgroundPreview ? (
                      <img
                        src={backgroundPreview}
                        alt="Background preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <ImageIcon className="w-12 h-12 text-sport-purple/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <label htmlFor="bg-upload" className="cursor-pointer px-4 py-2 bg-white/80 backdrop-blur-sm rounded-md text-sm font-medium text-sport-dark-purple hover:bg-white/90 transition-colors">
                        Upload Cover Photo
                      </label>
                      <Input
                        id="bg-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          onChange(e.target.files);
                          handleFileChange(e.target.files, 'background');
                        }}
                        className="hidden"
                        {...fieldProps}
                      />
                    </div>
                  </AspectRatio>
                </div>

                {/* Profile Picture Upload */}
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-white mx-auto border-4 border-white relative -mt-16 shadow-lg">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile preview"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-sport-light-purple">
                          <UserCircle className="w-16 h-16 text-sport-purple" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                        <label htmlFor="profile-upload" className="cursor-pointer rounded-full p-2 bg-white/80 text-sport-dark-purple">
                          <ImageIcon className="w-5 h-5" />
                        </label>
                        <Input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleFileChange(e.target.files, 'profile');
                          }}
                          className="hidden"
                          {...fieldProps}
                        />
                      </div>
                    </div>
                  )}
                />
              </FormItem>
            )}
          />

          <div className="p-6 pt-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-sport-dark-gray font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Sport */}
              <FormField
                control={form.control}
                name="sport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sport-dark-gray font-medium">Sport</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedSport(value);
                        form.setValue("position", ""); // Reset position when sport changes
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
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
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sport-dark-gray font-medium">Position/Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedSport}
                    >
                      <FormControl>
                        <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                          <SelectValue placeholder={selectedSport ? "Select your position" : "Select a sport first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedSport && sportPositions[selectedSport]?.map((position) => (
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
            </div>

            {/* Section Separator */}
            <Separator className="my-6 bg-sport-light-purple/30" />

            {/* Career Information Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-sport-dark-gray flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-sport-purple" />
                Career Information
              </h3>
              
              {/* Clubs Played For */}
              <FormField
                control={form.control}
                name="clubs"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-sport-dark-gray font-medium">Clubs Played For</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your current or previous club names" 
                        list="clubs-list"
                        className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
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
                    <FormLabel className="text-sport-dark-gray font-medium">Achievements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List your key achievements (e.g., MVP, All-Star selections)"
                        {...field}
                        className="min-h-[120px] border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section Separator */}
            <Separator className="my-6 bg-sport-light-purple/30" />

            {/* Social Media Fields */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-sport-dark-gray flex items-center">
                <Medal className="w-5 h-5 mr-2 text-sport-purple" />
                Social Media & Contact
              </h3>
              
              <div className="grid gap-5 md:grid-cols-3">
                {/* Facebook ID */}
                <FormField
                  control={form.control}
                  name="facebookId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sport-dark-gray font-medium">Facebook</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Facebook profile" 
                          {...field} 
                          className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
                        />
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
                      <FormLabel className="text-sport-dark-gray font-medium">WhatsApp</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your WhatsApp number" 
                          {...field} 
                          className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
                        />
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
                      <FormLabel className="text-sport-dark-gray font-medium">Instagram</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Instagram handle" 
                          {...field} 
                          className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-sport-blue to-sport-purple hover:from-sport-purple hover:to-sport-blue text-white font-medium py-2.5 mt-4" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Profile..." : "Create My Profile"}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default PlayerSignupForm;
