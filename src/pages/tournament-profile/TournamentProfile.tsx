
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TournamentHeader from './components/TournamentHeader';
import TournamentDetails from './components/TournamentDetails';
import TournamentTeamsSection from './components/TournamentTeamsSection';
import { useTournamentData } from './hooks/useTournamentData';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const TournamentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tournament, teams, loading, fetchData } = useTournamentData(id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData().catch((err) => {
        setError("Failed to load tournament data. Please try again later.");
        console.error("Tournament load error:", err);
      });
    } else {
      setError("No tournament ID provided.");
    }
  }, [id, fetchData]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 pb-12">
        {loading ? (
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-32 w-full mb-6 rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : tournament ? (
          <>
            <TournamentHeader tournament={tournament} />
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8">
                <TournamentDetails tournament={tournament} />
              </div>
              <div className="md:col-span-4">
                <TournamentTeamsSection 
                  teams={teams} 
                  tournamentId={tournament.id} 
                  teamsAllowed={tournament.teams_allowed} 
                />
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Not Found</AlertTitle>
              <AlertDescription>Tournament not found or has been removed.</AlertDescription>
            </Alert>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TournamentProfile;
