
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, MapPin, Award, ArrowRight } from "lucide-react";

interface SponsorshipCardProps {
  sponsorship: {
    id: number;
    name: string;
    sport: string;
    area: string;
    amount: string;
    image: string;
  };
  onClick: (id: number) => void;
}

const SponsorshipCard: React.FC<SponsorshipCardProps> = ({ sponsorship, onClick }) => {
  return (
    <Card 
      key={sponsorship.id} 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onClick(sponsorship.id)}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={sponsorship.image} 
          alt={sponsorship.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{sponsorship.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Dumbbell className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{sponsorship.sport}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{sponsorship.area}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Award className="h-4 w-4 text-sport-purple" />
          <span className="text-sm text-gray-600">{sponsorship.amount}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-3 flex justify-between">
        <Badge className="bg-sport-light-purple text-sport-purple">{sponsorship.sport}</Badge>
        <Button variant="ghost" size="sm" className="text-sport-purple">
          View Opportunity <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SponsorshipCard;
