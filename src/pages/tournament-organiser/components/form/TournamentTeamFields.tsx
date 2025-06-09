
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { DollarSign, Users } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "./tournamentFormSchema";

interface TournamentTeamFieldsProps {
  form: UseFormReturn<FormValues>;
}

const TournamentTeamFields = ({ form }: TournamentTeamFieldsProps) => {
  return (
    <>
      {/* Entry Fee */}
      <FormField
        control={form.control}
        name="entryFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entry Fee (Optional)</FormLabel>
            <FormControl>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  step="0.01"
                  className="pl-10" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Max Teams/Players */}
      <FormField
        control={form.control}
        name="teamsAllowed"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max Teams/Players</FormLabel>
            <FormControl>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="number" 
                  placeholder="8" 
                  className="pl-10" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Team Size */}
      <FormField
        control={form.control}
        name="teamSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Size / Player Limit (Optional)</FormLabel>
            <FormControl>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="number" 
                  placeholder="11" 
                  className="pl-10" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TournamentTeamFields;
