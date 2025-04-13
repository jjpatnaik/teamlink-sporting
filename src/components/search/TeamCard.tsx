
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, MapPin, ArrowRight } from "lucide-react";

interface TeamCardProps {
  team: {
    id: number;
    name: string;
    sport: string;
    area: string;
    logo: string;
  };
  onClick: (id: number) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {
  return (
    <Card 
      key={team.id} 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onClick(team.id)}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={team.logo} 
          alt={team.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{team.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Dumbbell className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{team.sport}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{team.area}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-3 flex justify-between">
        <Badge className="bg-sport-light-purple text-sport-purple">{team.sport}</Badge>
        <Button variant="ghost" size="sm" className="text-sport-purple">
          View Team <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;
