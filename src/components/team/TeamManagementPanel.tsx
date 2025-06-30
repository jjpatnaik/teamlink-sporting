import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Send, Crown, Shield, User, Trash2, MessageSquare, Calendar } from 'lucide-react';
import { useTeamMembership } from '@/hooks/useTeamMembership';
import { useTeamUpdates } from '@/hooks/useTeamUpdates';
import { useAuth } from '@/hooks/useAuth';

interface TeamManagementPanelProps {
  teamId: string;
  teamName: string;
  userRole?: string;
}

const TeamManagementPanel: React.FC<TeamManagementPanelProps> = ({
  teamId,
  teamName,
  userRole
}) => {
  const { user } = useAuth();
  const {
    members,
    invitations,
    loading,
    sendInvitation,
    respondToInvitation,
    updateMemberRole,
    removeMember,
    transferOwnership
  } = useTeamMembership(teamId);

  const {
    updates,
    loading: updatesLoading,
    createUpdate,
    deleteUpdate
  } = useTeamUpdates(teamId);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const isOwnerOrCaptain = userRole === 'owner' || userRole === 'captain';
  const isOwner = userRole === 'owner';

  const handleSendInvitation = async () => {
    if (!inviteEmail.trim()) return;

    const success = await sendInvitation(inviteEmail.trim(), inviteMessage.trim() || undefined);
    if (success) {
      setInviteEmail('');
      setInviteMessage('');
      setShowInviteDialog(false);
    }
  };

  const handleCreateUpdate = async () => {
    if (!updateContent.trim()) return;

    const success = await createUpdate(updateContent.trim());
    if (success) {
      setUpdateContent('');
      setShowUpdateDialog(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'captain':
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default' as const;
      case 'captain':
      case 'admin':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Management</h2>
        {isOwnerOrCaptain && (
          <div className="flex gap-2">
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">User Email/Name</label>
                    <Input
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter user email or name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message (Optional)</label>
                    <Textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Add a personal message..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendInvitation} disabled={!inviteEmail.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Post Update
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Post Team Update</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      value={updateContent}
                      onChange={(e) => setUpdateContent(e.target.value)}
                      placeholder="Write your update..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateUpdate} 
                      disabled={!updateContent.trim()}
                    >
                      Post Update
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
          <TabsTrigger value="invitations">Invitations ({invitations.length})</TabsTrigger>
          <TabsTrigger value="updates">Updates ({updates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {getRoleIcon(member.role)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {member.user_profile?.display_name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {member.role}
                      </Badge>
                      
                      {isOwner && member.role !== 'owner' && (
                        <div className="flex items-center gap-1">
                          <Select
                            value={member.role}
                            onValueChange={(value) => updateMemberRole(member.id, value as any)}
                          >
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="captain">Captain</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMember(member.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => transferOwnership(member.user_id)}
                            className="h-8 px-2 text-xs"
                          >
                            Make Owner
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {members.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No team members found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        Invitation to join {invitation.team?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        From: {invitation.sender_profile?.display_name || 'Unknown User'}
                      </p>
                      {invitation.message && (
                        <p className="text-sm text-gray-500 mt-1">"{invitation.message}"</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => respondToInvitation(invitation.id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => respondToInvitation(invitation.id, 'rejected')}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
                
                {invitations.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No pending invitations</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Team Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-gray-700 mb-3">{update.content}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>By {update.author_profile?.display_name || 'Unknown User'}</span>
                          <span>{new Date(update.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {(update.author_id === user?.id || isOwner) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUpdate(update.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {updates.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No team updates yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagementPanel;
