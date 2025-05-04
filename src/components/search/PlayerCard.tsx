
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, MapPin, ArrowRight } from "lucide-react";

interface PlayerCardProps {
  player: {
    id: number | string;
    name: string;
    sport: string;
    area: string;
    image: string;
  };
  onClick: (id: number | string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onClick }) => {
  const handleClick = () => {
    console.log("Player card clicked:", player.id);
    onClick(player.id);
  };

  return (
    <Card 
      key={player.id} 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={handleClick}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={player.image || "https://via.placeholder.com/300x200?text=Player"} 
          alt={player.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Player";
          }}
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
          <span className="text-sm text-gray-600">{player.area || "Location not specified"}</span>
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
