
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trophy, Building2, Users } from 'lucide-react';
import { SearchProfile } from '@/hooks/useUnifiedSearch';

interface UnifiedProfileCardProps {
  profile: SearchProfile;
  onClick: () => void;
}

const UnifiedProfileCard: React.FC<UnifiedProfileCardProps> = ({ profile, onClick }) => {
  const getProfileTypeLabel = (type: string) => {
    switch (type) {
      case 'player':
        return 'Sports Enthusiast';
      case 'team_captain':
        return 'Team Captain';
      case 'tournament_organizer':
        return 'Tournament Organizer';
      case 'sponsor':
        return 'Sponsor';
      default:
        return type;
    }
  };

  const getProfileTypeColor = (type: string) => {
    switch (type) {
      case 'player':
        return 'bg-blue-100 text-blue-800';
      case 'team_captain':
        return 'bg-green-100 text-green-800';
      case 'tournament_organizer':
        return 'bg-purple-100 text-purple-800';
      case 'sponsor':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfileIcon = (type: string) => {
    switch (type) {
      case 'player':
        return <Trophy className="h-4 w-4" />;
      case 'team_captain':
        return <Users className="h-4 w-4" />;
      case 'tournament_organizer':
        return <Trophy className="h-4 w-4" />;
      case 'sponsor':
        return <Building2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getSubtitle = () => {
    switch (profile.profile_type) {
      case 'player':
        return profile.sport && profile.position 
          ? `${profile.position} • ${profile.sport}`
          : profile.sport || profile.position;
      case 'team_captain':
        return profile.team_name 
          ? `${profile.team_name}${profile.sport ? ` • ${profile.sport}` : ''}`
          : profile.sport;
      case 'sponsor':
        return profile.company_name;
      default:
        return '';
    }
  };

  console.log('=== UNIFIED PROFILE CARD RENDER ===');
  console.log('Profile:', profile);
  console.log('Profile ID:', profile.id);

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-sport-light-purple/20"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sport-blue to-sport-purple flex items-center justify-center text-white font-semibold text-xl">
              {profile.profile_picture_url ? (
                <img 
                  src={profile.profile_picture_url} 
                  alt={profile.display_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                profile.display_name.charAt(0).toUpperCase()
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-sport-dark-gray group-hover:text-sport-purple transition-colors truncate">
                  {profile.display_name}
                </h3>
                {getSubtitle() && (
                  <p className="text-sm text-sport-gray truncate">
                    {getSubtitle()}
                  </p>
                )}
              </div>
              <Badge className={`flex items-center gap-1 ${getProfileTypeColor(profile.profile_type)}`}>
                {getProfileIcon(profile.profile_type)}
                {getProfileTypeLabel(profile.profile_type)}
              </Badge>
            </div>

            {profile.bio && (
              <p className="text-sm text-sport-gray mb-3 line-clamp-2">
                {profile.bio}
              </p>
            )}

            {profile.city && (
              <div className="flex items-center text-xs text-sport-gray">
                <MapPin className="h-3 w-3 mr-1" />
                {profile.city}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedProfileCard;
