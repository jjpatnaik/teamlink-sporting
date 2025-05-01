
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sports, tournamentFormats } from "@/pages/signup/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  description: z.string().optional(),
  sport: z.string().min(1, "Please select a sport"),
  teamsAllowed: z.coerce
    .number()
    .min(2, "At least 2 teams are required")
    .max(64, "Maximum 64 teams allowed"),
  format: z.string().min(1, "Please select a tournament format"),
  rules: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTournamentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userTournaments, setUserTournaments] = useState<any[]>([]);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      sport: "",
      teamsAllowed: 8,
      format: "",
      rules: "",
      location: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        toast.error("You must be logged in to create a tournament");
        navigate("/signup");
        return;
      }
      
      // Load user's tournaments
      loadUserTournaments(data.session.user.id);
    };
    
    checkAuth();
  }, [navigate]);

  const loadUserTournaments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("organizer_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setUserTournaments(data || []);
    } catch (error: any) {
      console.error("Error loading tournaments:", error.message);
      toast.error("Failed to load your tournaments");
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in to create a tournament");
        navigate("/signup");
        return;
      }

      const userId = sessionData.session.user.id;
      
      // Insert tournament data
      const { data, error } = await supabase.from("tournaments").insert({
        organizer_id: userId,
        name: values.name,
        description: values.description,
        sport: values.sport,
        teams_allowed: values.teamsAllowed,
        format: values.format,
        rules: values.rules,
        location: values.location,
        start_date: values.startDate || null,
        end_date: values.endDate || null,
      }).select();

      if (error) {
        throw error;
      }

      toast.success("Tournament created successfully!");
      
      // Reload user tournaments
      loadUserTournaments(userId);
      
      // Reset the form
      form.reset();
      
      // Navigate to tournament page
      if (data && data[0]) {
        navigate(`/tournaments/${data[0].id}`);
      }
    } catch (error: any) {
      console.error("Error creating tournament:", error.message);
      toast.error("Failed to create tournament: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToTournament = (tournamentId: string) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Create New Tournament</h1>
            <p className="text-sport-gray">
              Fill out the details below to organize your sports tournament
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tournament Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tournament name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sport*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sport" />
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
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter tournament description"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="teamsAllowed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Teams*</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={2} 
                            max={64} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tournament Format*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tournamentFormats.map((format) => (
                              <SelectItem key={format.value} value={format.value}>
                                {format.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Tournament location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rules and Regulations</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tournament rules and regulations"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-sport-purple hover:bg-sport-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Tournament..." : "Create Tournament"}
                </Button>
              </form>
            </Form>
          </div>

          {userTournaments.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Your Tournaments</h2>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Sport</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Format</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Teams</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Created</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userTournaments.map((tournament) => (
                        <tr 
                          key={tournament.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigateToTournament(tournament.id)}
                        >
                          <td className="px-4 py-4 text-sm text-gray-900">{tournament.name}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{tournament.sport}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {tournament.format === 'knockout' ? 'Knockout' : 'Round Robin'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{tournament.teams_allowed}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {new Date(tournament.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-sport-purple hover:text-sport-purple/80"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToTournament(tournament.id);
                              }}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTournamentPage;
