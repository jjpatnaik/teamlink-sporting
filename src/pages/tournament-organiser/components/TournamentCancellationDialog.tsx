
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TournamentCancellationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentName: string;
  onCancellationComplete: () => void;
}

const TournamentCancellationDialog = ({ 
  isOpen, 
  onClose, 
  tournamentId, 
  tournamentName,
  onCancellationComplete 
}: TournamentCancellationDialogProps) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      toast({
        variant: "destructive",
        title: "Cancellation reason required",
        description: "Please provide a reason for cancelling the tournament",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({
          tournament_status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: cancellationReason.trim()
        })
        .eq('id', tournamentId);

      if (error) {
        console.error("Error cancelling tournament:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to cancel tournament. Please try again.",
        });
        return;
      }

      toast({
        title: "Tournament Cancelled",
        description: `${tournamentName} has been successfully cancelled.`,
      });

      onCancellationComplete();
      onClose();
      setCancellationReason('');
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCancellationReason('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Cancel Tournament</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel "{tournamentName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cancellation-reason">Cancellation Reason *</Label>
            <Textarea
              id="cancellation-reason"
              placeholder="Please provide a reason for cancelling this tournament..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Keep Tournament
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancel}
            disabled={isSubmitting || !cancellationReason.trim()}
          >
            {isSubmitting ? "Cancelling..." : "Cancel Tournament"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentCancellationDialog;
