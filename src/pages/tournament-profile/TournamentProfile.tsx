
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { useTournamentData } from './hooks/useTournamentData';
import TournamentHeader from './components/TournamentHeader';
import TournamentDetails from './components/TournamentDetails';
import TournamentTeamsSection from './components/TournamentTeamsSection';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TournamentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { tournament, teams, fetchData } = useTournamentData(id);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOrganizer, setIsOrganizer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch current user and tournament data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || null;
        setCurrentUserId(userId);
        
        if (userId && tournament?.organizer_id) {
          setIsOrganizer(userId === tournament.organizer_id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error getting current user:", error);
        setLoading(false);
      }
    };

    fetchData().then(() => {
      fetchCurrentUser();
    }).catch(error => {
      toast.error("Failed to load tournament data");
      console.error("Error loading tournament:", error);
      setLoading(false);
    });
  }, [id, tournament?.organizer_id, fetchData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-10 w-1/2 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-12 bg-gray-50 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">Tournament Not Found</h2>
          <p className="text-gray-600">The tournament you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TournamentHeader 
        tournament={tournament} 
        teamsCount={teams.length}
      />
      
      <TournamentDetails 
        tournament={tournament} 
        teams={teams}
        isOrganizer={isOrganizer}
        currentUserId={currentUserId}
      />
      
      <TournamentTeamsSection 
        teams={teams} 
        isOrganizer={isOrganizer}
        isTournamentFull={teams.length >= tournament.teams_allowed}
      />
    </div>
  );
};

export default TournamentProfile;
