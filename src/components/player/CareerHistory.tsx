
import React from 'react';
import { Calendar } from 'lucide-react';
import { PlayerData } from '@/hooks/usePlayerData';

type CareerHistoryProps = {
  playerData: PlayerData | null;
};

const CareerHistory = ({ playerData }: CareerHistoryProps) => {
  // Format date for display, e.g. "2020-01" to "Jan 2020"
  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === 'Present') return dateString;
    
    try {
      const [year, month] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (e) {
      return dateString;
    }
  };
  
  // Parse clubs string into career entries if career history is not available
  const parseClubsToCareerHistory = () => {
    if (!playerData?.clubs) return [];
    
    try {
      // Parse the clubs string format: "Club1 (Position1, StartDate1 - EndDate1); Club2 (Position2, StartDate2 - EndDate2)"
      const entries = playerData.clubs.split('; ').map(entry => {
        const clubMatch = entry.match(/(.*?)\s\((.*?),\s(.*?)\s-\s(.*?)\)/);
        if (clubMatch && clubMatch.length >= 5) {
          return {
            club: clubMatch[1],
            position: clubMatch[2],
            startDate: clubMatch[3],
            endDate: clubMatch[4]
          };
        }
        return null;
      }).filter(Boolean);
      
      return entries;
    } catch (error) {
      console.error("Error parsing clubs string:", error);
      return [];
    }
  };
  
  const renderCareerEntries = () => {
    // Use career history if available, otherwise parse from clubs string
    const careerEntries = playerData?.careerHistory?.length 
      ? playerData.careerHistory 
      : parseClubsToCareerHistory();

    if (!careerEntries || careerEntries.length === 0) {
      // Default fallback entries if no career history is available
      return (
        <>
          <div className="border-l-4 border-sport-purple pl-4 pb-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-sport-purple mr-2" />
              <span className="text-sm text-sport-gray">2020 - Present</span>
            </div>
            <h3 className="text-lg font-semibold mt-1">Chicago Breeze</h3>
            <p className="text-sport-gray">Starting {playerData?.position}</p>
          </div>
          
          <div className="border-l-4 border-sport-gray pl-4 pb-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-sport-gray mr-2" />
              <span className="text-sm text-sport-gray">2018 - 2020</span>
            </div>
            <h3 className="text-lg font-semibold mt-1">Michigan Wolverines</h3>
            <p className="text-sport-gray">Collegiate Athlete</p>
          </div>
        </>
      );
    }

    // Sort entries by start date (most recent first)
    const sortedEntries = [...careerEntries].sort((a, b) => {
      const dateA = new Date(a.startDate + '-01');
      const dateB = new Date(b.startDate + '-01');
      return dateB.getTime() - dateA.getTime();
    });

    return sortedEntries.map((entry, index) => {
      const startDate = formatDate(entry.startDate);
      const endDate = entry.endDate === 'Present' ? 'Present' : formatDate(entry.endDate);
      const isActive = entry.endDate === 'Present' || index === 0; // Most recent is active
      
      return (
        <div 
          key={index} 
          className={`border-l-4 ${isActive ? 'border-sport-purple' : 'border-sport-gray'} pl-4 pb-4`}
        >
          <div className="flex items-center">
            <Calendar className={`w-5 h-5 ${isActive ? 'text-sport-purple' : 'text-sport-gray'} mr-2`} />
            <span className="text-sm text-sport-gray">
              {startDate} - {endDate}
            </span>
          </div>
          <h3 className="text-lg font-semibold mt-1">{entry.club}</h3>
          <p className="text-sport-gray">{entry.position}</p>
        </div>
      );
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Career History</h2>
      
      <div className="space-y-4">
        {renderCareerEntries()}
      </div>
    </div>
  );
};

export default CareerHistory;
