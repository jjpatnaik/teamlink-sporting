
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTournamentFetch } from './hooks/useTournamentData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TournamentHeader from './components/TournamentHeader';
import TournamentDetails from './components/TournamentDetails';
import TournamentTeamsSection from './components/TournamentTeamsSection';

const TournamentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tournament, loading, error } = useTournamentFetch(id);

  useEffect(() => {
    console.log("TournamentProfile component - Tournament data:", {
      id: id,
      loading: loading,
      hasData: !!tournament,
      error: error
    });
  }, [id, tournament, loading, error]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {loading ? (
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="animate-spin h-12 w-12 border-t-4 border-sport-purple mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tournament information...</p>
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-red-600 mb-2">Connection Error</h2>
              <p className="text-red-600 mb-4">{typeof error === 'string' ? error : 'Failed to load tournament details'}</p>
              <p className="text-gray-600">Please check your internet connection and try again later.</p>
            </div>
          </div>
        ) : tournament ? (
          <>
            <TournamentHeader tournament={tournament} />
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TournamentDetails tournament={tournament} />
              </div>
              <div className="lg:col-span-1">
                <TournamentTeamsSection tournamentId={tournament.id} teamsAllowed={tournament.teams_allowed} />
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-xl font-bold mb-2">Tournament Not Found</h2>
            <p className="text-gray-600">The tournament you're looking for doesn't exist or has been removed.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TournamentProfile;
