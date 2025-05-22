
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Rocket } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const FixtureManagementTool = () => {
  const handleManualFixtures = () => {
    // In a real app, this would navigate to the fixture builder page
    toast({
      title: "Manual Fixture Builder",
      description: "This would navigate to the manual fixture builder page",
    });
  };

  const handleAIFixtures = () => {
    // In a real app, this would open a modal with AI fixture generation options
    toast({
      title: "AI Fixture Generator",
      description: "This would open the AI fixture generator modal",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Fixture Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowRight className="mr-2 h-5 w-5 text-sport-purple" />
              Manual Fixture Builder
            </CardTitle>
            <CardDescription>
              Create your tournament fixtures manually with full control over matchups and schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Perfect for custom tournament structures or when you want specific team matchups.
              You'll be able to set:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Team pairings</li>
              <li>Match dates and times</li>
              <li>Venue assignments</li>
              <li>Match officials</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={handleManualFixtures} className="w-full">
              Start Manual Builder
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Rocket className="mr-2 h-5 w-5 text-sport-blue" />
              AI-Powered Fixture Generator
            </CardTitle>
            <CardDescription>
              Let our AI create balanced fixtures automatically based on your tournament format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Our AI will analyze your tournament parameters and generate optimal fixtures that:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Balance competitive fairness</li>
              <li>Optimize for venue availability</li>
              <li>Minimize travel time between matches</li>
              <li>Create the most exciting matchups</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleAIFixtures} 
              variant="secondary"
              className="w-full bg-sport-blue text-white hover:bg-sport-bright-blue"
            >
              Generate With AI
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FixtureManagementTool;
