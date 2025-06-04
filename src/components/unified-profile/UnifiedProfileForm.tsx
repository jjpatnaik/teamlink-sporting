import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sportsOptions } from '@/constants/sportOptions';

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

  const form = useForm({
    resolver: zodResolver(baseProfileSchema),
    defaultValues: {
      profile_type: initialData?.profile_type || 'player',
      display_name: initialData?.display_name || '',
      bio: initialData?.bio || '',
      city: initialData?.city || '',
      country: initialData?.country || '',
    }
  });

  // Create a single form for specific data based on profile type
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

  // Reset specific form when profile type changes or initial data changes
  useEffect(() => {
    specificForm.reset(getSpecificDefaultValues());
  }, [profileType, initialData]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const specificData = specificForm.getValues();
      const result = await onSubmit(data, specificData);
      if (result.success) {
        // Handle success (navigation, etc.)
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
        return (
          <Card>
            <CardHeader>
              <CardTitle>Player Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...specificForm}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={specificForm.control}
                      name="sport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sport</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sport" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sportsOptions.map((sport) => (
                                <SelectItem key={sport.value} value={sport.value}>
                                  {sport.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specificForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Your position" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={specificForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Age" 
                              {...field} 
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specificForm.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input placeholder="Height" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specificForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input placeholder="Weight" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={specificForm.control}
                    name="clubs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Clubs</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List your previous clubs (one per line or separated by commas)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={specificForm.control}
                    name="achievements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievements</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your achievements" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h4 className="text-md font-medium">Social Media Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={specificForm.control}
                        name="facebook_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook Profile</FormLabel>
                            <FormControl>
                              <Input placeholder="Facebook profile URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={specificForm.control}
                        name="instagram_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram Handle</FormLabel>
                            <FormControl>
                              <Input placeholder="Instagram profile URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={specificForm.control}
                        name="whatsapp_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp Number</FormLabel>
                            <FormControl>
                              <Input placeholder="WhatsApp number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        );

      case 'team_captain':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Team Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...specificForm}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={specificForm.control}
                      name="team_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your team name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specificForm.control}
                      name="sport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sport</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sport" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sportsOptions.map((sport) => (
                                <SelectItem key={sport.value} value={sport.value}>
                                  {sport.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={specificForm.control}
                      name="founded_year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Founded Year</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Year" 
                              {...field} 
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specificForm.control}
                      name="team_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Size</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Number of players" 
                              {...field} 
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specificForm.control}
                      name="league_division"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>League/Division</FormLabel>
                          <FormControl>
                            <Input placeholder="League or division" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={specificForm.control}
                    name="home_ground"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Ground</FormLabel>
                        <FormControl>
                          <Input placeholder="Your home ground/venue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={specificForm.control}
                      name="contact_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="team@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specificForm.control}
                      name="contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        );

      case 'sponsor':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sponsor Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...specificForm}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={specificForm.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specificForm.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input placeholder="Your industry" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={specificForm.control}
                      name="contact_person"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact person name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specificForm.control}
                      name="contact_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={specificForm.control}
                    name="sponsorship_budget_range"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsorship Budget Range</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under_1k">Under $1,000</SelectItem>
                            <SelectItem value="1k_5k">$1,000 - $5,000</SelectItem>
                            <SelectItem value="5k_10k">$5,000 - $10,000</SelectItem>
                            <SelectItem value="10k_25k">$10,000 - $25,000</SelectItem>
                            <SelectItem value="25k_50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k_plus">$50,000+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </CardContent>
          </Card>
        );

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
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="profile_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Type</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setProfileType(value);
                      }} 
                      value={field.value}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="player">Sports Enthusiast/Player</SelectItem>
                        <SelectItem value="team_captain">Team Captain/Organizer</SelectItem>
                        <SelectItem value="tournament_organizer">Tournament Organizer</SelectItem>
                        <SelectItem value="sponsor">Sponsor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your display name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Your city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about yourself" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

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
