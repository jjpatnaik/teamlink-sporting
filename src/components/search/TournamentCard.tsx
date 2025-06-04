
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, MapPin, Calendar, ArrowRight } from "lucide-react";

interface TournamentCardProps {
  tournament: {
    id: string;
    name: string;
    sport: string;
    area: string;
    startDate: string;
    endDate: string;
    image: string;
  };
  onClick: (id: string) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onClick }) => {
  return (
    <Card 
      key={tournament.id} 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onClick(tournament.id)}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={tournament.image} 
          alt={tournament.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{tournament.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Dumbbell className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{tournament.sport}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{tournament.area}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Calendar className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{tournament.startDate} to {tournament.endDate}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-3 flex justify-between">
        <Badge className="bg-sport-light-purple text-sport-purple">{tournament.sport}</Badge>
        <Button variant="ghost" size="sm" className="text-sport-purple">
          View Details <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
