import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HowItWorksPage from "./pages/HowItWorksPage";
import PlayerProfile from "./pages/PlayerProfile";
import TeamProfile from "./pages/TeamProfile";
import TournamentProfile from "./pages/TournamentProfile";
import SponsorProfile from "./pages/SponsorProfile";
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import CreateProfilePage from "./pages/createprofile";
import CreateTournamentPage from "./pages/create-tournament";
import SearchPage from "./pages/SearchPage";
import ConnectionsPage from "./pages/ConnectionsPage";

const App = () => {
  const queryClient = new QueryClient();
  const [session, setSession] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // If user is logged in, check if they have a profile
      if (data.session?.user) {
        const { data: profileData, error } = await supabase
          .from('player_details')
          .select('id')
          .eq('id', data.session.user.id)
          .maybeSingle();
          
        setHasProfile(!!profileData);
      } else {
        setHasProfile(null);
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('player_details')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
          
        setHasProfile(!!profileData);
      } else {
        setHasProfile(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
