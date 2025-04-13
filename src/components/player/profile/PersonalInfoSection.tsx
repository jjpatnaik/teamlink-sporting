
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sports, sportPositions } from "../../../pages/signup/constants";
import { UseFormReturn } from "react-hook-form";
import { PlayerFormValues } from "./types";

interface PersonalInfoSectionProps {
  form: UseFormReturn<PlayerFormValues>;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
}

const PersonalInfoSection = ({ form, selectedSport, setSelectedSport }: PersonalInfoSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-sport-dark-gray font-medium">Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sport-dark-gray font-medium">Sport</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedSport(value);
                  form.setValue("position", "");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                    <SelectValue placeholder="Select your sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sport-dark-gray font-medium">Position/Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedSport}
              >
                <FormControl>
                  <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                    <SelectValue placeholder={selectedSport ? "Select your position" : "Select a sport first"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedSport && sportPositions[selectedSport]?.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default PersonalInfoSection;
