
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, Users, Calendar, DollarSign, ArrowRight } from 'lucide-react';

const ImprovedOnboarding = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('');

  if (!user || profile) return null;

  const roleOptions = [
    {
      id: 'player',
      title: 'Player',
      description: 'Join teams, participate in tournaments, connect with other players',
      icon: User,
      benefits: ['Join multiple teams', 'Tournament participation', 'Player networking', 'Performance tracking']
    },
    {
      id: 'team_admin',
      title: 'Team Manager',
      description: 'Create and manage teams, recruit players, organize matches',
      icon: Users,
      benefits: ['Create teams', 'Manage rosters', 'Organize matches', 'Team analytics']
    },
    {
      id: 'organiser',
      title: 'Tournament Organizer',
      description: 'Create tournaments, manage competitions, coordinate events',
      icon: Calendar,
      benefits: ['Create tournaments', 'Manage competitions', 'Event coordination', 'Prize management']
    },
    {
      id: 'sponsor',
      title: 'Sponsor',
      description: 'Support teams and events, build brand presence in sports',
      icon: DollarSign,
      benefits: ['Sponsor teams', 'Brand visibility', 'Community engagement', 'Partnership opportunities']
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/createprofile', { state: { selectedRole } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SH</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to Sportshive!
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your primary role to get started. You can always add more roles later.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roleOptions.map((role) => (
            <Card 
              key={role.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === role.id 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      selectedRole === role.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      <role.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    </div>
                  </div>
                  {selectedRole === role.id && (
                    <CheckCircle className="h-6 w-6 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">What you can do:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole}
            className="px-8 py-3 text-lg"
          >
            Continue Setup
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Don't worry, you can change or add roles anytime in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovedOnboarding;
