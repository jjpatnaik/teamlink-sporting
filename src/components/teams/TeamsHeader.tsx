
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TeamsHeaderProps {
  onCreateTeam: () => void;
}

const TeamsHeader: React.FC<TeamsHeaderProps> = ({ onCreateTeam }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Teams</h1>
        <p className="text-gray-600">Manage your team memberships and create new teams</p>
      </div>
      <Button onClick={onCreateTeam} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create Team
      </Button>
    </div>
  );
};

export default TeamsHeader;
