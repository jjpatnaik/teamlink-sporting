import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Building2 } from "lucide-react";
import { useOrganizerData, OrganizerProfile } from "@/hooks/useOrganizerData";
import { sportsOptions } from "@/constants/sportOptions";

const organizerSchema = z.object({
  organization_name: z.string().min(2, "Organization name must be at least 2 characters"),
  description: z.string().optional(),
  contact_person_name: z.string().min(2, "Contact person name must be at least 2 characters"),
  contact_email: z.string().email("Please enter a valid email address"),
  contact_phone: z.string().optional(),
  sports: z.array(z.string()).min(1, "Please select at least one sport"),
  website_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  facebook_url: z.string().url("Please enter a valid Facebook URL").optional().or(z.literal("")),
  twitter_url: z.string().url("Please enter a valid Twitter URL").optional().or(z.literal("")),
  instagram_url: z.string().url("Please enter a valid Instagram URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  established_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
});

type OrganizerFormData = z.infer<typeof organizerSchema>;

interface OrganizerSignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  existingData?: OrganizerProfile | null;
  isEditing?: boolean;
}

const OrganizerSignupForm: React.FC<OrganizerSignupFormProps> = ({
  isLoading,
  setIsLoading,
  existingData,
  isEditing = false
}) => {
  const { createOrUpdateProfile, uploadLogo } = useOrganizerData();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(existingData?.logo_url || null);

  const form = useForm<OrganizerFormData>({
    resolver: zodResolver(organizerSchema),
    defaultValues: {
      organization_name: existingData?.organization_name || "",
      description: existingData?.description || "",
      contact_person_name: existingData?.contact_person_name || "",
      contact_email: existingData?.contact_email || "",
      contact_phone: existingData?.contact_phone || "",
      sports: existingData?.sports || [],
      website_url: existingData?.website_url || "",
      facebook_url: existingData?.facebook_url || "",
      twitter_url: existingData?.twitter_url || "",
      instagram_url: existingData?.instagram_url || "",
      linkedin_url: existingData?.linkedin_url || "",
      address: existingData?.address || "",
      city: existingData?.city || "",
      country: existingData?.country || "",
      established_year: existingData?.established_year || undefined,
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: OrganizerFormData) => {
    setIsLoading(true);
    try {
      let logoUrl = existingData?.logo_url || null;

      // Upload logo if a new file was selected
      if (logoFile) {
        const uploadedUrl = await uploadLogo(logoFile);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }

      // Convert established_year to number if it exists
      const formData = {
        ...data,
        logo_url: logoUrl,
        established_year: data.established_year ? Number(data.established_year) : null,
      };

      const success = await createOrUpdateProfile(formData);
      if (success) {
        // Redirect or show success message
        console.log("Profile saved successfully");
      }
    } catch (error) {
      console.error("Error saving organizer profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-sport-light-purple/20">
        <CardHeader>
          <CardTitle className="text-sport-purple">
            {isEditing ? "Edit Organization Profile" : "Create Organization Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Logo Upload Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={logoPreview || undefined} alt="Organization logo" />
                  <AvatarFallback className="bg-sport-light-purple/20">
                    <Building2 className="w-8 h-8 text-sport-purple" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sport-purple text-white rounded-md hover:bg-sport-purple/90 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </label>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="organization_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_person_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact person name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your organization..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@organization.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sports Selection */}
              <FormField
                control={form.control}
                name="sports"
                render={() => (
                  <FormItem>
                    <FormLabel>Sports Organized*</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {sportsOptions.map((sport) => (
                        <FormField
                          key={sport.value}
                          control={form.control}
                          name="sports"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={sport.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(sport.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, sport.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== sport.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {sport.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Social Media & Website */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sport-purple">Online Presence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourorganization.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facebook_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/yourorg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitter_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/yourorg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/yourorg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/company/yourorg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location & Additional Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sport-purple">Location & Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address" {...field} />
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
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="established_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Established Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="2020" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading 
                  ? (isEditing ? "Updating Profile..." : "Creating Profile...") 
                  : (isEditing ? "Update Profile" : "Create Profile")
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerSignupForm;
