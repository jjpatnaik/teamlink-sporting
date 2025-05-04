
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
import { AlertCircle, CheckCircle2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
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
        return;
      }

      toast({
        title: "Login successful",
        description: "You are now logged in to your account",
      });
      
      navigate("/players");
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

  const handleResetPassword = async (values: ResetPasswordValues) => {
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link",
      });
      
      setResetSuccess(true);
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: "An unexpected error occurred",
      });
    } finally {
      setResetLoading(false);
    }
  };

  // For development purposes only - direct password reset
  const handleDevPasswordReset = async () => {
    try {
      // This is a special case for the test account
      if (form.getValues().email === "jjpatnaik.12@gmail.com") {
        // Use the admin API to update password
        // Note: This should NOT be used in production
        const { error } = await supabase.auth.admin.updateUserById(
          "187527ca-dd65-4716-a70f-4e03cff5db34", // ID for jjpatnaik.12@gmail.com
          { password: "Abcde@12345" }
        );
        
        if (error) {
          console.error("Dev password reset error:", error);
          toast({
            variant: "destructive",
            title: "Password reset failed",
            description: "Could not reset password for test account",
          });
          return;
        }
        
        toast({
          title: "Test account password reset",
          description: "The test account password has been reset to 'Abcde@12345'",
        });
        
        // Auto-fill the form for convenience
        form.setValue("email", "jjpatnaik.12@gmail.com");
        form.setValue("password", "Abcde@12345");
      } else {
        toast({
          variant: "destructive",
          title: "Test account reset only",
          description: "This button only resets the test account (jjpatnaik.12@gmail.com)",
        });
      }
    } catch (error) {
      console.error("Dev password reset error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          {!showResetForm ? (
            <>
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
                <button
                  className="text-sm text-sport-purple hover:underline font-medium mt-2"
                  onClick={() => setShowResetForm(true)}
                >
                  Forgot password?
                </button>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <p className="text-xs text-gray-500 mb-2">Developer options</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={handleDevPasswordReset}
                  >
                    Reset test account
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Email: jjpatnaik.12@gmail.com<br />
                    Password: Abcde@12345
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {resetSuccess ? (
                <div className="text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h1 className="text-2xl font-bold mb-2">Reset Email Sent</h1>
                  <p className="text-gray-600 mb-6">
                    We've sent password reset instructions to your email address.
                    Please check your inbox and follow the instructions.
                  </p>
                  <Button 
                    onClick={() => {
                      setShowResetForm(false);
                      setResetSuccess(false);
                      resetForm.reset();
                    }} 
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-2 text-center">Reset Password</h1>
                  <p className="text-gray-600 mb-6 text-center">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      You will receive an email with a link to reset your password. 
                      The link will be valid for 24 hours.
                    </p>
                  </div>
                  
                  <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                      <FormField
                        control={resetForm.control}
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
                      
                      <div className="flex gap-2 flex-col">
                        <Button type="submit" className="w-full" disabled={resetLoading}>
                          {resetLoading ? "Sending..." : "Reset Password"}
                        </Button>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => setShowResetForm(false)}
                          disabled={resetLoading}
                        >
                          Back to Login
                        </Button>
                      </div>
                    </form>
                  </Form>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
