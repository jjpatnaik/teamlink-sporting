
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, Building2, Calendar } from 'lucide-react';

interface ProfileType {
  id: 'player' | 'team' | 'sponsor' | 'organizer';
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProfileTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const profileTypes: ProfileType[] = [
  {
    id: 'player',
    title: 'Player',
    description: 'Individual athlete looking to connect and compete',
    icon: <User className="h-6 w-6" />
  },
  {
    id: 'team',
    title: 'Team/Club',
    description: 'Sports team or club looking for players and competitions',
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 'sponsor',
    title: 'Sponsor',
    description: 'Business looking to sponsor teams and events',
    icon: <Building2 className="h-6 w-6" />
  },
  {
    id: 'organizer',
    title: 'Tournament Organizer',
    description: 'Organize and manage sports tournaments and events',
    icon: <Calendar className="h-6 w-6" />
  }
];

const ProfileTypeSelector: React.FC<ProfileTypeSelectorProps> = ({ selectedType, onTypeSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Profile Type</h2>
        <p className="text-gray-600">Select the type that best describes you</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all ${
              selectedType === type.id 
                ? 'ring-2 ring-sport-purple bg-sport-light-purple/10' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => onTypeSelect(type.id)}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {type.icon}
              </div>
              <CardTitle className="text-lg">{type.title}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileTypeSelector;
