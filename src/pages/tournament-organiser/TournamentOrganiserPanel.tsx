
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Tournament Organizer
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  {isManagingTournament 
                    ? "Manage your tournament settings, teams, and fixtures" 
                    : "Create and manage your tournaments"
                  }
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">TO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 rounded-xl border shadow-sm">
            <Tabs defaultValue={isManagingTournament ? "fixtures" : "tournaments"} className="w-full">
              <div className="border-b bg-muted/30 rounded-t-xl">
                <TabsList className={`inline-flex h-14 items-center justify-start rounded-none bg-transparent p-1 w-full ${
                  isManagingTournament ? 'grid-cols-6' : 'grid-cols-2'
                }`}>
                  <TabsTrigger 
                    value="tournaments" 
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-6 py-3 font-medium transition-all"
                  >
                    My Tournaments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="create"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-6 py-3 font-medium transition-all"
                  >
                    Create Tournament
                  </TabsTrigger>
                  {isManagingTournament && (
                    <>
                      <TabsTrigger 
                        value="fixtures"
                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-6 py-3 font-medium transition-all"
                      >
                        Teams & Fixtures
                      </TabsTrigger>
                      <TabsTrigger 
                        value="rules"
                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-6 py-3 font-medium transition-all"
                      >
                        Rules
                      </TabsTrigger>
                      <TabsTrigger 
                        value="payment"
                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-6 py-3 font-medium transition-all"
                      >
                        Payment
                      </TabsTrigger>
                      <TabsTrigger 
                        value="updates"
                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-6 py-3 font-medium transition-all"
                      >
                        Updates
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>
              </div>
              
              <div className="p-6">
                <TabsContent value="tournaments" className="mt-0">
                  <TournamentsList />
                </TabsContent>
                
                <TabsContent value="create" className="mt-0">
                  <CreateTournamentForm />
                </TabsContent>
                
                {isManagingTournament && (
                  <>
                    <TabsContent value="fixtures" className="mt-0">
                      <div className="space-y-8">
                        <TeamApprovalPanel />
                        <FixtureManagementTool />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="rules" className="mt-0">
                      <TournamentRulesPanel />
                    </TabsContent>
                    
                    <TabsContent value="payment" className="mt-0">
                      <PaymentPanel />
                    </TabsContent>
                    
                    <TabsContent value="updates" className="mt-0">
                      <UpdatesPanel />
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentOrganiserPanel;
