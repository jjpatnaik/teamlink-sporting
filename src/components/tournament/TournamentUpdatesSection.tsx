import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, MessageSquare, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TournamentUpdate {
  id: string;
  title: string;
  content: string;
  update_type: string;
  is_important: boolean;
  created_at: string;
  author_id: string;
}

interface TournamentUpdatesSectionProps {
  tournamentId: string;
  isOrganizer: boolean;
}

const TournamentUpdatesSection: React.FC<TournamentUpdatesSectionProps> = ({ 
  tournamentId, 
  isOrganizer 
}) => {
  const { user } = useAuth();
  const [updates, setUpdates] = useState<TournamentUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    content: '',
    update_type: 'general',
    is_important: false
  });

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournament_updates')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tournament updates:', error);
        return;
      }

      setUpdates(data || []);
    } catch (error) {
      console.error('Error in fetchUpdates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdate = async () => {
    if (!user || !newUpdate.title.trim() || !newUpdate.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('tournament_updates')
        .insert({
          tournament_id: tournamentId,
          author_id: user.id,
          title: newUpdate.title.trim(),
          content: newUpdate.content.trim(),
          update_type: newUpdate.update_type,
          is_important: newUpdate.is_important
        });

      if (error) {
        throw error;
      }

      toast.success('Update posted successfully!');
      setNewUpdate({
        title: '',
        content: '',
        update_type: 'general',
        is_important: false
      });
      setShowAddForm(false);
      fetchUpdates();
    } catch (error) {
      console.error('Error adding update:', error);
      toast.error('Failed to post update');
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return;

    try {
      const { error } = await supabase
        .from('tournament_updates')
        .delete()
        .eq('id', updateId);

      if (error) {
        throw error;
      }

      toast.success('Update deleted successfully');
      fetchUpdates();
    } catch (error) {
      console.error('Error deleting update:', error);
      toast.error('Failed to delete update');
    }
  };

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'schedule':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'results':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [tournamentId]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Tournament Updates
          </CardTitle>
          {isOrganizer && (
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Update
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Update Form */}
        {showAddForm && isOrganizer && (
          <Card className="border-sport-purple/20">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="update-title">Title</Label>
                <Input
                  id="update-title"
                  placeholder="Update title..."
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="update-content">Content</Label>
                <Textarea
                  id="update-content"
                  placeholder="Update content..."
                  value={newUpdate.content}
                  onChange={(e) => setNewUpdate(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <Label htmlFor="update-type">Type</Label>
                  <Select 
                    value={newUpdate.update_type} 
                    onValueChange={(value) => setNewUpdate(prev => ({ ...prev, update_type: value }))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="results">Results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="important"
                    checked={newUpdate.is_important}
                    onCheckedChange={(checked) => setNewUpdate(prev => ({ ...prev, is_important: checked }))}
                  />
                  <Label htmlFor="important">Mark as Important</Label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleAddUpdate}>Post Update</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Updates List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sport-purple mx-auto"></div>
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-sport-gray mx-auto mb-2" />
            <p className="text-sport-gray">No updates posted yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => (
              <Card key={update.id} className={`border-l-4 ${update.is_important ? 'border-red-500' : 'border-sport-purple'}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{update.title}</h4>
                      {update.is_important && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Important
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getUpdateTypeColor(update.update_type)}>
                        {update.update_type}
                      </Badge>
                      {isOrganizer && update.author_id === user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUpdate(update.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{update.content}</p>
                  
                  <p className="text-sm text-sport-gray">
                    {format(new Date(update.created_at), 'MMM dd, yyyy at hh:mm a')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentUpdatesSection;