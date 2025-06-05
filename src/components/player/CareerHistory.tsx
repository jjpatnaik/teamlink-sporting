
import React from 'react';
import { Calendar } from 'lucide-react';
import { PlayerData } from '@/hooks/usePlayerData';

type CareerHistoryProps = {
  playerData: PlayerData | null;
};

const CareerHistory = ({ playerData }: CareerHistoryProps) => {
  console.log('CareerHistory - playerData:', playerData);
  console.log('CareerHistory - careerHistory:', playerData?.careerHistory);
  console.log('CareerHistory - clubs string:', playerData?.clubs);

  // Format date for display, e.g. "2020-01" to "Jan 2020"
  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === 'Present') return dateString;
    
    try {
      const [year, month] = dateString.split('-');
      if (!year || !month) return dateString;
      
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (e) {
      console.error('Error formatting date:', e, dateString);
      return dateString;
    }
  };

  // Calculate duration between two dates
  const calculateDuration = (startDate: string, endDate: string): string => {
    if (!startDate) return '';
    
    try {
      const start = new Date(startDate + '-01');
      const end = endDate === 'Present' ? new Date() : new Date(endDate + '-01');
      
      const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      
      if (diffInMonths < 1) {
        return '1 mo';
      } else if (diffInMonths < 12) {
        return `${diffInMonths} mos`;
      } else {
        const years = Math.floor(diffInMonths / 12);
        const months = diffInMonths % 12;
        if (months === 0) {
          return `${years} yr${years > 1 ? 's' : ''}`;
        }
        return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
      }
    } catch (e) {
      console.error('Error calculating duration:', e);
      return '';
    }
  };
  
  // Parse clubs string into career entries if career history is not available
  const parseClubsToCareerHistory = () => {
    if (!playerData?.clubs) {
      console.log('No clubs string available');
      return [];
    }
    
    try {
      console.log('Parsing clubs string:', playerData.clubs);
      const entries = playerData.clubs.split('; ').map((entry, index) => {
        console.log(`Parsing entry ${index}:`, entry);
        const clubMatch = entry.match(/(.*?)\s\((.*?),\s(.*?)\s-\s(.*?)\)/);
        if (clubMatch && clubMatch.length >= 5) {
          const parsed = {
            club: clubMatch[1],
            position: clubMatch[2],
            startDate: clubMatch[3],
            endDate: clubMatch[4]
          };
          console.log(`Parsed entry ${index}:`, parsed);
          return parsed;
        }
        console.log(`Failed to parse entry ${index}:`, entry);
        return null;
      }).filter(Boolean);
      
      console.log('All parsed entries:', entries);
      return entries;
    } catch (error) {
      console.error("Error parsing clubs string:", error);
      return [];
    }
  };
  
  const renderCareerEntries = () => {
    // Use career history if available, otherwise parse from clubs string
    let careerEntries = playerData?.careerHistory?.length 
      ? playerData.careerHistory 
      : parseClubsToCareerHistory();

    console.log('Career entries to render:', careerEntries);

    if (!careerEntries || careerEntries.length === 0) {
      console.log('No career entries found');
      return (
        <div className="text-center py-8 text-sport-gray">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No career history available yet.</p>
          <p className="text-sm">Add your career history when editing your profile.</p>
        </div>
      );
    }

    // Sort entries by start date (most recent first)
    const sortedEntries = [...careerEntries].sort((a, b) => {
      try {
        const dateA = new Date(a.startDate + '-01');
        const dateB = new Date(b.startDate + '-01');
        return dateB.getTime() - dateA.getTime();
      } catch (e) {
        console.error('Error sorting entries:', e);
        return 0;
      }
    });

    console.log('Sorted entries:', sortedEntries);

    return sortedEntries.map((entry, index) => {
      const startDate = formatDate(entry.startDate);
      const endDate = entry.endDate === 'Present' ? 'Present' : formatDate(entry.endDate);
      const duration = calculateDuration(entry.startDate, entry.endDate);
      const isActive = entry.endDate === 'Present';
      
      // Create initials for club logo
      const clubInitials = entry.club
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
      
      console.log(`Rendering entry ${index}:`, {
        club: entry.club,
        position: entry.position,
        startDate,
        endDate,
        duration,
        isActive,
        clubInitials
      });
      
      return (
        <div key={index} className="flex items-start space-x-4 pb-6 relative">
          {/* Timeline line */}
          {index < sortedEntries.length - 1 && (
            <div className="absolute left-6 top-12 w-0.5 h-16 bg-sport-light-purple/30"></div>
          )}
          
          <div className={`w-12 h-12 ${isActive ? 'bg-sport-purple' : 'bg-sport-gray'} rounded-md flex items-center justify-center flex-shrink-0 relative z-10`}>
            <span className="text-white font-bold text-sm">{clubInitials}</span>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{entry.club}</h3>
            <p className="text-sport-gray mb-1">{entry.position}</p>
            <div className="flex items-center text-sm text-sport-gray">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {startDate}
                {entry.endDate === 'Present' ? ' - Present' : ` - ${endDate}`}
                {duration && ` • ${duration}`}
              </span>
            </div>
            {isActive && (
              <span className="inline-block mt-2 px-2 py-1 bg-sport-purple/10 text-sport-purple text-xs rounded-full">
                Current
              </span>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-6">Career History</h2>
      
      <div className="space-y-0">
        {renderCareerEntries()}
      </div>
    </div>
  );
};

export default CareerHistory;
