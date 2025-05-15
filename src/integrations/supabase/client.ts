
// This file is read-only, but I'll add a debug function to check its status without modifying it

// Debug function to check Supabase client status
export const checkSupabaseClientStatus = () => {
  // Import the actual client from the file
  const { supabase } = require('./client');
  
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
