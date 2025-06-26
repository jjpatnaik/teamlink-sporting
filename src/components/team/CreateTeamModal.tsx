
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTeamCreation } from '@/hooks/useTeamCreation';
import { sportsOptions } from '@/constants/sportOptions';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated?: () => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onTeamCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    location: '',
    description: '',
    introduction: '',
    established_year: '',
    achievements: ''
  });
  const { createTeam, isCreating } = useTeamCreation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sport) return;

    const result = await createTeam({
      name: formData.name.trim(),
      sport: formData.sport,
      location: formData.location.trim() || 'Not specified',
      description: formData.description.trim(),
      introduction: formData.introduction.trim() || undefined,
      established_year: formData.established_year ? parseInt(formData.established_year) : undefined,
      achievements: formData.achievements.trim() || undefined
    });

    if (result && typeof result === 'object' && result.success) {
      setFormData({
        name: '',
        sport: '',
        location: '',
        description: '',
        introduction: '',
        established_year: '',
        achievements: ''
      });
      onClose();
      onTeamCreated?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="team-name">Team Name *</Label>
              <Input
                id="team-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter team name"
                required
              />
            </div>
            <div>
              <Label htmlFor="team-sport">Sport *</Label>
              <Select
                value={formData.sport}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {sportsOptions.map((sport) => (
                    <SelectItem key={sport.value} value={sport.value}>
                      {sport.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="team-location">Location</Label>
              <Input
                id="team-location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Team location"
              />
            </div>
            <div>
              <Label htmlFor="established-year">Established Year</Label>
              <Input
                id="established-year"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.established_year}
                onChange={(e) => setFormData(prev => ({ ...prev, established_year: e.target.value }))}
                placeholder="Year established"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="team-description">Description</Label>
            <Textarea
              id="team-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your team"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="team-introduction">Introduction</Label>
            <Textarea
              id="team-introduction"
              value={formData.introduction}
              onChange={(e) => setFormData(prev => ({ ...prev, introduction: e.target.value }))}
              placeholder="Detailed introduction about your team, goals, and what you're looking for"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="team-achievements">Achievements</Label>
            <Textarea
              id="team-achievements"
              value={formData.achievements}
              onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
              placeholder="Team achievements, trophies, notable performances..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !formData.name.trim() || !formData.sport}>
              {isCreating ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamModal;
