import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting cleanup of old canceled tournaments...');

    // Call the database function to clean up old canceled tournaments
    const { data, error } = await supabase.rpc('cleanup_old_canceled_tournaments');

    if (error) {
      console.error('Error during cleanup:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message 
        }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const deletedCount = data || 0;
    console.log(`Successfully cleaned up ${deletedCount} canceled tournaments`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        deletedCount,
        message: `Cleaned up ${deletedCount} tournaments that were canceled more than 3 weeks ago`
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error during tournament cleanup:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error during cleanup' 
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});