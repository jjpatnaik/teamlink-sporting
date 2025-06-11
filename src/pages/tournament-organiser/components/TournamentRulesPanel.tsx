
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useTournamentData } from "@/hooks/useTournamentData";
import { BookOpen, Save } from 'lucide-react';

const TournamentRulesPanel = () => {
  const { tournament, isOrganizer, loading } = useTournamentData();
  const [rules, setRules] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tournament?.rules) {
      setRules(tournament.rules);
    }
  }, [tournament]);

  const handleSaveRules = async () => {
    if (!tournament?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({ rules: rules.trim() })
        .eq('id', tournament.id);

      if (error) {
        console.error('Error saving rules:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save tournament rules"
        });
        return;
      }

      toast({
        title: "Rules Saved",
        description: "Tournament rules have been updated successfully"
      });
    } catch (error) {
      console.error('Error in handleSaveRules:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sport-purple"></div>
      </div>
    );
  }

  if (!isOrganizer) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Only the tournament organizer can manage rules.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Tournament Rules</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Tournament Rules & Regulations
          </CardTitle>
          <CardDescription>
            Define the rules and regulations for your tournament. These will be visible to all participants.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rules">Tournament Rules</Label>
            <Textarea
              id="rules"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Enter your tournament rules and regulations here..."
              className="min-h-[300px] mt-1"
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveRules}
              disabled={isSaving}
              className="bg-sport-purple hover:bg-sport-purple/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Rules'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {rules && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              This is how the rules will appear to participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">
                {rules}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TournamentRulesPanel;
