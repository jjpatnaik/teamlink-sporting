
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight, Trophy, Check } from "lucide-react";

interface TournamentCardProps {
  tournament: {
    id: number | string;
    name: string;
    sport: string;
    area?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    start_date?: string;
    end_date?: string;
    teams_allowed: number;
    image?: string;
  };
  onClick: (id: number | string) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onClick }) => {
  // Support both API formats (camelCase and snake_case)
  const location = tournament.location || tournament.area || "Unknown location";
  const startDate = tournament.start_date || tournament.startDate;
  const endDate = tournament.end_date || tournament.endDate;
  
  // Format dates if they exist
  const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString() : null;
  const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString() : null;

  const handleClick = () => {
    console.log("Tournament card clicked:", tournament.id);
    onClick(tournament.id);
  };

  return (
    <Card 
      key={tournament.id} 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={handleClick}
    >
      <div className="h-48 overflow-hidden bg-sport-light-purple">
        {tournament.image ? (
          <img 
            src={tournament.image} 
            alt={tournament.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="h-16 w-16 text-sport-purple opacity-30" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{tournament.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Trophy className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{tournament.sport}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{location}</span>
        </div>
        {(formattedStartDate || formattedEndDate) && (
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4 text-sport-purple" />
            <span className="text-sm text-gray-600">
              {formattedStartDate || ''} 
              {formattedStartDate && formattedEndDate && ' to '} 
              {formattedEndDate || ''}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <Users className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">Teams: {tournament.teams_allowed}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-3 flex justify-between">
        <Badge className="bg-sport-light-purple text-sport-purple flex items-center gap-1">
          <Check className="h-3 w-3" /> Active
        </Badge>
        <Button variant="ghost" size="sm" className="text-sport-purple">
          View Details <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
