
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import TournamentsList from "./components/TournamentsList";
import CreateTournamentForm from "./components/CreateTournamentForm";
import FixtureManagementTool from "./components/FixtureManagementTool";
import TeamApprovalPanel from "./components/TeamApprovalPanel";
import UpdatesPanel from "./components/UpdatesPanel";
import TournamentRulesPanel from "./components/TournamentRulesPanel";
import PaymentPanel from "./components/PaymentPanel";
import { useParams } from "react-router-dom";

const TournamentOrganiserPanel = () => {
  const { tournamentId } = useParams();
  
  // If we have a tournamentId, we're in tournament management mode
  const isManagingTournament = !!tournamentId;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Tournament Organiser Panel</h1>
          
          <Tabs defaultValue={isManagingTournament ? "fixtures" : "tournaments"} className="w-full">
            <TabsList className={`grid w-full ${isManagingTournament ? 'grid-cols-6' : 'grid-cols-2'}`}>
              <TabsTrigger value="tournaments">My Tournaments</TabsTrigger>
              <TabsTrigger value="create">Create Tournament</TabsTrigger>
              {isManagingTournament && (
                <>
                  <TabsTrigger value="fixtures">Fixtures & Teams</TabsTrigger>
                  <TabsTrigger value="rules">Rules</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                </>
              )}
            </TabsList>
            
            <TabsContent value="tournaments" className="mt-6">
              <TournamentsList />
            </TabsContent>
            
            <TabsContent value="create" className="mt-6">
              <CreateTournamentForm />
            </TabsContent>
            
            {isManagingTournament && (
              <>
                <TabsContent value="fixtures" className="mt-6">
                  <div className="space-y-8">
                    <TeamApprovalPanel />
                    <FixtureManagementTool />
                  </div>
                </TabsContent>
                
                <TabsContent value="rules" className="mt-6">
                  <TournamentRulesPanel />
                </TabsContent>
                
                <TabsContent value="payment" className="mt-6">
                  <PaymentPanel />
                </TabsContent>
                
                <TabsContent value="updates" className="mt-6">
                  <UpdatesPanel />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default TournamentOrganiserPanel;
