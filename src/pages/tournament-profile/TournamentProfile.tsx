
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTournamentData } from './hooks/useTournamentData';
import TournamentHeader from './components/TournamentHeader';
import TournamentDetails from './components/TournamentDetails';
import TournamentTeamsSection from './components/TournamentTeamsSection';
import FixtureBot from './components/FixtureBot';

const TournamentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { tournament, teams, fetchData, addTeam } = useTournamentData(id);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData?.session?.user?.id;
        setCurrentUserId(currentUserId || null);
        
        if (!id) {
          toast.error("No tournament ID provided");
          return;
        }

        await fetchData();
        
        // Check if current user is the organizer
        if (currentUserId && tournament?.organizer_id === currentUserId) {
          setIsOrganizer(true);
        }
      } catch (error: any) {
        console.error("Error fetching tournament data:", error.message);
        toast.error("Failed to load tournament details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id && id !== ":id") {
      checkAuth();
    } else {
      console.error("Invalid tournament ID:", id);
      toast.error("Invalid tournament ID");
      setLoading(false);
    }
  }, [id, navigate, fetchData, tournament?.organizer_id]);
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
            <p className="text-sport-gray">Loading tournament details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!tournament) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Tournament not found</h2>
            <p className="mt-2 text-gray-600">The tournament you're looking for doesn't exist or has been removed.</p>
            <button 
              className="mt-4 bg-sport-purple hover:bg-sport-purple/90 text-white px-4 py-2 rounded"
              onClick={() => navigate('/search?type=Tournament')}
            >
              Browse Tournaments
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <TournamentHeader tournament={tournament} />
          
          <div className="p-6">
            <TournamentDetails 
              tournament={tournament} 
              teams={teams} 
              isOrganizer={isOrganizer} 
              currentUserId={currentUserId}
            />
            
            <TournamentTeamsSection
              tournament={tournament}
              teams={teams}
              isOrganizer={isOrganizer}
              addTeam={addTeam}
            />
            
            {/* Replace FixtureGenerator with FixtureBot */}
            <FixtureBot 
              tournament={tournament}
              teams={teams}
              isOrganizer={isOrganizer}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default TournamentProfile;
