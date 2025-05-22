
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/Header";
import CreateTournamentForm from "./components/CreateTournamentForm";
import TournamentRulesSection from "./components/TournamentRulesSection";
import FixtureManagementTool from "./components/FixtureManagementTool";
import UpdatesPanel from "./components/UpdatesPanel";
import PaymentGateway from "./components/PaymentGateway";
import { Card } from "@/components/ui/card";

const TournamentOrganiserPanel = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-sport-purple">Tournament Organiser Panel</h1>
          <p className="text-gray-600 mb-6">Create and manage your sports tournaments</p>
          
          <Card className="p-1">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="create">Create Tournament</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
              
              <div className="p-4">
                <TabsContent value="create" className="mt-0">
                  <CreateTournamentForm />
                </TabsContent>
                
                <TabsContent value="rules" className="mt-0">
                  <TournamentRulesSection />
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
