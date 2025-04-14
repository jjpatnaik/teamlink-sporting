
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

interface PersonalInfoSectionProps {
  form: UseFormReturn<FormValues>;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Account Information</h3>
      
      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email*</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                autoComplete="email"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password*</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Create a secure password"
                autoComplete="new-password"
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      
      {/* Confirm Password */}
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password*</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Confirm your password"
                autoComplete="new-password"
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalInfoSection;
