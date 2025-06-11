
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Mail, Phone, User } from 'lucide-react';

interface Team {
  id: string;
  tournament_id: string;
  team_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  captain_name: string | null;
  status: string;
  approval_status: string;
  rejection_reason: string | null;
  created_at: string;
  registered_by: string | null;
  social_media_links: any;
}

interface TeamApprovalCardProps {
  team: Team;
  onStatusUpdate: () => void;
}

const TeamApprovalCard: React.FC<TeamApprovalCardProps> = ({ team, onStatusUpdate }) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApproveTeam = async () => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to approve teams"
        });
        return;
      }

      const { error } = await supabase
        .from('tournament_teams')
        .update({
          approval_status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user.id,
          rejection_reason: null
        })
        .eq('id', team.id);

      if (error) {
        console.error('Error approving team:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to approve team"
        });
        return;
      }

      toast({
        title: "Team Approved",
        description: `${team.team_name} has been approved for the tournament`
      });

      onStatusUpdate();
    } catch (error) {
      console.error('Error in handleApproveTeam:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectTeam = async () => {
    if (!rejectionReason.trim()) {
      toast({
        variant: "destructive",
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this team"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to reject teams"
        });
        return;
      }

      const { error } = await supabase
        .from('tournament_teams')
        .update({
          approval_status: 'rejected',
          rejection_reason: rejectionReason.trim(),
          approved_by: user.id
        })
        .eq('id', team.id);

      if (error) {
        console.error('Error rejecting team:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to reject team"
        });
        return;
      }

      toast({
        title: "Team Rejected",
        description: `${team.team_name} has been rejected. The team will be notified via email.`
      });

      setIsRejectDialogOpen(false);
      setRejectionReason('');
      onStatusUpdate();
    } catch (error) {
      console.error('Error in handleRejectTeam:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{team.team_name}</CardTitle>
            {getStatusBadge(team.approval_status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {team.captain_name && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Captain:</span>
                  <span className="ml-1 font-medium">{team.captain_name}</span>
                </div>
              )}
              {team.contact_email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-1 font-medium">{team.contact_email}</span>
                </div>
              )}
              {team.contact_phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-1 font-medium">{team.contact_phone}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-600">Registered:</span>
                <span className="ml-1 font-medium">
                  {new Date(team.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {team.approval_status === 'rejected' && team.rejection_reason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>Rejection Reason:</strong> {team.rejection_reason}
                </p>
              </div>
            )}

            {team.approval_status === 'pending' && (
              <div className="flex space-x-2 pt-2">
                <Button 
                  onClick={handleApproveTeam}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  onClick={() => setIsRejectDialogOpen(true)}
                  disabled={isProcessing}
                  variant="destructive"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Team Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {team.team_name}'s registration. 
              This will be included in the notification email sent to the team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please explain why this team registration is being rejected..."
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsRejectDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRejectTeam}
                disabled={isProcessing}
              >
                {isProcessing ? 'Rejecting...' : 'Reject Team'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamApprovalCard;
