
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from 'lucide-react';

interface CareerHistoryEntryProps {
  index: number;
  entry: {
    club: string;
    position: string;
    startDate: string;
    endDate: string | 'Present';
  };
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  isLast: boolean;
}

const CareerHistoryEntry = ({ 
  index, 
  entry, 
  onChange, 
  onRemove, 
  isLast 
}: CareerHistoryEntryProps) => {
  return (
    <div className="mb-4 p-4 border border-sport-light-purple/30 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor={`club-${index}`} className="block text-sm font-medium mb-1 text-sport-dark-gray">
            Club/Team
          </label>
          <Input
            id={`club-${index}`}
            value={entry.club}
            onChange={(e) => onChange(index, 'club', e.target.value)}
            placeholder="Club or team name"
            className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
          />
        </div>
        <div>
          <label htmlFor={`position-${index}`} className="block text-sm font-medium mb-1 text-sport-dark-gray">
            Position/Role
          </label>
          <Input
            id={`position-${index}`}
            value={entry.position}
            onChange={(e) => onChange(index, 'position', e.target.value)}
            placeholder="Your position"
            className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor={`start-date-${index}`} className="block text-sm font-medium mb-1 text-sport-dark-gray">
            <Calendar className="w-4 h-4 inline mr-1" /> Start Date
          </label>
          <Input
            id={`start-date-${index}`}
            type="month"
            value={entry.startDate}
            onChange={(e) => onChange(index, 'startDate', e.target.value)}
            className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
          />
        </div>
        <div>
          <label htmlFor={`end-date-${index}`} className="block text-sm font-medium mb-1 text-sport-dark-gray">
            <Calendar className="w-4 h-4 inline mr-1" /> End Date
          </label>
          <div className="flex items-center space-x-2">
            <Input
              id={`end-date-${index}`}
              type="month"
              value={entry.endDate !== 'Present' ? entry.endDate : ''}
              onChange={(e) => onChange(index, 'endDate', e.target.value)}
              className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
              disabled={entry.endDate === 'Present'}
            />
            <div className="flex items-center">
              <input
                type="checkbox" 
                id={`present-${index}`}
                checked={entry.endDate === 'Present'}
                onChange={(e) => onChange(index, 'endDate', e.target.checked ? 'Present' : '')}
                className="mr-2 h-4 w-4 rounded border-sport-light-purple/50 text-sport-purple focus:ring-sport-purple/40"
              />
              <label htmlFor={`present-${index}`} className="text-sm text-sport-dark-gray">
                Present
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline" 
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CareerHistoryEntry;
