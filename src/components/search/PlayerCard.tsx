
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, MapPin, ArrowRight } from "lucide-react";

interface PlayerCardProps {
  player: {
    id: number;
    name: string;
    sport: string;
    area: string;
    image: string;
  };
  onClick: (id: number) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onClick }) => {
  return (
    <Card 
      key={player.id} 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onClick(player.id)}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={player.image} 
          alt={player.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{player.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Dumbbell className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{player.sport}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{player.area}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-3 flex justify-between">
        <Badge className="bg-sport-light-purple text-sport-purple">{player.sport}</Badge>
        <Button variant="ghost" size="sm" className="text-sport-purple">
          View Profile <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlayerCard;
