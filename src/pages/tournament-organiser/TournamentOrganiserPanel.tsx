
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/Header";
import CreateTournamentForm from "./components/CreateTournamentForm";
import TournamentRulesSection from "./components/TournamentRulesSection";
import FixtureManagementTool from "./components/FixtureManagementTool";
import UpdatesPanel from "./components/UpdatesPanel";
import PaymentGateway from "./components/PaymentGateway";
import TournamentsList from "./components/TournamentsList";
import { Card } from "@/components/ui/card";

const TournamentOrganiserPanel = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("tournaments");
  const [tournamentFormCompleted, setTournamentFormCompleted] = useState(false);
  const [rulesCompleted, setRulesCompleted] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'create') {
      setActiveTab('create');
    }
  }, [searchParams]);

  const handleFormCompletion = () => {
    setTournamentFormCompleted(true);
    setActiveTab('rules');
  };

  const handleRulesCompletion = () => {
    setRulesCompleted(true);
  };

  const resetCreationFlow = () => {
    setTournamentFormCompleted(false);
    setRulesCompleted(false);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-sport-purple">Tournament Organiser Panel</h1>
          <p className="text-gray-600 mb-6">Create and manage your sports tournaments</p>
          
          <Card className="p-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-6 mb-4">
                <TabsTrigger value="tournaments" onClick={resetCreationFlow}>My Tournaments</TabsTrigger>
                <TabsTrigger value="create">Create Tournament</TabsTrigger>
                <TabsTrigger 
                  value="rules" 
                  disabled={!tournamentFormCompleted}
                  className={!tournamentFormCompleted ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Rules
                </TabsTrigger>
                <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
              
              <div className="p-4">
                <TabsContent value="tournaments" className="mt-0">
                  <TournamentsList />
                </TabsContent>
                
                <TabsContent value="create" className="mt-0">
                  <CreateTournamentForm 
                    onFormComplete={handleFormCompletion}
                    showSubmitButton={false}
                  />
                </TabsContent>
                
                <TabsContent value="rules" className="mt-0">
                  <TournamentRulesSection 
                    onRulesComplete={handleRulesCompletion}
                    showFinalSubmit={tournamentFormCompleted && rulesCompleted}
                  />
                </TabsContent>
                
                <TabsContent value="fixtures" className="mt-0">
                  <FixtureManagementTool />
                </TabsContent>
                
                <TabsContent value="updates" className="mt-0">
                  <UpdatesPanel />
                </TabsContent>
                
                <TabsContent value="payments" className="mt-0">
                  <PaymentGateway />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TournamentOrganiserPanel;
