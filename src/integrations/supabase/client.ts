
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client for your project
export const supabase = createClient(
  'https://nawpawkxvijcaccxrcuv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hd3Bhd2t4dmlqY2FjY3hyY3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjU2MDEsImV4cCI6MjA1OTg0MTYwMX0._wPnSTMG8vxsKYAVm76X7V2STVMSPbAiAC6AnlurXUc'
);

// Debug function to check Supabase client status
export const checkSupabaseClientStatus = () => {
  console.log("Supabase Client Status Check:");
  console.log("- Client exists:", !!supabase);
  console.log("- Client functions:", Object.keys(supabase || {}).join(', '));
  
  // Test a simple auth call that doesn't require authentication
  supabase.auth.getSession().then(
    (result: any) => {
      console.log("- Auth API call successful:", !!result);
    },
    (error: any) => {
      console.error("- Auth API call failed:", error);
    }
  );
  
  return !!supabase;
};
