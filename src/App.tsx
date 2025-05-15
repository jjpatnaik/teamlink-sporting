
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HowItWorksPage from "./pages/HowItWorksPage";
import PlayerProfile from "./pages/PlayerProfile";
import TeamProfile from "./pages/TeamProfile";
import TournamentProfile from "./pages/tournament-profile";
import SponsorProfile from "./pages/SponsorProfile";
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import CreateProfilePage from "./pages/createprofile";
import CreateTournamentPage from "./pages/create-tournament";
import SearchPage from "./pages/SearchPage";
import ConnectionsPage from "./pages/ConnectionsPage";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 30000, // 30 seconds
        refetchOnWindowFocus: false, // Disable auto refetch on window focus for debugging
      },
    },
  });
  
  const [session, setSession] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  useEffect(() => {
    console.log("App initialization started");
    
    // First set up auth state listener to catch any changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state change:", event);
      setSession(newSession);
      
      if (newSession?.user) {
        try {
          const { data: profileData } = await supabase
            .from('player_details')
            .select('id')
            .eq('id', newSession.user.id)
            .maybeSingle();
            
          setHasProfile(!!profileData);
          console.log("Profile check after auth change:", !!profileData);
        } catch (error) {
          console.error("Error checking profile after auth change:", error);
          setHasProfile(null);
        }
      } else {
        setHasProfile(null);
      }
    });
    
    // Then check if user is logged in
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        }
        
        console.log("Initial session check:", data?.session ? "Active session" : "No session");
        setSession(data.session);
        
        // If user is logged in, check if they have a profile
        if (data.session?.user) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('player_details')
              .select('id')
              .eq('id', data.session.user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error("Error checking user profile:", profileError);
            }
              
            setHasProfile(!!profileData);
            console.log("Initial profile check:", !!profileData);
          } catch (profileCheckError) {
            console.error("Exception checking profile:", profileCheckError);
            setHasProfile(null);
          }
        } else {
          setHasProfile(null);
        }
        
      } catch (e) {
        console.error("Exception during session check:", e);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg">Initializing application...</div>
        </div>
      </div>
    );
  }

  // Once auth is initialized, render the app
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/players" element={<PlayerProfile />} />
            <Route path="/players/:id" element={<PlayerProfile />} />
            <Route path="/teams" element={<TeamProfile />} />
            <Route path="/teams/:id" element={<TeamProfile />} />
            <Route path="/tournaments" element={<SearchPage />} /> 
            <Route path="/tournaments/:id" element={<TournamentProfile />} />
            <Route path="/sponsors" element={<SponsorProfile />} />
            <Route path="/sponsors/:id" element={<SponsorProfile />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/createprofile" element={<CreateProfilePage />} />
            <Route path="/create-tournament" element={<CreateTournamentPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
