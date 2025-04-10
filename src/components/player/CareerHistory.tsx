
import React from 'react';
import { Calendar } from 'lucide-react';

type CareerHistoryProps = {
  playerData: any;
};

const CareerHistory = ({ playerData }: CareerHistoryProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Career History</h2>
      
      <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default CareerHistory;
