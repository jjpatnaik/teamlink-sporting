
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';
import UnifiedProfileForm from '@/components/unified-profile/UnifiedProfileForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EditProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const { user } = useAuth();
  const { updateProfile } = useUnifiedProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    fetchProfileData();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile data for user:', user.id);
      setLoading(true);
      
      // Fetch main profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Main profile fetch result:', { profile, profileError });

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      if (!profile) {
        console.log('No profile found, redirecting to create profile');
        // No profile found, redirect to create profile
        navigate('/createprofile');
        return;
      }

      let specificProfile = null;

      // Fetch specific profile data based on profile type
      console.log('Fetching specific profile for type:', profile.profile_type);
      
      switch (profile.profile_type) {
        case 'player':
          const { data: playerProfile, error: playerError } = await supabase
            .from('player_profiles')
            .select('*')
            .eq('profile_id', profile.id)
            .maybeSingle();
          
          if (playerError) {
            console.error('Player profile fetch error:', playerError);
          }
          specificProfile = playerProfile;
          console.log('Player profile data:', playerProfile);
          break;
        
        case 'team_captain':
          const { data: teamProfile, error: teamError } = await supabase
            .from('team_profiles')
            .select('*')
            .eq('profile_id', profile.id)
            .maybeSingle();
            
          if (teamError) {
            console.error('Team profile fetch error:', teamError);
          }
          specificProfile = teamProfile;
          console.log('Team profile data:', teamProfile);
          break;
        
        case 'sponsor':
          const { data: sponsorProfile, error: sponsorError } = await supabase
            .from('sponsor_profiles')
            .select('*')
            .eq('profile_id', profile.id)
            .maybeSingle();
            
          if (sponsorError) {
            console.error('Sponsor profile fetch error:', sponsorError);
          }
          specificProfile = sponsorProfile;
          console.log('Sponsor profile data:', sponsorProfile);
          break;
          
        default:
          console.log('Unknown or unsupported profile type:', profile.profile_type);
      }

      setProfileData({
        ...profile,
        playerProfile: profile.profile_type === 'player' ? specificProfile : null,
        teamProfile: profile.profile_type === 'team_captain' ? specificProfile : null,
        sponsorProfile: profile.profile_type === 'sponsor' ? specificProfile : null,
      });
      
      console.log('Final profile data structure:', {
        ...profile,
        playerProfile: profile.profile_type === 'player' ? specificProfile : null,
        teamProfile: profile.profile_type === 'team_captain' ? specificProfile : null,
        sponsorProfile: profile.profile_type === 'sponsor' ? specificProfile : null,
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (profileData: any, specificData: any) => {
    console.log('Starting profile update process');
    console.log('Profile data to update:', profileData);
    console.log('Specific data to update:', specificData);
    
    try {
      const result = await updateProfile(profileData, specificData);
      console.log('Update profile result:', result);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
        // Refresh the profile data to reflect changes
        await fetchProfileData();
        navigate('/');
      } else {
        console.error('Profile update failed:', result.error);
        toast.error(result.error || 'Failed to update profile. Please try again.');
      }
      return result;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Profile Not Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                We couldn't find your profile. Would you like to create one?
              </p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/createprofile')} className="w-full">
                  Create Profile
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()} 
                  className="w-full"
                >
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Your Profile</h1>
          <p className="text-gray-600">Update your profile information and settings</p>
        </div>

        <UnifiedProfileForm 
          onSubmit={handleProfileUpdate}
          initialData={profileData}
          isEditing={true}
        />

        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            Cancel
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfilePage;
