
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
      navigate('/auth');
      return;
    }

    fetchProfileData();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch main profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        // No profile found, redirect to create profile
        navigate('/createprofile');
        return;
      }

      let specificProfile = null;

      // Fetch specific profile data based on profile type
      switch (profile.profile_type) {
        case 'player':
          const { data: playerProfile } = await supabase
            .from('player_profiles')
            .select('*')
            .eq('profile_id', profile.id)
            .maybeSingle();
          specificProfile = playerProfile;
          break;
        
        case 'team_captain':
          const { data: teamProfile } = await supabase
            .from('team_profiles')
            .select('*')
            .eq('profile_id', profile.id)
            .maybeSingle();
          specificProfile = teamProfile;
          break;
        
        case 'sponsor':
          const { data: sponsorProfile } = await supabase
            .from('sponsor_profiles')
            .select('*')
            .eq('profile_id', profile.id)
            .maybeSingle();
          specificProfile = sponsorProfile;
          break;
      }

      setProfileData({
        ...profile,
        playerProfile: profile.profile_type === 'player' ? specificProfile : null,
        teamProfile: profile.profile_type === 'team_captain' ? specificProfile : null,
        sponsorProfile: profile.profile_type === 'sponsor' ? specificProfile : null,
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (profileData: any, specificData: any) => {
    const result = await updateProfile(profileData, specificData);
    if (result.success) {
      toast.success('Profile updated successfully!');
      navigate('/');
    }
    return result;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
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
            <CardContent>
              <p className="text-gray-600 mb-4">
                We couldn't find your profile. Would you like to create one?
              </p>
              <Button onClick={() => navigate('/createprofile')} className="w-full">
                Create Profile
              </Button>
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
