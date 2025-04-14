
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Trophy } from "lucide-react";
import { PlayerFormValues } from "./types";

interface AchievementsSectionProps {
  form: UseFormReturn<PlayerFormValues>;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ form }) => {
  return (
    <>
      <h3 className="text-xl font-semibold mb-4 text-sport-dark-gray flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-sport-purple" />
        Achievements
      </h3>
      
      <FormField
        control={form.control}
        name="achievements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Achievements*</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="List your achievements, awards, and recognitions"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AchievementsSection;
