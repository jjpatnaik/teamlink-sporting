
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const userTypes = [
  { value: "player", label: "Player" },
  { value: "team", label: "Club/Team (Coming Soon)", disabled: true },
  { value: "organizer", label: "Tournament Organiser (Coming Soon)", disabled: true },
  { value: "sponsor", label: "Sponsor (Coming Soon)", disabled: true },
];

const sports = [
  "Basketball",
  "Cricket",
  "Soccer",
  "Tennis",
  "Badminton",
  "Volleyball",
  "Hockey",
  "Rugby"
];

const sportPositions: Record<string, string[]> = {
  "Basketball": ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  "Cricket": ["Batsman", "Bowler", "All-rounder", "Wicketkeeper"],
  "Soccer": ["Forward", "Midfielder", "Defender", "Goalkeeper"],
  "Tennis": ["Singles", "Doubles"],
  "Badminton": ["Singles", "Doubles"],
  "Volleyball": ["Setter", "Outside Hitter", "Middle Blocker", "Libero"],
  "Hockey": ["Forward", "Defender", "Goaltender"],
  "Rugby": ["Prop", "Hooker", "Lock", "Flanker", "Number 8", "Scrum-half", "Fly-half", "Center", "Wing", "Full-back"]
};

const clubs = [
  "Chicago Breeze", 
  "Michigan Wolverines",
  "LA Lakers",
  "Boston Celtics",
  "Mumbai Indians",
  "Royal Challengers",
  "Manchester United",
  "Barcelona FC"
];

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  sport: z.string().min(1, "Please select a sport"),
  position: z.string().min(1, "Please select a position"),
  clubs: z.string().optional(),
  achievements: z.string().optional(),
  profilePicture: z.instanceof(FileList).optional(),
  facebookId: z.string().optional(),
  whatsappId: z.string().optional(),
  instagramId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SignupPage = () => {
  const [userType, setUserType] = useState<string>("player");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
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
    try {
      setIsLoading(true);
      
      // 1. Create the user account with email and password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (authError) {
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("User registration failed");
      }
      
      // 2. Create the player profile with the remaining data
      const { error: profileError } = await supabase
        .from('player_details')
        .insert({
          id: authData.user.id,
          full_name: data.fullName,
          sport: data.sport,
          position: data.position,
          clubs: data.clubs || null,
          achievements: data.achievements || null,
          facebook_id: data.facebookId || null,
          whatsapp_id: data.whatsappId || null,
          instagram_id: data.instagramId || null,
        });
      
      if (profileError) {
        throw profileError;
      }
      
      toast.success("Signup successful! Check your email to verify your account.");
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10 max-w-3xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join the Sportshive community today</p>
          </div>

          {/* User Type Selection */}
          <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <div>
              <label htmlFor="userType" className="block text-sm font-medium mb-2">
                I want to sign up as:
              </label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map((type) => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      disabled={type.disabled}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {userType === "player" && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                  {/* Profile Picture */}
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Upload Profile Picture</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            {...fieldProps}
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
            )}

            {userType !== "player" && (
              <div className="py-8 text-center">
                <p className="text-lg text-gray-600">
                  {userType === "team" ? "Club/Team" : 
                   userType === "organizer" ? "Tournament Organiser" : "Sponsor"} registration is coming soon!
                </p>
                <p className="mt-2 text-gray-500">
                  We're currently working on making this available. Please check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
