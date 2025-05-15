
import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key - ensure these are correct
const supabaseUrl = 'https://nawpawkxvijcaccxrcuv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hd3Bhd2t4dmlqY2FjY3hyY3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjU2MDEsImV4cCI6MjA1OTg0MTYwMX0._wPnSTMG8vxsKYAVm76X7V2STVMSPbAiAC6AnlurXUc';

// Create a single Supabase client instance with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Export the URL and key for use in other files
export { supabaseUrl, supabaseAnonKey };

// Debug function with improved error logging
export const checkSupabaseClientStatus = () => {
  console.log("Supabase Client Status Check:");
  console.log("- Client exists:", !!supabase);
  console.log("- Client functions:", Object.keys(supabase || {}).join(', '));
  console.log("- Supabase URL:", supabaseUrl);
  console.log("- Supabase Key valid:", supabaseAnonKey.substring(0, 10) + '...');
  
  // Test a simple auth call that doesn't require authentication
  supabase.auth.getSession().then(
    (result: any) => {
      console.log("- Auth API call successful:", !!result);
      console.log("- Session data:", result?.data?.session ? 'Session exists' : 'No active session');
    },
    (error: any) => {
      console.error("- Auth API call failed:", error);
      console.error("- Full error object:", JSON.stringify(error, null, 2));
    }
  );
  
  // Test database connectivity
  supabase
    .from('tournaments')
    .select('count(*)', { count: 'exact', head: true })
    .then(
      (result: any) => {
        console.log("- Database connectivity test:", result?.error ? 'Failed' : 'Successful');
        if (result?.error) {
          console.error("- Database error:", result.error);
        }
      },
      (error: any) => {
        console.error("- Database connectivity failed:", error);
        console.error("- Full error details:", JSON.stringify(error, null, 2));
      }
    );
  
  return !!supabase;
};

// Export a manual fetch test function that can be called from the console
export const testSupabaseManualFetch = async (tableName = 'tournaments') => {
  console.log(`Manual fetch test for table: ${tableName}`);
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/${tableName}?select=id,name`,
      {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      }
    );
    
    console.log(`HTTP Status: ${response.status} ${response.statusText}`);
    console.log(`Response Headers:`, Object.fromEntries([...response.headers.entries()]));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response body:`, errorText);
      return { error: `HTTP Error ${response.status}`, details: errorText };
    }
    
    const data = await response.json();
    console.log(`Data received:`, data);
    return { data };
  } catch (error) {
    console.error(`Network error during manual fetch:`, error);
    return { error };
  }
};
