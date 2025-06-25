
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamsHeader from '@/components/teams/TeamsHeader';
import TeamsList from '@/components/teams/TeamsList';
import CreateTeamModal from '@/components/team/CreateTeamModal';
import { useTeams } from '@/hooks/useTeams';

const TeamsManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { teams, loading, error, refetch } = useTeams();

  const handleTeamCreated = () => {
    setShowCreateModal(false);
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <TeamsHeader onCreateTeam={() => setShowCreateModal(true)} />
        <TeamsList teams={teams} loading={loading} error={error} />
      </main>

      <Footer />

      <CreateTeamModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTeamCreated={handleTeamCreated}
      />
    </div>
  );
};

export default TeamsManagement;
