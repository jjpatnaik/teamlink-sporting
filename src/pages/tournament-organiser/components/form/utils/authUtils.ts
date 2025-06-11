
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const checkAuthentication = async () => {
  console.log("Step 1: Checking authentication...");
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("❌ Session error:", sessionError);
    toast({
      title: "Authentication Error",
      description: `Failed to get session: ${sessionError.message}`,
      variant: "destructive",
    });
    return { success: false, error: sessionError };
  }
  
  if (!sessionData.session?.user) {
    console.error("❌ No authenticated user found");
    toast({
      title: "Authentication Required",
      description: "You need to be logged in to create a tournament",
      variant: "destructive",
    });
    return { success: false, redirectToLogin: true };
  }

  const organizerId = sessionData.session.user.id;
  console.log("✅ User authenticated successfully. Organizer ID:", organizerId);
  
  return { success: true, organizerId };
};
