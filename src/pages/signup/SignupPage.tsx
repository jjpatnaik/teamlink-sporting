
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

const SignupPage = () => {
  const [userType, setUserType] = useState<string>("player");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        toast.info("You're already signed up! Let's complete your profile.");
        navigate("/createprofile");
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success("Successfully signed up! Now let's create your profile.");
        navigate("/createprofile");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
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

            {userType === "player" ? (
              <PlayerSignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
            ) : (
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
