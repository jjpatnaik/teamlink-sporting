
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";

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
  // Helper function to convert dates
  const formatDate = (date: Date | undefined): string => {
    if (!date || !isValid(date)) return "";
    return format(date, "yyyy-MM");
  };

  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr || dateStr === 'Present') return undefined;
    
    try {
      const [year, month] = dateStr.split('-').map(num => parseInt(num, 10));
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return undefined;
      }
      const date = new Date(year, month - 1, 1);
      return isValid(date) ? date : undefined;
    } catch (e) {
      console.error("Error parsing date:", e);
      return undefined;
    }
  };

  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr || dateStr === 'Present') return dateStr || "Select date";
    
    const parsedDate = parseDate(dateStr);
    if (!parsedDate || !isValid(parsedDate)) {
      return "Select date";
    }
    
    return format(parsedDate, "MMMM yyyy");
  };

  const handlePresentToggle = (isPresent: boolean) => {
    if (isPresent) {
      onChange(index, 'endDate', 'Present');
    } else {
      onChange(index, 'endDate', '');
    }
  };

  return (
    <div className="mb-4 p-4 border border-sport-light-purple/30 rounded-md bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor={`club-${index}`} className="block text-sm font-medium mb-1 text-sport-dark-gray">
            Club/Team Name <span className="text-red-500">*</span>
          </label>
          <Input
            id={`club-${index}`}
            value={entry.club}
            onChange={(e) => onChange(index, 'club', e.target.value)}
            placeholder="Enter club or team name"
            className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
          />
        </div>
        <div>
          <label htmlFor={`position-${index}`} className="block text-sm font-medium mb-1 text-sport-dark-gray">
            Position/Role <span className="text-red-500">*</span>
          </label>
          <Input
            id={`position-${index}`}
            value={entry.position}
            onChange={(e) => onChange(index, 'position', e.target.value)}
            placeholder="Your position or role"
            className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor={`start-date-${index}`} className="block text-sm font-medium mb-1 text-sport-dark-gray">
            Start Date <span className="text-red-500">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={`start-date-${index}`}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-sport-light-purple/50",
                  !entry.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDisplayDate(entry.startDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseDate(entry.startDate)}
                onSelect={(date) => {
                  if (date) {
                    onChange(index, 'startDate', formatDate(date));
                  }
                }}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={1990}
                toYear={2030}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label htmlFor={`end-date-${index}`} className="block text-sm font-medium mb-1 text-sport-dark-gray">
            End Date
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox" 
                id={`present-${index}`}
                checked={entry.endDate === 'Present'}
                onChange={(e) => handlePresentToggle(e.target.checked)}
                className="h-4 w-4 rounded border-sport-light-purple/50 text-sport-purple focus:ring-sport-purple/40"
              />
              <label htmlFor={`present-${index}`} className="text-sm text-sport-dark-gray">
                Currently working here
              </label>
            </div>
            {entry.endDate !== 'Present' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={`end-date-${index}`}
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-sport-light-purple/50",
                      !entry.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDisplayDate(entry.endDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDate(entry.endDate === 'Present' ? '' : entry.endDate)}
                    onSelect={(date) => {
                      if (date) {
                        onChange(index, 'endDate', formatDate(date));
                      }
                    }}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1990}
                    toYear={2030}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
                </Popover>
            )}
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
          <Trash2 className="w-4 h-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CareerHistoryEntry;
