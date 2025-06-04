
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PlayerFormValues } from "@/components/player/profile/types";
import { sports, sportPositions } from "../constants";

// Now this component is dedicated for the create profile page, not signup
interface SportInfoSectionProps {
  form: UseFormReturn<PlayerFormValues>;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
}

const SportInfoSection: React.FC<SportInfoSectionProps> = ({ form, selectedSport, setSelectedSport }) => {
  return (
    <>
      {/* Sport */}
      <FormField
        control={form.control}
        name="sport"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sport*</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedSport(value);
                form.setValue("position", ""); // Reset position when sport changes
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your sport" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {sports.map((sport) => (
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

      {/* Position/Role - Dynamic based on Sport */}
      {selectedSport && (
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position/Role*</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sportPositions[selectedSport]?.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Achievements */}
      <FormField
        control={form.control}
        name="achievements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Achievements</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="List your key achievements (e.g., MVP, All-Star selections)"
                {...field}
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SportInfoSection;
