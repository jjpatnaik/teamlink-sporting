
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, DollarSign, CreditCard } from 'lucide-react';

interface TeamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: {
    id: string;
    name: string;
    entry_fee: number;
    sport: string;
  };
  onRegistrationSuccess: () => void;
}

const TeamRegistrationModal: React.FC<TeamRegistrationModalProps> = ({
  isOpen,
  onClose,
  tournament,
  onRegistrationSuccess
}) => {
  const [formData, setFormData] = useState({
    team_name: '',
    captain_name: '',
    contact_email: '',
    contact_phone: '',
    social_media_links: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const entryFee = tournament.entry_fee || 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media_links: {
        ...prev.social_media_links,
        [platform]: value
      }
    }));
  };

  const resetForm = () => {
    setFormData({
      team_name: '',
      captain_name: '',
      contact_email: '',
      contact_phone: '',
      social_media_links: {
        facebook: '',
        instagram: '',
        twitter: ''
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.team_name.trim() || !formData.captain_name.trim() || !formData.contact_email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('User error:', userError);
        toast.error('You must be logged in to register a team');
        setIsSubmitting(false);
        return;
      }

      console.log('Registering team for tournament:', tournament.id);
      console.log('Form data:', formData);

      // Check if team name already exists for this tournament
      const { data: existingTeam, error: checkError } = await supabase
        .from('tournament_teams')
        .select('id')
        .eq('tournament_id', tournament.id)
        .eq('team_name', formData.team_name.trim())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing team:', checkError);
        toast.error('Error checking team name availability');
        setIsSubmitting(false);
        return;
      }

      if (existingTeam) {
        toast.error('A team with this name is already registered for this tournament');
        setIsSubmitting(false);
        return;
      }

      // Register the team with all required fields
      const teamData = {
        tournament_id: tournament.id,
        team_name: formData.team_name.trim(),
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone.trim() || null,
        captain_name: formData.captain_name.trim(),
        social_media_links: formData.social_media_links,
        status: 'registered',
        registered_by: user.id
      };

      console.log('Inserting team data:', teamData);

      const { data: insertedTeam, error: insertError } = await supabase
        .from('tournament_teams')
        .insert(teamData)
        .select()
        .single();

      if (insertError) {
        console.error('Registration error:', insertError);
        toast.error(`Failed to register team: ${insertError.message}`);
        setIsSubmitting(false);
        return;
      }

      console.log('Team registered successfully:', insertedTeam);
      
      // Show success message
      toast.success(`Team "${formData.team_name}" successfully registered for ${tournament.name}!`);
      
      // Reset form
      resetForm();
      
      // Call success callback to refresh data
      onRegistrationSuccess();
      
      // Close modal
      onClose();

    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentClick = () => {
    toast.info('Payment integration will be added soon with Stripe');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Register Team for {tournament.name}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to register your team for this {tournament.sport} tournament.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Entry Fee Display */}
          <div className={`border rounded-lg p-4 ${entryFee > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className={`w-5 h-5 mr-2 ${entryFee > 0 ? 'text-yellow-600' : 'text-green-600'}`} />
                <span className={`font-medium ${entryFee > 0 ? 'text-yellow-800' : 'text-green-800'}`}>
                  Registration Fee: ${entryFee}
                </span>
              </div>
              {entryFee > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handlePaymentClick}
                  className="ml-4"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Registration Fee
                </Button>
              )}
            </div>
            <p className={`text-sm mt-1 ${entryFee > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
              {entryFee > 0 
                ? 'Payment will be coordinated by the tournament organizer after registration.'
                : 'This tournament has no registration fee.'
              }
            </p>
          </div>

          {/* Required Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="team_name">Team Name *</Label>
                <Input
                  id="team_name"
                  value={formData.team_name}
                  onChange={(e) => handleInputChange('team_name', e.target.value)}
                  placeholder="Enter team name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="captain_name">Captain Name *</Label>
                <Input
                  id="captain_name"
                  value={formData.captain_name}
                  onChange={(e) => handleInputChange('captain_name', e.target.value)}
                  placeholder="Enter captain's name"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="team@example.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Optional Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Social Media Links (Optional)</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.social_media_links.facebook}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourteam"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.social_media_links.instagram}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourteam"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.social_media_links.twitter}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/yourteam"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Registering...' : 'Register Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamRegistrationModal;
