
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlayerFormValues } from "./types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sportsOptions, positionsMap } from "../../../constants/sportOptions";

interface PersonalInfoSectionProps {
  form: UseFormReturn<PlayerFormValues>;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  form, 
  selectedSport, 
  setSelectedSport 
}) => {
  const availablePositions = selectedSport ? positionsMap[selectedSport] || [] : [];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-sport-dark-gray">Personal Information</h3>
      
      <div className="space-y-6">
        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Age, Height, Weight in a grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age*</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Age" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Height */}
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Height" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Weight */}
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Weight" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Sport and Position in a grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sport */}
          <FormField
            control={form.control}
            name="sport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sport*</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedSport(value);
                    form.setValue("position", "");
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="text-base md:text-sm">
                      <SelectValue placeholder="Select your sport" />
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

          {/* Position */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position*</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedSport}
                >
                  <FormControl>
                    <SelectTrigger className="text-base md:text-sm">
                      <SelectValue placeholder={selectedSport ? "Select your position" : "Select a sport first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availablePositions.map((position) => (
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
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
