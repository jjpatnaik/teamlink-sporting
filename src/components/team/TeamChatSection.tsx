
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const canPostUpdates = userRole === 'owner' || userRole === 'captain';
  const canManageUpdates = canPostUpdates;

  const handlePostUpdate = async () => {
    if (!newUpdateTitle.trim() || !newUpdateContent.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setIsPosting(true);
    const success = await createUpdate(newUpdateTitle.trim(), newUpdateContent.trim());
    
    if (success) {
      setNewUpdateTitle('');
      setNewUpdateContent('');
      toast.success('Team update posted successfully!');
    }
    setIsPosting(false);
  };

  const handleEditUpdate = (update: TeamUpdate) => {
    setEditingUpdate(update.id);
    setEditTitle(update.title);
    setEditContent(update.content);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    if (editingUpdate) {
      const success = await updateTeamUpdate(editingUpdate, editTitle.trim(), editContent.trim());
      if (success) {
        setEditingUpdate(null);
        setEditTitle('');
        setEditContent('');
        toast.success('Update edited successfully!');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUpdate(null);
    setEditTitle('');
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
            <h3 className="font-medium mb-3">Post Team Update</h3>
            <div className="space-y-3">
              <Input
                placeholder="Update title..."
                value={newUpdateTitle}
                onChange={(e) => setNewUpdateTitle(e.target.value)}
                maxLength={100}
                disabled={isPosting}
              />
              <Textarea
                placeholder="What's new with the team?"
                value={newUpdateContent}
                onChange={(e) => setNewUpdateContent(e.target.value)}
                rows={3}
                maxLength={500}
                disabled={isPosting}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {newUpdateContent.length}/500 characters
                </span>
                <Button
                  onClick={handlePostUpdate}
                  disabled={!newUpdateTitle.trim() || !newUpdateContent.trim() || isPosting}
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isPosting ? 'Posting...' : 'Post Update'}
                </Button>
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
                <p className="text-sm mt-1">Be the first to post a team update!</p>
              )}
            </div>
          ) : (
            updates.map((update) => (
              <div key={update.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-sport-light-purple rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-sport-purple" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {update.author_profile?.display_name || 'Team Member'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                        </span>
                        {update.updated_at !== update.created_at && (
                          <span className="text-blue-600">(edited)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Update
                    </Badge>
                    {canEditUpdate(update) && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUpdate(update)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUpdate(update.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-10">
                  {editingUpdate === update.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        maxLength={100}
                        className="font-semibold"
                      />
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        maxLength={500}
                      />
                      <div className="flex justify-end gap-2">
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
                          disabled={!editTitle.trim() || !editContent.trim()}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold text-sport-blue mb-1">{update.title}</h4>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{update.content}</p>
                    </>
                  )}
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
