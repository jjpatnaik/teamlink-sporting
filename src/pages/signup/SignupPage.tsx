
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import PlayerSignupForm from "./PlayerSignupForm";
import { userTypes } from "./constants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OrganizerSignupForm from "./OrganizerSignupForm";

const SignupPage = () => {
  const [userType, setUserType] = useState<string>("player");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  
  // Check if user is already authenticated and handle auth state changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking existing auth session...");
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("User already authenticated, redirecting to profile creation");
          toast.info("You're already signed up! Let's complete your profile.");
          navigate("/createprofile");
          return;
        }
        
        console.log("No existing session found");
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener for new signups
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in successfully, redirecting to profile creation");
        toast.success("Account created successfully! Now let's set up your profile.");
        navigate("/createprofile");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-10 max-w-md">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10 max-w-md">
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
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {userType === "player" ? (
              <PlayerSignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
            ) : userType === "organizer" ? (
              <OrganizerSignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
            ) : (
              <div className="py-8 text-center">
                <p className="text-lg text-gray-600">
                  {userType === "team" ? "Club/Team" : "Sponsor"} registration is coming soon!
                </p>
                <p className="mt-2 text-gray-500">
                  We're currently working on making this available. Please check back later.
                </p>
              </div>
            )}
          </div>

          {/* Help section */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <h3 className="font-medium text-blue-900 mb-2">Need help?</h3>
            <p className="text-blue-800 text-sm">
              If you already have an account, please <a href="/auth" className="underline font-medium">sign in here</a> instead.
            </p>
            <p className="text-blue-800 text-sm mt-1">
              Having trouble? Make sure your email is valid and your password meets the requirements shown above.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
