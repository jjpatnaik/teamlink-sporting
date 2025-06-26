
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import ProfileTypeSelector from '@/components/profile/ProfileTypeSelector';
import BasicInfoForm from '@/components/profile/BasicInfoForm';
import UnifiedProfileForm from '@/components/unified-profile/UnifiedProfileForm';
import { useProfileUpdate } from '@/hooks/useProfileUpdate';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';

const basicProfileSchema = z.object({
  display_name: z.string().min(1, 'Display name is required'),
  bio: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  profile_type: z.enum(['player', 'team', 'sponsor', 'organizer'])
});

type BasicProfileForm = z.infer<typeof basicProfileSchema>;

const CreateProfilePage = () => {
  const [step, setStep] = useState<'type' | 'basic' | 'detailed'>('type');
  const [selectedType, setSelectedType] = useState<string>('');
  const navigate = useNavigate();
  const { updateProfile, isUpdating } = useProfileUpdate();
  const { updateProfile: createProfile } = useUnifiedProfile();

  const form = useForm<BasicProfileForm>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: {
      display_name: '',
      bio: '',
      city: '',
      country: '',
      profile_type: 'player'
    }
  });

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
    form.setValue('profile_type', type as any);
    setStep('basic');
  };

  const handleBasicInfo = async (data: BasicProfileForm) => {
    const success = await updateProfile({
      display_name: data.display_name,
      bio: data.bio,
      city: data.city,
      country: data.country,
      profile_type: data.profile_type,
      roles: [data.profile_type, 'enthusiast']
    });
    
    if (success) {
      if (data.profile_type === 'player') {
        setStep('detailed');
      } else {
        navigate('/');
      }
    }
  };

  const handleDetailedProfileSubmit = async (profileData: any, specificData: any) => {
    const result = await createProfile(profileData, specificData);
    if (result.success) {
      navigate('/');
    }
    return result;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {step === 'type' && (
          <ProfileTypeSelector 
            selectedType={selectedType}
            onTypeSelect={handleTypeSelection}
          />
        )}

        {step === 'basic' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
              <p className="text-gray-600">Let's set up your basic profile information</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleBasicInfo)} className="space-y-6">
                <BasicInfoForm form={form} />
                
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('type')}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isUpdating} className="flex-1">
                    {isUpdating ? 'Saving...' : 'Continue'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === 'detailed' && selectedType === 'player' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Complete Your Player Profile</h2>
              <p className="text-gray-600">Add detailed information to help others connect with you</p>
            </div>

            <UnifiedProfileForm 
              onSubmit={handleDetailedProfileSubmit}
              isEditing={false}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CreateProfilePage;
