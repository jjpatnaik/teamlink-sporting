
import { toast } from "@/components/ui/use-toast";

export const handleUnexpectedError = (error: any) => {
  console.error("❌ Unexpected error in form submission:", error);
  console.error("Error analysis:");
  console.error("- Stack:", error.stack);
  console.error("- Type:", typeof error);
  console.error("- Constructor:", error.constructor?.name);
  console.error("- Message:", error.message);
  console.error("- Full error object:", error);
  
  let errorMessage = "An unexpected error occurred";
  
  if (error.message) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
};
