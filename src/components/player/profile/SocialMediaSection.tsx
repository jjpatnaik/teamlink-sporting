
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Medal } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PlayerFormValues } from "./types";

interface SocialMediaSectionProps {
  form: UseFormReturn<PlayerFormValues>;
}

const SocialMediaSection = ({ form }: SocialMediaSectionProps) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4 text-sport-dark-gray flex items-center">
        <Medal className="w-5 h-5 mr-2 text-sport-purple" />
        Social Media & Contact
      </h3>
      
      <div className="grid gap-5 md:grid-cols-3">
        <FormField
          control={form.control}
          name="facebookId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sport-dark-gray font-medium">Facebook</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your Facebook profile" 
                  {...field} 
                  className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whatsappId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sport-dark-gray font-medium">WhatsApp</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your WhatsApp number" 
                  {...field} 
                  className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagramId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sport-dark-gray font-medium">Instagram</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your Instagram handle" 
                  {...field} 
                  className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default SocialMediaSection;
