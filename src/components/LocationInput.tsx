
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormDescription } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface LocationInputProps {
  form: UseFormReturn<any>;
  cityFieldName: string;
  postcodeFieldName: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ 
  form, 
  cityFieldName, 
  postcodeFieldName 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-sport-dark-gray">Location Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={cityFieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter your city" {...field} />
              </FormControl>
              <FormDescription>
                Your current city or town
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={postcodeFieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postcode <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter your postcode" {...field} />
              </FormControl>
              <FormDescription>
                Your postal/zip code
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default LocationInput;
