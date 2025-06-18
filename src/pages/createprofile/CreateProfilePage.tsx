
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Building2, User } from 'lucide-react';
import Header from "@/components/Header";
import UnifiedProfileForm from '@/components/unified-profile/UnifiedProfileForm';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<'player' | 'team_captain' | 'tournament_organizer' | 'sponsor' | null>(null);

  useEffect(() => {
    // Check if type is specified in URL params
    const typeParam = searchParams.get('type');
    if (typeParam === 'team') {
      setSelectedType('team_captain');
    } else if (typeParam === 'player') {
      setSelectedType('player');
    } else if (typeParam === 'organizer') {
      setSelectedType('tournament_organizer');
    } else if (typeParam === 'sponsor') {
      setSelectedType('sponsor');
    }
  }, [searchParams]);

  const profileTypes = [
    {
      type: 'player' as const,
      title: 'Player',
      description: 'Create a profile to connect with teams and showcase your skills',
      icon: User,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      type: 'team_captain' as const,
      title: 'Team Captain',
      description: 'Manage your team and connect with players and tournaments',
      icon: Users,
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      type: 'tournament_organizer' as const,
      title: 'Tournament Organizer',
      description: 'Organize tournaments and manage events',
      icon: Trophy,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      type: 'sponsor' as const,
      title: 'Sponsor',
      description: 'Connect with teams and players for sponsorship opportunities',
      icon: Building2,
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    }
  ];

  const handleProfileSubmit = async (profileData: any, specificData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let profile;

      // Check if we're updating an existing profile (for team creation)
      if (profileData.existingProfileId) {
        // Update existing profile to team_captain type
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({
            profile_type: profileData.profile_type,
            display_name: profileData.display_name,
            bio: profileData.bio,
            city: profileData.city,
            country: profileData.country,
          })
          .eq('id', profileData.existingProfileId)
          .select()
          .single();

        if (updateError) throw updateError;
        profile = updatedProfile;
      } else {
        // Create new profile record
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            profile_type: profileData.profile_type,
            display_name: profileData.display_name,
            bio: profileData.bio,
            city: profileData.city,
            country: profileData.country,
          })
          .select()
          .single();

        if (profileError) throw profileError;
        profile = newProfile;
      }

      // Create specific profile based on type
      if (profileData.profile_type === 'player') {
        const { error: playerError } = await supabase
          .from('player_profiles')
          .insert({
            profile_id: profile.id,
            ...specificData
          });
        if (playerError) throw playerError;
      } else if (profileData.profile_type === 'team_captain') {
        const { error: teamError } = await supabase
          .from('team_profiles')
          .insert({
            profile_id: profile.id,
            ...specificData
          });
        if (teamError) throw teamError;
      } else if (profileData.profile_type === 'sponsor') {
        const { error: sponsorError } = await supabase
          .from('sponsor_profiles')
          .insert({
            profile_id: profile.id,
            ...specificData
          });
        if (sponsorError) throw sponsorError;
      }

      toast.success('Profile created successfully!');
      navigate('/');
      return { success: true };
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.message || 'Error creating profile');
      return { success: false, error: error.message };
    }
  };

  if (selectedType) {
    const getProfileTitle = () => {
      if (selectedType === 'team_captain') {
        return 'Create Your Team Profile';
      }
      return `Create Your ${profileTypes.find(p => p.type === selectedType)?.title} Profile`;
    };

    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedType(null)}
                  className="mb-4"
                >
                  ← Back to Profile Types
                </Button>
                <h1 className="text-3xl font-bold text-center mb-2">
                  {getProfileTitle()}
                </h1>
                <p className="text-gray-600 text-center">
                  Fill in your details to get started
                </p>
              </div>
              
              <UnifiedProfileForm 
                onSubmit={handleProfileSubmit}
                initialData={{ profile_type: selectedType }}
                isEditing={false}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Create Your Profile</h1>
              <p className="text-xl text-gray-600">
                Choose your profile type to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileTypes.map((profileType) => {
                const IconComponent = profileType.icon;
                return (
                  <Card 
                    key={profileType.type}
                    className={`cursor-pointer transition-colors ${profileType.color}`}
                    onClick={() => setSelectedType(profileType.type)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-white shadow-sm">
                        <IconComponent className="h-8 w-8 text-sport-blue" />
                      </div>
                      <CardTitle className="text-xl font-semibold">
                        {profileType.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center">
                        {profileType.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="px-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProfilePage;
