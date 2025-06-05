import React from "react";
import { Button } from "@/components/ui/button";
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
    
    // Update the form value to keep it in sync
    form.setValue('careerHistory', updatedEntries);
  };

  const addCareerEntry = () => {
    const newEntry = { club: "", position: "", startDate: "", endDate: "" };
    const updatedEntries = [...careerEntries, newEntry];
    setCareerEntries(updatedEntries);
    form.setValue('careerHistory', updatedEntries);
  };

  const removeCareerEntry = (index: number) => {
    if (careerEntries.length > 1) {
      const updatedEntries = careerEntries.filter((_, i) => i !== index);
      setCareerEntries(updatedEntries);
      form.setValue('careerHistory', updatedEntries);
    }
  };

  return (
    <>
      <h3 className="text-lg font-medium mb-4 text-sport-dark-gray flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-sport-purple" />
        Career History
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
        <Plus className="w-4 h-4 mr-2" /> Add Club
      </Button>
    </>
  );
};

export default CareerSection;
