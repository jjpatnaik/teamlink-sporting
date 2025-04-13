
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
    if (!date) return "";
    return format(date, "yyyy-MM");
  };

  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      const [year, month] = dateStr.split('-').map(num => parseInt(num));
      return new Date(year, month - 1); // Month is 0-indexed in JS Date
    } catch (e) {
      return undefined;
    }
  };

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
            Start Date
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
                {entry.startDate ? format(parseDate(entry.startDate) || new Date(), "MMMM yyyy") : <span>Select date</span>}
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
          <div className="flex items-center space-x-2">
            {entry.endDate !== 'Present' ? (
              <div className="flex-grow">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={`end-date-${index}`}
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-sport-light-purple/50",
                        !entry.endDate && "text-muted-foreground"
                      )}
                      disabled={entry.endDate === 'Present'}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {entry.endDate && entry.endDate !== 'Present' 
                        ? format(parseDate(entry.endDate) || new Date(), "MMMM yyyy") 
                        : <span>Select date</span>
                      }
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
              </div>
            ) : (
              <div className="flex-grow">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-sport-light-purple/50"
                  disabled
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Present
                </Button>
              </div>
            )}
            <div className="flex items-center">
              <input
                type="checkbox" 
                id={`present-${index}`}
                checked={entry.endDate === 'Present'}
                onChange={(e) => onChange(index, 'endDate', e.target.checked ? 'Present' : '')}
                className="mr-2 h-4 w-4 rounded border-sport-light-purple/50 text-sport-purple focus:ring-sport-purple/40"
              />
              <label htmlFor={`present-${index}`} className="text-sm text-sport-dark-gray whitespace-nowrap">
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
