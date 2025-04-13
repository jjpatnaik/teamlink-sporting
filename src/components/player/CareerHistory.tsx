
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
  
  const renderCareerEntries = () => {
    if (!playerData?.careerHistory?.length) {
      // Default fallback entries if no career history is available
      return (
        <>
          <div className="border-l-4 border-sport-purple pl-4 pb-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-sport-purple mr-2" />
              <span className="text-sm text-sport-gray">2020 - Present</span>
            </div>
            <h3 className="text-lg font-semibold mt-1">{playerData?.clubs || "Chicago Breeze"}</h3>
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

    return playerData.careerHistory.map((entry, index) => {
      const startDate = formatDate(entry.startDate);
      const endDate = entry.endDate === 'Present' ? 'Present' : formatDate(entry.endDate);
      const isActive = entry.endDate === 'Present';
      
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
