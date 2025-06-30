
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Users, Calendar, Trophy, Plus } from 'lucide-react';

interface NewUserGuideProps {
  title?: string;
  subtitle?: string;
}

const NewUserGuide: React.FC<NewUserGuideProps> = ({ 
  title = "Welcome to Sportshive!", 
  subtitle = "Here's how to get started:" 
}) => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const actions = [
    {
      icon: <Plus className="h-5 w-5 text-green-600" />,
      title: "Create Your Team",
      description: "Start your own team and invite players to join.",
      buttonText: "Create Team",
      action: () => navigate("/teams"),
      show: hasRole('player') || hasRole('team_admin')
    },
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "Join Teams",
      description: "Browse and join existing teams in your area.",
      buttonText: "Browse Teams",
      action: () => navigate("/teams"),
      show: hasRole('player')
    },
    {
      icon: <Calendar className="h-5 w-5 text-purple-600" />,
      title: "Create Tournament",
      description: "Organize tournaments for your sport.",
      buttonText: "Create Tournament",
      action: () => navigate("/organiser/tournament"),
      show: hasRole('organiser')
    }
  ];

  const visibleActions = actions.filter(action => action.show);

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Trophy className="h-5 w-5" />
          {title}
        </CardTitle>
        {subtitle && <p className="text-blue-800">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {visibleActions.map((action, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-100">
              {action.icon}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <Button onClick={action.action} size="sm" className="w-full">
                  {action.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewUserGuide;
