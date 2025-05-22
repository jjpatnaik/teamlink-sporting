
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  isOrganiser: z.boolean().default(false),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      isOrganiser: false,
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
        setIsLoading(false);
        return;
      }

      // Check if user is an organiser
      if (values.isOrganiser) {
        // First check if user is in the organisers table
        const { data: organiserData, error: organiserError } = await supabase
          .from('organisers')
          .select('*')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .limit(1);

        // If not in organisers table, check if they've created tournaments
        // This is for backward compatibility with existing tournament creators
        if (!organiserData || organiserData.length === 0) {
          const { data: tournamentData, error: tournamentError } = await supabase
            .from('tournaments')
            .select('*')
            .eq('organizer_id', (await supabase.auth.getUser()).data.user?.id)
            .limit(1);

          if (tournamentError || !tournamentData || tournamentData.length === 0) {
            // User is not an organiser
            toast({
              variant: "destructive",
              title: "Access denied",
              description: "You don't have tournament organiser privileges.",
            });
            
            // Sign out the user
            await supabase.auth.signOut();
            setIsLoading(false);
            return;
          } else {
            // User has created tournaments but isn't in organisers table - add them
            const { error: insertError } = await supabase
              .from('organisers')
              .insert({
                user_id: (await supabase.auth.getUser()).data.user?.id,
                email: (await supabase.auth.getUser()).data.user?.email
              });
              
            if (insertError) {
              console.error("Error adding user to organisers table:", insertError);
            }
          }
        }

        toast({
          title: "Login successful",
          description: "Welcome to the Tournament Organiser Panel",
        });
        
        navigate("/organiser/tournament");
      } else {
        toast({
          title: "Login successful",
          description: "You are now logged in to your account",
        });
        
        navigate("/players");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isOrganiser"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Login as Tournament Organiser
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-sport-purple hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
