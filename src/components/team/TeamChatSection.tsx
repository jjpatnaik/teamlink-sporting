
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, User, Calendar } from 'lucide-react';
import { useTeamUpdates, TeamUpdate } from '@/hooks/useTeamUpdates';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface TeamChatSectionProps {
  teamId: string;
  userRole?: string;
}

const TeamChatSection: React.FC<TeamChatSectionProps> = ({ teamId, userRole }) => {
  const { user } = useAuth();
  const { updates, loading, createUpdate } = useTeamUpdates(teamId);
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const canPostUpdates = userRole === 'owner' || userRole === 'captain';

  const handlePostUpdate = async () => {
    if (!newUpdateTitle.trim() || !newUpdateContent.trim()) return;

    setIsPosting(true);
    const success = await createUpdate(newUpdateTitle.trim(), newUpdateContent.trim());
    
    if (success) {
      setNewUpdateTitle('');
      setNewUpdateContent('');
    }
    setIsPosting(false);
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
              />
              <Textarea
                placeholder="What's new with the team?"
                value={newUpdateContent}
                onChange={(e) => setNewUpdateContent(e.target.value)}
                rows={3}
                maxLength={500}
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
                      </div>
                    </div>
                  </div>
                  <Badge variant="purple" className="text-xs">
                    Update
                  </Badge>
                </div>
                
                <div className="ml-10">
                  <h4 className="font-semibold text-sport-blue mb-1">{update.title}</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{update.content}</p>
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
