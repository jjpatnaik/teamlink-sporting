
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import ImprovedOnboarding from "@/components/onboarding/ImprovedOnboarding";
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
import TeamsPage from "@/pages/TeamsPage";
import TournamentOrganiserPanel from "./pages/tournament-organiser/TournamentOrganiserPanel";
import TournamentsPage from "@/pages/TournamentsPage";
import MyTournamentsPage from "@/pages/MyTournamentsPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          
          {/* Routes with main layout */}
          <Route path="/" element={
            <AppLayout>
              <Index />
            </AppLayout>
          } />
          
          {/* Onboarding flow */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <ImprovedOnboarding />
              </ProtectedRoute>
            } 
          />
          
          {/* Profile setup - authenticated but doesn't require complete profile */}
          <Route 
            path="/createprofile" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfileSetupPage />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Profile editing - authenticated and requires profile */}
          <Route 
            path="/edit-profile" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EditProfilePage />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Public profile pages */}
          <Route path="/player/:id" element={
            <AppLayout>
              <PlayerProfile />
            </AppLayout>
          } />
          <Route path="/players/:id" element={
            <AppLayout>
              <PlayerProfile />
            </AppLayout>
          } />
          <Route path="/team/:teamId" element={
            <AppLayout>
              <TeamProfile />
            </AppLayout>
          } />
          <Route path="/tournament/:tournamentId" element={
            <AppLayout>
              <TournamentProfile />
            </AppLayout>
          } />
          <Route path="/sponsor/:id" element={
            <AppLayout>
              <SponsorProfile />
            </AppLayout>
          } />
          
          {/* General authenticated pages */}
          <Route path="/search" element={
            <AppLayout>
              <SearchPage />
            </AppLayout>
          } />
          <Route path="/players" element={
            <AppLayout>
              <SearchPage />
            </AppLayout>
          } />
          <Route path="/tournaments" element={
            <AppLayout>
              <TournamentsPage />
            </AppLayout>
          } />
          <Route path="/my-tournaments" element={
            <ProtectedRoute>
              <AppLayout>
                <MyTournamentsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/connections" element={
            <AppLayout>
              <ConnectionsPage />
            </AppLayout>
          } />
          
          {/* Team management - accessible to all authenticated users */}
          <Route 
            path="/teams" 
            element={
              <AppLayout>
                <TeamsPage />
              </AppLayout>
            } 
          />
          
          <Route 
            path="/organiser/tournament" 
            element={
              <ProtectedRoute requiredRole="organiser">
                <AppLayout>
                  <TournamentOrganiserPanel />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/organiser/tournament/:tournamentId" 
            element={
              <ProtectedRoute requiredRole="organiser">
                <AppLayout>
                  <TournamentOrganiserPanel />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/profile" element={
            <AppLayout>
              <PlayerProfile />
            </AppLayout>
          } />
          <Route path="/profile/:id" element={
            <AppLayout>
              <PlayerProfile />
            </AppLayout>
          } />
          
          <Route path="*" element={
            <AppLayout>
              <NotFound />
            </AppLayout>
          } />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
