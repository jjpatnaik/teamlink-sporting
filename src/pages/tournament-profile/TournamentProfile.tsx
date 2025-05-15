
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTournamentData } from './hooks/useTournamentData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TournamentHeader from './components/TournamentHeader';
import TournamentDetails from './components/TournamentDetails';
import TournamentTeamsSection from './components/TournamentTeamsSection';
import { supabase } from '@/integrations/supabase/client';

const TournamentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tournament, teams, loading, fetchData } = useTournamentData(id);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch tournament data when component mounts
    fetchData();
    
    // Check if current user is the organizer of the tournament
    const checkIfOrganizer = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      
      if (user && tournament?.organizer_id === user.id) {
        setIsOrganizer(true);
      } else {
        setIsOrganizer(false);
      }
    };
    
    if (tournament) {
      checkIfOrganizer();
    }
  }, [id, tournament, fetchData]);

  useEffect(() => {
    console.log("TournamentProfile component - Tournament data:", {
      id: id,
      loading: loading,
      hasData: !!tournament,
      teamsCount: teams?.length || 0
    });
  }, [id, tournament, teams, loading]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {loading ? (
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="animate-spin h-12 w-12 border-t-4 border-sport-purple mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tournament information...</p>
          </div>
        ) : !tournament ? (
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-xl font-bold mb-2">Tournament Not Found</h2>
            <p className="text-gray-600">The tournament you're looking for doesn't exist or has been removed.</p>
          </div>
        ) : (
          <>
            <TournamentHeader tournament={tournament} />
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TournamentDetails 
                  tournament={tournament} 
                  teams={teams}
                  isOrganizer={isOrganizer}
                  currentUserId={currentUserId}
                />
              </div>
              <div className="lg:col-span-1">
                <TournamentTeamsSection 
                  tournament={tournament}
                  teams={teams} 
                />
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TournamentProfile;
