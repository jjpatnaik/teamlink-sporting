
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from "@/pages/Index";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import HowItWorksPage from "@/pages/HowItWorksPage";
import CreateProfilePage from "@/pages/createprofile";
import PlayerProfile from "@/pages/PlayerProfile";
import TeamProfile from "@/pages/TeamProfile";
import TournamentProfile from "@/pages/TournamentProfile";
import SponsorProfile from "@/pages/SponsorProfile";
import ConnectionsPage from "@/pages/ConnectionsPage";
import SearchPage from "@/pages/SearchPage";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import TournamentOrganiserPanel from "./pages/tournament-organiser/TournamentOrganiserPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/createprofile" element={<CreateProfilePage />} />
        <Route path="/profile" element={<PlayerProfile />} />
        <Route path="/player/:id" element={<PlayerProfile />} />
        <Route path="/players/:id" element={<PlayerProfile />} />
        <Route path="/players" element={<SearchPage />} />
        <Route path="/profile/:id" element={<PlayerProfile />} />
        <Route path="/team/:id" element={<TeamProfile />} />
        <Route path="/tournament/:tournamentId" element={<TournamentProfile />} />
        <Route path="/sponsor/:id" element={<SponsorProfile />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/organiser/tournament" element={<TournamentOrganiserPanel />} />
        <Route path="/organiser/tournament/:tournamentId" element={<TournamentOrganiserPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
