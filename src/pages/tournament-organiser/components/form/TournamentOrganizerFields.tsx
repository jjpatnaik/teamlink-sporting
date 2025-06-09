
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "./tournamentFormSchema";

interface TournamentOrganizerFieldsProps {
  form: UseFormReturn<FormValues>;
}

const TournamentOrganizerFields = ({ form }: TournamentOrganizerFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-sport-purple">Organizer Contact Information</h3>
      <p className="text-sm text-gray-600">Optional: Provide contact details for participants to reach you</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="organizerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="organizer@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="organizerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="organizerWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://your-website.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="organizerFacebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Page/Profile</FormLabel>
              <FormControl>
                <Input placeholder="facebook.com/yourpage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="organizerTwitter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter/X Handle</FormLabel>
              <FormControl>
                <Input placeholder="@yourusername" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="organizerInstagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram Handle</FormLabel>
              <FormControl>
                <Input placeholder="@yourusername" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default TournamentOrganizerFields;
