
import { toast } from "@/components/ui/use-toast";
import { FormValues } from "../tournamentFormSchema";

export const validateFormData = (data: FormValues) => {
  console.log("Step 2: Processing form data...");
  console.log("Original startDate:", data.startDate);
  console.log("Original endDate:", data.endDate);
  console.log("Original registrationDeadline:", data.registrationDeadline);
  console.log("Original teamsAllowed (string):", data.teamsAllowed, "Type:", typeof data.teamsAllowed);
  console.log("Original entryFee (string):", data.entryFee, "Type:", typeof data.entryFee);
  console.log("Original teamSize (string):", data.teamSize, "Type:", typeof data.teamSize);
  console.log("Format value:", data.format, "Type:", typeof data.format);
  
  // Convert string numbers to integers with validation
  const teamsAllowed = parseInt(data.teamsAllowed);
  const entryFee = data.entryFee ? parseFloat(data.entryFee) : 0;
  const teamSize = data.teamSize ? parseInt(data.teamSize) : null;
  
  console.log("Converted teamsAllowed (number):", teamsAllowed, "Type:", typeof teamsAllowed);
  console.log("Converted entryFee (number):", entryFee, "Type:", typeof entryFee);
  console.log("Converted teamSize (number):", teamSize, "Type:", typeof teamSize);
  
  if (isNaN(teamsAllowed) || teamsAllowed < 1) {
    console.error("❌ Invalid teamsAllowed value:", teamsAllowed);
    toast({
      title: "Validation Error",
      description: "Please enter a valid number of teams allowed",
      variant: "destructive",
    });
    return { success: false };
  }
  
  // Validate format field against allowed values
  const allowedFormats = ['knockout', 'round_robin', 'league', 'swiss'];
  if (!allowedFormats.includes(data.format)) {
    console.error("❌ Invalid format value:", data.format);
    toast({
      title: "Validation Error",
      description: "Please select a valid tournament format",
      variant: "destructive",
    });
    return { success: false };
  }
  
  console.log("✅ Data validation passed");
  
  return {
    success: true,
    processedData: {
      teamsAllowed,
      entryFee,
      teamSize
    }
  };
};
