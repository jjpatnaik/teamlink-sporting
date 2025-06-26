
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Header from "@/components/Header";

const AVAILABLE_ROLES = [
  { id: 'player', label: 'Player', description: 'Join teams and participate in tournaments' },
  { id: 'team_admin', label: 'Team Admin', description: 'Create and manage teams' },
  { id: 'organiser', label: 'Tournament Organiser', description: 'Create and organize tournaments' },
  { id: 'sponsor', label: 'Sponsor', description: 'Sponsor teams and events' },
];

const ProfileSetupPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    city: '',
    country: '',
    roles: ['enthusiast'] as string[],
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // If profile exists, populate form with existing data
    if (profile) {
      console.log('Populating form with existing profile:', profile);
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        city: profile.city || '',
        country: profile.country || '',
        roles: profile.roles || ['enthusiast'],
      });
    }
  }, [user, profile, navigate]);

  const handleRoleChange = (roleId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, roleId]
        : prev.roles.filter(r => r !== roleId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    console.log('Starting profile update with data:', formData);
    setLoading(true);
    
    try {
      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing profile:', fetchError);
        throw fetchError;
      }

      console.log('Existing profile check:', existingProfile);

      let result;
      
      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile with ID:', existingProfile.id);
        result = await supabase
          .from('profiles')
          .update({
            display_name: formData.display_name,
            bio: formData.bio,
            city: formData.city,
            country: formData.country,
            roles: formData.roles,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProfile.id)
          .select();
      } else {
        // Create new profile
        console.log('Creating new profile for user:', user.id);
        result = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            display_name: formData.display_name,
            bio: formData.bio,
            city: formData.city,
            country: formData.country,
            roles: formData.roles,
            profile_type: 'player', // Default for compatibility
          })
          .select();
      }

      console.log('Database operation result:', result);

      if (result.error) {
        console.error('Database operation error:', result.error);
        throw result.error;
      }

      console.log('Profile operation successful, refreshing profile...');
      await refreshProfile();
      
      toast.success(existingProfile ? 'Profile updated successfully!' : 'Profile created successfully!');
      
      // Navigate to home page after successful update
      navigate('/');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleAdvancedEdit = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {profile ? 'Update Your Profile' : 'Complete Your Profile'}
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Tell us about yourself and select your roles in the sports community
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      value={formData.display_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">City</label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Your city"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Country</label>
                      <Input
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="Your country"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Select Your Roles</label>
                  <div className="space-y-3">
                    {AVAILABLE_ROLES.map((role) => (
                      <div key={role.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={role.id}
                          checked={formData.roles.includes(role.id)}
                          onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <label htmlFor={role.id} className="font-medium cursor-pointer">
                            {role.label}
                          </label>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Saving...' : profile ? 'Update Profile' : 'Complete Setup'}
                  </Button>
                  {!profile && (
                    <Button type="button" variant="outline" onClick={handleSkip}>
                      Skip for now
                    </Button>
                  )}
                </div>

                {profile && (
                  <div className="text-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                      Need to add sport details, team information, or sponsorship details?
                    </p>
                    <Button type="button" variant="outline" onClick={handleAdvancedEdit}>
                      Advanced Profile Editor
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
