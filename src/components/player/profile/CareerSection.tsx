
import React from "react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Plus } from "lucide-react";
import CareerHistoryEntry from "@/components/player/CareerHistoryEntry";
import { UseFormReturn } from "react-hook-form";
import { PlayerFormValues } from "./types";

interface CareerSectionProps {
  form: UseFormReturn<PlayerFormValues>;
  careerEntries: Array<{
    club: string;
    position: string;
    startDate: string;
    endDate: string;
  }>;
  setCareerEntries: React.Dispatch<
    React.SetStateAction<
      Array<{
        club: string;
        position: string;
        startDate: string;
        endDate: string;
      }>
    >
  >;
}

const CareerSection = ({ form, careerEntries, setCareerEntries }: CareerSectionProps) => {
  const handleCareerEntryChange = (index: number, field: string, value: string) => {
    const updatedEntries = [...careerEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setCareerEntries(updatedEntries);
  };

  const addCareerEntry = () => {
    setCareerEntries([
      ...careerEntries,
      { club: "", position: "", startDate: "", endDate: "Present" }
    ]);
  };

  const removeCareerEntry = (index: number) => {
    if (careerEntries.length > 1) {
      const updatedEntries = careerEntries.filter((_, i) => i !== index);
      setCareerEntries(updatedEntries);
    }
  };

  return (
    <>
      <h3 className="text-lg font-medium mb-4 text-sport-dark-gray flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-sport-purple" />
        Career Information
      </h3>
      
      <div className="space-y-4 mb-4">
        {careerEntries.map((entry, index) => (
          <CareerHistoryEntry
            key={index}
            index={index}
            entry={entry}
            onChange={handleCareerEntryChange}
            onRemove={removeCareerEntry}
            isLast={index === careerEntries.length - 1}
          />
        ))}
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addCareerEntry}
        className="mb-6 border-sport-light-purple/50 text-sport-purple hover:bg-sport-light-purple/10"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Career Entry
      </Button>

      <FormField
        control={form.control}
        name="achievements"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sport-dark-gray font-medium">Achievements</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="List your key achievements (e.g., MVP, All-Star selections)"
                {...field}
                className="min-h-[120px] border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CareerSection;
