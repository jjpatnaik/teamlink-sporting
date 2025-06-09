
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BaseProfileForm from './BaseProfileForm';
import PlayerProfileForm from './PlayerProfileForm';
import TeamProfileForm from './TeamProfileForm';
import SponsorProfileForm from './SponsorProfileForm';

const baseProfileSchema = z.object({
  profile_type: z.enum(['player', 'team_captain', 'tournament_organizer', 'sponsor']),
  display_name: z.string().min(2, 'Display name must be at least 2 characters'),
  bio: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

const playerSchema = z.object({
  sport: z.string().min(1, 'Sport is required'),
  position: z.string().min(1, 'Position is required'),
  age: z.number().min(1).max(100).optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  clubs: z.string().optional(),
  achievements: z.string().optional(),
  facebook_id: z.string().optional(),
  instagram_id: z.string().optional(),
  whatsapp_id: z.string().optional(),
});

const teamSchema = z.object({
  team_name: z.string().min(1, 'Team name is required'),
  sport: z.string().min(1, 'Sport is required'),
  founded_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  team_size: z.number().min(1).optional(),
  league_division: z.string().optional(),
  home_ground: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  website_url: z.string().url().optional(),
});

const sponsorSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  industry: z.string().optional(),
  contact_person: z.string().min(1, 'Contact person is required'),
  contact_email: z.string().email('Valid email is required'),
  contact_phone: z.string().optional(),
  website_url: z.string().url().optional(),
  sponsorship_budget_range: z.string().optional(),
  preferred_sports: z.array(z.string()).optional(),
  sponsorship_types: z.array(z.string()).optional(),
});

interface UnifiedProfileFormProps {
  onSubmit: (profileData: any, specificData: any) => Promise<{ success: boolean; error?: string }>;
  initialData?: any;
  isEditing?: boolean;
}

const UnifiedProfileForm: React.FC<UnifiedProfileFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [profileType, setProfileType] = useState<string>(initialData?.profile_type || 'player');
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to get base profile defaults
  const getBaseProfileDefaults = () => ({
    profile_type: initialData?.profile_type || 'player',
    display_name: initialData?.display_name || '',
    bio: initialData?.bio || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
  });

  const form = useForm({
    resolver: zodResolver(baseProfileSchema),
    defaultValues: getBaseProfileDefaults()
  });

  // Helper function to get specific form schema
  const getSpecificFormSchema = () => {
    switch (profileType) {
      case 'player':
        return playerSchema;
      case 'team_captain':
        return teamSchema;
      case 'sponsor':
        return sponsorSchema;
      default:
        return z.object({});
    }
  };

  // Helper function to get specific form defaults
  const getSpecificDefaultValues = () => {
    if (!initialData) return {};
    
    switch (profileType) {
      case 'player':
        return {
          sport: initialData.playerProfile?.sport || '',
          position: initialData.playerProfile?.position || '',
          age: initialData.playerProfile?.age || undefined,
          height: initialData.playerProfile?.height || '',
          weight: initialData.playerProfile?.weight || '',
          clubs: initialData.playerProfile?.clubs || '',
          achievements: initialData.playerProfile?.achievements || '',
          facebook_id: initialData.playerProfile?.facebook_id || '',
          instagram_id: initialData.playerProfile?.instagram_id || '',
          whatsapp_id: initialData.playerProfile?.whatsapp_id || '',
        };
      case 'team_captain':
        return {
          team_name: initialData.teamProfile?.team_name || '',
          sport: initialData.teamProfile?.sport || '',
          founded_year: initialData.teamProfile?.founded_year || undefined,
          team_size: initialData.teamProfile?.team_size || undefined,
          league_division: initialData.teamProfile?.league_division || '',
          home_ground: initialData.teamProfile?.home_ground || '',
          contact_email: initialData.teamProfile?.contact_email || '',
          contact_phone: initialData.teamProfile?.contact_phone || '',
          website_url: initialData.teamProfile?.website_url || '',
        };
      case 'sponsor':
        return {
          company_name: initialData.sponsorProfile?.company_name || '',
          industry: initialData.sponsorProfile?.industry || '',
          contact_person: initialData.sponsorProfile?.contact_person || '',
          contact_email: initialData.sponsorProfile?.contact_email || '',
          contact_phone: initialData.sponsorProfile?.contact_phone || '',
          website_url: initialData.sponsorProfile?.website_url || '',
          sponsorship_budget_range: initialData.sponsorProfile?.sponsorship_budget_range || '',
          preferred_sports: initialData.sponsorProfile?.preferred_sports || [],
          sponsorship_types: initialData.sponsorProfile?.sponsorship_types || [],
        };
      default:
        return {};
    }
  };

  const specificForm = useForm({
    resolver: zodResolver(getSpecificFormSchema()),
    defaultValues: getSpecificDefaultValues()
  });

  // Reset forms when initialData changes
  useEffect(() => {
    console.log('Initial data changed:', initialData);
    
    // Reset main form
    const baseDefaults = getBaseProfileDefaults();
    console.log('Resetting main form with:', baseDefaults);
    form.reset(baseDefaults);
    
    // Update profile type if it changed
    if (initialData?.profile_type && initialData.profile_type !== profileType) {
      setProfileType(initialData.profile_type);
    }
  }, [initialData]);

  // Reset specific form when profile type changes or initial data changes
  useEffect(() => {
    const specificDefaults = getSpecificDefaultValues();
    console.log('Resetting specific form with:', specificDefaults);
    console.log('Profile type:', profileType);
    
    // Recreate form with new schema and defaults
    specificForm.reset(specificDefaults);
  }, [profileType, initialData]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const specificData = specificForm.getValues();
      console.log('Submitting profile data:', data);
      console.log('Submitting specific data:', specificData);
      
      const result = await onSubmit(data, specificData);
      if (result.success) {
        console.log('Profile submission successful');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSpecificFields = () => {
    switch (profileType) {
      case 'player':
        return <PlayerProfileForm form={specificForm} />;
      case 'team_captain':
        return <TeamProfileForm form={specificForm} />;
      case 'sponsor':
        return <SponsorProfileForm form={specificForm} />;
      case 'tournament_organizer':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tournament Organizer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Tournament organizer profiles will be available soon. Please use the tournament organizer panel for managing tournaments.</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <BaseProfileForm 
        form={form}
        profileType={profileType}
        setProfileType={setProfileType}
        isEditing={isEditing}
      />

      {renderSpecificFields()}

      <Button 
        onClick={form.handleSubmit(handleSubmit)} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Saving...' : (isEditing ? 'Update Profile' : 'Create Profile')}
      </Button>
    </div>
  );
};

export default UnifiedProfileForm;
