import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
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
import { UserCircle, Image as ImageIcon, Trophy, Medal, Plus } from "lucide-react";
import { sports, sportPositions, clubs } from "../signup/constants";
import { handleSignup } from "../signup/utils";
import CareerHistoryEntry from "@/components/player/CareerHistoryEntry";
import * as z from "zod";

interface PlayerSignupFormProps {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const careerEntrySchema = z.object({
  club: z.string().min(1, "Club name is required"),
  position: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
});

const playerFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  sport: z.string().min(1, "Please select a sport"),
  position: z.string().optional(),
  careerHistory: z.array(careerEntrySchema).optional().default([]),
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
  const [careerEntries, setCareerEntries] = useState([
    { club: "", position: "", startDate: "", endDate: "Present" }
  ]);
  const navigate = useNavigate();
  
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      fullName: "",
      sport: "",
      position: "",
      careerHistory: [{ club: "", position: "", startDate: "", endDate: "Present" }],
      achievements: "",
      facebookId: "",
      whatsappId: "",
      instagramId: "",
    },
  });

  const onSubmit = async (data: PlayerFormValues) => {
    setIsLoading(true);
    
    data.careerHistory = careerEntries;
    
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

  const handleCareerEntryChange = (index: number, field: string, value: string) => {
    const updatedEntries = [...careerEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setCareerEntries(updatedEntries);
  };

  const addCareerEntry = () => {
    setCareerEntries([
      ...careerEntries,
      { club: "", position: "", startDate: "", endDate: "Present" }
    ]);
  };

  const removeCareerEntry = (index: number) => {
    if (careerEntries.length > 1) {
      const updatedEntries = careerEntries.filter((_, i) => i !== index);
      setCareerEntries(updatedEntries);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="overflow-hidden bg-white border-none shadow-md">
          <FormField
            control={form.control}
            name="backgroundPicture"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem className="space-y-0 relative">
                <Badge 
                  variant="outline" 
                  className="absolute top-4 right-4 z-10 bg-sport-purple/10 text-sport-purple"
                >
                  Player Profile
                </Badge>
                
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
                        form.setValue("position", "");
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

            <Separator className="my-6 bg-sport-light-purple/30" />

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-sport-dark-gray flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-sport-purple" />
                Career Information
              </h3>
              
              <div className="space-y-4 mb-4">
                {careerEntries.map((entry, index) => (
                  <CareerHistoryEntry
                    key={index}
                    index={index}
                    entry={entry}
                    onChange={handleCareerEntryChange}
                    onRemove={removeCareerEntry}
                    isLast={index === careerEntries.length - 1}
                  />
                ))}
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCareerEntry}
                className="mb-6 border-sport-light-purple/50 text-sport-purple hover:bg-sport-light-purple/10"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Career Entry
              </Button>

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

            <Separator className="my-6 bg-sport-light-purple/30" />

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-sport-dark-gray flex items-center">
                <Medal className="w-5 h-5 mr-2 text-sport-purple" />
                Social Media & Contact
              </h3>
              
              <div className="grid gap-5 md:grid-cols-3">
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
