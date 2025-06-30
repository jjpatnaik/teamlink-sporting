
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, User, Calendar, Edit, Trash2 } from 'lucide-react';
import { useTeamUpdates, TeamUpdate } from '@/hooks/useTeamUpdates';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface TeamChatSectionProps {
  teamId: string;
  userRole?: string;
}

const TeamChatSection: React.FC<TeamChatSectionProps> = ({ teamId, userRole }) => {
  const { user } = useAuth();
  const { updates, loading, createUpdate, updateTeamUpdate, deleteUpdate } = useTeamUpdates(teamId);
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const canPostUpdates = userRole === 'owner' || userRole === 'captain';
  const canManageUpdates = canPostUpdates;

  const handlePostUpdate = async () => {
    if (!newUpdateContent.trim()) {
      toast.error('Please enter some content for your update');
      return;
    }

    setIsPosting(true);
    const success = await createUpdate(newUpdateContent.trim());
    
    if (success) {
      setNewUpdateContent('');
      toast.success('Team update posted successfully!');
    }
    setIsPosting(false);
  };

  const handleEditUpdate = (update: TeamUpdate) => {
    setEditingUpdate(update.id);
    setEditContent(update.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Please enter some content for your update');
      return;
    }

    if (editingUpdate) {
      const success = await updateTeamUpdate(editingUpdate, editContent.trim());
      if (success) {
        setEditingUpdate(null);
        setEditContent('');
        toast.success('Update edited successfully!');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUpdate(null);
    setEditContent('');
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      const success = await deleteUpdate(updateId);
      if (success) {
        toast.success('Update deleted successfully!');
      }
    }
  };

  const canEditUpdate = (update: TeamUpdate) => {
    return user && (update.author_id === user.id || canManageUpdates);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Team Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Team Updates ({updates.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Post new update form */}
        {canPostUpdates && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-sport-light-purple rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-sport-purple" />
              </div>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="What's happening with the team?"
                  value={newUpdateContent}
                  onChange={(e) => setNewUpdateContent(e.target.value)}
                  rows={3}
                  maxLength={500}
                  disabled={isPosting}
                  className="resize-none border-none bg-transparent p-0 focus:ring-0 text-lg placeholder:text-gray-500"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {newUpdateContent.length}/500 characters
                  </span>
                  <Button
                    onClick={handlePostUpdate}
                    disabled={!newUpdateContent.trim() || isPosting}
                    size="sm"
                    className="bg-sport-blue hover:bg-sport-blue/90"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isPosting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Updates list */}
        <div className="space-y-4">
          {updates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No team updates yet</p>
              {canPostUpdates && (
                <p className="text-sm mt-1">Be the first to share what's happening with the team!</p>
              )}
            </div>
          ) : (
            updates.map((update) => (
              <div key={update.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-sport-light-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-sport-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {update.author_profile?.display_name || 'Team Member'}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                          </span>
                          {update.updated_at !== update.created_at && (
                            <span className="text-blue-600 ml-1">(edited)</span>
                          )}
                        </div>
                      </div>
                      {canEditUpdate(update) && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUpdate(update)}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUpdate(update.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      {editingUpdate === update.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            maxLength={500}
                            className="resize-none"
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {editContent.length}/500 characters
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleSaveEdit}
                                disabled={!editContent.trim()}
                                className="bg-sport-blue hover:bg-sport-blue/90"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                          {update.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamChatSection;
