
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PlayerFormValues } from "@/components/player/profile/types";

// Now this component is dedicated for the create profile page, not signup
interface SocialMediaSectionProps {
  form: UseFormReturn<PlayerFormValues>;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ form }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Facebook ID */}
      <FormField
        control={form.control}
        name="facebookId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook ID</FormLabel>
            <FormControl>
              <Input placeholder="Enter your Facebook profile link (optional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* WhatsApp ID */}
      <FormField
        control={form.control}
        name="whatsappId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp ID</FormLabel>
            <FormControl>
              <Input placeholder="Enter your WhatsApp number (optional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Instagram ID */}
      <FormField
        control={form.control}
        name="instagramId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram ID</FormLabel>
            <FormControl>
              <Input placeholder="Enter your Instagram handle (optional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SocialMediaSection;
