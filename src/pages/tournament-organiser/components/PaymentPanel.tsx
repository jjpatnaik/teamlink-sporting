
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useTournamentData } from "@/hooks/useTournamentData";
import { DollarSign, CreditCard, Users, TrendingUp } from 'lucide-react';

const PaymentPanel = () => {
  const { tournament, teams, isOrganizer, loading } = useTournamentData();
  const [entryFee, setEntryFee] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (tournament?.entry_fee) {
      setEntryFee(Number(tournament.entry_fee));
    }
  }, [tournament]);

  const handleUpdateEntryFee = async () => {
    if (!tournament?.id) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({ entry_fee: entryFee })
        .eq('id', tournament.id);

      if (error) {
        console.error('Error updating entry fee:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update entry fee"
        });
        return;
      }

      toast({
        title: "Entry Fee Updated",
        description: `Entry fee has been set to $${entryFee}`
      });
    } catch (error) {
      console.error('Error in handleUpdateEntryFee:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setIsUpdating(false);
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
        <p className="text-gray-600">Only the tournament organizer can manage payments.</p>
      </div>
    );
  }

  const approvedTeams = teams.filter(team => team.approval_status === 'approved');
  const totalRevenue = approvedTeams.length * entryFee;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Payment Management</h2>
      
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-2xl font-bold">${entryFee}</p>
                <p className="text-xs text-muted-foreground">Entry Fee</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-2xl font-bold">{approvedTeams.length}</p>
                <p className="text-xs text-muted-foreground">Paying Teams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div className="ml-2">
                <p className="text-2xl font-bold">${totalRevenue}</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entry Fee Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Entry Fee Management
          </CardTitle>
          <CardDescription>
            Set and manage the entry fee for your tournament
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Label htmlFor="entryFee">Entry Fee ($)</Label>
              <Input
                id="entryFee"
                type="number"
                min="0"
                step="0.01"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <Button 
              onClick={handleUpdateEntryFee}
              disabled={isUpdating}
              className="bg-sport-purple hover:bg-sport-purple/90"
            >
              {isUpdating ? 'Updating...' : 'Update Fee'}
            </Button>
          </div>
          
          {entryFee === 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 text-sm">
                This tournament is currently free to enter. Teams will not be charged any registration fee.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Payment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Team Payment Status</CardTitle>
          <CardDescription>
            Overview of payment status for all approved teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedTeams.length > 0 ? (
            <div className="space-y-3">
              {approvedTeams.map((team) => (
                <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{team.team_name}</h4>
                    <p className="text-sm text-gray-600">{team.contact_email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">${entryFee}</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Payment Integration Coming Soon
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No approved teams yet. Teams need to be approved before payment collection.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Integration Notice */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start">
            <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Payment Integration</h3>
              <p className="text-sm text-blue-700">
                Full payment processing with Stripe integration is coming soon. For now, you can set entry fees and coordinate payments manually with your teams.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPanel;
