
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Search, User, MapPin, UserPlus, Loader2 } from 'lucide-react';
import { useUnifiedSearch, SearchProfile } from '@/hooks/useUnifiedSearch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PlayerInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
}

const PlayerInvitationModal: React.FC<PlayerInvitationModalProps> = ({
  isOpen,
  onClose,
  teamId,
  teamName
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<SearchProfile | null>(null);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  
  const { profiles, loading, searchProfiles } = useUnifiedSearch();

  // Filter only player profiles
  const playerProfiles = profiles.filter(profile => profile.profile_type === 'player');

  useEffect(() => {
    if (searchTerm.trim()) {
      searchProfiles({
        searchTerm: searchTerm,
        profileType: 'player'
      });
    }
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchProfiles({
        searchTerm: searchTerm,
        profileType: 'player'
      });
    }
  };

  const handleSelectPlayer = (player: SearchProfile) => {
    setSelectedPlayer(player);
    setInvitationMessage(`Hi ${player.display_name}, you're invited to join ${teamName}!`);
  };

  const handleSendInvitation = async () => {
    if (!selectedPlayer) return;

    setIsInviting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to send invitations');
        return;
      }

      // Send invitation using the player's id (which is the user_id)
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          team_id: teamId,
          sender_id: user.id,
          receiver_id: selectedPlayer.id,
          message: invitationMessage || null
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Invitation already sent to this player');
        } else {
          throw error;
        }
        return;
      }
      
      toast.success(`Invitation sent to ${selectedPlayer.display_name}!`);
      setSelectedPlayer(null);
      setInvitationMessage('');
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleClose = () => {
    setSelectedPlayer(null);
    setInvitationMessage('');
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Players to {teamName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Section */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search for players by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Search Results</h3>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : playerProfiles.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {playerProfiles.map((player) => (
                      <Card 
                        key={player.id} 
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedPlayer?.id === player.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => handleSelectPlayer(player)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={player.profile_picture_url} />
                              <AvatarFallback>
                                <User className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{player.display_name}</h4>
                                <Badge variant="secondary">{player.sport || 'Player'}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                {player.position && (
                                  <span>{player.position}</span>
                                )}
                                {player.city && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{player.city}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No players found matching your search.</p>
                )}
              </div>
            )}
          </div>

          {/* Selected Player & Invitation Message */}
          {selectedPlayer && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Player</h3>
                <Card className="border-blue-500 bg-blue-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedPlayer.profile_picture_url} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{selectedPlayer.display_name}</h4>
                        <p className="text-sm text-gray-600">{selectedPlayer.sport} • {selectedPlayer.position}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Invitation Message (Optional)
                </label>
                <Textarea
                  placeholder="Add a personal message to your invitation..."
                  value={invitationMessage}
                  onChange={(e) => setInvitationMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleSendInvitation}
                  disabled={isInviting}
                  className="flex-1"
                >
                  {isInviting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Send Invitation
                </Button>
                <Button variant="outline" onClick={() => setSelectedPlayer(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerInvitationModal;
