
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HowItWorksPage from "./pages/HowItWorksPage";
import PlayerProfile from "./pages/PlayerProfile";
import TeamProfile from "./pages/TeamProfile";
import TournamentProfile from "./pages/TournamentProfile";
import SponsorProfile from "./pages/SponsorProfile";
import SignupPage from "./pages/auth/SignupPage";
import CreateProfilePage from "./pages/createprofile";

const App = () => {
  const queryClient = new QueryClient();

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
            <Route path="/teams" element={<TeamProfile />} />
            <Route path="/tournaments" element={<TournamentProfile />} />
            <Route path="/sponsors" element={<SponsorProfile />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/createprofile" element={<CreateProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
