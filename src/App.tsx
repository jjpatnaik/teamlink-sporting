
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import AuthPage from "@/pages/auth/AuthPage";
import ProfileSetupPage from "@/pages/createprofile/ProfileSetupPage";
import EditProfilePage from "@/pages/EditProfilePage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import PlayerProfile from "@/pages/PlayerProfile";
import TeamProfile from "@/pages/TeamProfile";
import TournamentProfile from "@/pages/TournamentProfile";
import SponsorProfile from "@/pages/SponsorProfile";
import ConnectionsPage from "@/pages/ConnectionsPage";
import SearchPage from "@/pages/SearchPage";
import NotFound from "@/pages/NotFound";
import TeamsManagement from "@/pages/TeamsManagement";
import TournamentOrganiserPanel from "./pages/tournament-organiser/TournamentOrganiserPanel";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          
          {/* Profile setup - authenticated but doesn't require complete profile */}
          <Route 
            path="/createprofile" 
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Profile editing - authenticated and requires profile */}
          <Route 
            path="/edit-profile" 
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Public profile pages */}
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/players/:id" element={<PlayerProfile />} />
          <Route path="/team/:id" element={<TeamProfile />} />
          <Route path="/tournament/:tournamentId" element={<TournamentProfile />} />
          <Route path="/sponsor/:id" element={<SponsorProfile />} />
          
          {/* General authenticated pages */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/players" element={<SearchPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          
          {/* Role-based protected routes */}
          <Route 
            path="/teams" 
            element={
              <ProtectedRoute requiredRole="player">
                <TeamsManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/organiser/tournament" 
            element={
              <ProtectedRoute requiredRole="organiser">
                <TournamentOrganiserPanel />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/organiser/tournament/:tournamentId" 
            element={
              <ProtectedRoute requiredRole="organiser">
                <TournamentOrganiserPanel />
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/profile" element={<PlayerProfile />} />
          <Route path="/profile/:id" element={<PlayerProfile />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
